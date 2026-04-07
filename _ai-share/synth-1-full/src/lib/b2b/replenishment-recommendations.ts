/**
 * Прогноз продаж и умное пополнение (AI Replenishment).
 * Рекомендации «дозаказать X шт.» и «не дозаказывать» на основе sell-through и остатка.
 * FashioNexus-style: прогноз спроса по SKU/магазину, сезон учитывается в моке.
 */

import { getReorderLinesWithSellThrough } from './reorder-sellthrough';

export interface ReplenishmentRecommendation {
  sku: string;
  productId: string;
  productName: string;
  brand: string;
  orderId: string;
  /** Заказывали в прошлый раз */
  previousQty: number;
  /** Продано за период (мок) */
  soldQty: number;
  /** Sell-through 0..1 */
  sellThroughRate: number;
  /** Рекомендуемое кол-во к дозаказу */
  suggestedQty: number;
  /** Мок: текущий остаток в магазине (в проде — из ATS/инвентаря) */
  currentStock: number;
  /** Дозаказать suggestedQty шт. или не дозаказывать */
  action: 'reorder' | 'skip';
  /** Краткая причина для UI */
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

/** Мок остатка по productId (в проде — из ATS/warehouse). */
function mockCurrentStock(productId: string, sku: string): number {
  const h = (productId + sku).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return (h % 15) + 2; // 2..16
}

/**
 * Рекомендации к пополнению: по sell-through и остатку.
 * @param brandId — фильтр по бренду (для агентского кабинета); пусто = все бренды.
 */
export function getReplenishmentRecommendations(brandId?: string): ReplenishmentRecommendation[] {
  const lines = getReorderLinesWithSellThrough();
  const filtered = brandId
    ? lines.filter((l) => l.brand.toLowerCase().includes(brandId.toLowerCase()))
    : lines;

  return filtered.map((l) => {
    const currentStock = mockCurrentStock(l.productId, l.sku);
    const reorder = l.suggestedQty > 0 && (l.hint === 'increase' || (l.hint === 'same' && currentStock < 5));
    const suggestedQty = reorder ? l.suggestedQty : 0;
    const action: 'reorder' | 'skip' = reorder ? 'reorder' : 'skip';

    let reason: string;
    if (l.sellThroughRate >= 0.8) reason = 'Высокий sell-through, дозаказ рекомендован';
    else if (l.sellThroughRate < 0.5) reason = 'Низкий sell-through, не дозаказывать';
    else if (currentStock < 5) reason = 'Мало остатка, дозаказ по прошлому объёму';
    else reason = 'Остаток в норме, не дозаказывать';

    let urgency: ReplenishmentRecommendation['urgency'] = 'medium';
    if (action === 'reorder' && (currentStock < 3 || l.sellThroughRate >= 0.9)) urgency = 'high';
    if (action === 'skip' && l.sellThroughRate < 0.4) urgency = 'low';

    return {
      sku: l.sku,
      productId: l.productId,
      productName: l.productName,
      brand: l.brand,
      orderId: l.orderId,
      previousQty: l.previousQty,
      soldQty: l.soldQty,
      sellThroughRate: l.sellThroughRate,
      suggestedQty,
      currentStock,
      action,
      reason,
      urgency,
    };
  });
}
