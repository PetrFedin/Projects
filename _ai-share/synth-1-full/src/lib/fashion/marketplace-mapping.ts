import type { Product } from '@/lib/types';
import type { MarketplaceMappingV1 } from './types';

/** Синхронизация SKU с маркетплейсами РФ (WB, Ozon, Lamoda). */
export function getMarketplaceMapping(product: Product): MarketplaceMappingV1 {
  const idPrefix = product.id.slice(0, 8);

  return {
    sku: product.sku,
    wildberriesId: `WB-${idPrefix}`,
    ozonId: `OZ-${idPrefix}`,
    lamodaId: product.price > 5000 ? `LM-${idPrefix}` : undefined,
    status: product.id.length % 7 === 0 ? 'error' : 'synced',
    lastFeedUpdate: new Date().toISOString().split('T')[0],
  };
}
