/**
 * Wave 39: единый снимок critical path «Разработка» — sample → WMS → movement → gold → intake.
 * Persist в досье PG; handoff-readiness API и gates читают этот mirror.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2ArticleDevelopmentPathStep,
  Workshop2ArticleDevelopmentStateMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import { summarizeWorkshop2SampleIntakeStatus } from '@/lib/production/workshop2-sample-intake-status';
import { summarizeWorkshop2SampleMovementStatus } from '@/lib/production/workshop2-sample-movement-status';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type {
  Workshop2ArticleDevelopmentPathStep,
  Workshop2ArticleDevelopmentStateMirror,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function buildWorkshop2ArticleDevelopmentState(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  vaultFileCount: number;
  categoryLeafId?: string;
  latestSampleOrder?: {
    id: string;
    status: string;
    movementStatus: Workshop2SampleGoodsMovementStatus;
    movementLogLength: number;
  } | null;
}): Workshop2ArticleDevelopmentStateMirror {
  const order = input.latestSampleOrder ?? null;
  const hasOrder = Boolean(order?.id);
  const movement = order?.movementStatus ?? 'created';
  const movementSummary = summarizeWorkshop2SampleMovementStatus({
    hasSampleOrder: hasOrder,
    movement,
    movementLogEntries: order?.movementLogLength ?? 0,
    dossier: input.dossier,
  });
  const wmsEnabled = isWorkshop2InternalWmsEnabled();
  const internal = input.dossier.internalWmsMirror;
  const ledger = input.dossier.stockWmsLedger;
  const internalSync = workshop2PgMirrorStr(internal, 'wmsSyncStatus');
  const ledgerSync = workshop2PgMirrorStr(ledger, 'wmsSyncStatus');
  const reservedQty = workshop2PgMirrorNum(internal, 'reservedQty');
  const reserveSynced =
    internalSync === 'internal_pg' || ledgerSync === 'internal_pg' || reservedQty > 0;
  const intake = summarizeWorkshop2SampleIntakeStatus(input.dossier);
  const handoff = evaluateWorkshop2HandoffReadiness({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeafId,
    vaultFileCount: input.vaultFileCount,
  });
  const goldApproved = input.dossier.goldSampleStatus?.status === 'approved';
  const barcodeFilled = Boolean(input.dossier.sampleIntakeRelease?.eanOrBatchCode?.trim());

  const steps: Workshop2ArticleDevelopmentPathStep[] = [];
  if (hasOrder) steps.push('sample_order');
  if (hasOrder && reserveSynced) steps.push('wms_reserve');
  if (movement === 'in_transit' || movement === 'received') steps.push('movement_in_transit');
  if (movement === 'received') steps.push('movement_received');
  if (goldApproved) steps.push('gold_approved');
  if (intake.state === 'ready') steps.push('intake_ready');

  const criticalPathReady =
    hasOrder &&
    (!wmsEnabled || reserveSynced) &&
    movement === 'received' &&
    goldApproved &&
    intake.state === 'ready' &&
    handoff.ready;

  let hintRu: string | undefined;
  if (criticalPathReady) {
    hintRu = 'Critical path закрыт: образец → WMS → приёмка → эталон → intake.';
  } else if (!hasOrder) {
    hintRu = 'Создайте sample-order на вкладке «Примерка».';
  } else if (wmsEnabled && !reserveSynced) {
    hintRu = 'После sample-order выполните резерв WMS (Снабжение или авто при POST).';
  } else if (movement !== 'received') {
    hintRu = movementSummary.hintRu ?? 'Переведите движение образца в received.';
  } else if (!goldApproved) {
    hintRu = 'Утвердите gold sample до полного intake.';
  } else if (intake.state !== 'ready') {
    hintRu = intake.hintRu;
  } else if (!handoff.ready) {
    hintRu = 'Handoff-readiness: устраните blockers в ТЗ/Vault.';
  }

  return {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    steps,
    sample: {
      hasOrder,
      orderId: order?.id,
      orderStatus: order?.status,
      movementStatus: movement,
      movementLogEntries: order?.movementLogLength ?? 0,
      movementState: movementSummary.state,
    },
    wms: {
      enabled: wmsEnabled,
      syncStatus: internalSync || ledgerSync || undefined,
      reservedQty: reservedQty || undefined,
      reserveDeficitCount: workshop2PgMirrorNum(internal, 'reserveDeficitCount') || undefined,
      itemCount: workshop2PgMirrorNum(internal, 'itemCount') || undefined,
      lastSampleReserveOrderId: order?.id,
    },
    gold: {
      status: input.dossier.goldSampleStatus?.status,
      approved: goldApproved,
    },
    intake: {
      state: intake.state,
      missingCount: intake.missingCount,
      chainMode: input.dossier.sampleProductionChainMode,
      chainModeLabel: intake.chainModeLabel,
      barcodeFilled,
    },
    readiness: {
      tzOverallPct: handoff.tzOverallPct,
      preflightScore: handoff.preflightScore,
      handoffReady: handoff.ready,
      vaultFileCount: input.vaultFileCount,
    },
    criticalPathReady,
    hintRu,
  };
}

export function persistWorkshop2ArticleDevelopmentStateToDossier(
  dossier: Workshop2DossierPhase1,
  snapshot: Workshop2ArticleDevelopmentStateMirror
): Workshop2DossierPhase1 {
  return { ...dossier, articleDevelopmentStateMirror: snapshot };
}

/** Gate: предупреждения по снимку critical path (не banner-only). */
export function evaluateWorkshop2ArticleDevelopmentPathGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.articleDevelopmentStateMirror;
  if (!snap) {
    return {
      id: 'devpath.snapshot.missing',
      severity: 'warning',
      messageRu:
        'Снимок critical path не зафиксирован в PG — откройте handoff-readiness или создайте sample-order.',
    };
  }
  if (snap.sample.hasOrder && snap.wms.enabled && snap.wms.syncStatus !== 'internal_pg') {
    return {
      id: 'devpath.wms.reserve_pending',
      severity: 'warning',
      messageRu:
        snap.hintRu ??
        'Sample-order есть, WMS резерв не отражён в досье — «Синхр. из BOM» + «Резерв под образец».',
    };
  }
  if (snap.sample.movementStatus === 'received' && !snap.gold.approved) {
    return {
      id: 'devpath.gold.before_intake',
      severity: 'warning',
      messageRu: 'Образец received, но gold sample не утверждён — intake заблокирован.',
    };
  }
  if (snap.intake.state !== 'ready' && snap.sample.movementStatus === 'received') {
    return {
      id: 'devpath.intake.incomplete',
      severity: 'warning',
      messageRu: snap.intake.chainModeLabel
        ? `Intake (${snap.intake.chainModeLabel}): заполните EAN/комплаенс — не хватает ${snap.intake.missingCount} полей.`
        : `Intake: не хватает ${snap.intake.missingCount} полей (цепочка/barcode).`,
    };
  }
  if (!snap.intake.barcodeFilled && snap.sample.movementStatus === 'received') {
    return {
      id: 'devpath.intake.barcode_missing',
      severity: 'warning',
      messageRu: 'EAN / код партии не заполнен — укажите в Sample Intake перед GRN.',
    };
  }
  return null;
}
