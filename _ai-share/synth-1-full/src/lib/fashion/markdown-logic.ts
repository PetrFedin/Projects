import type { Product } from '@/lib/types';
import type { MarkdownRecommendationV1 } from './types';

/** Рекомендует уценку на основе "возраста" и остатков (демо-движок). */
export function buildMarkdownRecommendations(products: Product[]): MarkdownRecommendationV1[] {
  return products
    .filter((p) => !p.tags?.includes('carryover'))
    .map((p) => {
      const isOld = p.season.includes('24') || p.season.includes('23');
      const discount = isOld ? 40 : 15;
      const sellThrough = isOld ? 85 : 45;

      return {
        sku: p.sku,
        currentPrice: p.price,
        suggestedDiscount: discount,
        reason: isOld ? 'Season Liquidation' : 'Slow Inventory Rotation',
        projectedSellThrough: sellThrough,
      };
    })
    .sort((a, b) => b.suggestedDiscount - a.suggestedDiscount)
    .slice(0, 15);
}
