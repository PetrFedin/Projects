export interface ReturnRequest {
  orderId: string;
  sku: string;
  condition: 'mint' | 'damaged' | 'wrong_item';
  customerLocation: { lat: number; lng: number }; // Координаты клиента
}

export interface StoreInventoryStatus {
  storeId: string;
  location: { lat: number; lng: number };
  deficitQuantity: number; // Дефицит этого SKU в магазине (например, 2 штуки)
}

export interface ReturnRoutingDecision {
  orderId: string;
  destinationType: 'store' | 'central_dc' | 'recycling_center' | 'keep_it';
  destinationId: string | null;
  estimatedShippingCostUSD: number;
  reasoning: string;
}

/**
 * [Phase 24 — Predictive Returns Routing (Smart RMA)]
 * Умная маршрутизация возвратов.
 * Вместо того чтобы везти все возвраты на центральный склад (DC),
 * система анализирует состояние вещи и дефицит в ближайших магазинах.
 * Если вещь новая (mint) и в соседнем магазине ее не хватает — возврат едет прямо туда.
 * Если вещь дешевая и доставка стоит дороже — клиенту предлагают оставить ее себе (Keep It).
 */
export class PredictiveReturnsRouter {
  /**
   * Определяет оптимальный маршрут для возвращаемого товара.
   */
  public static routeReturn(
    request: ReturnRequest,
    itemValueUSD: number,
    nearbyStores: StoreInventoryStatus[]
  ): ReturnRoutingDecision {
    let destinationType: ReturnRoutingDecision['destinationType'] = 'central_dc';
    let destinationId: string | null = 'DC-MAIN-01';
    let estimatedShippingCostUSD = 15; // Базовая стоимость возврата на ЦС
    let reasoning = 'Standard return routing to Central Distribution Center.';

    // 1. Экономическая целесообразность (Keep It)
    // Если доставка обратно стоит дороже самой вещи (например, носки за $10)
    if (itemValueUSD < 15 && request.condition !== 'wrong_item') {
      return {
        orderId: request.orderId,
        destinationType: 'keep_it',
        destinationId: null,
        estimatedShippingCostUSD: 0,
        reasoning: `Item value ($${itemValueUSD}) is lower than return shipping cost ($15). Customer advised to keep or donate the item. Refund issued automatically.`
      };
    }

    // 2. Маршрутизация брака (Recycling)
    if (request.condition === 'damaged') {
      // Отправляем в ближайший центр переработки (Circular Economy)
      return {
        orderId: request.orderId,
        destinationType: 'recycling_center',
        destinationId: 'RECYCLE-HUB-01',
        estimatedShippingCostUSD: 8, // Локальная доставка дешевле
        reasoning: 'Item is damaged. Routing directly to regional recycling center to minimize carbon footprint and handling costs.'
      };
    }

    // 3. Умная маршрутизация в магазин (Store Fulfillment)
    if (request.condition === 'mint' || request.condition === 'wrong_item') {
      // Ищем ближайший магазин, где этот товар в дефиците
      let bestStore: StoreInventoryStatus | null = null;
      let minDistance = Infinity;

      for (const store of nearbyStores) {
        if (store.deficitQuantity > 0) {
          // Вычисляем примерное расстояние (упрощенная Евклидова метрика для мока)
          const distance = Math.sqrt(
            Math.pow(store.location.lat - request.customerLocation.lat, 2) +
            Math.pow(store.location.lng - request.customerLocation.lng, 2)
          );

          // Допустим, 1 градус ~ 111 км. Ищем в радиусе ~50 км (0.5 градуса)
          if (distance < 0.5 && distance < minDistance) {
            minDistance = distance;
            bestStore = store;
          }
        }
      }

      if (bestStore) {
        // Нашли магазин с дефицитом поблизости!
        destinationType = 'store';
        destinationId = bestStore.storeId;
        estimatedShippingCostUSD = 5; // Локальная курьерская доставка
        reasoning = `Item is in mint condition. Store ${bestStore.storeId} has a deficit of ${bestStore.deficitQuantity} units. Routing return directly to store to replenish shelf and save $10 on shipping.`;
      }
    }

    return {
      orderId: request.orderId,
      destinationType,
      destinationId,
      estimatedShippingCostUSD,
      reasoning
    };
  }
}
