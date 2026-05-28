/**
 * Collections по сезону/тренду (Faire, NuOrder).
 * Группировки: Early Bird, VIP, Outlet, Stock Lot — фильтрация продуктов в матрице.
 */

export type LinesheetCollectionId = 'early-bird' | 'vip' | 'outlet' | 'stock-lot' | 'all';

export interface LinesheetCollection {
  id: LinesheetCollectionId;
  name: string;
  description: string;
  /** Фильтр: теги продуктов, категории или явный список productIds */
  productTags?: string[];
  categoryFilter?: string;
  productIds?: string[];
}

export const LINESHEET_COLLECTIONS: LinesheetCollection[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Ранний доступ, ключевые партнёры',
    productTags: ['early-bird', 'core'],
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Расширенный ассортимент, приоритет',
    productTags: ['vip', 'premium', 'core'],
  },
  {
    id: 'outlet',
    name: 'Outlet',
    description: 'Ликвидация, уценка',
    productTags: ['outlet', 'sale'],
  },
  {
    id: 'stock-lot',
    name: 'Stock Lot',
    description: 'Остатки со склада',
    productTags: ['stock-lot', 'remainder'],
  },
  { id: 'all', name: 'Все', description: 'Полный каталог', productTags: [] },
];

/** Фильтровать productIds по коллекции */
export function filterProductsByCollection(
  productIds: string[],
  productTags: Record<string, string[]>,
  collectionId: LinesheetCollectionId
): string[] {
  if (collectionId === 'all') return productIds;
  const coll = LINESHEET_COLLECTIONS.find((c) => c.id === collectionId);
  if (!coll?.productTags?.length) return productIds;
  return productIds.filter((id) => {
    const tags = productTags[id] ?? [];
    return coll.productTags!.some((t) => tags.includes(t));
  });
}
