import {
  aggregateReplenishmentStockRowsFromGrains,
  buildShopReplenishmentStockRows,
} from '@/lib/platform/shop-replenishment-stock-atp';
import type { InventoryGrain } from '@/lib/logic/inventory-ledger-core';
import { getShopReplenishmentStockAtpRows } from '@/lib/server/shop-replenishment-stock-atp-server';
import { __clearShopInventoryLedgerGrainsForTests } from '@/lib/server/shop-inventory-ledger-grains-repository';
import { putWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';

describe('shop-replenishment-stock-atp', () => {
  it('builds demo rows with non-negative ATP', () => {
    const rows = buildShopReplenishmentStockRows(5);
    expect(rows.length).toBe(5);
    for (const row of rows) {
      expect(row.atp).toBeGreaterThanOrEqual(0);
      expect(row.sku.length).toBeGreaterThan(0);
    }
  });

  it('aggregates grains into ATP rows', () => {
    const grains: InventoryGrain[] = [
      {
        grainId: 'g1',
        productId: 'SKU-A',
        sku: 'SKU-A',
        locationId: 'shop-main',
        state: 'on_hand',
        quantity: 10,
        ownerId: 'shop1',
        tenantId: 'shop1',
        metadata: { updatedAt: new Date().toISOString(), version: 1 },
      },
      {
        grainId: 'g2',
        productId: 'SKU-A',
        sku: 'SKU-A',
        locationId: 'shop-main',
        state: 'reserved',
        quantity: 3,
        ownerId: 'shop1',
        tenantId: 'shop1',
        metadata: { updatedAt: new Date().toISOString(), version: 1 },
      },
    ];
    const rows = aggregateReplenishmentStockRowsFromGrains({ grains, shopId: 'shop1' });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.sku).toBe('SKU-A');
    expect(rows[0]?.atp).toBe(10);
  });
});

describe('shop-replenishment-stock-atp-server', () => {
  beforeEach(async () => {
    await __clearShopInventoryLedgerGrainsForTests();
  });

  it('returns seeded ledger rows for shop1', async () => {
    const result = await getShopReplenishmentStockAtpRows({ shopId: 'shop1', limit: 6 });
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.grainCount).toBeGreaterThan(0);
    expect(['pg', 'file', 'memory', 'demo']).toContain(result.source);
  });

  it('merges B2B reserved qty into ATP rows', async () => {
    const seeded = await getShopReplenishmentStockAtpRows({ shopId: 'shop1', limit: 24 });
    const targetSku = seeded.rows[0]?.sku;
    expect(targetSku).toBeTruthy();
    await putWorkshop2B2bOrder({
      id: 'B2B-ATP-TEST-1',
      collectionId: 'SS27',
      articleId: targetSku!,
      buyerId: 'shop1',
      status: 'confirmed',
      tier: 'standard',
      totalRub: 1000,
      lines: [{ articleId: targetSku!, collectionId: 'SS27', qty: 8 }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const result = await getShopReplenishmentStockAtpRows({
      shopId: 'shop1',
      collectionId: 'SS27',
      limit: 24,
    });
    const row = result.rows.find((r) => r.sku === targetSku);
    expect(row?.reserved).toBeGreaterThanOrEqual(8);
  });
});
