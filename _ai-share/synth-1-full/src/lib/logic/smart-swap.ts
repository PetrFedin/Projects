export interface StoreInventorySnapshot {
  storeId: string;
  sku: string;
  currentInventoryUnits: number;
  dailySalesVelocity: number; // Скорость продаж в день
  daysUntilStockout: number; // Дней до обнуления запасов
  overstockThresholdUnits: number; // Порог, выше которого считаем излишком
}

export interface SmartSwapTransfer {
  fromStoreId: string;
  toStoreId: string;
  sku: string;
  quantityToTransfer: number;
  estimatedShippingCostUSD: number;
  projectedRevenueLiftUSD: number; // Ожидаемый прирост выручки от перемещения
  reasoning: string;
}

/**
 * [Phase 29 — Omnichannel Smart Swap (Store-to-Store Rebalancing)]
 * Движок умного перемещения товаров между магазинами (Rebalancing).
 * Анализирует сеть магазинов. Если в магазине А куртки лежат мертвым грузом (Overstock),
 * а в магазине Б они разлетаются как горячие пирожки и скоро закончатся (Stockout),
 * система автоматически формирует задачу на перемещение (Transfer) из А в Б.
 * При этом учитывается стоимость логистики: перемещение должно окупаться.
 */
export class OmnichannelSmartSwap {
  /**
   * Оптимизирует запасы между двумя магазинами.
   */
  public static calculateOptimalSwap(
    storeA: StoreInventorySnapshot,
    storeB: StoreInventorySnapshot,
    itemPriceUSD: number,
    transferCostPerUnitUSD: number = 5 // Базовая стоимость перемещения одной единицы
  ): SmartSwapTransfer | null {
    let fromStore: StoreInventorySnapshot;
    let toStore: StoreInventorySnapshot;

    // 1. Определяем, кто донор (Overstock), а кто реципиент (Stockout)
    if (storeA.currentInventoryUnits > storeA.overstockThresholdUnits && storeB.daysUntilStockout < 7) {
      fromStore = storeA;
      toStore = storeB;
    } else if (storeB.currentInventoryUnits > storeB.overstockThresholdUnits && storeA.daysUntilStockout < 7) {
      fromStore = storeB;
      toStore = storeA;
    } else {
      // Нет явного дисбаланса — перемещение не требуется
      return null;
    }

    // 2. Рассчитываем количество для перемещения
    // Сколько излишков у донора?
    const availableOverstock = fromStore.currentInventoryUnits - fromStore.overstockThresholdUnits;
    
    // Сколько нужно реципиенту, чтобы продержаться хотя бы 30 дней?
    const targetInventoryForRecipient = toStore.dailySalesVelocity * 30;
    const deficitForRecipient = targetInventoryForRecipient - toStore.currentInventoryUnits;

    // Перемещаем минимум из того, что есть лишнего, и того, что нужно
    const quantityToTransfer = Math.min(availableOverstock, deficitForRecipient);

    if (quantityToTransfer <= 0) return null; // Нечего перемещать

    // 3. Финансовая целесообразность (ROI перемещения)
    // Если мы оставим товар у донора, он, скорее всего, пойдет под скидку (Clearance)
    // Допустим, скидка составит 40% (потеря 40% маржи)
    const potentialMarkdownLossUSD = (itemPriceUSD * 0.4) * quantityToTransfer;
    
    // Если мы перевезем товар реципиенту, мы продадим его по полной цене (Full Price)
    // Но заплатим за логистику
    const estimatedShippingCostUSD = quantityToTransfer * transferCostPerUnitUSD;
    
    // Чистая выгода от перемещения (Revenue Lift)
    const projectedRevenueLiftUSD = potentialMarkdownLossUSD - estimatedShippingCostUSD;

    // Если логистика съедает всю выгоду от спасения маржи — отменяем перемещение
    if (projectedRevenueLiftUSD <= 0) {
      console.log(`[SmartSwap] Transfer of ${quantityToTransfer} units from ${fromStore.storeId} to ${toStore.storeId} cancelled. Shipping cost ($${estimatedShippingCostUSD}) exceeds potential markdown loss ($${potentialMarkdownLossUSD}).`);
      return null;
    }

    return {
      fromStoreId: fromStore.storeId,
      toStoreId: toStore.storeId,
      sku: fromStore.sku,
      quantityToTransfer: Math.round(quantityToTransfer),
      estimatedShippingCostUSD: Math.round(estimatedShippingCostUSD),
      projectedRevenueLiftUSD: Math.round(projectedRevenueLiftUSD),
      reasoning: `Store ${fromStore.storeId} is overstocked (${fromStore.currentInventoryUnits} units). Store ${toStore.storeId} faces stockout in ${toStore.daysUntilStockout} days. Transferring ${Math.round(quantityToTransfer)} units saves $${Math.round(potentialMarkdownLossUSD)} in markdowns, costing $${Math.round(estimatedShippingCostUSD)} in shipping. Net lift: $${Math.round(projectedRevenueLiftUSD)}.`
    };
  }
}
