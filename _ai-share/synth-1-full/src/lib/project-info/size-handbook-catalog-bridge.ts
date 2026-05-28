/**
 * Связь листов справочника категорий (галочки М/Ж/Мл/Дв/Нв/Пр) с id блоков
 * `PRODUCTION_PARAMS_BY_CATEGORY` для страницы «Размерные сетки».
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import type { CatalogAudienceFlags } from '@/lib/project-info/category-catalog-audience-flags';
import { getProductionParamsByCategory } from '@/lib/data/production-params';

export function productionParamIdsForCatalogFlags(l1: string, f: CatalogAudienceFlags): string[] {
  const L = l1.trim();
  const ids = new Set<string>();

  const anyAdult = f.men || f.women;
  const anyKid = f.boys || f.girls || f.newborn;

  if (L === 'Одежда') {
    if (f.men) ids.add('men-apparel');
    if (f.women) ids.add('women-apparel');
    if (f.boys) ids.add('kids-apparel-boys');
    if (f.girls) ids.add('kids-apparel-girls');
    if (f.newborn) ids.add('kids-apparel');
    return [...ids];
  }

  if (L === 'Обувь') {
    if (f.men) ids.add('men-shoes');
    if (f.women) ids.add('women-shoes');
    if (anyKid) ids.add('kids-shoes');
    return [...ids];
  }

  if (L === 'Сумки') {
    if (f.men) ids.add('men-bags');
    if (f.women) ids.add('women-bags');
    if (anyKid) ids.add('kids-bags');
    return [...ids];
  }

  if (L === 'Аксессуары') {
    if (f.men) ids.add('men-accessories');
    if (f.women) ids.add('women-accessories');
    if (anyKid) ids.add('kids-accessories');
    return [...ids];
  }

  if (L === 'Головные уборы') {
    if (f.men) ids.add('men-headwear');
    if (f.women) ids.add('women-headwear');
    if (anyKid) ids.add('kids-accessories');
    return [...ids];
  }

  if (L === 'Меховые изделия') {
    if (f.men) ids.add('men-fur');
    if (f.women) ids.add('women-fur');
    if (anyKid) ids.add('women-fur');
    return [...ids];
  }

  if (L === 'Носочно-чулочные') {
    if (f.men) ids.add('men-accessories');
    if (f.women) ids.add('women-accessories');
    if (anyKid) ids.add('kids-accessories');
    return [...ids];
  }

  if (L === 'Аксессуары для новорождённых') {
    ids.add('newborn-accessories');
    return [...ids];
  }

  if (L === 'Игрушки (детские)') {
    if (anyKid) ids.add('women-accessories');
    return [...ids];
  }

  if (L === 'Красота и уход') {
    if (anyAdult || f.other) ids.add('beauty-care');
    return [...ids];
  }

  if (L === 'Дом и стиль жизни') {
    if (anyAdult || f.other) ids.add('home-lifestyle');
    return [...ids];
  }

  return [];
}

export type SizeHandbookCatalogRow = {
  leafId: string;
  path: string;
  l1: string;
  flags: CatalogAudienceFlags;
  paramIds: string[];
};

export function buildSizeHandbookCatalogRows(
  leaves: HandbookCategoryLeaf[],
  getFlags: (leafId: string) => CatalogAudienceFlags
): SizeHandbookCatalogRow[] {
  const out: SizeHandbookCatalogRow[] = [];
  for (const leaf of leaves) {
    const flags = getFlags(leaf.leafId);
    const paramIds = productionParamIdsForCatalogFlags(leaf.l1Name, flags);
    if (paramIds.length === 0) continue;
    out.push({
      leafId: leaf.leafId,
      path: `${leaf.l1Name} › ${leaf.l2Name} › ${leaf.l3Name}`,
      l1: leaf.l1Name,
      flags,
      paramIds,
    });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path, 'ru'));
}

export function formatParamIdsShort(ids: string[]): string {
  return ids.map((id) => getProductionParamsByCategory(id)?.label ?? id).join(' · ');
}

/** Строки, где задействована хотя бы одна детская аудитория (Мл/Дв/Нв). */
export function filterKidAudienceRows(rows: SizeHandbookCatalogRow[]): SizeHandbookCatalogRow[] {
  return rows.filter((r) => r.flags.boys || r.flags.girls || r.flags.newborn);
}
