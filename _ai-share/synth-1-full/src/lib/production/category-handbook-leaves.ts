import snapshot from './generated/category-handbook.snapshot.json';
import type {
  CategoryHandbookSnapshot,
  HandbookCategoryLeaf,
} from './category-handbook-snapshot-builder';
import type { TaxonomyLeafAlias } from './category-leaf-production-types';
import { resolveCanonicalLeafId, TAXONOMY_LEAF_ALIASES } from './category-taxonomy-aliases';

export type {
  CategoryHandbookSnapshot,
  HandbookCategoryLeaf,
} from './category-handbook-snapshot-builder';
export type { TaxonomyLeafAlias } from './category-leaf-production-types';
export {
  buildCategoryHandbookSnapshot,
  handbookAudienceCategoryPath,
} from './category-handbook-snapshot-builder';

const catalog = snapshot as CategoryHandbookSnapshot;
const WORKSHOP2_FALLBACK_AUDIENCES = [
  { id: 'women', name: 'Женщины' },
  { id: 'men', name: 'Мужчины' },
  { id: 'girls', name: 'Девочки' },
  { id: 'boys', name: 'Мальчики' },
  { id: 'newborn', name: 'Новорожденные' },
  { id: 'other', name: 'Остальное' },
] as const;

let cachedLeaves: HandbookCategoryLeaf[] | null = null;

function handbookTaxonomyAliases(): TaxonomyLeafAlias[] {
  if (catalog.schemaVersion >= 2 && catalog.taxonomyAliases?.length) {
    return catalog.taxonomyAliases;
  }
  return TAXONOMY_LEAF_ALIASES;
}

export function getCategoryHandbookSnapshot(): CategoryHandbookSnapshot {
  return catalog;
}

export function getHandbookCategoryLeaves(): HandbookCategoryLeaf[] {
  if (!cachedLeaves) {
    cachedLeaves = catalog.leaves;
  }
  return cachedLeaves;
}

export function getHandbookAudiences(): { id: string; name: string }[] {
  return catalog.audiences;
}

/** Аудитории для разработки коллекции (создание артикула): без унисекс. */
export function getHandbookAudiencesWorkshop2(): { id: string; name: string }[] {
  const filtered = getHandbookAudiences().filter((a) => a.id !== 'unisex');
  const hasDedicatedAudiences = filtered.some((a) => a.id !== 'catalog');
  return hasDedicatedAudiences ? filtered : [...WORKSHOP2_FALLBACK_AUDIENCES];
}

/**
 * Если snapshot пока не разведен по аудиториям, для lookup'ов используем общий `catalog`,
 * но в UI можем показывать брендовые сегменты.
 */
export function resolveWorkshop2EffectiveAudienceId(
  leaves: HandbookCategoryLeaf[],
  audienceId: string
): string {
  if (leaves.some((l) => l.audienceId === audienceId)) return audienceId;
  if (leaves.some((l) => l.audienceId === 'catalog')) return 'catalog';
  return leaves[0]?.audienceId ?? audienceId;
}

export function handbookL1OptionsForAudience(
  leaves: HandbookCategoryLeaf[],
  audienceId: string
): string[] {
  const set = new Set(leaves.filter((l) => l.audienceId === audienceId).map((l) => l.l1Name));
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
}

export function handbookL2OptionsForAudience(
  leaves: HandbookCategoryLeaf[],
  audienceId: string,
  l1Name: string
): string[] {
  const set = new Set(
    leaves.filter((l) => l.audienceId === audienceId && l.l1Name === l1Name).map((l) => l.l2Name)
  );
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
}

export function handbookL3OptionsForAudience(
  leaves: HandbookCategoryLeaf[],
  audienceId: string,
  l1Name: string,
  l2Name: string
): string[] {
  const set = new Set(
    leaves
      .filter((l) => l.audienceId === audienceId && l.l1Name === l1Name && l.l2Name === l2Name)
      .map((l) => l.l3Name)
  );
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
}

export function handbookLeafIdFromL123(
  leaves: HandbookCategoryLeaf[],
  audienceId: string,
  l1Name: string,
  l2Name: string,
  l3Name: string
): string | undefined {
  return leaves.find(
    (l) =>
      l.audienceId === audienceId &&
      l.l1Name === l1Name &&
      l.l2Name === l2Name &&
      l.l3Name === l3Name
  )?.leafId;
}

/** Канонический `leafId` после цепочки алиасов (смена таксономии). */
export function resolveHandbookLeafId(leafId: string): string {
  return resolveCanonicalLeafId(leafId, handbookTaxonomyAliases());
}

export function getHandbookTaxonomyAliases(): TaxonomyLeafAlias[] {
  return [...handbookTaxonomyAliases()];
}

export function findHandbookLeafById(leafId: string): HandbookCategoryLeaf | undefined {
  const id = resolveHandbookLeafId(leafId);
  return getHandbookCategoryLeaves().find((l) => l.leafId === id);
}
