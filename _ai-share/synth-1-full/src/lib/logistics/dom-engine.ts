import { InventoryGrain } from '../logic/inventory-ledger';

export interface FulfillmentSplit {
  locationId: string;
  items: Array<{ sku: string; quantity: number }>;
}

export interface DOMResult {
  splits: FulfillmentSplit[];
  unfulfilled: Array<{ sku: string; missingQty: number }>;
  isFullyFulfilled: boolean;
}

/**
 * [Phase 7 — Distributed Order Management (DOM)]
 * Движок распределенного управления заказами.
 * Решает задачу "Split Shipment": если заказ нельзя собрать на одном складе,
 * он разбивается на несколько отгрузок с разных складов.
 */
export class DOMEngine {
  /**
   * Рассчитывает оптимальный план отгрузки заказа с учетом доступных остатков на складах.
   * Жадный алгоритм: сначала берет со склада, где больше всего товара.
   */
  public static planFulfillment(
    orderItems: Array<{ sku: string; requestedQty: number }>,
    grains: InventoryGrain[],
    channelId?: 'b2b' | 'b2c' | 'retail'
  ): DOMResult {
    const splitsMap: Map<string, FulfillmentSplit> = new Map();
    const unfulfilled: Array<{ sku: string; missingQty: number }> = [];

    for (const item of orderItems) {
      let remaining = item.requestedQty;
      
      // Находим все доступные гранулы для этого SKU
      const availableGrains = grains.filter(g => 
        g.sku === item.sku && 
        g.state === 'on_hand' &&
        (!channelId || g.channelId === channelId || !g.channelId) // Учитываем канал
      );
      
      // Сортируем по убыванию количества (чтобы минимизировать количество сплитов)
      availableGrains.sort((a, b) => b.quantity - a.quantity);

      for (const grain of availableGrains) {
        if (remaining <= 0) break;
        
        const take = Math.min(grain.quantity, remaining);
        remaining -= take;

        if (!splitsMap.has(grain.locationId)) {
          splitsMap.set(grain.locationId, { locationId: grain.locationId, items: [] });
        }
        
        const split = splitsMap.get(grain.locationId)!;
        const existingItem = split.items.find(i => i.sku === item.sku);
        
        if (existingItem) {
          existingItem.quantity += take;
        } else {
          split.items.push({ sku: item.sku, quantity: take });
        }
      }

      if (remaining > 0) {
        unfulfilled.push({ sku: item.sku, missingQty: remaining });
      }
    }

    return { 
      splits: Array.from(splitsMap.values()), 
      unfulfilled,
      isFullyFulfilled: unfulfilled.length === 0
    };
  }
}
