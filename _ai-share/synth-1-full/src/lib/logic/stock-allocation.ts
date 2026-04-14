import { InventoryGrain, StockState } from './inventory-ledger';
import { canManageStock } from './stock-integration';
import { StockSyncAgreement } from '@/lib/types/marketplace';
import {
  publishInventoryStockLow,
  publishInventoryReservationExpired,
  publishInventoryB2b2cAllocationCompleted,
} from '@/lib/order/domain-event-factories';

/**
 * [Phase 2 — Inventory / Warehouse / Logistics architecture]
 * Логика аллокации и резервирования стока (Tenant/Owner aware).
 * Управляет тем, как физический остаток распределяется между каналами (B2C/B2B).
 */

export interface AllocationRequest {
  productId: string;
  sku: string;
  locationId: string;
  quantity: number;
  targetState: StockState;
  targetChannelId?: 'b2b' | 'b2c' | 'retail';
  actorId: string;
  actorType: 'brand' | 'shop';
  agreementId?: string; // [Phase 2] Ссылка на VMI контракт
  reservationTtlMs?: number; // [Phase 2 Prod] TTL для резерва в мс
}

/**
 * Выполняет аллокацию стока (перевод из on_hand в другое состояние, напр. reserved или allocated).
 * Проверяет права владения (Tenant/Owner) и наличие активного соглашения (VMI).
 */
export function allocateStock(params: {
  request: AllocationRequest;
  grains: InventoryGrain[];
  agreement?: StockSyncAgreement;
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { request, grains, agreement } = params;

  // 1. Проверка VMI соглашения при кросс-кабинетной аллокации
  if (request.actorType === 'brand' && (request.targetChannelId === 'b2c' || request.targetChannelId === 'retail')) {
    if (!request.agreementId) {
      return { success: false, error: `VMI Agreement ID is required for Brand -> ${request.targetChannelId} allocation` };
    }
    if (agreement && agreement.id !== request.agreementId) {
      return { success: false, error: 'VMI Agreement mismatch' };
    }
    if (agreement && agreement.status !== 'active') {
      return { success: false, error: 'VMI Agreement is not active' };
    }
    // [Phase 2 Prod] Проверка, что бренд является провайдером в этом соглашении
    if (agreement && agreement.brandId !== request.actorId) {
      return { success: false, error: 'Actor is not the provider of this VMI agreement' };
    }
  }

  // 1. Находим подходящие гранулы стока (on_hand в нужной локации)
  const sourceGrains = grains.filter(
    (g) =>
      g.sku === request.sku &&
      g.locationId === request.locationId &&
      g.state === 'on_hand'
  );

  const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);

  if (totalAvailable < request.quantity) {
    return { success: false, error: `Insufficient on_hand stock: available ${totalAvailable}, requested ${request.quantity}` };
  }

  // 2. Проверяем права на управление каждой гранулой
  for (const grain of sourceGrains) {
    const check = canManageStock({
      actorId: request.actorId,
      actorType: request.actorType,
      source: grain,
      targetProductId: request.productId,
      agreement,
      tenantId: grain.tenantId
    });

    if (!check.allowed) {
      return { success: false, error: `Ownership violation: ${check.reason}` };
    }
  }

  // 3. Выполняем "перемещение" между состояниями (в демо — возвращаем обновленные гранулы)
  let remainingToAllocate = request.quantity;
  const updatedGrains = grains.map((g) => {
    if (
      remainingToAllocate > 0 &&
      g.sku === request.sku &&
      g.locationId === request.locationId &&
      g.state === 'on_hand'
    ) {
      const take = Math.min(g.quantity, remainingToAllocate);
      remainingToAllocate -= take;
      
      // В реальной системе это была бы транзакция, создающая новую гранулу с targetState
      // и уменьшающая текущую. Здесь — упрощенная модель.
      return { 
        ...g, 
        quantity: g.quantity - take,
        metadata: {
          ...g.metadata,
          updatedAt: new Date().toISOString(),
          version: g.metadata.version + 1,
          auditTrail: [
            ...(g.metadata.auditTrail || []),
            {
              timestamp: new Date().toISOString(),
              actorId: request.actorId,
              action: 'ALLOCATION_DECREMENT',
              prevQuantity: g.quantity,
              newQuantity: g.quantity - take
            }
          ]
        }
      };
    }
    return g;
  });

  // [Phase 2 Prod] Если аллокация идёт от бренда в ритейл-канал, 
  // используем промежуточный статус reserved_for_channel до подтверждения приёмки
  const finalTargetState = (request.actorType === 'brand' && request.targetChannelId === 'retail') 
    ? 'reserved_for_channel' 
    : request.targetState;

  // Добавляем новую гранулу с целевым состоянием
  updatedGrains.push({
    grainId: `grain-alloc-${Date.now()}`,
    productId: request.productId,
    sku: request.sku,
    locationId: request.locationId,
    state: finalTargetState,
    channelId: request.targetChannelId,
    agreementId: request.agreementId,
    quantity: request.quantity,
    ownerId: request.actorId,
    tenantId: sourceGrains[0].tenantId, // [Phase 2 Prod] Наследуем tenantId от источника
    expiresAt: request.reservationTtlMs ? new Date(Date.now() + request.reservationTtlMs).toISOString() : undefined,
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [{
        timestamp: new Date().toISOString(),
        actorId: request.actorId,
        action: 'ALLOCATION_INCREMENT',
        prevQuantity: 0,
        newQuantity: request.quantity
      }]
    }
  });

  // [Phase 4] Проверка на падение стока (Auto-Replenishment trigger)
  // В реальной системе здесь бы вызывался calculateATP, но для демо мы просто смотрим на остаток on_hand
  const remainingOnHand = updatedGrains
    .filter(g => g.sku === request.sku && g.state === 'on_hand')
    .reduce((acc, g) => acc + g.quantity, 0);

  const REPLENISHMENT_THRESHOLD = 50; // Мок-порог
  if (remainingOnHand < REPLENISHMENT_THRESHOLD) {
    void publishInventoryStockLow({
      aggregateId: request.sku,
      version: 1,
      payload: {
        sku: request.sku,
        currentAtp: remainingOnHand,
        threshold: REPLENISHMENT_THRESHOLD,
        suggestedReplenishment: 200
      }
    });
  }

  return { success: true, updatedGrains };
}

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
}): { action: 'none' | 'allocate'; quantity?: number; reason?: string; financialImpact?: { profitMargin: number; swapCost: number } } {
  const { 
    sku, currentB2CAllocated, availableB2BOnHand, 
    b2cSalesVelocity, b2bSalesVelocity, leadTimeDays, agreement, tenantId,
    unitPrice = 100, shippingCostPerUnit = 5, handlingCostPerUnit = 2
  } = params;

  // 1. Проверка политики ребалансировки в соглашении
  if (agreement && agreement.status === 'active') {
    if (agreement.terms.fulfillmentResponsibility === 'retailer' && !agreement.terms.autoRebalanceEnabled) {
      return { action: 'none', reason: 'Auto-rebalance disabled by agreement' };
    }
  }

  // 2. Расчет динамического порога (Safety Stock = Velocity * Lead Time + Buffer)
  const bufferDays = 3;
  const dynamicSafetyThreshold = b2cSalesVelocity * (leadTimeDays + bufferDays);

  if (currentB2CAllocated >= dynamicSafetyThreshold) {
    return { action: 'none', reason: `B2C stock (${currentB2CAllocated}) is above dynamic threshold (${dynamicSafetyThreshold})` };
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
        financialImpact: { profitMargin, swapCost }
      };
    }

    return { 
      action: 'allocate', 
      quantity: canTake, 
      reason: `Smart Swap triggered: B2C Velocity ${b2cSalesVelocity}/d, B2B Surplus ${b2bSurplus}`,
      financialImpact: { profitMargin, swapCost }
    };
  }

  return { action: 'none', reason: 'Insufficient B2B surplus for rebalance' };
}

/**
 * [Phase 2 Prod] Автоматическое освобождение просроченных резервов.
 * Возвращает сток в on_hand того же владельца.
 */
export function releaseExpiredReservations(params: {
  grains: InventoryGrain[];
  actorId: string;
}): { success: boolean; updatedGrains: InventoryGrain[]; releasedCount: number } {
  const { grains, actorId } = params;
  const now = new Date();
  
  const expiredGrains = grains.filter(g => 
    g.expiresAt && 
    new Date(g.expiresAt) < now && 
    (g.state === 'reserved' || g.state === 'reserved_for_channel')
  );

  if (expiredGrains.length === 0) {
    return { success: true, updatedGrains: grains, releasedCount: 0 };
  }

  const updatedGrains = grains.map(g => {
    if (expiredGrains.some(eg => eg.grainId === g.grainId)) {
      return {
        ...g,
        state: 'on_hand' as const,
        expiresAt: undefined,
        metadata: {
          ...g.metadata,
          updatedAt: now.toISOString(),
          version: g.metadata.version + 1,
          auditTrail: [
            ...(g.metadata.auditTrail || []),
            {
              timestamp: now.toISOString(),
              actorId,
              action: 'RESERVATION_EXPIRED_RELEASE',
              prevQuantity: g.quantity,
              newQuantity: g.quantity
            }
          ]
        }
      };
    }
    return g;
  });

  // Публикуем события для каждой просроченной гранулы
  expiredGrains.forEach(eg => {
    void publishInventoryReservationExpired({
      aggregateId: eg.sku,
      version: 1,
      payload: {
        grainId: eg.grainId,
        sku: eg.sku,
        quantity: eg.quantity,
        ownerId: eg.ownerId,
        tenantId: eg.tenantId
      }
    });
  });

  return { success: true, updatedGrains, releasedCount: expiredGrains.length };
}

/**
 * [Phase 2 Prod] Back-to-Back (B2B2C) аллокация.
 * Позволяет зарезервировать сток в одном канале (напр. B2B) 
 * на основании существующего резерва в другом канале (напр. B2C).
 */
export function allocateBackToBack(params: {
  parentGrainId: string;
  targetChannelId: 'b2b' | 'b2c' | 'retail';
  quantity: number;
  grains: InventoryGrain[];
  actorId: string;
  tenantId: string;
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { parentGrainId, targetChannelId, quantity, grains, actorId, tenantId } = params;

  const parentGrain = grains.find(g => g.grainId === parentGrainId && g.tenantId === tenantId);
  if (!parentGrain) return { success: false, error: 'Parent grain not found' };
  if (parentGrain.quantity < quantity) return { success: false, error: 'Insufficient quantity in parent grain' };

  // 1. Уменьшаем родительскую гранулу
  const updatedGrains = grains.map(g => {
    if (g.grainId === parentGrainId) {
      return {
        ...g,
        quantity: g.quantity - quantity,
        metadata: {
          ...g.metadata,
          updatedAt: new Date().toISOString(),
          version: g.metadata.version + 1,
          auditTrail: [
            ...(g.metadata.auditTrail || []),
            {
              timestamp: new Date().toISOString(),
              actorId,
              action: `B2B2C_DECREMENT_FOR_${targetChannelId.toUpperCase()}`,
              prevQuantity: g.quantity,
              newQuantity: g.quantity - quantity
            }
          ]
        }
      };
    }
    return g;
  });

  // 2. Создаем дочернюю гранулу с привязкой
  updatedGrains.push({
    grainId: `grain-b2b2c-${Date.now()}`,
    productId: parentGrain.productId,
    sku: parentGrain.sku,
    locationId: parentGrain.locationId,
    state: 'allocated',
    channelId: targetChannelId,
    quantity,
    ownerId: parentGrain.ownerId,
    tenantId,
    parentGrainId, // Связь Back-to-Back
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [{
        timestamp: new Date().toISOString(),
        actorId,
        action: `B2B2C_ALLOCATION_FROM_${parentGrainId}`,
        prevQuantity: 0,
        newQuantity: quantity
      }]
    }
  });

  void publishInventoryB2b2cAllocationCompleted({
    aggregateId: parentGrain.sku,
    version: 1,
    payload: {
      parentGrainId,
      targetChannelId,
      quantity,
      actorId,
      tenantId
    }
  });

  return { success: true, updatedGrains };
}
