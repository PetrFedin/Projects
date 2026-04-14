import { CognitivePricingEngine } from '../finance/cognitive-pricing';
import { publishStoreEslPriceUpdated } from '../order/domain-event-factories';

export interface ShelfSensorData {
  storeId: string;
  shelfId: string;
  sku: string;
  currentUnitsOnShelf: number;
  shelfCapacity: number;
  unitsInBackroom: number;
  historicalSalesVelocityPerHour: number;
}

export interface ReplenishmentAction {
  storeId: string;
  shelfId: string;
  sku: string;
  action: 'none' | 'restock_from_backroom' | 'order_from_dc';
  quantityToMove: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
}

/**
 * [Phase 20 — Autonomous Store Operations (Smart Shelf)]
 * Движок умного магазина (Autonomous Retail).
 * Анализирует данные с IoT-датчиков на полках (весы, камеры) и автоматически
 * генерирует задачи для персонала магазина на пополнение полки из подсобки (Backroom),
 * либо формирует заказ на распределительный центр (DC), если товар закончился везде.
 */
export class SmartShelfMonitor {
  /**
   * Обрабатывает телеметрию с умной полки и принимает решение о пополнении.
   */
  public static processSensorData(data: ShelfSensorData): ReplenishmentAction {
    let action: ReplenishmentAction['action'] = 'none';
    let quantityToMove = 0;
    let urgency: ReplenishmentAction['urgency'] = 'low';
    let reasoning = 'Shelf is adequately stocked.';

    // 1. Оценка заполненности полки
    const fillRate = data.currentUnitsOnShelf / data.shelfCapacity;

    // Если полка пуста более чем наполовину, нужно пополнять
    if (fillRate <= 0.4) {
      const deficit = data.shelfCapacity - data.currentUnitsOnShelf;

      // 2. Проверяем наличие в подсобке (Backroom)
      if (data.unitsInBackroom >= deficit) {
        // Товар есть в подсобке — отправляем задачу персоналу
        action = 'restock_from_backroom';
        quantityToMove = deficit;
        
        // Оценка срочности (Urgency) на основе скорости продаж (Velocity)
        // Если товар продается быстро, а полка пустеет — это критично (упущенная выгода)
        const hoursUntilEmpty = data.currentUnitsOnShelf / (data.historicalSalesVelocityPerHour || 1); // Защита от деления на ноль
        
        if (hoursUntilEmpty < 2) {
          urgency = 'critical';
          reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. Velocity is high (${data.historicalSalesVelocityPerHour} units/hr). Stockout expected in <2 hours. CRITICAL: Restock ${deficit} units from backroom immediately.`;
        } else if (hoursUntilEmpty < 6) {
          urgency = 'high';
          reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. Restock ${deficit} units from backroom during next staff round.`;
        } else {
          urgency = 'medium';
          reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. Restock ${deficit} units from backroom.`;
        }

      } else if (data.unitsInBackroom > 0) {
        // В подсобке есть товар, но меньше дефицита — выносим всё, что есть
        action = 'restock_from_backroom';
        quantityToMove = data.unitsInBackroom;
        urgency = 'high';
        reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. Only ${data.unitsInBackroom} units left in backroom. Restock all available units. Need to order more from DC.`;
      } else {
        // 3. Товара нет ни на полке, ни в подсобке — заказываем с РЦ (Distribution Center)
        action = 'order_from_dc';
        // Заказываем столько, чтобы заполнить полку + создать запас в подсобке (например, 2 полных полки)
        quantityToMove = (data.shelfCapacity * 2) - data.currentUnitsOnShelf;
        urgency = 'critical';
        reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. ZERO units in backroom. CRITICAL: Order ${quantityToMove} units from Distribution Center to prevent out-of-stock.`;
      }
    } else {
      // Полка заполнена более чем на 40%
      reasoning = `Shelf fill rate is ${(fillRate * 100).toFixed(0)}%. No action required.`;

      // [Phase 28] Интеграция с ESL (Electronic Shelf Labels) и Динамическим ценообразованием
      // Если полка полная, в подсобке много товара, а скорость продаж низкая — нужно снижать цену прямо на полке
      if (fillRate > 0.8 && data.unitsInBackroom > data.shelfCapacity * 2 && data.historicalSalesVelocityPerHour < 0.5) {
        
        // Запрашиваем новую цену у Cognitive Pricing Engine
        const pricingDecision = CognitivePricingEngine.calculateOptimalPrice({
          sku: data.sku,
          currentPrice: 100, // Mock current price
          competitorAveragePrice: 95,
          inventoryLevel: data.currentUnitsOnShelf + data.unitsInBackroom,
          daysUntilSeasonEnd: 30,
          conversionRatePercent: 0.5 // Низкая конверсия
        });

        if (pricingDecision.strategy === 'clear_inventory') {
          reasoning += ` WARNING: Shelf is full, backroom is overstocked, and velocity is low. Triggering ESL (Electronic Shelf Label) markdown to $${pricingDecision.newPrice} (-${pricingDecision.priceChangePercent}%).`;
          
          // Публикуем событие для обновления ценников в магазине
          void publishStoreEslPriceUpdated({
            aggregateId: data.storeId,
            version: 1,
            payload: {
              sku: data.sku,
              shelfId: data.shelfId,
              newPrice: pricingDecision.newPrice,
              oldPrice: 100
            }
          });
        }
      }
    }

    return {
      storeId: data.storeId,
      shelfId: data.shelfId,
      sku: data.sku,
      action,
      quantityToMove,
      urgency,
      reasoning
    };
  }
}
