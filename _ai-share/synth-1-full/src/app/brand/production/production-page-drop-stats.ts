export type DropStatsItemInput = { deliveryWindowId?: string; orderedQuantity?: number };

/** Агрегация по окнам поставки для карточек дропов на этаже. */
export function buildDropStatsFromItems(items: DropStatsItemInput[]): Record<
  string,
  { styles: number; qty: number }
> {
  const acc: Record<string, { styles: number; qty: number }> = {};
  for (const item of items) {
    const windowId: string = item.deliveryWindowId || 'unknown';
    if (!acc[windowId]) acc[windowId] = { styles: 0, qty: 0 };
    acc[windowId].styles += 1;
    acc[windowId].qty += item.orderedQuantity ?? 0;
  }
  return acc;
}
