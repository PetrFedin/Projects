import type { Product } from '@/lib/types';
import type { WholesaleOrderEntryV1 } from './types';

export function calculateWholesaleOrderTotal(entries: WholesaleOrderEntryV1[]): number {
  return entries.reduce((sum, e) => sum + e.quantity * e.price, 0);
}

/** Группировка заказа по SKU для удобства подтверждения. */
export function groupWholesaleOrder(entries: WholesaleOrderEntryV1[]) {
  const map = new Map<string, { qty: number; total: number }>();
  entries.forEach(e => {
    const cur = map.get(e.sku) || { qty: 0, total: 0 };
    map.set(e.sku, {
      qty: cur.qty + e.quantity,
      total: cur.total + (e.quantity * e.price),
    });
  });
  return map;
}
