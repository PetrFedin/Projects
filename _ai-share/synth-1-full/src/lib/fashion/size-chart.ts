import type { Product } from '@/lib/types';
import type { SizeChartRow } from './types';

/** Читает `attributes.sizeChart`: массив объектов { size, chest_cm, ... }. */
export function parseSizeChartRows(product: Product): SizeChartRow[] | null {
  const sc = product.attributes?.sizeChart;
  if (!Array.isArray(sc) || sc.length === 0) return null;
  const first = sc[0];
  if (!first || typeof first !== 'object' || Array.isArray(first)) return null;
  return sc as SizeChartRow[];
}

export function sizeChartColumnOrder(rows: SizeChartRow[]): string[] {
  const keys = new Set<string>();
  for (const r of rows) Object.keys(r).forEach((k) => keys.add(k));
  const list = [...keys];
  list.sort((a, b) => {
    const pa = a.toLowerCase() === 'size' ? 0 : 1;
    const pb = b.toLowerCase() === 'size' ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, 'ru');
  });
  return list;
}
