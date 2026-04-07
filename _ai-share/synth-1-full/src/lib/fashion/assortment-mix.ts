import type { Product } from '@/lib/types';
import type { AssortmentMixRow } from './types';

/** Доля категорий в ассортименте (мерч-планирование, до OTB API). */
export function buildAssortmentMix(products: Product[]): AssortmentMixRow[] {
  const map = new Map<string, number>();
  for (const p of products) {
    const c = (p.category || 'Прочее').trim() || 'Прочее';
    map.set(c, (map.get(c) ?? 0) + 1);
  }
  const total = products.length || 1;
  return [...map.entries()]
    .map(([category, count]) => ({
      category,
      count,
      pct: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

export function assortmentMixToCsv(rows: AssortmentMixRow[]): string {
  const lines = ['category,count,pct'];
  for (const r of rows) {
    lines.push([`"${r.category.replace(/"/g, '""')}"`, String(r.count), String(r.pct)].join(','));
  }
  return lines.join('\n');
}
