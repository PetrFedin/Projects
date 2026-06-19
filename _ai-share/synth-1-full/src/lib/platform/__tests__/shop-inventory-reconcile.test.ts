import {
  applyLedgerAdjustOverlay,
  buildShopInventoryReconcileRows,
} from '@/lib/platform/shop-inventory-reconcile';
import { buildLedgerAdjustDeltaMap } from '@/lib/shop/shop-inventory-ledger-adjust-store';

describe('shop-inventory-reconcile', () => {
  it('builds reconcile rows with diff severity', () => {
    const rows = buildShopInventoryReconcileRows({ limit: 6 });
    expect(rows.length).toBe(6);
  });

  it('biases diff when cycle session has discrepancy', () => {
    const rows = buildShopInventoryReconcileRows({
      limit: 4,
      cycleSessions: [
        {
          id: 'x',
          warehouseId: 'wh-1',
          status: 'discrepancy',
          scannedCount: 1,
          expectedCount: 10,
          markingVerified: false,
          startedAt: new Date().toISOString(),
          discrepancyCount: 3,
        },
      ],
    });
    expect(rows.some((r) => r.diff !== 0)).toBe(true);
  });

  it('applyLedgerAdjustOverlay aligns ledger to physical', () => {
    const base = buildShopInventoryReconcileRows({ limit: 2 });
    const row = base[0];
    const deltaMap = buildLedgerAdjustDeltaMap([
      {
        id: 'a1',
        shopId: 'shop1',
        sku: row.sku,
        delta: row.physicalOnHand - row.ledgerAtp,
        reason: 'cycle_count_reconcile',
        adjustedAt: new Date().toISOString(),
      },
    ]);
    const adjusted = applyLedgerAdjustOverlay(base, deltaMap);
    expect(adjusted[0].diff).toBe(0);
  });
});
