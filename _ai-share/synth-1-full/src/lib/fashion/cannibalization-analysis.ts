import type { Product } from '@/lib/types';
import type { CannibalizationImpactV1 } from './types';

/** Анализ каннибализации ассортимента (Overlap Detection). */
export function analyzeCannibalization(products: Product[]): CannibalizationImpactV1[] {
  const results: CannibalizationImpactV1[] = [];
  
  for (let i = 0; i < Math.min(products.length, 5); i++) {
    const p1 = products[i];
    const p2 = products[i + 1] || products[0];

    if (p1.category === p2.category && p1.sku !== p2.sku) {
      const priceDiff = Math.abs(p1.price - p2.price);
      const overlap = priceDiff < 1000 ? 80 : 40;

      results.push({
        primarySku: p1.sku,
        competingSku: p2.sku,
        overlapScore: overlap,
        riskLevel: overlap > 70 ? 'high' : 'medium',
        recommendation: overlap > 70 
          ? 'Consider price differentiation or color exclusivity.' 
          : 'Differentiated enough for current mix.',
      });
    }
  }

  return results;
}
