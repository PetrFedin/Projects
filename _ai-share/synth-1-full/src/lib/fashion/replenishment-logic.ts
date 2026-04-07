import type { Product } from '@/lib/types';
import type { ReplenishmentPlanV1 } from './types';

/** Генерирует план подсортировки на основе стока и продаж. */
export function generateReplenishmentPlan(products: Product[]): ReplenishmentPlanV1[] {
  return products.slice(0, 12).map(p => {
    const isBestseller = p.reviewCount && p.reviewCount > 20;
    const qty = isBestseller ? 150 : 50;
    
    return {
      sku: p.sku,
      suggestedQty: qty,
      urgency: isBestseller ? 'high' : 'normal',
      restockDate: '2026-04-20',
    };
  });
}
