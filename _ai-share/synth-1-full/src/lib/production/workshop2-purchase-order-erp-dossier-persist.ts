/**
 * Wave 22 #47: зеркало PO ERP sync в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { resolveWorkshop2PurchaseOrderErpDisplayStatus } from '@/lib/production/workshop2-purchase-order-erp-display';
import { isWorkshop2LiveErpConfigured } from '@/lib/production/workshop2-live-integration-probes-env';

export type Workshop2PurchaseOrderErpRow = {
  id: string;
  status: string;
  erpExternalId?: string | null;
  lastError?: string | null;
};

export function buildWorkshop2PurchaseOrderErpMirror(input: {
  purchaseOrders: Workshop2PurchaseOrderErpRow[];
  erpConfigured: boolean;
}): NonNullable<Workshop2DossierPhase1['purchaseOrderErpMirror']> {
  let fakeSyncedCount = 0;
  let errorCount = 0;
  let pendingCount = 0;

  for (const po of input.purchaseOrders) {
    const display = resolveWorkshop2PurchaseOrderErpDisplayStatus({
      status: po.status,
      erpExternalId: po.erpExternalId,
      lastError: po.lastError,
      erpConfigured: input.erpConfigured,
    });
    if (display.code === 'pending_erp' && po.status === 'synced') fakeSyncedCount += 1;
    if (display.code === 'error') errorCount += 1;
    if (display.code === 'pending_erp') pendingCount += 1;
  }

  const erpSyncMode: 'journal_only' | 'live_factory_erp' =
    input.erpConfigured && isWorkshop2LiveErpConfigured() ? 'live_factory_erp' : 'journal_only';
  const blockerSampleOrder = erpSyncMode === 'live_factory_erp' && fakeSyncedCount > 0;
  const blockerHandoff = blockerSampleOrder;
  const serverWorkflowEnabled =
    erpSyncMode === 'journal_only' || (fakeSyncedCount === 0 && errorCount === 0);

  return {
    mirroredAt: new Date().toISOString(),
    poCount: input.purchaseOrders.length,
    fakeSyncedCount,
    errorCount,
    pendingCount,
    erpConfigured: input.erpConfigured,
    erpSyncMode,
    serverWorkflowEnabled,
    blockerSampleOrder,
    blockerHandoff,
    hintRu: blockerSampleOrder
      ? `${fakeSyncedCount} PO synced без erpOrderId — ERP sync.`
      : erpSyncMode === 'journal_only'
        ? 'PO ERP: journal-only (без FACTORY_ERP_BASE_URL) — in-repo audit OK.'
        : undefined,
  };
}

export function persistWorkshop2PurchaseOrderErpMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: { purchaseOrders: Workshop2PurchaseOrderErpRow[]; erpConfigured: boolean }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    purchaseOrderErpMirror: buildWorkshop2PurchaseOrderErpMirror(input),
  };
}

/** Wave 3: journal fallback после POST PO create (honest, без fake erpExternalId). */
export function recordWorkshop2PurchaseOrderErpCreateAttemptInDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    purchaseOrders: Workshop2PurchaseOrderErpRow[];
    erpConfigured: boolean;
    attempt: {
      outcome: 'success' | 'failed' | 'journal_only' | 'skipped';
      erpExternalId?: string | null;
      error?: string;
    };
  }
): Workshop2DossierPhase1 {
  const mirror = buildWorkshop2PurchaseOrderErpMirror({
    purchaseOrders: input.purchaseOrders,
    erpConfigured: input.erpConfigured,
  });
  return {
    ...dossier,
    purchaseOrderErpMirror: {
      ...mirror,
      lastCreateErpAttempt: {
        at: new Date().toISOString(),
        outcome: input.attempt.outcome,
        erpExternalId: input.attempt.erpExternalId ?? null,
        error: input.attempt.error,
      },
      hintRu:
        input.attempt.outcome === 'journal_only'
          ? 'PO create: journal-only — WORKSHOP2_FACTORY_ERP_BASE_URL не задан.'
          : input.attempt.outcome === 'failed'
            ? `PO create ERP fail-closed: ${input.attempt.error ?? 'error'}`
            : input.attempt.outcome === 'success'
              ? `PO create ERP ACK: ${input.attempt.erpExternalId}`
              : mirror.hintRu,
    },
  };
}

export function evaluateWorkshop2PurchaseOrderErpSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.purchaseOrderErpMirror;
  if (!mirror) {
    return {
      id: 'po.erp.mirror_missing',
      severity: 'warning',
      messageRu: 'Аудит PO ERP не в досье — сохраните «PO ERP → PG» на снабжении или плане.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'po.erp.fake_synced',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ??
        'Ложный synced без erpOrderId — заказ образца заблокирован до исправления PO.',
    };
  }
  if (mirror.errorCount > 0) {
    return {
      id: 'po.erp.errors',
      severity: 'warning',
      messageRu: `${mirror.errorCount} PO с ошибкой ERP sync — проверьте панель закупки.`,
    };
  }
  return null;
}

export function evaluateWorkshop2PurchaseOrderErpHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.purchaseOrderErpMirror;
  if (!mirror) {
    return {
      id: 'po.erp.mirror_missing_handoff',
      severity: 'warning',
      messageRu: 'Аудит PO ERP не в досье — сохраните «PO ERP → PG» перед handoff.',
    };
  }
  if (mirror.blockerHandoff || mirror.blockerSampleOrder) {
    return {
      id: 'po.erp.fake_synced_handoff',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Ложный synced без erpOrderId — handoff commit заблокирован.',
    };
  }
  if (mirror.errorCount > 0) {
    return {
      id: 'po.erp.errors_handoff',
      severity: 'warning',
      messageRu: `${mirror.errorCount} PO с ошибкой ERP — проверьте перед передачей в цех.`,
    };
  }
  return null;
}

/** Wave 35: export-tz — PO ERP mirror. */
export function evaluateWorkshop2PurchaseOrderErpExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.purchaseOrderErpMirror;
  if (!mirror) {
    return {
      id: 'po.erp.export_missing',
      severity: 'warning',
      messageRu: 'ZIP ТЗ: PO ERP audit не в досье.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'po.erp.export_fake_synced',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'ZIP ТЗ: fake ERP synced заблокирован.',
    };
  }
  return null;
}
