/**
 * Shop inventory reconcile read-model: ledger ATP vs physical count (cycle count).
 */
import { buildShopReplenishmentStockRows } from '@/lib/platform/shop-replenishment-stock-atp';
import type { CycleCountSession } from '@/lib/shop/cycle-counting';

export type ShopInventoryReconcileSeverity = 'ok' | 'low' | 'medium' | 'high';

export type ShopInventoryReconcileRow = {
  sku: string;
  name: string;
  ledgerAtp: number;
  physicalOnHand: number;
  diff: number;
  severity: ShopInventoryReconcileSeverity;
};

function severityFromDiff(diff: number, ledgerAtp: number): ShopInventoryReconcileSeverity {
  const abs = Math.abs(diff);
  if (abs === 0) return 'ok';
  const pct = abs / Math.max(ledgerAtp, 1);
  if (pct >= 0.25 || abs >= 8) return 'high';
  if (pct >= 0.1 || abs >= 3) return 'medium';
  return 'low';
}

/** Demo: physical = ledger + deterministic offset; cycle sessions adjust aggregate. */
export function buildShopInventoryReconcileRowsFromAtp(input: {
  atpRows: ReadonlyArray<{ sku: string; name: string; atp: number }>;
  cycleSessions?: CycleCountSession[];
}): ShopInventoryReconcileRow[] {
  const sessions = input.cycleSessions ?? [];
  const discrepancyBias = sessions.reduce(
    (s, sess) => s + (sess.discrepancyCount ?? (sess.status === 'discrepancy' ? 2 : 0)),
    0
  );

  return input.atpRows.map((row, i) => {
    const offset = ((i * 2 + discrepancyBias) % 5) - 2;
    const physicalOnHand = Math.max(0, row.atp + offset);
    const diff = physicalOnHand - row.atp;
    return {
      sku: row.sku,
      name: row.name,
      ledgerAtp: row.atp,
      physicalOnHand,
      diff,
      severity: severityFromDiff(diff, row.atp),
    };
  });
}

/** Demo fallback when PG ATP недоступен. */
export function buildShopInventoryReconcileRows(input?: {
  cycleSessions?: CycleCountSession[];
  limit?: number;
}): ShopInventoryReconcileRow[] {
  return buildShopInventoryReconcileRowsFromAtp({
    atpRows: buildShopReplenishmentStockRows(input?.limit ?? 10),
    cycleSessions: input?.cycleSessions,
  });
}

export function applyLedgerAdjustOverlay(
  rows: readonly ShopInventoryReconcileRow[],
  deltaBySku: ReadonlyMap<string, number>
): ShopInventoryReconcileRow[] {
  return rows.map((row) => {
    const adjustDelta = deltaBySku.get(row.sku) ?? 0;
    if (adjustDelta === 0) return row;
    const ledgerAtp = row.ledgerAtp + adjustDelta;
    const diff = row.physicalOnHand - ledgerAtp;
    return {
      ...row,
      ledgerAtp,
      diff,
      severity: severityFromDiff(diff, ledgerAtp),
    };
  });
}

export function summarizeShopInventoryReconcile(rows: ShopInventoryReconcileRow[]): {
  total: number;
  mismatches: number;
  high: number;
} {
  return {
    total: rows.length,
    mismatches: rows.filter((r) => r.diff !== 0).length,
    high: rows.filter((r) => r.severity === 'high').length,
  };
}
