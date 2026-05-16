import {
  PRODUCTION_FLOOR_STEPS,
  type ProductionFloorTabId,
} from '@/lib/production/floor-flow';

export function getProductionFloorTabTitle(tab: ProductionFloorTabId): string {
  return PRODUCTION_FLOOR_STEPS.find((s) => s.id === tab)?.label ?? tab;
}

/** Подмешать collectionId к любому href */
export function mergeCollectionQuery(href: string, collectionQuery: string): string {
  if (!href || !collectionQuery) return href;
  const q = collectionQuery.startsWith('?') ? collectionQuery.slice(1) : collectionQuery;
  return href.includes('?') ? `${href}&${q}` : `${href}?${q}`;
}

/** Мок-номер заказа для связки артикул ↔ B2B/PO в чатах и календаре (до API). */
export function derivePrimaryOrderRef(season: string, idx: number): string {
  const s = (season || 'COL').replace(/\s+/g, '').slice(0, 12);
  return `PO-${s}-${String(idx + 1).padStart(4, '0')}`;
}
