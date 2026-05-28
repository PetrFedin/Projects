import type { Product } from '@/lib/types';

type CompositionRow = { material?: string; percentage?: number | string };

/** Строка состава для атрибутов каталога / валидации B2B. */
export function formatProductComposition(c: Product['composition']): string {
  if (typeof c === 'string') return c.trim();
  if (!Array.isArray(c) || c.length === 0) return '';
  return c
    .map((x) => {
      if (typeof x === 'string') return x;
      const row = x as CompositionRow;
      return `${row.material ?? ''} ${row.percentage ?? ''}%`.trim();
    })
    .join(', ');
}
