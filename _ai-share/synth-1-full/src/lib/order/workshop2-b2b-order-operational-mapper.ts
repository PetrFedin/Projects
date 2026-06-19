import 'server-only';

import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { workshop2B2bOrderStatusLabelRu } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import type { B2BOrder } from '@/lib/types';

/** Native PG `workshop2_b2b_orders` → operational UI `B2BOrder`. */
export function mapWorkshop2B2bOrderToOperationalRow(order: Workshop2B2bOrderRecord): B2BOrder {
  const date = order.createdAt.slice(0, 10);
  const deliveryDate =
    order.requestedDeliveryDate?.slice(0, 10) ??
    order.lines.find((l) => l.deliveryDate)?.deliveryDate?.slice(0, 10) ??
    date;

  return {
    order: order.id,
    status: workshop2B2bOrderStatusLabelRu(order.status),
    shop: order.buyerId?.trim() || 'Оптовый партнёр',
    brand: order.brandId?.trim() || 'Syntha Lab',
    amount: formatWorkshop2RubCurrency(order.totalRub),
    date,
    deliveryDate,
    orderMode: order.tier === 'prebook' ? 'pre_order' : 'buy_now',
    priceTier: order.tier === 'vip' ? 'retail_a' : 'retail_b',
    paymentStatus: order.status === 'shipped' ? 'paid' : 'pending',
  };
}

export function mapWorkshop2B2bOrderLinesToOperational(
  order: Workshop2B2bOrderRecord
): B2BOrderLineItem[] {
  return (order.lines ?? []).map((line) => ({
    productId: `${line.collectionId}:${line.articleId}`,
    size: line.size,
    quantity: line.qty,
    price: line.wholesalePriceRub,
    currency: 'RUB',
  }));
}

export function mergeOperationalB2bOrderLists(
  snapshotRows: B2BOrder[],
  pgNative: Workshop2B2bOrderRecord[]
): B2BOrder[] {
  const pgIds = new Set(pgNative.map((o) => o.id));
  const fromPg = pgNative.map(mapWorkshop2B2bOrderToOperationalRow);
  const legacy = snapshotRows.filter((row) => !pgIds.has(row.order));
  return [...fromPg, ...legacy].sort((a, b) => b.date.localeCompare(a.date));
}

export function findWorkshop2B2bOrderLineItems(
  pgOrders: Workshop2B2bOrderRecord[],
  orderId: string
): B2BOrderLineItem[] | undefined {
  const order = pgOrders.find((o) => o.id === orderId);
  if (!order?.lines?.length) return undefined;
  return mapWorkshop2B2bOrderLinesToOperational(order);
}
