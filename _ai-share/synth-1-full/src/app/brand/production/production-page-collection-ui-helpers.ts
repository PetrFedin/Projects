import type { BrandProductionMockCollectionRow } from '@/app/brand/production/production-page-demo-data';
import type { LocalCollectionInventory } from '@/lib/production/local-collection-inventory';

/** Подпись в шапке селектора коллекции. */
export function formatProductionCollectionLabel(collectionIdFromQuery: string): string {
  if (!collectionIdFromQuery) return 'Коллекция (по умолчанию)';
  return `Коллекция: ${collectionIdFromQuery}`;
}

/** Сезоны из каталога + id пользовательских локальных коллекций, отсортировано. */
export function mergeCollectionSelectOptions(
  collectionOptions: string[],
  userCollections: Array<{ id: string }>
): string[] {
  const s = new Set(collectionOptions);
  for (const c of userCollections) {
    s.add(c.id);
  }
  return Array.from(s).sort();
}

/**
 * Карточки коллекций для этажа: локальные коллекции (не дублирующие моки) + фиксированный мок-список.
 */
export function buildWorkshopCollectionsDisplay(
  inv: LocalCollectionInventory,
  mockCollections: readonly BrandProductionMockCollectionRow[]
): BrandProductionMockCollectionRow[] {
  const existing = new Set(mockCollections.map((m) => m.id));
  const extra = inv.userCollections
    .filter((u) => !existing.has(u.id))
    .map((c) => ({
      id: c.id,
      name: `${c.name} · локально`,
      status: 'draft' as const,
      articleCount: inv.articlesByCollection[c.id]?.length ?? 0,
      progressPct: 0,
    }));
  return [...extra, ...mockCollections];
}

/** Текущий `collectionId` — пользовательская локальная коллекция из инвентаря. */
export function isUserDefinedProductionCollection(
  collectionIdFromQuery: string,
  userCollections: Array<{ id: string }>
): boolean {
  return userCollections.some((c) => c.id === collectionIdFromQuery.trim());
}
