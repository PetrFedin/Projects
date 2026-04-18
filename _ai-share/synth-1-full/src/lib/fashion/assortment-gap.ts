import type { Product } from '@/lib/types';
import type { CategoryAssortmentGapV1 } from './types';

/** Анализирует пробелы в ассортименте категории (Gap Analysis). */
<<<<<<< HEAD
export function analyzeAssortmentGaps(products: Product[] = [], category: string): AssortmentGapV1 {
=======
export function analyzeCategoryAssortmentGaps(
  products: Product[] = [],
  category: string
): CategoryAssortmentGapV1 {
>>>>>>> recover/cabinet-wip-from-stash
  const catProducts = (products || []).filter((p) => p.category === category);
  const colors = new Set(catProducts.map((p) => p.color.toLowerCase()));
  const prices = catProducts.map((p) => p.price);

  const missingColors: string[] = [];
  ['white', 'black', 'navy', 'beige', 'grey'].forEach((c) => {
    if (!colors.has(c)) missingColors.push(c);
  });

  const missingPricePoints: string[] = [];
  if (!prices.some((p) => p < 5000)) missingPricePoints.push('Entry Level (<5k)');
  if (!prices.some((p) => p > 15000)) missingPricePoints.push('Premium (>15k)');

  return {
    category,
    missingColors,
    missingPricePoints,
    demandSignal: missingColors.length > 2 ? 'high' : 'medium',
  };
}
