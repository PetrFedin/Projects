import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';

/** Tier label для CRM ритейлера — из PG order.tier или объёма заказов. */
export function workshop2RetailerTierLabelRu(
  latestTier: Workshop2B2bOrderRecord['tier'] | undefined,
  orderCount: number
): string {
  if (latestTier === 'vip') return 'VIP';
  if (latestTier === 'prebook') return 'Пребук';
  if (orderCount >= 3) return 'Ключевой';
  if (orderCount >= 1) return 'Оптовый';
  return 'Новый';
}

/** Нормализация buyer/rep → retailer id (shop1, shop2, …). */
export function workshop2RetailerIdFromOrder(order: Workshop2B2bOrderRecord): string | null {
  const rep = order.repId?.trim();
  if (rep && /^shop\d/i.test(rep)) return rep.toLowerCase();
  const buyer = order.buyerId?.trim();
  if (buyer === 'buyer-demo') return 'shop1';
  if (buyer && /^shop\d/i.test(buyer)) return buyer.toLowerCase();
  if (rep) return rep;
  if (buyer) return buyer;
  return null;
}
