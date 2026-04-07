import type { Product } from '@/lib/types';
import type { LogisticStrategyV1 } from './types';

/** Оптимизация модели фулфилмента для маркетплейсов. */
export function optimizeFulfillment(product: Product): LogisticStrategyV1 {
  const price = product.price;
  const isHeavy = product.category === 'Outerwear';
  
  if (price > 15000) {
    return {
      sku: product.sku,
      recommendedModel: 'FBS',
      marginImpact: +2.5,
      deliverySpeedBonus: 0,
      reason: 'High value item. Keep in own warehouse to minimize OOS risk across channels.',
    };
  }

  return {
    sku: product.sku,
    recommendedModel: 'FBO',
    marginImpact: -1.5,
    deliverySpeedBonus: 2,
    reason: 'High turnover potential. Use marketplace warehouse for 1-day delivery badge.',
  };
}
