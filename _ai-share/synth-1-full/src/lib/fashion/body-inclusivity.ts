import type { Product } from '@/lib/types';
import type { BodyInclusivityV1 } from './types';

/** Индекс инклюзивности и посадки (Local Market Fit). */
export function getBodyInclusivity(product: Product): BodyInclusivityV1 {
  const name = product.name.toLowerCase();
  
  return {
    sku: product.sku,
    slavicFitScore: 85 + (product.id.length % 12),
    petiteFriendly: name.includes('crop') || name.includes('short'),
    tallFriendly: product.category === 'Outerwear' || name.includes('long'),
    adjustmentPoints: product.category === 'Dress' ? ['waist elastic', 'adjustable straps'] : ['standard seam'],
  };
}
