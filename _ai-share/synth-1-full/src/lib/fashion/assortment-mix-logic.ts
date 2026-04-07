import type { Product } from '@/lib/types';
import type { AssortmentMixV1 } from './types';

/** Анализирует долю категорий в коллекции (OTB Planning). */
export function calculateAssortmentMix(products: Product[]): AssortmentMixV1[] {
  const counts = new Map<string, number>();
  products.forEach(p => counts.set(p.category, (counts.get(p.category) || 0) + 1));

  const total = products.length || 1;
  const targets: Record<string, number> = {
    'Top': 35,
    'Bottom': 25,
    'Outerwear': 15,
    'Accessory': 15,
    'Footwear': 10,
  };

  return Array.from(counts.entries()).map(([cat, count]) => {
    const currentPct = Math.round((count / total) * 100);
    const targetPct = targets[cat] || 10;
    return {
      category: cat,
      currentPct,
      targetPct,
      skuCount: count,
      gap: currentPct - targetPct,
    };
  }).sort((a, b) => b.skuCount - a.skuCount);
}
