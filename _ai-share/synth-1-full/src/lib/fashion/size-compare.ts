import type { Product } from '@/lib/types';
import { compositionToPlainText, parseComposition } from './parse-composition';
import type { SizeCompareRow } from './types';

function fmtSizes(p: Product): string {
  if (!p.sizes?.length) return '—';
  return p.sizes.map((s) => s.name).join(', ');
}

/** Плоское сравнение двух SKU для клиента и QA. */
export function buildSizeCompareRows(left: Product, right: Product): SizeCompareRow[] {
  return [
    { label: 'SKU', left: left.sku, right: right.sku },
    { label: 'Бренд', left: left.brand, right: right.brand },
    { label: 'Сезон', left: left.season, right: right.season },
    { label: 'Цвет', left: left.color, right: right.color },
    { label: 'Цена', left: String(left.price), right: String(right.price) },
    { label: 'Размеры', left: fmtSizes(left), right: fmtSizes(right) },
    {
      label: 'Состав',
      left: compositionToPlainText(parseComposition(left)) || '—',
      right: compositionToPlainText(parseComposition(right)) || '—',
    },
    {
      label: 'Eco-теги',
      left: (left.sustainability?.length ?? 0) ? left.sustainability.join('; ') : '—',
      right: (right.sustainability?.length ?? 0) ? right.sustainability.join('; ') : '—',
    },
    { label: 'Категория', left: left.category, right: right.category },
  ];
}
