import { UnifiedStockView, StockSource } from '../types/marketplace';

/**
 * Integration Hub (Connective Tissue)
 * Управление перемещением стока между B2B и B2C каналами.
 */

export interface StockMoveLog {
  id: string;
  productId: string;
  sku: string;
  fromChannel: 'b2b' | 'b2c' | 'brand_warehouse' | 'retail_store';
  toChannel: 'b2b' | 'b2c' | 'brand_warehouse' | 'retail_store';
  quantity: number;
  reason: string;
  timestamp: string;
  initiatedBy: string;
}

/**
 * Ребалансировка стока
 * Перемещает свободный остаток из B2B резерва в B2C (Marketroom) и наоборот.
 */
export function rebalanceStock(
  view: UnifiedStockView,
  sourceId: string,
  quantity: number,
  targetChannel: 'b2b' | 'b2c'
): { success: boolean; log?: StockMoveLog; error?: string } {
  const source = view.sources.find(s => s.locationId === sourceId);
  
  if (!source) return { success: false, error: 'Source not found' };
  if (source.available < quantity) return { success: false, error: 'Insufficient stock' };

  // В реальной системе здесь будет транзакция в БД (Firestore/Redis)
  console.log(`[IntegrationHub] Rebalancing ${quantity} units to ${targetChannel} for ${view.productId}`);

  const log: StockMoveLog = {
    id: `move-${Date.now()}`,
    productId: view.productId,
    sku: view.sku,
    fromChannel: 'brand_warehouse', // По умолчанию
    toChannel: targetChannel,
    quantity,
    reason: `Strategic rebalance to ${targetChannel}`,
    timestamp: new Date().toISOString(),
    initiatedBy: 'system_auto_balancer'
  };

  return { success: true, log };
}

/**
 * Авто-резервирование (Safety Stock)
 * Рассчитывает, сколько нужно оставить в B2C для предотвращения оверсейла.
 */
export function calculateSafetyStock(
  dailySalesVelocity: number,
  leadTimeDays: number,
  serviceLevel: number = 1.645 // 95%
): number {
  // Простая формула: Z * SQRT(LeadTime) * StdDev(Sales)
  // Для MVP: (Продажи в день * Дни поставки) * Буфер
  return Math.ceil((dailySalesVelocity * leadTimeDays) * 1.2);
}

/**
 * Синхронизация с маркетплейсами (Wildberries, Ozon, Amazon)
 * Подготовка данных для внешних API.
 */
export function prepareExternalStockSync(view: UnifiedStockView): any {
  return {
    sku: view.sku,
    warehouseId: view.sources[0]?.locationId,
    stock: view.totalAvailable,
    timestamp: new Date().toISOString()
  };
}
