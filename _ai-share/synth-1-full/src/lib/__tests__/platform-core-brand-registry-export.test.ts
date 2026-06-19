import {
  buildBrandRegistryExportCsv,
  buildBrandRegistryExportJson,
  listBrandRegistryExportOrders,
} from '@/lib/server/platform-core-brand-registry-export';

describe('platform-core-brand-registry-export', () => {
  it('builds CSV with production order id column', async () => {
    const orders = await listBrandRegistryExportOrders({ collectionId: 'SS27' });
    const csv = buildBrandRegistryExportCsv(orders);
    expect(csv.split('\n')[0]).toContain('spineChannel');
    expect(csv).toContain('orderId');
  });

  it('JSON export includes spineChannel per order', () => {
    const json = buildBrandRegistryExportJson([
      {
        id: 'INT-JOOR-SS27-001',
        buyerId: 'shop1',
        status: 'submitted',
        tier: 'standard',
        totalRub: 1000,
        lines: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        collectionId: 'SS27',
      },
      {
        id: 'B2B-42',
        buyerId: 'shop1',
        status: 'submitted',
        tier: 'standard',
        totalRub: 500,
        lines: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        collectionId: 'SS27',
      },
    ]);
    expect(json.orders[0]?.spineChannel).toBeTruthy();
    expect(json.orders[0]?.spineChannel).not.toBe('');
    expect(json.orders[1]?.spineChannel).toBe('');
  });

  it('builds JSON export envelope', async () => {
    const orders = await listBrandRegistryExportOrders({ collectionId: 'SS27' });
    const json = buildBrandRegistryExportJson(orders);
    expect(json.ok).toBe(true);
    expect(json.count).toBe(orders.length);
    expect(json.source).toMatch(/pg|memory/);
    if (orders.length > 0) {
      expect(json.orders[0]?.orderId).toBeTruthy();
    }
  });
});
