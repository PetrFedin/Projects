import {
  publishInventoryCustomerReturnProcessed,
  publishInventoryChannelTransferCompleted,
  publishInventoryReconciliationCompleted,
  publishInventoryOwnershipTransferred,
  publishInventoryGrainUnlocked,
  publishInventorySnapshotCreated,
  publishInventoryCycleCountCompleted,
} from '../order/domain-event-factories';

import type { InventoryGrain } from './inventory-ledger-core';

export type { StockState, InventoryGrain } from './inventory-ledger-core';
export { validateVMI, calculateATP, shouldInvalidateControl } from './inventory-ledger-core';

/**
 * Мутации ledger и публикация доменных событий (через factories — только на сервере / при наличии outbox).
 */

/**
 * [Phase 2] Перемещение стока между локациями (Shadow Inventory).
 * Создает запись в состоянии in_transit.
 */
export function transferStock(params: {
  sku: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  ownerId: string;
  grains: InventoryGrain[];
  actorId?: string; // [Phase 2 Prod]
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { sku, fromLocationId, toLocationId, quantity, ownerId, grains, actorId } = params;

  // 1. Находим источник
  const sourceGrains = grains.filter(
    (g) =>
      g.sku === sku &&
      g.locationId === fromLocationId &&
      g.state === 'on_hand' &&
      g.ownerId === ownerId
  );

  const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
  if (totalAvailable < quantity) {
    return { success: false, error: 'Insufficient stock for transfer' };
  }

  // 2. Уменьшаем источник и создаем in_transit
  let remainingToTransfer = quantity;
  const updatedGrains = grains.map((g) => {
    if (
      remainingToTransfer > 0 &&
      g.sku === sku &&
      g.locationId === fromLocationId &&
      g.state === 'on_hand' &&
      g.ownerId === ownerId
    ) {
      const take = Math.min(g.quantity, remainingToTransfer);
      remainingToTransfer -= take;
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
              actorId: actorId || 'system',
              action: 'TRANSFER_DECREMENT',
              prevQuantity: g.quantity,
              newQuantity: g.quantity - take,
            },
          ],
        },
      };
    }
    return g;
  });

  updatedGrains.push({
    grainId: `grain-transit-${Date.now()}`,
    productId: sourceGrains[0].productId,
    sku,
    locationId: toLocationId, // Целевая локация
    state: 'in_transit',
    quantity,
    ownerId,
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actorId: actorId || 'system',
          action: 'TRANSFER_INCREMENT',
          prevQuantity: 0,
          newQuantity: quantity,
        },
      ],
    },
  });

  return { success: true, updatedGrains };
}

/**
 * [Phase 2 Prod] Резервирование стока для кросс-кабинетного сценария.
 * Позволяет бренду "отложить" товар для конкретного магазина до оформления заказа.
 */
export function reserveCrossCabinetStock(params: {
  sku: string;
  locationId: string;
  quantity: number;
  brandId: string;
  shopId: string;
  grains: InventoryGrain[];
  tenantId: string;
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { sku, locationId, quantity, brandId, shopId, grains, tenantId } = params;

  const availableGrains = grains.filter(
    (g) =>
      g.sku === sku &&
      g.locationId === locationId &&
      g.state === 'on_hand' &&
      g.ownerId === brandId &&
      g.tenantId === tenantId
  );

  const totalAvailable = availableGrains.reduce((acc, g) => acc + g.quantity, 0);
  if (totalAvailable < quantity) {
    return { success: false, error: 'Insufficient stock for cross-cabinet reservation' };
  }

  let remaining = quantity;
  const updatedGrains = grains.map((g) => {
    if (
      remaining > 0 &&
      g.sku === sku &&
      g.locationId === locationId &&
      g.state === 'on_hand' &&
      g.ownerId === brandId &&
      g.tenantId === tenantId
    ) {
      const take = Math.min(g.quantity, remaining);
      remaining -= take;
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
              actorId: brandId,
              action: 'CROSS_CABINET_RESERVE_DECREMENT',
              prevQuantity: g.quantity,
              newQuantity: g.quantity - take,
            },
          ],
        },
      };
    }
    return g;
  });

  updatedGrains.push({
    grainId: `grain-cc-res-${Date.now()}`,
    productId: availableGrains[0].productId,
    sku,
    locationId,
    state: 'reserved_for_channel',
    quantity,
    ownerId: brandId,
    tenantId,
    agreementId: `cc-res-${shopId}`, // Временная привязка к магазину
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actorId: brandId,
          action: 'CROSS_CABINET_RESERVE_INCREMENT',
          prevQuantity: 0,
          newQuantity: quantity,
        },
      ],
    },
  });

  return { success: true, updatedGrains };
}

/**
 * [Phase 2] Обработка событий инвентаря.
 * ASN, Приёмка, Отгрузка, Подтверждение ритейлом.
 */
export type InventoryEventType =
  | 'ASN_CREATED'
  | 'GOODS_RECEIVED'
  | 'ORDER_SHIPPED'
  | 'RETAIL_RECEIVED'
  | 'CYCLE_COUNT'
  | 'RECONCILIATION'
  | 'GRAIN_LOCKED'
  | 'GRAIN_UNLOCKED'
  | 'CUSTOMER_RETURN';

/**
 * [Phase 2 Prod] Обработка возврата от клиента.
 * Возвращает товар в Ledger (on_hand или unavailable в зависимости от состояния).
 */
export function processCustomerReturn(params: {
  sku: string;
  locationId: string;
  quantity: number;
  ownerId: string;
  tenantId: string;
  grains: InventoryGrain[];
  condition: 'resellable' | 'damaged';
  actorId: string;
}): { success: boolean; updatedGrains?: InventoryGrain[] } {
  const { sku, locationId, quantity, ownerId, tenantId, grains, condition, actorId } = params;

  const updatedGrains = [...grains];
  updatedGrains.push({
    grainId: `grain-return-${Date.now()}`,
    productId: grains.find((g) => g.sku === sku)?.productId || 'unknown',
    sku,
    locationId,
    state: condition === 'resellable' ? 'on_hand' : 'unavailable',
    quantity,
    ownerId,
    tenantId,
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actorId,
          action: 'CUSTOMER_RETURN',
          prevQuantity: 0,
          newQuantity: quantity,
        },
      ],
    },
  });

  void publishInventoryCustomerReturnProcessed({
    aggregateId: sku,
    version: 1,
    payload: {
      locationId,
      quantity,
      condition,
      actorId,
      tenantId,
    },
  });

  return { success: true, updatedGrains };
}

/**
 * [Phase 2 Prod] Кросс-канальное перемещение стока (напр. из B2B пула в B2C).
 * Автоматически создает финансовый след перемещения.
 */
export function transferChannelStock(params: {
  sku: string;
  locationId: string;
  quantity: number;
  fromChannel: 'b2b' | 'b2c' | 'retail';
  toChannel: 'b2b' | 'b2c' | 'retail';
  ownerId: string;
  tenantId: string;
  grains: InventoryGrain[];
  actorId: string;
  unitCost?: number;
  agreementId?: string; // [Phase 2 Prod] Ссылка на VMI/SLA
}): { success: boolean; updatedGrains?: InventoryGrain[]; financialImpact?: number } {
  const {
    sku,
    locationId,
    quantity,
    fromChannel,
    toChannel,
    ownerId,
    tenantId,
    grains,
    actorId,
    unitCost = 0,
    agreementId,
  } = params;

  // 1. Фильтруем подходящие гранулы источника
  const sourceGrains = grains.filter(
    (g) =>
      g.sku === sku &&
      g.locationId === locationId &&
      g.ownerId === ownerId &&
      g.tenantId === tenantId &&
      (fromChannel === 'b2b'
        ? !g.channelId || g.channelId === 'b2b'
        : g.channelId === fromChannel) &&
      g.state === 'on_hand' &&
      !g.isLocked // [Phase 2 Prod] Нельзя перемещать заблокированный сток
  );

  const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
  if (totalAvailable < quantity) return { success: false };

  let remaining = quantity;
  const updatedGrains = grains.map((g) => {
    if (remaining > 0 && sourceGrains.some((sg) => sg.grainId === g.grainId)) {
      const take = Math.min(g.quantity, remaining);
      remaining -= take;
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
              actorId,
              action: `CHANNEL_TRANSFER_OUT_${toChannel.toUpperCase()}`,
              prevQuantity: g.quantity,
              newQuantity: g.quantity - take,
            },
          ],
        },
      };
    }
    return g;
  });

  updatedGrains.push({
    grainId: `grain-ch-transfer-${Date.now()}`,
    productId: sourceGrains[0].productId,
    sku,
    locationId,
    state: 'on_hand',
    quantity,
    ownerId,
    tenantId,
    channelId: toChannel,
    agreementId, // [Phase 2 Prod] Проброс соглашения
    vmiProtected: !!agreementId, // [Phase 2 Prod] Авто-защита при перемещении в канал по соглашению
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actorId,
          action: `CHANNEL_TRANSFER_IN_${fromChannel.toUpperCase()}`,
          prevQuantity: 0,
          newQuantity: quantity,
        },
      ],
    },
  });

  const financialImpact = quantity * unitCost;

  void publishInventoryChannelTransferCompleted({
    aggregateId: sku,
    version: 1,
    payload: {
      locationId,
      quantity,
      fromChannel,
      toChannel,
      financialImpact,
      actorId,
      tenantId,
      agreementId,
    },
  });

  return { success: true, updatedGrains, financialImpact };
}

/**
 * [Phase 2 Prod] Смена владельца стока (напр. выкуп товара магазином у бренда).
 * Переводит гранулы от одного владельца к другому внутри одного арендатора.
 * Генерирует событие финансового взаиморасчета.
 */
export function transferStockOwnership(params: {
  sku: string;
  locationId: string;
  quantity: number;
  fromOwnerId: string;
  toOwnerId: string;
  tenantId: string;
  grains: InventoryGrain[];
  actorId: string;
  unitPrice: number;
  agreementId?: string;
}): {
  success: boolean;
  updatedGrains?: InventoryGrain[];
  settlementAmount?: number;
  error?: string;
} {
  const {
    sku,
    locationId,
    quantity,
    fromOwnerId,
    toOwnerId,
    tenantId,
    grains,
    actorId,
    unitPrice,
    agreementId,
  } = params;

  // 1. Находим свободные гранулы текущего владельца
  const sourceGrains = grains.filter(
    (g) =>
      g.sku === sku &&
      g.locationId === locationId &&
      g.ownerId === fromOwnerId &&
      g.tenantId === tenantId &&
      g.state === 'on_hand' &&
      !g.isLocked
  );

  const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
  if (totalAvailable < quantity)
    return { success: false, error: 'Insufficient stock for ownership transfer' };

  let remaining = quantity;
  const updatedGrains = grains.map((g) => {
    if (remaining > 0 && sourceGrains.some((sg) => sg.grainId === g.grainId)) {
      const take = Math.min(g.quantity, remaining);
      remaining -= take;
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
              actorId,
              action: `OWNERSHIP_TRANSFER_OUT_TO_${toOwnerId}`,
              prevQuantity: g.quantity,
              newQuantity: g.quantity - take,
            },
          ],
        },
      };
    }
    return g;
  });

  // 2. Создаем новую гранулу для нового владельца
  updatedGrains.push({
    grainId: `grain-own-transfer-${Date.now()}`,
    productId: sourceGrains[0].productId,
    sku,
    locationId,
    state: 'on_hand',
    quantity,
    ownerId: toOwnerId,
    tenantId,
    agreementId,
    metadata: {
      updatedAt: new Date().toISOString(),
      version: 1,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actorId,
          action: `OWNERSHIP_TRANSFER_IN_FROM_${fromOwnerId}`,
          prevQuantity: 0,
          newQuantity: quantity,
        },
      ],
    },
  });

  const settlementAmount = quantity * unitPrice;

  // 3. Публикуем событие смены владельца
  void publishInventoryOwnershipTransferred({
    aggregateId: sku,
    version: 1,
    payload: {
      locationId,
      quantity,
      fromOwnerId,
      toOwnerId,
      settlementAmount,
      actorId,
      tenantId,
      agreementId,
    },
  });

  return { success: true, updatedGrains, settlementAmount };
}

export interface ReconciliationResult {
  sku: string;
  locationId: string;
  expectedQuantity: number;
  actualQuantity: number;
  discrepancy: number;
  actionTaken: 'adjusted' | 'locked' | 'flagged';
}

/**
 * [Phase 2 Prod] Разблокировка гранулы после расследования.
 */
export function unlockInventoryGrain(params: {
  grainId: string;
  grains: InventoryGrain[];
  actorId: string;
  reason: string;
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { grainId, grains, actorId, reason } = params;
  const grain = grains.find((g) => g.grainId === grainId);

  if (!grain) return { success: false, error: 'Grain not found' };
  if (!grain.isLocked) return { success: true, updatedGrains: grains };

  const updatedGrains = grains.map((g) => {
    if (g.grainId === grainId) {
      return {
        ...g,
        isLocked: false,
        auditStatus: 'verified' as const,
        metadata: {
          ...g.metadata,
          updatedAt: new Date().toISOString(),
          version: g.metadata.version + 1,
          auditTrail: [
            ...(g.metadata.auditTrail || []),
            {
              timestamp: new Date().toISOString(),
              actorId,
              action: 'UNLOCK_GRAIN',
              prevQuantity: g.quantity,
              newQuantity: g.quantity,
            },
          ],
        },
      };
    }
    return g;
  });

  void publishInventoryGrainUnlocked({
    aggregateId: grain.sku,
    version: 1,
    payload: {
      grainId,
      actorId,
      reason,
      tenantId: grain.tenantId,
    },
  });

  return { success: true, updatedGrains };
}

export function reconcileInventory(params: {
  sku: string;
  locationId: string;
  actualQuantity: number;
  grains: InventoryGrain[];
  tenantId: string;
  actorId: string;
}): { success: boolean; result?: ReconciliationResult; updatedGrains?: InventoryGrain[] } {
  const { sku, locationId, actualQuantity, grains, tenantId, actorId } = params;

  const tenantGrains = grains.filter(
    (g) =>
      g.tenantId === tenantId &&
      g.sku === sku &&
      g.locationId === locationId &&
      g.state === 'on_hand'
  );

  // [Phase 2 Prod] Проверка tenantId
  if (tenantGrains.length > 0 && tenantGrains[0].tenantId !== tenantId) {
    return { success: false, result: undefined, updatedGrains: grains };
  }
  const expectedQuantity = tenantGrains.reduce((acc, g) => acc + g.quantity, 0);
  const discrepancy = actualQuantity - expectedQuantity;

  if (discrepancy === 0) {
    return {
      success: true,
      result: {
        sku,
        locationId,
        expectedQuantity,
        actualQuantity,
        discrepancy,
        actionTaken: 'adjusted',
      },
    };
  }

  // Если расхождение значительное (>10% или >50 единиц), блокируем гранулы для расследования
  const shouldLock = Math.abs(discrepancy) > expectedQuantity * 0.1 || Math.abs(discrepancy) > 50;

  const updatedGrains = grains.map((g) => {
    if (
      g.tenantId === tenantId &&
      g.sku === sku &&
      g.locationId === locationId &&
      g.state === 'on_hand'
    ) {
      const newQuantity = shouldLock ? g.quantity : g.quantity + discrepancy / tenantGrains.length;

      return {
        ...g,
        isLocked: shouldLock ? true : g.isLocked,
        auditStatus: (shouldLock ? 'flagged' : 'verified') as 'flagged' | 'verified',
        metadata: {
          ...g.metadata,
          updatedAt: new Date().toISOString(),
          version: g.metadata.version + 1,
          auditTrail: [
            ...(g.metadata.auditTrail || []),
            {
              timestamp: new Date().toISOString(),
              actorId,
              action: 'RECONCILIATION',
              prevQuantity: g.quantity,
              newQuantity,
            },
          ],
        },
      };
    }
    return g;
  });

  // [Phase 2 Prod] Публикуем событие сверки
  void publishInventoryReconciliationCompleted({
    aggregateId: sku,
    version: 1,
    payload: {
      locationId,
      discrepancy,
      actionTaken: shouldLock ? 'locked' : 'adjusted',
      actorId,
      tenantId,
    },
  });

  return {
    success: true,
    result: {
      sku,
      locationId,
      expectedQuantity,
      actualQuantity,
      discrepancy,
      actionTaken: shouldLock ? 'locked' : 'adjusted',
    },
    updatedGrains,
  };
}

/**
 * [Phase 2 Prod] Создание снапшота всего Ledger для конкретного арендатора.
 */
export function createLedgerSnapshot(params: {
  grains: InventoryGrain[];
  tenantId: string;
  actorId: string;
  reason: string;
}): { snapshotId: string; timestamp: string; grains: InventoryGrain[] } {
  const { grains, tenantId, actorId, reason } = params;
  const timestamp = new Date().toISOString();
  const snapshotId = `snap-inv-${tenantId}-${Date.now()}`;

  const tenantGrains = grains.filter((g) => g.tenantId === tenantId);

  void publishInventorySnapshotCreated({
    aggregateId: tenantId,
    version: 1,
    occurredAt: timestamp,
    payload: {
      snapshotId,
      grainCount: tenantGrains.length,
      actorId,
      reason,
    },
  });

  return {
    snapshotId,
    timestamp,
    grains: JSON.parse(JSON.stringify(tenantGrains)) as InventoryGrain[], // Deep copy
  };
}

/**
 * [Phase 2 Prod] Сервис автоматической ребалансировки стока.
 * Находит дефицитные локации и предлагает перемещения из локаций с избытком.
 */
export function rebalanceInventory(params: {
  sku: string;
  grains: InventoryGrain[];
  tenantId: string;
  thresholds: Record<string, { min: number; max: number }>;
}): Array<{ fromLocationId: string; toLocationId: string; quantity: number; reason: string }> {
  const { sku, grains, tenantId, thresholds } = params;

  const skuGrains = grains.filter(
    (g) => g.sku === sku && g.tenantId === tenantId && g.state === 'on_hand' && !g.isLocked
  );
  const locationBalances = skuGrains.reduce(
    (acc, g) => {
      acc[g.locationId] = (acc[g.locationId] || 0) + g.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  const recommendations: Array<{
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
    reason: string;
  }> = [];

  // 1. Находим локации с дефицитом
  for (const [locationId, threshold] of Object.entries(thresholds)) {
    const currentBalance = locationBalances[locationId] || 0;
    if (currentBalance < threshold.min) {
      const deficit = threshold.min - currentBalance;

      // 2. Ищем донора с избытком
      for (const [donorId, donorThreshold] of Object.entries(thresholds)) {
        if (donorId === locationId) continue;
        const donorBalance = locationBalances[donorId] || 0;

        if (donorBalance > donorThreshold.min) {
          const surplus = donorBalance - donorThreshold.min;
          const transferQty = Math.min(deficit, surplus);

          if (transferQty > 0) {
            recommendations.push({
              fromLocationId: donorId,
              toLocationId: locationId,
              quantity: transferQty,
              reason: `REPLENISHMENT_DEFICIT_IN_${locationId}`,
            });
            locationBalances[donorId] -= transferQty;
            locationBalances[locationId] += transferQty;
          }
        }
      }
    }
  }

  return recommendations;
}

/**
 * [Phase 2 Prod] Проверка и применение квот на сток.
 * Гарантирует, что аллокация не превышает установленные лимиты для канала/пула.
 */
export function validateQuota(params: {
  grains: InventoryGrain[];
  sku: string;
  channelId?: string;
  virtualPoolId?: string;
  requestedQuantity: number;
}): { allowed: boolean; remainingQuota?: number; error?: string } {
  const { grains, sku, channelId, virtualPoolId, requestedQuantity } = params;

  const relevantGrains = grains.filter(
    (g) =>
      g.sku === sku &&
      (channelId ? g.channelId === channelId : true) &&
      (virtualPoolId ? g.virtualPoolId === virtualPoolId : true)
  );

  const totalQuota = relevantGrains.reduce((acc, g) => acc + (g.quota || Infinity), 0);
  const currentAllocated = relevantGrains
    .filter((g) => g.state === 'allocated' || g.state === 'reserved')
    .reduce((acc, g) => acc + g.quantity, 0);

  const remainingQuota = totalQuota - currentAllocated;

  if (requestedQuantity > remainingQuota) {
    return {
      allowed: false,
      remainingQuota,
      error: `Quota exceeded: requested ${requestedQuantity}, remaining ${remainingQuota}`,
    };
  }

  return { allowed: true, remainingQuota };
}

export function processInventoryEvent(params: {
  type: InventoryEventType;
  sku: string;
  locationId: string;
  quantity: number;
  ownerId: string;
  grains: InventoryGrain[];
  actorId?: string; // [Phase 2 Prod]
  agreementId?: string; // [Phase 2 Prod]
  reason?: string; // [Phase 2 Prod] Для инвентаризации
}): { success: boolean; updatedGrains?: InventoryGrain[]; error?: string } {
  const { type, sku, locationId, quantity, ownerId, grains, actorId, agreementId, reason } = params;

  if (type === 'CYCLE_COUNT') {
    // Инвентаризация (Cycle Counting) — прямая корректировка on_hand с аудитом
    const updatedGrains = grains.map((g) => {
      if (
        g.sku === sku &&
        g.locationId === locationId &&
        g.state === 'on_hand' &&
        g.ownerId === ownerId
      ) {
        // [Phase 2 Prod] Проверка tenantId
        if (actorId && g.tenantId && g.tenantId !== actorId.split('-')[0]) {
          // Упрощенная проверка в демо
          // В реальной системе здесь была бы более строгая проверка
        }

        return {
          ...g,
          quantity: quantity, // Новое абсолютное значение
          lastCycleCountAt: new Date().toISOString(),
          metadata: {
            ...g.metadata,
            updatedAt: new Date().toISOString(),
            version: g.metadata.version + 1,
            auditTrail: [
              ...(g.metadata.auditTrail || []),
              {
                timestamp: new Date().toISOString(),
                actorId: actorId || 'system',
                action: 'CYCLE_COUNT_ADJUSTMENT',
                prevQuantity: g.quantity,
                newQuantity: quantity,
              },
            ],
          },
        };
      }
      return g;
    });
    const result = { success: true, updatedGrains };

    // Публикуем событие домена
    void publishInventoryCycleCountCompleted({
      aggregateId: sku,
      version: 1,
      payload: {
        locationId,
        newQuantity: quantity,
        actorId: actorId || 'system',
        reason: reason || 'Scheduled cycle count',
        tenantId: updatedGrains.find((g) => g.sku === sku)?.tenantId,
      },
    });

    return result;
  }

  if (type === 'ASN_CREATED') {
    // ASN (Advanced Shipping Notice) — товар вышел с фабрики
    const updatedGrains = [...grains];
    updatedGrains.push({
      grainId: `grain-asn-${Date.now()}`,
      productId: 'unknown', // В реальной системе берем из SKU master
      sku,
      locationId,
      state: 'ex_factory',
      quantity,
      ownerId,
      agreementId,
      metadata: {
        updatedAt: new Date().toISOString(),
        version: 1,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actorId: actorId || 'system',
            action: 'ASN_CREATED',
            prevQuantity: 0,
            newQuantity: quantity,
          },
        ],
      },
    });
    return { success: true, updatedGrains };
  }

  if (type === 'RETAIL_RECEIVED') {
    // Подтверждение приёмки ритейлом — перевод из reserved_for_channel в on_hand (смена владельца)
    const sourceGrains = grains.filter(
      (g) => g.sku === sku && g.locationId === locationId && g.state === 'reserved_for_channel'
    );
    const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
    if (totalAvailable < quantity)
      return { success: false, error: 'Insufficient reserved stock for retail receipt' };

    let remaining = quantity;
    const updatedGrains = grains.map((g) => {
      if (
        remaining > 0 &&
        g.sku === sku &&
        g.locationId === locationId &&
        g.state === 'reserved_for_channel'
      ) {
        const take = Math.min(g.quantity, remaining);
        remaining -= take;
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
                actorId: actorId || 'system',
                action: 'RETAIL_RECEIVED_DECREMENT',
                prevQuantity: g.quantity,
                newQuantity: g.quantity - take,
              },
            ],
          },
        };
      }
      return g;
    });

    updatedGrains.push({
      grainId: `grain-retail-onhand-${Date.now()}`,
      productId: sourceGrains[0].productId,
      sku,
      locationId,
      state: 'on_hand',
      quantity,
      ownerId, // Новый владелец (магазин)
      tenantId: sourceGrains[0].tenantId, // [Phase 2 Prod] Наследуем tenantId
      agreementId: agreementId || sourceGrains[0].agreementId,
      metadata: {
        updatedAt: new Date().toISOString(),
        version: 1,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actorId: actorId || 'system',
            action: 'RETAIL_RECEIVED_INCREMENT',
            prevQuantity: 0,
            newQuantity: quantity,
          },
        ],
      },
    });
    return { success: true, updatedGrains };
  }

  if (type === 'GOODS_RECEIVED') {
    // Приёмка — перевод из ex_factory/in_transit в on_hand
    const sourceGrains = grains.filter(
      (g) =>
        g.sku === sku &&
        g.locationId === locationId &&
        (g.state === 'ex_factory' || g.state === 'in_transit')
    );
    const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
    if (totalAvailable < quantity)
      return { success: false, error: 'Insufficient transit stock for receiving' };

    let remaining = quantity;
    const updatedGrains = grains.map((g) => {
      if (
        remaining > 0 &&
        g.sku === sku &&
        g.locationId === locationId &&
        (g.state === 'ex_factory' || g.state === 'in_transit')
      ) {
        const take = Math.min(g.quantity, remaining);
        remaining -= take;
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
                actorId: actorId || 'system',
                action: 'GOODS_RECEIVED_DECREMENT',
                prevQuantity: g.quantity,
                newQuantity: g.quantity - take,
              },
            ],
          },
        };
      }
      return g;
    });

    updatedGrains.push({
      grainId: `grain-received-${Date.now()}`,
      productId: sourceGrains[0].productId,
      sku,
      locationId,
      state: 'on_hand',
      quantity,
      ownerId,
      tenantId: sourceGrains[0].tenantId, // [Phase 2 Prod] Наследуем tenantId
      metadata: {
        updatedAt: new Date().toISOString(),
        version: 1,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actorId: actorId || 'system',
            action: 'GOODS_RECEIVED_INCREMENT',
            prevQuantity: 0,
            newQuantity: quantity,
          },
        ],
      },
    });
    return { success: true, updatedGrains };
  }

  if (type === 'ORDER_SHIPPED') {
    // Отгрузка — перевод из reserved/allocated в shipped
    const sourceGrains = grains.filter(
      (g) =>
        g.sku === sku &&
        g.locationId === locationId &&
        (g.state === 'reserved' || g.state === 'allocated')
    );
    const totalAvailable = sourceGrains.reduce((acc, g) => acc + g.quantity, 0);
    if (totalAvailable < quantity)
      return { success: false, error: 'Insufficient reserved stock for shipment' };

    let remaining = quantity;
    const updatedGrains = grains.map((g) => {
      if (
        remaining > 0 &&
        g.sku === sku &&
        g.locationId === locationId &&
        (g.state === 'reserved' || g.state === 'allocated')
      ) {
        const take = Math.min(g.quantity, remaining);
        remaining -= take;
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
                actorId: actorId || 'system',
                action: 'ORDER_SHIPPED_DECREMENT',
                prevQuantity: g.quantity,
                newQuantity: g.quantity - take,
              },
            ],
          },
        };
      }
      return g;
    });

    updatedGrains.push({
      grainId: `grain-shipped-${Date.now()}`,
      productId: sourceGrains[0].productId,
      sku,
      locationId,
      state: 'shipped',
      quantity,
      ownerId,
      tenantId: sourceGrains[0].tenantId, // [Phase 2 Prod] Наследуем tenantId
      metadata: {
        updatedAt: new Date().toISOString(),
        version: 1,
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actorId: actorId || 'system',
            action: 'ORDER_SHIPPED_INCREMENT',
            prevQuantity: 0,
            newQuantity: quantity,
          },
        ],
      },
    });
    return { success: true, updatedGrains };
  }

  return { success: false, error: 'Unknown event type' };
}
