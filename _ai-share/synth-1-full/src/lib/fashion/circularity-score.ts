import type { Product } from '@/lib/types';
import type { CircularityScoreV1 } from './types';
import { compositionSearchText } from './parse-composition';

/** Расчет цикличности изделия и потенциала перепродажи (Resale). */
export function calculateCircularity(product: Product): CircularityScoreV1 {
  const comp = compositionSearchText(product);
  const isNatural = comp.includes('cotton') || comp.includes('wool');
  const recycled = isNatural ? 20 : 0;
  const recyclability = isNatural ? 90 : 40;
  
  return {
    sku: product.sku,
    recycledContent: recycled,
    recyclabilityRate: recyclability,
    estimatedResaleValue: Math.round(product.price * 0.45),
    carbonSavings: Math.round(product.price * 0.0001 * 10) / 10,
  };
}
