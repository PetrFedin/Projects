import type { Product } from '@/lib/types';
import type { RetailPlanogramV1 } from './types';

/** Инструкции по визуальному мерчандайзингу для магазинов. */
export function getRetailPlanogram(product: Product): RetailPlanogramV1 {
  return {
    storeId: 'MSK-01',
    section: product.category === 'Outerwear' ? 'Front Entrance' : 'Main Hall',
    shelfPosition: 2,
    adjacentSkus: ['SKU-778', 'SKU-231'],
    visualMerchTip: `Use wooden hangers. Ensure ${product.category} is grouped by color story.`,
  };
}
