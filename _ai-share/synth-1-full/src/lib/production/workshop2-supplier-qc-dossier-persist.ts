/**
 * Wave 20 #70: scorecard PO в досье + warning в sample-order chain.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2SupplierQcScorecardFromPurchaseOrders,
  type Workshop2SupplierQcScorecard,
} from '@/lib/production/workshop2-supplier-qc-scorecard';
import type { Workshop2PurchaseOrderRecord } from '@/lib/server/workshop2-purchase-order-repository';

export function buildWorkshop2SupplierQcSnapshotFromScorecard(
  scorecard: Workshop2SupplierQcScorecard
): NonNullable<Workshop2DossierPhase1['supplierQcSnapshot']> {
  const critical =
    scorecard.source !== 'empty' &&
    scorecard.totalBatches >= 2 &&
    scorecard.passRate < 40 &&
    scorecard.failed >= 3;
  const blockerSampleOrder = critical;
  const blockerHandoff = critical;

  let hintRu = scorecard.hintRu;
  if (critical && !hintRu) {
    hintRu = `Поставщик ${scorecard.supplierId}: pass rate ${scorecard.passRate.toFixed(1)}% — критический брак.`;
  }

  return {
    snapshotAt: new Date().toISOString(),
    supplierId: scorecard.supplierId,
    totalBatches: scorecard.totalBatches,
    passRate: Number(scorecard.passRate.toFixed(1)),
    failed: scorecard.failed,
    source: scorecard.source,
    blockerSampleOrder,
    blockerHandoff,
    hintRu,
  };
}

export function persistWorkshop2SupplierQcSnapshotToDossier(
  dossier: Workshop2DossierPhase1,
  scorecard: Workshop2SupplierQcScorecard
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    supplierQcSnapshot: buildWorkshop2SupplierQcSnapshotFromScorecard(scorecard),
  };
}

export function buildWorkshop2SupplierQcSnapshotFromPurchaseOrders(
  supplierId: string,
  orders: Workshop2PurchaseOrderRecord[]
): NonNullable<Workshop2DossierPhase1['supplierQcSnapshot']> {
  const scorecard = buildWorkshop2SupplierQcScorecardFromPurchaseOrders(supplierId, orders);
  return buildWorkshop2SupplierQcSnapshotFromScorecard(scorecard);
}

export function evaluateWorkshop2SupplierQcSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.supplierQcSnapshot;
  if (!snap || snap.source === 'empty') return null;
  if (snap.blockerSampleOrder) {
    return {
      id: 'qc.supplier.pass_rate_critical',
      severity: 'blocker',
      messageRu:
        snap.hintRu ??
        `Поставщик ${snap.supplierId}: критический pass rate ${snap.passRate}% — образец заблокирован.`,
    };
  }
  if (snap.totalBatches < 2) return null;
  if (snap.passRate < 50 && snap.failed >= 2) {
    return {
      id: 'qc.supplier.pass_rate_low',
      severity: 'warning',
      messageRu: `Поставщик ${snap.supplierId}: pass rate ${snap.passRate}% (${snap.failed} брак) — пересмотрите PO перед образцом.`,
    };
  }
  const ageMs = Date.now() - new Date(snap.snapshotAt).getTime();
  if (ageMs > 30 * 24 * 60 * 60 * 1000) {
    return {
      id: 'qc.supplier.snapshot_stale',
      severity: 'warning',
      messageRu: 'Scorecard поставщика в досье устарел (>30 дн.) — обновите снимок на вкладке ОТК.',
    };
  }
  return null;
}

export function evaluateWorkshop2SupplierQcHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const snap = dossier.supplierQcSnapshot;
  if (!snap || snap.source === 'empty') return null;
  if (snap.blockerHandoff) {
    return {
      id: 'qc.supplier.pass_rate_critical_handoff',
      severity: 'blocker',
      messageRu:
        snap.hintRu ??
        `Поставщик ${snap.supplierId}: критический QC — handoff commit заблокирован.`,
    };
  }
  const ageMs = Date.now() - new Date(snap.snapshotAt).getTime();
  if (ageMs > 30 * 24 * 60 * 60 * 1000 && snap.passRate < 60) {
    return {
      id: 'qc.supplier.snapshot_stale_handoff',
      severity: 'warning',
      messageRu: 'Устаревший scorecard с низким pass rate — обновите перед handoff.',
    };
  }
  return null;
}
