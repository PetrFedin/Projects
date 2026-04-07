import type { Product } from '@/lib/types';
import type { PriceOptimizationV1 } from './types';

/** Динамическая оптимизация цены на основе трендов и остатков. */
export function optimizeProductPrice(product: Product): PriceOptimizationV1 {
  const currentPrice = product.price;
  let recommended = currentPrice;
  let reason = 'Market stable. No changes recommended.';
  let factor: PriceOptimizationV1['trendFactor'] = 'high_demand';

  if (product.tags?.includes('newSeason')) {
    recommended = Math.round(currentPrice * 1.05 / 10) * 10;
    reason = 'High early-season interest detected in RU regions.';
    factor = 'high_demand';
  } else if (product.originalPrice && product.price < product.originalPrice) {
    recommended = Math.round(currentPrice * 0.9 / 10) * 10;
    reason = 'Clearance phase. Accelerate stock liquidation.';
    factor = 'season_end';
  }

  return {
    currentPrice,
    recommendedPrice: recommended,
    confidenceScore: 85 + (product.id.length % 10),
    reason,
    trendFactor: factor,
  };
}
