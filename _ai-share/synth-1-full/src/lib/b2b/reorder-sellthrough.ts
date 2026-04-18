/**
 * NuORDER: Line sheets / reorder по истории — умный reorder с подсказками по sell-through (мок).
 * Для каждого артикула из прошлых заказов: продано %, рекомендованное кол-во к повторному заказу.
 */

import { mockB2BOrders } from '@/lib/order-data';
import { initialOrderItems } from '@/lib/order-data';
import products from '@/lib/products';

export interface ReorderLineSellThrough {
  orderId: string;
  brand: string;
  sku: string;
  productId: string;
  productName: string;
  previousQty: number;
  /** Мок: проданное кол-во за период */
  soldQty: number;
  /** sell-through rate 0..1 */
  sellThroughRate: number;
  /** Рекомендация: сколько заказать в повторе (мок-логика: +20% если ST > 80%, same если 50–80%, -20% если < 50%) */
  suggestedQty: number;
  hint: 'increase' | 'same' | 'decrease';
}

/** Мок: строки прошлых заказов с sell-through. В проде — из аналитики/ERP. */
function buildMockReorderLines(): ReorderLineSellThrough[] {
  const orders = mockB2BOrders.filter((o) => o.status !== 'Черновик');
  const itemsByOrder: Record<
    string,
    { sku: string; productId: string; name: string; qty: number }[]
  > = {
    'B2B-0012': [
      {
        sku: (products[0] as any)?.sku ?? 'CTP-26-001',
        productId: products[0]?.id ?? '1',
        name: products[0]?.name ?? 'Product 1',
        qty: 50,
      },
      {
        sku: (products[1] as any)?.sku ?? 'CTP-26-002',
        productId: products[1]?.id ?? '2',
        name: products[1]?.name ?? 'Product 2',
        qty: 75,
      },
      {
        sku: (products[3] as any)?.sku ?? 'CTP-26-004',
        productId: products[3]?.id ?? '4',
        name: products[3]?.name ?? 'Product 4',
        qty: 30,
      },
    ],
    'B2B-0011': [
      {
        sku: (products[2] as { sku?: string })?.sku ?? 'NW-K001-BLK',
        productId: products[2]?.id ?? '3',
        name: products[2]?.name ?? 'Nordic Wool — позиция 1',
        qty: 40,
      },
      {
        sku: (products[0] as { sku?: string })?.sku ?? 'NW-K001-BLK',
        productId: products[0]?.id ?? '1',
        name: products[0]?.name ?? 'Nordic Wool — позиция 2',
        qty: 60,
      },
    ],
<<<<<<< HEAD
    'B2B-0010': [{ sku: 'ACNE-26-01', productId: '201', name: 'Acne Item', qty: 25 }],
=======
    'B2B-0010': [
      {
        sku: (products[4] as { sku?: string })?.sku ?? 'SYN-C004-BEI',
        productId: products[4]?.id ?? '4',
        name: products[4]?.name ?? 'Syntha Lab — позиция',
        qty: 25,
      },
    ],
>>>>>>> recover/cabinet-wip-from-stash
  };
  const lines: ReorderLineSellThrough[] = [];
  orders.forEach((o) => {
    const items =
      itemsByOrder[o.order] ??
      initialOrderItems.slice(0, 2).map((it: any) => ({
        sku: it.sku ?? it.id,
        productId: it.id,
        name: it.name,
        qty: it.orderedQuantity ?? 0,
      }));
    items.forEach((line, i) => {
      const previousQty = line.qty;
      const seed = (o.order.length + line.sku.length + i) % 100;
      const rate = 0.45 + (seed / 100) * 0.5; // мок: детерминированный 45–95%
      const soldQty = Math.round(previousQty * rate);
      const sellThroughRate = previousQty > 0 ? soldQty / previousQty : 0;
      let suggestedQty = previousQty;
      let hint: ReorderLineSellThrough['hint'] = 'same';
      if (sellThroughRate >= 0.8) {
        suggestedQty = Math.max(previousQty, Math.round(previousQty * 1.2));
        hint = 'increase';
      } else if (sellThroughRate < 0.5) {
        suggestedQty = Math.max(1, Math.round(previousQty * 0.8));
        hint = 'decrease';
      }
      lines.push({
        orderId: o.order,
        brand: o.brand,
        sku: line.sku,
        productId: line.productId,
        productName: line.name,
        previousQty,
        soldQty,
        sellThroughRate,
        suggestedQty,
        hint,
      });
    });
  });
  return lines;
}

let cachedLines: ReorderLineSellThrough[] | null = null;

export function getReorderLinesWithSellThrough(): ReorderLineSellThrough[] {
  if (!cachedLines) cachedLines = buildMockReorderLines();
  return cachedLines;
}

export function getReorderLinesByOrder(orderId: string): ReorderLineSellThrough[] {
  return getReorderLinesWithSellThrough().filter((l) => l.orderId === orderId);
}
