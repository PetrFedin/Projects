/**
 * Фасеты артикула для вкладки «Этапы»: аудитория и L1–L3 строго из CATEGORY_HANDBOOK.
 */

import {
  findHandbookLeafById,
  getHandbookAudiences,
  getHandbookCategoryLeaves,
  type HandbookCategoryLeaf,
} from '@/lib/production/category-catalog';

export type StagesArticleFacets = {
  audienceId: string;
  audienceLabel: string;
  /** id листа справочника (для сопоставления с PIM) */
  categoryLeafId: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  /** Аудитория › L1 › L2 › L3 (L1–L3 — уровни под `aud.categories` в CATEGORY_HANDBOOK) */
  categoryPathLabel: string;
  season: string;
  productionSiteId: string;
  productionSiteLabel: string;
  /** Два поставщика ткани (подпись для UI) */
  fabricSuppliersLabel: string;
  /** Если основная ткань со склада бренда (часто учёт на складе у производства) */
  fabricStockNote?: string;
};

export const STAGES_PRODUCTION_SITES: { id: string; label: string }[] = [
  { id: 'fab-rf-ivanovo', label: 'Фабрика · Иваново (РФ)' },
  { id: 'fab-rf-krasnodar', label: 'Фабрика · Краснодар (РФ)' },
  { id: 'fab-sh', label: 'Фабрика · Шанхай (осн.)' },
  { id: 'fab-ist', label: 'Фабрика · Стамбул' },
  { id: 'atelier-msc', label: 'Ателье · Москва' },
  { id: 'cut-tula', label: 'Раскройный цех · Тула' },
  { id: 'inhouse', label: 'Собственное производство' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function leafFromItem(item: Record<string, unknown>): HandbookCategoryLeaf | undefined {
  const leafId = item.categoryLeafId ?? item.handbookLeafId ?? item.categoryHandbookId;
  if (typeof leafId === 'string' && leafId.trim()) {
    return findHandbookLeafById(leafId.trim());
  }
  return undefined;
}

const DEFAULT_FABRIC_STOCK_NOTE =
  'Основная ткань со склада бренда · партия учтена на складе у производства';

function fabricFacetsFromItem(
  item: Record<string, unknown>
): Pick<StagesArticleFacets, 'fabricSuppliersLabel' | 'fabricStockNote'> {
  const raw = item.fabricSuppliers;
  const names = Array.isArray(raw)
    ? (raw as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : [];
  const fabricSuppliersLabel =
    names.length > 0
      ? `Ткань: ${names.length} поставщика — ${names.join('; ')}`
      : 'Ткань: поставщики не указаны';
  const fabricStockNote =
    item.fabricMainFromBrandStock === true
      ? typeof item.fabricStockNote === 'string' && item.fabricStockNote.trim()
        ? item.fabricStockNote.trim()
        : DEFAULT_FABRIC_STOCK_NOTE
      : undefined;
  return { fabricSuppliersLabel, fabricStockNote };
}

/**
 * Назначает артикулу ветку из справочника: явный leafId или стабильный выбор по id строки.
 */
export function deriveStagesArticleFacets(
  item: Record<string, unknown>,
  index: number
): StagesArticleFacets {
  const id = String(item.id ?? item.sku ?? index);
  const leaves = getHandbookCategoryLeaves();
  const leaf = leafFromItem(item) ?? leaves[hashString(id) % leaves.length] ?? leaves[0];
  const site = STAGES_PRODUCTION_SITES[hashString(id + 'site') % STAGES_PRODUCTION_SITES.length];
  const seasonRaw = item.season ?? item.collectionSeason ?? item.seasonCode;

  return {
    audienceId: leaf.audienceId,
    audienceLabel: leaf.audienceName,
    categoryLeafId: leaf.leafId,
    categoryL1: leaf.l1Name,
    categoryL2: leaf.l2Name,
    categoryL3: leaf.l3Name,
    categoryPathLabel: leaf.pathLabel,
    season: typeof seasonRaw === 'string' && seasonRaw.trim() ? seasonRaw.trim() : 'FW26',
    productionSiteId: (item.productionSiteId as string) || (item.factoryId as string) || site.id,
    productionSiteLabel:
      (item.productionSiteLabel as string) || (item.factoryName as string) || site.label,
    ...fabricFacetsFromItem(item),
  };
}

/** Подпись в UI производства: код артикула и сезон коллекции (без длинного названия модели). */
export function stagesArticleDisplayLabel(sku: string, season?: string): string {
  const t = season?.trim();
  return t ? `${sku} · ${t}` : sku;
}

export function uniqueSeasons(articles: { season?: string }[]): string[] {
  const s = new Set<string>();
  articles.forEach((a) => {
    if (a.season?.trim()) s.add(a.season.trim());
  });
  return Array.from(s).sort();
}

export { getHandbookAudiences, getHandbookCategoryLeaves };
