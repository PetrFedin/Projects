export interface B2BClientContext {
  clientId: string;
  industry: 'hospitality' | 'healthcare' | 'corporate';
  sku: string;
  historicalConsumptionRatePerMonth: number;
  currentStockLevel: number;
  subscriptionStatus: 'active' | 'paused' | 'cancelled';
}

export interface ReplenishmentOrder {
  clientId: string;
  sku: string;
  quantityToShip: number;
  estimatedDeliveryDate: string;
  discountAppliedPercent: number;
  reasoning: string;
}

/**
 * [Phase 31 — Autonomous B2B Subscriptions (Smart Replenishment)]
 * Движок умных B2B-подписок.
 * Вместо того чтобы B2B-клиенты (отели, клиники) каждый месяц вручную заказывали
 * униформу, полотенца или расходники, система сама отслеживает их потребление
 * и автоматически формирует заказ на пополнение (Auto-Replenishment),
 * когда запасы клиента подходят к концу.
 */
export class B2BSubscriptionEngine {
  /**
   * Анализирует запасы B2B-клиента и генерирует заказ на пополнение.
   */
  public static evaluateReplenishment(client: B2BClientContext): ReplenishmentOrder | null {
    if (client.subscriptionStatus !== 'active') {
      return null;
    }

    // 1. Прогноз исчерпания запасов (Days of Supply)
    const dailyConsumption = client.historicalConsumptionRatePerMonth / 30;
    const daysOfSupply = client.currentStockLevel / dailyConsumption;

    // Если запасов хватит больше чем на 14 дней — ждем
    if (daysOfSupply > 14) {
      return null;
    }

    // 2. Расчет объема пополнения (Order Quantity)
    // Цель: пополнить запасы на 1 месяц вперед + страховой запас (Safety Stock)
    const targetInventory = client.historicalConsumptionRatePerMonth * 1.5; // 1.5 месяца
    const quantityToShip = Math.ceil(targetInventory - client.currentStockLevel);

    if (quantityToShip <= 0) return null;

    // 3. Расчет скидки за лояльность (Volume Discount)
    let discountAppliedPercent = 0;
    if (client.industry === 'healthcare' && quantityToShip > 1000) {
      discountAppliedPercent = 15; // Крупный опт для клиник
    } else if (quantityToShip > 500) {
      discountAppliedPercent = 10;
    } else {
      discountAppliedPercent = 5; // Базовая скидка за подписку
    }

    const estimatedDeliveryDate = new Date(Date.now() + 5 * 86400000).toISOString(); // 5 дней на доставку

    return {
      clientId: client.clientId,
      sku: client.sku,
      quantityToShip,
      estimatedDeliveryDate,
      discountAppliedPercent,
      reasoning:
        `Client inventory critically low (${daysOfSupply.toFixed(1)} days of supply remaining). ` +
        `Auto-replenishing ${quantityToShip} units to restore 1.5 months target inventory. ` +
        `Applied ${discountAppliedPercent}% subscription discount.`,
    };
  }
}
