import { emptyLocalCollectionInventory } from '@/lib/production/local-collection-inventory';
import {
  platformCoreGoldenCollectionStorageKeys,
  stripPlatformCoreGoldenArticleOverlay,
} from '@/lib/production/workshop2-platform-core-inventory';

describe('workshop2-platform-core-inventory', () => {
  it('lists SS27 and FW27 storage keys', () => {
    const keys = platformCoreGoldenCollectionStorageKeys();
    expect(keys).toContain('SS27');
    expect(keys).toContain('FW27');
    expect(keys).not.toContain('EMPTY27');
  });

  it('strips golden collection article overlay', () => {
    const inv = emptyLocalCollectionInventory();
    inv.articlesByCollection.SS27 = [
      {
        id: 'demo-ss27-01',
        sku: 'SS27-01',
        name: 'Тест',
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
    inv.articlesByCollection.FW27 = [
      {
        id: 'demo-fw27-01',
        sku: 'FW27-01',
        name: 'Тест',
        season: 'FW27',
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
    inv.articlesByCollection['my-local'] = [
      {
        id: 'local-1',
        sku: 'LOC-1',
        name: 'Локальная',
        season: 'LOC',
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
    const next = stripPlatformCoreGoldenArticleOverlay(inv);
    expect(next.articlesByCollection.SS27).toBeUndefined();
    expect(next.articlesByCollection.FW27).toBeUndefined();
    expect(next.articlesByCollection['my-local']).toHaveLength(1);
  });
});
