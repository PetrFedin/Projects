import type { Product } from '@/lib/types';
import type { AssortmentOverlapV1 } from './types';

/** Анализ пересечения ассортимента для предотвращения каннибализации SKU. */
export function detectAssortmentOverlap(products: Product[]): AssortmentOverlapV1[] {
  const overlaps: AssortmentOverlapV1[] = [];

  // Сравниваем только внутри категорий для экономии
  const byCategory = new Map<string, Product[]>();
  products.forEach((p) => {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  });

  byCategory.forEach((items, cat) => {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];

        let score = 0;
        const reasons: string[] = [];

        if (a.color === b.color) {
          score += 40;
          reasons.push('Совпадение цвета');
        }
        if (Math.abs(a.price - b.price) < a.price * 0.1) {
          score += 30;
          reasons.push('Близкая цена');
        }
        if (a.material === b.material) {
          score += 20;
          reasons.push('Тот же материал');
        }

        if (score >= 60) {
          overlaps.push({
            skuA: a.sku,
            skuB: b.sku,
            similarityScore: score,
            reason: reasons.join(', '),
            actionHint:
              score >= 80
                ? 'Каннибализация: рассмотрите вывод одного SKU'
                : 'Близкие аналоги: разведите по маркетингу',
          });
        }
      }
    }
  });

  return overlaps.sort((a, b) => b.similarityScore - a.similarityScore);
}
