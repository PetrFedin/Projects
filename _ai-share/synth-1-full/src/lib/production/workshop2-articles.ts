import type { LocalCollectionInventory } from '@/lib/production/local-collection-inventory';
import { storageKeyForCollectionId } from '@/lib/production/local-collection-inventory';

/** Единственная коллекция в интерфейсе «Цех 2» (демо). */
export const WORKSHOP2_COLLECTION_ID = 'SS27';

/** Три демо-линии SS27 с ненулевым прогрессом этапов (как в основном цехе). */
export const WORKSHOP2_DEMO_LINE_SKUS = [
  'SS27-M-COAT-01',
  'SS27-W-DRS-02',
  'SS27-U-SNK-03',
] as const;

const DEMO_SKU_ORDER = new Map<string, number>(WORKSHOP2_DEMO_LINE_SKUS.map((s, i) => [s, i]));

/** Оставляет только демо-артикулы цеха и фиксирует порядок строк. */
export function filterWorkshop2DemoOrderLines(items: unknown[]): unknown[] {
  const set = new Set<string>(WORKSHOP2_DEMO_LINE_SKUS);
  const list = items.filter((item) => set.has(String((item as { sku?: string }).sku ?? '')));
  return [...list].sort(
    (a, b) =>
      (DEMO_SKU_ORDER.get(String((a as { sku?: string }).sku ?? '')) ?? 99) -
      (DEMO_SKU_ORDER.get(String((b as { sku?: string }).sku ?? '')) ?? 99)
  );
}

export function itemsForCollectionIdForWorkshop2(
  cid: string,
  localInventory: LocalCollectionInventory,
  orderItems: unknown[]
): unknown[] {
  const items = orderItems as any[];
  const key = storageKeyForCollectionId(cid);
  const extras = localInventory.articlesByCollection[key] ?? [];
  if (cid === 'Investor') return [...items.filter((i: any) => i.investorDemo === true), ...extras];
  if (!cid) return [...items, ...(localInventory.articlesByCollection['__default__'] ?? [])];
  return [...items.filter((item: any) => item.season === cid), ...extras];
}

/**
 * Список артикулов для UI Цеха 2: для SS27 демо-строки из сида сохраняют порядок,
 * локально созданные артикулы не отбрасываются (в отличие от «только демо-SKU»).
 */
export function workshop2MergedItemsForCollectionList(
  cid: string,
  localInventory: LocalCollectionInventory,
  orderItems: unknown[]
): unknown[] {
  const merged = itemsForCollectionIdForWorkshop2(cid, localInventory, orderItems);
  if (cid !== WORKSHOP2_COLLECTION_ID) return merged;
  const demoSkus = new Set<string>(WORKSHOP2_DEMO_LINE_SKUS as unknown as string[]);
  const demoPart = filterWorkshop2DemoOrderLines(merged);
  const rest = merged.filter((it) => !demoSkus.has(String((it as { sku?: string }).sku ?? '')));
  return [...demoPart, ...rest];
}
