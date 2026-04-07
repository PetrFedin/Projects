import type { CatalogLeafRow } from './catalog-flat-rows';

/**
 * Сопоставляет лист каталога (L1–L3) с ключом объекта *ByCategory в product-attributes
 * (наследие «тип изделия в каталоге»), например «Платья и сарафаны», «Топы» / «Футболки».
 */
export function resolveLegacyAttributeGroupKey(row: CatalogLeafRow, groupedKeys: string[]): string | null {
  const k = new Set(groupedKeys);
  if (k.size === 0) return null;

  // Вид спорта (обувь / спортодежда)
  if (k.has('Кроссовки') && row.l1 === 'Обувь' && row.l2 === 'Кроссовки') return 'Кроссовки';
  if (k.has('Спортивная') && row.l1 === 'Обувь' && row.l2 === 'Спортивная') return 'Спортивная';
  if (k.has('Спортивная одежда') && row.l1 === 'Одежда' && row.l2 === 'Спортивная одежда') return 'Спортивная одежда';

  if (row.l1 === 'Одежда') {
    const l2 = row.l2;
    if (l2 === 'Платья' || l2 === 'Сарафаны') {
      return k.has('Платья и сарафаны') ? 'Платья и сарафаны' : null;
    }
    if (l2 === 'Топы' && row.l3 === 'Поло' && k.has('Футболки')) return 'Футболки';
    if (l2 === 'Топы' && k.has('Топы')) return 'Топы';
    if (l2 === 'Футболки' && k.has('Футболки')) return 'Футболки';
    if (k.has(l2)) return l2;
    return null;
  }

  if (k.has(row.l1)) return row.l1;
  if (k.has(row.l2)) return row.l2;
  if (row.l3 !== '—' && k.has(row.l3)) return row.l3;

  return null;
}

export type LegacySection = {
  legacyKey: string;
  paths: CatalogLeafRow[];
  opts: unknown[];
};

/**
 * Группирует листья каталога по legacy-ключу (одинаковые значения атрибута для нескольких L3).
 */
export function buildLegacySectionsForGroupedAttribute(
  rows: CatalogLeafRow[],
  grouped: Record<string, unknown[]>,
): LegacySection[] {
  const keys = Object.keys(grouped);
  const map = new Map<string, CatalogLeafRow[]>();
  for (const row of rows) {
    const lk = resolveLegacyAttributeGroupKey(row, keys);
    if (!lk || !grouped[lk]) continue;
    if (!map.has(lk)) map.set(lk, []);
    map.get(lk)!.push(row);
  }
  return [...map.entries()].map(([legacyKey, paths]) => ({
    legacyKey,
    paths,
    opts: grouped[legacyKey] ?? [],
  }));
}
