import type { TaxonomyLeafAlias } from './category-leaf-production-types';

/**
 * Алиасы устаревших `leafId` → актуальный лист. Попадает в `category-handbook.snapshot.json` (schema v2).
 * `subjectId` / цепочки проверяйте при миграции бэкапов артикулов.
 */
export const TAXONOMY_LEAF_ALIASES: TaxonomyLeafAlias[] = [
  {
    fromLeafId: 'catalog-apparel-outerwear-palto',
    toLeafId: 'catalog-apparel-g0-l0',
    since: '2026-01-15',
    note: 'Словесный slug → индекс g/l (Пальто)',
  },
  {
    fromLeafId: 'catalog-shoes-sneakers',
    toLeafId: 'catalog-shoes-g0-l0',
    since: '2026-01-15',
    note: 'EN slug → лист «Кроссовки»',
  },
  {
    fromLeafId: 'catalog-bags-cosmetic-pouch',
    toLeafId: 'catalog-bags-g5-l0',
    since: '2026-02-01',
    note: 'Косметички / несессеры',
  },
  {
    fromLeafId: 'catalog-beauty-parfum-legacy',
    toLeafId: 'catalog-beauty-g0-l0',
    since: '2026-02-05',
    note: 'Парфюмерия: прежний id ветки',
  },
  {
    fromLeafId: 'catalog-newborn-stroller-legacy',
    toLeafId: 'catalog-newborn-g0-l0',
    since: '2026-02-08',
    note: 'Коляски: единый лист',
  },
  {
    fromLeafId: 'catalog-prefill-v0-toys',
    toLeafId: 'catalog-prefill-v1-toys',
    since: '2026-02-10',
    note: 'Промежуточный id (цепочка на catalog-toys-g0-l0)',
  },
  {
    fromLeafId: 'catalog-prefill-v1-toys',
    toLeafId: 'catalog-toys-g0-l0',
    since: '2026-02-11',
    note: 'Игрушки (детские): финальный лист',
  },
];

export function taxonomyAliasForwardMap(aliases: TaxonomyLeafAlias[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const a of aliases) {
    const from = a.fromLeafId.trim();
    const to = a.toLeafId.trim();
    if (from && to) m.set(from, to);
  }
  return m;
}

/** Разрешить цепочку алиасов до канонического leafId (защита от циклов). */
export function resolveCanonicalLeafId(leafId: string, aliases: TaxonomyLeafAlias[]): string {
  const forward = taxonomyAliasForwardMap(aliases);
  let current = leafId.trim();
  const seen = new Set<string>();
  for (let i = 0; i < 64; i++) {
    if (seen.has(current)) return current;
    seen.add(current);
    const next = forward.get(current);
    if (!next || next === current) return current;
    current = next;
  }
  return current;
}
