import type { Product } from '@/lib/types';
import type { AssortmentGapV1 } from './types';

/** Анализ пробелов в заказе партнера (Assortment Gaps). */
export function analyzeOrderAssortmentGaps(currentSkus: string[] = [], allProducts: Product[] = []): AssortmentGapV1[] {
  // Demo logic: find high-performing products in the same category that are missing in the order
  const categories = Array.from(new Set((allProducts || []).map(p => p.category)));
  const gaps: AssortmentGapV1[] = [];

  categories.forEach(cat => {
    const productsInCat = (allProducts || []).filter(p => p.category === cat);
    const orderInCat = (currentSkus || []).filter(sku => productsInCat.find(p => p.sku === sku));

    // If order has < 2 items in a category, suggest best sellers
    if (orderInCat.length < 2) {
      const bestSellers = productsInCat.slice(0, 2);
      bestSellers.forEach(p => {
        if (!currentSkus.includes(p.sku)) {
          gaps.push({
            sku: p.sku,
            recommendation: 'essential',
            reason: `Category '${cat}' is under-represented. Add core essentials.`,
            missingInCurrentOrder: true,
          });
        }
      });
    }
  });

  return gaps;
}
