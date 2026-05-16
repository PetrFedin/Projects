import { storageKeyForCollectionId } from '@/lib/production/local-collection-inventory';

/** Строка заказа/артикула из `initialOrderItems` + локальных черновиков (минимальные поля для фильтра). */
export type ProductionPageOrderLike = Record<string, unknown> & {
  season?: string;
  investorDemo?: boolean;
};

/**
 * Список позиций для текущей коллекции: базовые заказы + локальные артикулы из `articlesByCollection`.
 */
export function buildItemsForCollection({
  collectionIdFromQuery,
  initialOrderItems,
  articlesByCollection,
}: {
  collectionIdFromQuery: string;
  initialOrderItems: readonly ProductionPageOrderLike[];
  articlesByCollection: Record<string, ProductionPageOrderLike[] | undefined>;
}): ProductionPageOrderLike[] {
  const key = storageKeyForCollectionId(collectionIdFromQuery);
  const extras = articlesByCollection[key] ?? [];

  if (collectionIdFromQuery === 'Investor') {
    return [...initialOrderItems.filter((i) => i.investorDemo === true), ...extras];
  }
  if (!collectionIdFromQuery) {
    return [...initialOrderItems, ...(articlesByCollection['__default__'] ?? [])];
  }
  return [
    ...initialOrderItems.filter((item) => item.season === collectionIdFromQuery),
    ...extras,
  ];
}
