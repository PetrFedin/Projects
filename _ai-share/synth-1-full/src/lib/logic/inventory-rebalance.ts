import { InventoryGrain, StockState } from './inventory-ledger';
import { allocateStock, triggerSmartSwap } from './stock-allocation';
import { StockSyncAgreement } from '@/lib/types/marketplace';

/**
 * [Phase 2 — Inventory / Warehouse / Logistics architecture]
 * Оркестратор ребалансировки стока (Inventory Rebalance Orchestrator).
 * Объединяет расчеты порогов (Safety Stock) и выполнение аллокаций.
 */

export interface RebalanceResult {
  sku: string;
  action: 'none' | 'allocated' | 'failed';
  requestedQuantity?: number;
  allocatedQuantity?: number;
  reason?: string;
  error?: string;
}

/**
 * Выполняет цикл ребалансировки для конкретного SKU.
 * 1. Проверяет текущую аллокацию B2C.
 * 2. Сравнивает с порогом Safety Stock.
 * 3. При необходимости запрашивает аллокацию из свободного B2B стока.
 */
export function executeRebalance(params: {
  productId: string;
  sku: string;
  locationId: string;
  grains: InventoryGrain[];
  safetyThreshold: number;
  actorId: string;
  actorType: 'brand' | 'shop';
  agreement?: StockSyncAgreement;
  tenantId?: string; // [Phase 2 Prod]
}): { result: RebalanceResult; updatedGrains: InventoryGrain[] } {
  const { productId, sku, locationId, grains, safetyThreshold, actorId, actorType, agreement, tenantId } = params;

  // 1. Считаем текущий B2C Allocated (с учетом арендатора)
  const currentB2C = grains
    .filter(g => g.sku === sku && g.locationId === locationId && g.state === 'allocated' && (!params.tenantId || g.tenantId === params.tenantId))
    .reduce((acc, g) => acc + g.quantity, 0);

  // 2. Считаем доступный B2B OnHand (с учетом арендатора)
  const availableB2B = grains
    .filter(g => g.sku === sku && g.locationId === locationId && g.state === 'on_hand' && (!params.tenantId || g.tenantId === params.tenantId))
    .reduce((acc, g) => acc + g.quantity, 0);

  // 3. Триггерим расчет необходимости
  const decision = triggerSmartSwap({
    sku,
    currentB2CAllocated: currentB2C,
    availableB2BOnHand: availableB2B,
    b2cSalesVelocity: 5, // Мок
    b2bSalesVelocity: 2, // Мок
    leadTimeDays: 5,     // Мок
    agreement
  });

  if (decision.action === 'none' || !decision.quantity) {
    return { 
      result: { sku, action: 'none', reason: decision.reason }, 
      updatedGrains: grains 
    };
  }

  // 4. Выполняем аллокацию
  const allocation = allocateStock({
    request: {
      productId,
      sku,
      locationId,
      quantity: decision.quantity,
      targetState: 'allocated',
      actorId,
      actorType,
      agreementId: agreement?.id
    },
    grains,
    agreement
  });

  if (!allocation.success || !allocation.updatedGrains) {
    return { 
      result: { sku, action: 'failed', requestedQuantity: decision.quantity, error: allocation.error }, 
      updatedGrains: grains 
    };
  }

  return {
    result: { sku, action: 'allocated', requestedQuantity: decision.quantity, allocatedQuantity: decision.quantity },
    updatedGrains: allocation.updatedGrains
  };
}

/**
 * Пакетная ребалансировка (Batch Rebalance).
 * Полезно для регулярных задач (cron) или после массовой загрузки остатков.
 */
export function batchRebalance(params: {
  items: Array<{
    productId: string;
    sku: string;
    locationId: string;
    safetyThreshold: number;
  }>;
  grains: InventoryGrain[];
  actorId: string;
  actorType: 'brand' | 'shop';
  agreement?: StockSyncAgreement;
  tenantId?: string; // [Phase 2 Prod]
}): { results: RebalanceResult[]; updatedGrains: InventoryGrain[] } {
  let currentGrains = [...params.grains];
  const results: RebalanceResult[] = [];

  for (const item of params.items) {
    const { result, updatedGrains } = executeRebalance({
      ...item,
      grains: currentGrains,
      actorId: params.actorId,
      actorType: params.actorType,
      agreement: params.agreement,
      tenantId: params.tenantId
    });
    
    results.push(result);
    currentGrains = updatedGrains;
  }

  return { results, updatedGrains: currentGrains };
}
