import { getHandbookCategoryLeaves, type HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import {
  type CatalogAudienceFlags,
  type CatalogAudienceKey,
  defaultAudienceFlagsForCatalogLeaf,
} from '@/lib/project-info/catalog-audience-defaults';

export type { CatalogAudienceFlags, CatalogAudienceKey } from '@/lib/project-info/catalog-audience-defaults';

export const CATALOG_AUDIENCE_COLUMNS: { key: CatalogAudienceKey; label: string; abbr: string }[] = [
  { key: 'men', label: 'Мужчины', abbr: 'М' },
  { key: 'women', label: 'Женщины', abbr: 'Ж' },
  { key: 'boys', label: 'Мальчики', abbr: 'Мл' },
  { key: 'girls', label: 'Девочки', abbr: 'Дв' },
  { key: 'newborn', label: 'Новорождённые', abbr: 'Нв' },
  { key: 'other', label: 'Остальное', abbr: 'Пр' },
];

export const CATEGORY_CATALOG_AUDIENCE_FLAGS_KEY = 'synth.projectInfo.categoryCatalog.audienceFlags.v6';

export function defaultAudienceFlagsForLeaf(leaf: HandbookCategoryLeaf): CatalogAudienceFlags {
  return defaultAudienceFlagsForCatalogLeaf(leaf);
}

export function buildDefaultFlagMap(): Record<string, CatalogAudienceFlags> {
  const map: Record<string, CatalogAudienceFlags> = {};
  for (const leaf of getHandbookCategoryLeaves()) {
    map[leaf.leafId] = defaultAudienceFlagsForCatalogLeaf(leaf);
  }
  return map;
}

function parseStored(raw: string): Record<string, Partial<CatalogAudienceFlags>> | null {
  try {
    const data = JSON.parse(raw) as { version?: number; byLeaf?: Record<string, Partial<CatalogAudienceFlags>> };
    const v = data.version;
    if (
      (v !== 3 && v !== 4 && v !== 5 && v !== 6) ||
      !data.byLeaf ||
      typeof data.byLeaf !== 'object'
    ) {
      return null;
    }
    return data.byLeaf;
  } catch {
    return null;
  }
}

function normalizeFlags(partial: Partial<CatalogAudienceFlags> | undefined): CatalogAudienceFlags | null {
  if (!partial || typeof partial !== 'object') return null;
  return {
    men: Boolean(partial.men),
    women: Boolean(partial.women),
    boys: Boolean(partial.boys),
    girls: Boolean(partial.girls),
    newborn: Boolean(partial.newborn),
    other: Boolean(partial.other),
  };
}

export function loadCatalogAudienceFlagMap(): Record<string, CatalogAudienceFlags> {
  const leaves = getHandbookCategoryLeaves();
  const defaults = buildDefaultFlagMap();

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(CATEGORY_CATALOG_AUDIENCE_FLAGS_KEY);
    if (raw) {
      const partial = parseStored(raw);
      if (partial) {
        const next: Record<string, CatalogAudienceFlags> = {};
        for (const leaf of leaves) {
          const id = leaf.leafId;
          const merged = normalizeFlags(partial[id]);
          next[id] = merged ?? { ...defaults[id]! };
        }
        return next;
      }
    }
  } catch {
    /* quota */
  }

  return defaults;
}

export function saveCatalogAudienceFlagMap(map: Record<string, CatalogAudienceFlags>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      CATEGORY_CATALOG_AUDIENCE_FLAGS_KEY,
      JSON.stringify({ version: 6, byLeaf: map })
    );
  } catch {
    /* quota */
  }
}
