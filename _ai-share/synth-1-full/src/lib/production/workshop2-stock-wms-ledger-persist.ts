/**
 * Wave 19 #71: подготовка WMS ledger в досье + gate перед sample-order.
 */
import type { StockSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2StockWmsDeficitReserveGate } from '@/lib/production/workshop2-internal-wms';
import { summarizeWorkshop2StockBundleStatus } from '@/lib/production/workshop2-stock-bundle-status';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2StockWmsLedgerFromBundle(input: {
  stock?: StockSnapshot | null;
  dossier?: Workshop2DossierPhase1 | null;
}): NonNullable<Workshop2DossierPhase1['stockWmsLedger']> {
  const status = summarizeWorkshop2StockBundleStatus(input);
  const movements = (input.stock?.movements ?? []).map((m) => ({
    id: m.id,
    kind: m.kind,
    qty: Number(m.qty) || 0,
    at: m.at,
    note: m.label,
  }));
  const internal = input.dossier?.internalWmsMirror;
  const wmsSyncStatus =
    internal?.wmsSyncStatus === 'internal_pg'
      ? 'internal_pg'
      : internal?.wmsSyncStatus === 'memory_fallback'
        ? 'internal_pg'
        : input.dossier?.stockWmsLedger?.wmsSyncStatus === 'internal_pg'
          ? 'internal_pg'
          : 'draft_local';

  return {
    ledgerAt: new Date().toISOString(),
    qtyOnHand: status.qtyOnHand,
    movementCount: status.movementCount,
    negativeBalance: status.negativeBalance,
    onHandNote: input.stock?.onHandNote?.trim() || undefined,
    movements,
    wmsSyncStatus,
    hintRu: internal?.hintRu ?? status.hintRu,
  };
}

export function persistWorkshop2StockWmsLedgerToDossier(
  dossier: Workshop2DossierPhase1,
  input: { stock?: StockSnapshot | null }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    stockWmsLedger: buildWorkshop2StockWmsLedgerFromBundle({
      stock: input.stock,
      dossier,
    }),
  };
}

/** Warning sample-order: дефицит internal WMS reserve или stale negative ledger. */
export function evaluateWorkshop2StockWmsLedgerGate(input: {
  dossier: Workshop2DossierPhase1;
  stock?: StockSnapshot | null;
}): Workshop2HandoffReadinessCheck | null {
  const deficit = evaluateWorkshop2StockWmsDeficitReserveGate({ dossier: input.dossier });
  if (deficit) return deficit;

  const ledger = input.dossier.stockWmsLedger;
  const status = summarizeWorkshop2StockBundleStatus({
    stock: input.stock,
    dossier: input.dossier,
  });
  const negative = ledger
    ? workshop2PgMirrorStr(ledger, 'negativeBalance') === 'true' || status.negativeBalance
    : status.negativeBalance;
  if (!negative) return null;
  const ledgerAt = ledger ? workshop2PgMirrorStr(ledger, 'ledgerAt') : '';
  const qtyOnHand = ledger ? workshop2PgMirrorNum(ledger, 'qtyOnHand') : status.qtyOnHand;
  if (ledgerAt && qtyOnHand < 0) {
    const ageMs = Date.now() - new Date(ledgerAt).getTime();
    if (ageMs < 7 * 24 * 60 * 60 * 1000) return null;
  }
  return {
    id: 'stock.wms.negative_unaudited',
    severity: 'warning',
    messageRu:
      status.hintRu ??
      'Отрицательный складской остаток — зафиксируйте WMS ledger в досье перед заказом образца.',
  };
}

export function evaluateWorkshop2StockWmsHandoffGate(input: {
  dossier: Workshop2DossierPhase1;
  stock?: StockSnapshot | null;
}): Workshop2HandoffReadinessCheck | null {
  const ledger = input.dossier.stockWmsLedger;
  if (!ledger) {
    return {
      id: 'stock.wms.ledger_missing_handoff',
      severity: 'warning',
      messageRu: 'WMS ledger не в досье — «WMS ledger → PG» на вкладке Склад перед handoff.',
    };
  }
  if (
    ledger &&
    (workshop2PgMirrorStr(ledger, 'negativeBalance') === 'true' || ledger.negativeBalance === true)
  ) {
    return {
      id: 'stock.wms.negative_handoff',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(ledger, 'hintRu') ??
        'Отрицательный остаток в WMS ledger — handoff commit заблокирован.',
    };
  }
  return null;
}
