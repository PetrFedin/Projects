import type { Product } from '@/lib/types';
import type { CircularityScoreV1 } from './types';

function compositionSearchText(product: Product): string {
  const c = product.composition;
  if (!c) return '';
  if (typeof c === 'string') return c.toLowerCase();
  return c.map((x) => x.material).join(' ').toLowerCase();
}

/** Расчёт цикличности изделия (материалы, переработка, CO₂). */
export function calculateCircularity(product: Product): CircularityScoreV1 {
  const text = compositionSearchText(product);
  const isNatural = text.includes('cotton') || text.includes('wool');
  const recycled = isNatural ? 20 : 0;
  const recyclability = isNatural ? 90 : 40;

  return {
    sku: product.sku,
    recycledContent: recycled,
    recyclabilityRate: recyclability,
    carbonSavings: Math.round(product.price * 0.0001 * 10) / 10,
  };
}
