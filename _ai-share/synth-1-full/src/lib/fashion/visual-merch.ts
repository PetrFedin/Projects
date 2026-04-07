import type { Product } from '@/lib/types';
import type { VisualMerchSlotV1 } from './types';

/** Оптимизация сетки витрины (Visual Merchandising). */
export function optimizeVisualGrid(products: Product[]): VisualMerchSlotV1[] {
  return products.map((p, idx) => {
    const visualWeight = 50 + (p.price % 50);
    const harmony = 70 + (idx % 30); // Demo score

    return {
      sku: p.sku,
      position: idx + 1,
      visualWeight,
      colorHarmonyScore: harmony,
    };
  });
}
