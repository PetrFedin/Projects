import type { Product } from '@/lib/types';
import type { CategoryPriceStat } from './types';

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Мин/макс/средняя/медиана цены по категории для мерча и прайсинга. */
export function buildCategoryPriceStats(products: Product[]): CategoryPriceStat[] {
  const map = new Map<string, number[]>();
  for (const p of products) {
    const cat = (p.category || 'Прочее').trim() || 'Прочее';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p.price);
  }
  return [...map.entries()]
    .map(([category, prices]) => {
      const sorted = [...prices].sort((a, b) => a - b);
      const sum = prices.reduce((a, b) => a + b, 0);
      return {
        category,
        count: prices.length,
        min: sorted[0] ?? 0,
        max: sorted[sorted.length - 1] ?? 0,
        avg: prices.length ? Math.round((sum / prices.length) * 100) / 100 : 0,
        median: Math.round(median(prices) * 100) / 100,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function categoryPriceStatsToCsv(rows: CategoryPriceStat[]): string {
  const h = ['category', 'count', 'min', 'max', 'avg', 'median'];
  const lines = [h.join(',')];
  for (const r of rows) {
    lines.push(
      [
        `"${r.category.replace(/"/g, '""')}"`,
        String(r.count),
        String(r.min),
        String(r.max),
        String(r.avg),
        String(r.median),
      ].join(',')
    );
  }
  return lines.join('\n');
}
