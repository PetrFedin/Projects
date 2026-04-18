import type { Product } from '@/lib/types';
import type { CircularityScoreV1 } from './types';
import { compositionSearchText } from './parse-composition';

/** Расчет цикличности изделия и потенциала перепродажи (Resale). */
export function calculateCircularity(product: Product): CircularityScoreV1 {
<<<<<<< HEAD
  const isNatural =
    product.composition?.toLowerCase().includes('cotton') ||
    product.composition?.toLowerCase().includes('wool');
=======
  const comp = compositionSearchText(product);
  const isNatural = comp.includes('cotton') || comp.includes('wool');
>>>>>>> recover/cabinet-wip-from-stash
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
