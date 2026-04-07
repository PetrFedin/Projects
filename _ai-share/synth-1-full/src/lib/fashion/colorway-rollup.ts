import type { Product } from '@/lib/types';
import type { ColorwayRollupRow } from './types';

function colorKey(c: string): string {
  return c.trim().toLowerCase() || '_empty';
}

/** Плотность цветовых рядов по полю color — для range review и закупок. */
export function buildColorwayRollup(products: Product[]): ColorwayRollupRow[] {
  const buckets = new Map<
    string,
    { display: string; skus: number; cats: Set<string>; seasons: Set<string> }
  >();

  for (const p of products) {
    const raw = (p.color || '').trim() || '—';
    const k = colorKey(raw);
    let b = buckets.get(k);
    if (!b) {
      b = { display: raw, skus: 0, cats: new Set(), seasons: new Set() };
      buckets.set(k, b);
    }
    b.skus += 1;
    if (p.category) b.cats.add(p.category.trim());
    if (p.season) b.seasons.add(String(p.season).trim());
  }

  return [...buckets.values()]
    .map((b) => ({
      displayColor: b.display,
      skuCount: b.skus,
      categorySample: [...b.cats].slice(0, 4).join(', ') || '—',
      seasonSample: [...b.seasons].slice(0, 3).join(', ') || '—',
    }))
    .sort((a, b) => b.skuCount - a.skuCount);
}

export function colorwayRollupToCsv(rows: ColorwayRollupRow[]): string {
  const h = ['color', 'sku_count', 'categories_sample', 'seasons_sample'];
  const lines = [h.join(',')];
  for (const r of rows) {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    lines.push([esc(r.displayColor), String(r.skuCount), esc(r.categorySample), esc(r.seasonSample)].join(','));
  }
  return lines.join('\n');
}
