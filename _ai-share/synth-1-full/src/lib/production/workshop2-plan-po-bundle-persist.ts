/**
 * Wave 21 #59: снимок plan PO bundle в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2PlanPoBundleInput = {
  purchaseOrders: Array<{
    id?: string;
    label?: string;
    qty?: string | number;
    status?: string;
    supplierId?: string;
  }>;
};

export function buildWorkshop2PlanPoBundleSnapshot(
  input: Workshop2PlanPoBundleInput
): NonNullable<Workshop2DossierPhase1['planPoBundleSnapshot']> {
  const rows = input.purchaseOrders ?? [];
  const totalQty = rows.reduce((acc, po) => acc + Number(po.qty || 0), 0);
  const supplierIds = [
    ...new Set(rows.map((p) => p.supplierId?.trim()).filter(Boolean) as string[]),
  ];
  const allClosed = rows.length > 0 && rows.every((po) => po.status === 'closed');

  let hintRu: string | undefined;
  if (rows.length === 0) {
    hintRu = 'Нет строк PO в плане — добавьте партии перед заказом образца.';
  }

  const blockerHandoff = rows.length === 0;
  const blockerSampleOrder = rows.length === 0;

  return {
    snapshotAt: new Date().toISOString(),
    poLineCount: rows.length,
    totalQty,
    allClosed,
    supplierIds,
    blockerHandoff,
    blockerSampleOrder,
    hintRu,
  };
}

export function evaluateWorkshop2PlanPoHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.planPoBundleSnapshot;
  if (!snap) {
    return {
      id: 'plan.po.snapshot_missing_handoff',
      severity: 'blocker',
      messageRu: 'Снимок плана PO не в досье — сохраните «План → PG» перед handoff.',
    };
  }
  if (snap.blockerHandoff || snap.poLineCount === 0) {
    return {
      id: 'plan.po.empty_handoff',
      severity: 'blocker',
      messageRu: snap.hintRu ?? 'План PO пуст — handoff commit заблокирован.',
    };
  }
  return null;
}

export function persistWorkshop2PlanPoBundleSnapshotToDossier(
  dossier: Workshop2DossierPhase1,
  input: Workshop2PlanPoBundleInput
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    planPoBundleSnapshot: buildWorkshop2PlanPoBundleSnapshot(input),
  };
}

export function evaluateWorkshop2PlanPoSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.planPoBundleSnapshot;
  if (!snap) {
    return {
      id: 'plan.po.snapshot_missing',
      severity: 'blocker',
      messageRu: 'Снимок плана PO не в досье — сохраните «План → PG» на вкладке План.',
    };
  }
  if (snap.poLineCount === 0) {
    return {
      id: 'plan.po.empty',
      severity: 'blocker',
      messageRu: snap.hintRu ?? 'План PO пуст — заказ образца заблокирован.',
    };
  }
  if (snap.allClosed) {
    return {
      id: 'plan.po.all_closed',
      severity: 'warning',
      messageRu: 'Все строки PO закрыты — проверьте актуальность плана.',
    };
  }
  return null;
}
