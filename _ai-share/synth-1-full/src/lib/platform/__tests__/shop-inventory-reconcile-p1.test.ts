import { buildShopInventoryReconcileRowsFromAtp } from '@/lib/platform/shop-inventory-reconcile';
import { getShopInventoryReconcileRows } from '@/lib/server/shop-inventory-reconcile-server';
import { __clearShopInventoryLedgerGrainsForTests } from '@/lib/server/shop-inventory-ledger-grains-repository';
import {
  getShopReplenishmentStockSliceServer,
  putShopReplenishmentStockSliceServer,
} from '@/lib/server/shop-replenishment-stock-slice-repository';

describe('shop-inventory-reconcile-server', () => {
  beforeEach(async () => {
    await __clearShopInventoryLedgerGrainsForTests();
  });

  it('builds reconcile rows from ATP ledger', async () => {
    const result = await getShopInventoryReconcileRows({ shopId: 'shop1', limit: 6 });
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0]?.ledgerAtp).toBeGreaterThanOrEqual(0);
    expect(['pg', 'file', 'memory', 'demo']).toContain(result.ledgerSource);
  });

  it('maps physical diff from cycle session bias', () => {
    const rows = buildShopInventoryReconcileRowsFromAtp({
      atpRows: [
        { sku: 'A', name: 'A', atp: 10 },
        { sku: 'B', name: 'B', atp: 8 },
      ],
      cycleSessions: [
        {
          id: '1',
          warehouseId: 'w',
          status: 'discrepancy',
          scannedCount: 1,
          expectedCount: 2,
          markingVerified: true,
          startedAt: new Date().toISOString(),
          discrepancyCount: 2,
        },
      ],
    });
    expect(rows.some((r) => r.diff !== 0)).toBe(true);
  });
});

describe('shop-replenishment-stock-slice-repository', () => {
  it('persists saved slice for buyer', async () => {
    const saved = await putShopReplenishmentStockSliceServer({
      buyerId: 'shop1',
      orgId: 'shop1',
      seasonId: 'SS27',
      collectionId: 'SS27',
      labelRu: 'Shop1 · SS27',
    });
    expect(saved.seasonId).toBe('SS27');
    const loaded = await getShopReplenishmentStockSliceServer('shop1');
    expect(loaded?.collectionId).toBe('SS27');
  });
});
