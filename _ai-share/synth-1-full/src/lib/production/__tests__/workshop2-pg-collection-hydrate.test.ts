import {
  emptyLocalCollectionInventory,
  ensureWorkshop2PlatformCoreCollectionInInventory,
} from '@/lib/production/local-collection-inventory';
import { listWorkshop2PublishedArticlesFromLocalOverlay } from '@/lib/production/workshop2-pg-collection-hydrate';
import { buildWorkshop2PgSourceStats } from '@/lib/production/workshop2-pg-source-stats';

describe('workshop2-pg-collection-hydrate helpers', () => {
  it('registers FW27 user collection for W2 PG hydrate', () => {
    const inv = emptyLocalCollectionInventory();
    const next = ensureWorkshop2PlatformCoreCollectionInInventory(inv, 'FW27', 'Тест');
    expect(next.userCollections.some((c) => c.id === 'FW27')).toBe(true);
    expect(next.workshop2ActiveOrder?.[0]).toBe('FW27');
  });

  it('skips SS27 system collection registration', () => {
    const inv = emptyLocalCollectionInventory();
    const next = ensureWorkshop2PlatformCoreCollectionInInventory(inv, 'SS27', 'Тест');
    expect(next).toBe(inv);
  });

  it('lists canonical article ids from local overlay (not local-*)', () => {
    const inv = emptyLocalCollectionInventory();
    inv.articlesByCollection.SS27 = [
      {
        id: 'demo-ss27-01',
        sku: 'SS27-M-COAT-01',
        name: 'Пальто',
        season: 'SS27',
        orderedQuantity: 1,
        price: 1,
        deliveryWindowId: 'drop1',
        categoryLeafId: 'catalog-apparel-g0-l0',
        productionSiteId: 'fab-rf-ivanovo',
        productionSiteLabel: 'Фабрика',
        fabricSuppliers: [],
        fabricMainFromBrandStock: false,
        lineStatus: 'open',
      },
      {
        id: 'local-abc123',
        sku: 'W2-LOCAL',
        name: 'Локальный',
        season: 'SS27',
        orderedQuantity: 1,
        price: 1,
        deliveryWindowId: 'drop1',
        categoryLeafId: 'catalog-apparel-g0-l0',
        productionSiteId: 'fab-rf-ivanovo',
        productionSiteLabel: 'Фабрика',
        fabricSuppliers: [],
        fabricMainFromBrandStock: false,
        lineStatus: 'open',
      },
    ];
    const rows = listWorkshop2PublishedArticlesFromLocalOverlay(inv, 'SS27', []);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.articleId).toBe('demo-ss27-01');
  });

  it('buildWorkshop2PgSourceStats splits PG vs local overlay counts', () => {
    const inv = emptyLocalCollectionInventory();
    inv.articlesByCollection.SS27 = [
      {
        id: 'demo-ss27-01',
        sku: 'SS27-M-COAT-01',
        name: 'Пальто',
        season: 'SS27',
        orderedQuantity: 1,
        price: 1,
        deliveryWindowId: 'drop1',
        categoryLeafId: 'catalog-apparel-g0-l0',
        productionSiteId: 'fab-rf-ivanovo',
        productionSiteLabel: 'Фабрика',
        fabricSuppliers: [],
        fabricMainFromBrandStock: false,
        lineStatus: 'open',
      },
      {
        id: 'local-only',
        sku: 'W2-LOCAL',
        name: 'Только браузер',
        season: 'SS27',
        orderedQuantity: 1,
        price: 1,
        deliveryWindowId: 'drop1',
        categoryLeafId: 'catalog-apparel-g0-l0',
        productionSiteId: 'fab-rf-ivanovo',
        productionSiteLabel: 'Фабрика',
        fabricSuppliers: [],
        fabricMainFromBrandStock: false,
        lineStatus: 'open',
      },
    ];
    const stats = buildWorkshop2PgSourceStats({
      collectionId: 'SS27',
      pgArticles: [{ articleId: 'demo-ss27-01', sku: 'SS27-M-COAT-01' }],
      localInventory: inv,
      seedLines: [],
      publishedArticlesReadPath: 'api',
    });
    expect(stats.pgArticlesCount).toBe(1);
    expect(stats.localOverlayArticlesCount).toBe(1);
    expect(stats.publishedArticlesReadPath).toBe('api');
  });
});
