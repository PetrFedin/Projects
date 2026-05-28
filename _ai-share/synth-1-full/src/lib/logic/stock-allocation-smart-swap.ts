import type { StockSyncAgreement } from '@/lib/types/marketplace';

/**
 * [Phase 2] Автоматическая ребалансировка на основе порогов (Safety Stock).
 * [Phase 4] Omnichannel Smart Swap (Velocity-based Rebalancing).
 * Если B2C остаток ниже порога, пытается доаллоцировать из B2B,
 * учитывая скорость продаж (Velocity) и время пополнения (Lead Time).
 */
export function triggerSmartSwap(params: {
  sku: string;
  currentB2CAllocated: number;
  availableB2BOnHand: number;
  b2cSalesVelocity: number; // units per day
  b2bSalesVelocity: number; // units per day
  leadTimeDays: number;
  agreement?: StockSyncAgreement;
  tenantId?: string; // [Phase 2 Prod]
  /** [Phase 4] Cost-to-Serve parameters */
  unitPrice?: number;
  shippingCostPerUnit?: number;
  handlingCostPerUnit?: number;
}): {
  action: 'none' | 'allocate';
  quantity?: number;
  reason?: string;
  financialImpact?: { profitMargin: number; swapCost: number };
} {
  const {
    sku,
    currentB2CAllocated,
    availableB2BOnHand,
    b2cSalesVelocity,
    b2bSalesVelocity,
    leadTimeDays,
    agreement,
    tenantId,
    unitPrice = 100,
    shippingCostPerUnit = 5,
    handlingCostPerUnit = 2,
  } = params;

  // 1. Проверка политики ребалансировки в соглашении
  if (agreement && agreement.status === 'active') {
    if (
      agreement.terms.fulfillmentResponsibility === 'retailer' &&
      !agreement.terms.autoRebalanceEnabled
    ) {
      return { action: 'none', reason: 'Auto-rebalance disabled by agreement' };
    }
  }

  // 2. Расчет динамического порога (Safety Stock = Velocity * Lead Time + Buffer)
  const bufferDays = 3;
  const dynamicSafetyThreshold = b2cSalesVelocity * (leadTimeDays + bufferDays);

  if (currentB2CAllocated >= dynamicSafetyThreshold) {
    return {
      action: 'none',
      reason: `B2C stock (${currentB2CAllocated}) is above dynamic threshold (${dynamicSafetyThreshold})`,
    };
  }

  // 3. Проверка, не обнулим ли мы B2B канал, если у него тоже высокая скорость продаж
  const b2bSafetyThreshold = b2bSalesVelocity * (leadTimeDays + bufferDays);
  const b2bSurplus = availableB2BOnHand - b2bSafetyThreshold;

  if (b2bSurplus <= 0) {
    return { action: 'none', reason: `B2B channel needs its stock (Surplus: ${b2bSurplus})` };
  }

  // 4. Вычисляем объем для переброски (Smart Swap)
  const needed = dynamicSafetyThreshold - currentB2CAllocated;
  const canTake = Math.min(needed, b2bSurplus);

  if (canTake > 0) {
    // [Phase 4] Financial Projection (Cost-to-Serve)
    const swapCost = canTake * (shippingCostPerUnit + handlingCostPerUnit);
    const expectedRevenue = canTake * unitPrice;
    const profitMargin = expectedRevenue - swapCost;

    // Если переброска убыточна (например, дешевый товар и дорогая логистика) — отменяем
    if (profitMargin <= 0) {
      return {
        action: 'none',
        reason: `Financially unviable: Swap cost (${swapCost}) exceeds revenue (${expectedRevenue})`,
        financialImpact: { profitMargin, swapCost },
      };
    }

    return {
      action: 'allocate',
      quantity: canTake,
      reason: `Smart Swap triggered: B2C Velocity ${b2cSalesVelocity}/d, B2B Surplus ${b2bSurplus}`,
      financialImpact: { profitMargin, swapCost },
    };
  }

  return { action: 'none', reason: 'Insufficient B2B surplus for rebalance' };
}
