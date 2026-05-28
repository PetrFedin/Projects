import type { OrderAggregate } from './order-aggregate';
import { calculateATP, InventoryGrain } from '../logic/inventory-ledger';

/**
 * [Phase 2 — Order architecture]
 * Валидация заказа перед подтверждением.
 * Проверяет MOQ, Pack Rules и ATP.
 */

export interface OrderValidationError {
  code:
    | 'MOQ_NOT_MET'
    | 'PACK_RULE_VIOLATED'
    | 'INSUFFICIENT_ATP'
    | 'CURRENCY_MISMATCH'
    | 'PRICE_LIST_MISMATCH'
    | 'SHIP_WINDOW_VIOLATED'
    | 'TENANT_MISMATCH'
    | 'GATE_APPROVAL_MISSING'
    | 'GATE_REJECTED';
  message: string;
  sku?: string;
  expected?: string | number;
  actual?: string | number;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: OrderValidationError[];
}

/**
 * [Phase 2 Prod] Проверка прохождения всех обязательных "ворот" (Gates) перед подтверждением.
 */
export function validateOrderGates(order: OrderAggregate): OrderValidationResult {
  const errors: OrderValidationError[] = [];

  // 1. Проверка ворот бренда (Brand Gate)
  const brandGate = order.metadata.gates?.find((g) => g.role === 'brand');
  if (brandGate) {
    if (brandGate.status === 'rejected') {
      errors.push({
        code: 'GATE_REJECTED',
        message: `Order ${order.id} was rejected by Brand: ${brandGate.reason}`,
      });
    } else if (brandGate.status === 'pending') {
      errors.push({
        code: 'GATE_APPROVAL_MISSING',
        message: `Order ${order.id} is awaiting Brand approval`,
      });
    }
  }

  // 2. Проверка ворот партнера/магазина (Partner Gate)
  const partnerGate = order.metadata.gates?.find((g) => g.role === 'shop');
  if (partnerGate) {
    if (partnerGate.status === 'rejected') {
      errors.push({
        code: 'GATE_REJECTED',
        message: `Order ${order.id} was rejected by Partner: ${partnerGate.reason}`,
      });
    } else if (partnerGate.status === 'pending') {
      errors.push({
        code: 'GATE_APPROVAL_MISSING',
        message: `Order ${order.id} is awaiting Partner approval`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Полная валидация заказа.
 */
export function validateOrder(params: {
  order: OrderAggregate;
  inventoryGrains: InventoryGrain[];
  moqRules?: Record<string, number>; // SKU -> MOQ
  packRules?: Record<string, number>; // SKU -> Pack Size (напр. кратно 6)
  strictIsolation?: boolean; // [Phase 2 Prod]
}): OrderValidationResult {
  const { order, inventoryGrains, moqRules, packRules, strictIsolation = true } = params;
  const errors: OrderValidationError[] = [];

  // 0. Валидация ворот (Gates)
  const gateResult = validateOrderGates(order);
  if (!gateResult.isValid) {
    errors.push(...gateResult.errors);
  }

  // 0.1. Валидация условий (Terms)
  if (order.terms.priceListId && order.terms.priceListId === 'expired') {
    errors.push({
      code: 'PRICE_LIST_MISMATCH',
      message: `Price list ${order.terms.priceListId} is expired or invalid`,
    });
  }

  if (order.context.shipWindowId && order.context.shipWindowId === 'closed') {
    errors.push({
      code: 'SHIP_WINDOW_VIOLATED',
      message: `Ship window ${order.context.shipWindowId} is closed for new orders`,
    });
  }

  // [Phase 2 Prod] Проверка наличия tenantId в строгом режиме
  if (strictIsolation && !order.participants.tenantId) {
    errors.push({
      code: 'TENANT_MISMATCH',
      message: `Order ${order.id} is missing mandatory tenantId for strict isolation`,
    });
  }

  // [Phase 2 Prod] Проверка соответствия tenantId участникам
  if (strictIsolation && order.participants.tenantId) {
    // [Phase 2 Prod] Глубокая проверка соответствия участников арендатору.
    // В реальной системе используется справочник участников (Participant Registry).
    const brandId = order.participants.brandId;
    const buyerId = order.participants.buyerAccountId;
    const tenantId = order.participants.tenantId;

    // Демо-заглушка для проверки изоляции: brand-1 и shop-1 принадлежат tenant-1
    if (tenantId === 'tenant-1') {
      if (!brandId.includes('1') && brandId !== 'brand-demo') {
        errors.push({
          code: 'TENANT_MISMATCH',
          message: `Brand ${brandId} does not belong to tenant ${tenantId}`,
        });
      }
      if (!buyerId.includes('1') && buyerId !== 'shop-demo') {
        errors.push({
          code: 'TENANT_MISMATCH',
          message: `Buyer ${buyerId} does not belong to tenant ${tenantId}`,
        });
      }
    }
  }

  // 1. Валидация по каждой линии
  for (const line of order.lines) {
    const qty = line.quantity;
    const sku = `${line.productId}:${line.size}`;

    // 1.1. MOQ (Minimum Order Quantity)
    if (moqRules && moqRules[sku] && qty < moqRules[sku]) {
      errors.push({
        code: 'MOQ_NOT_MET',
        message: `Quantity ${qty} for SKU ${sku} is below MOQ ${moqRules[sku]}`,
        sku: sku,
        expected: moqRules[sku],
        actual: qty,
      });
    }

    // 1.2. Pack Rules (кратность упаковки)
    if (packRules && packRules[sku] && qty % packRules[sku] !== 0) {
      errors.push({
        code: 'PACK_RULE_VIOLATED',
        message: `Quantity ${qty} for SKU ${sku} must be a multiple of ${packRules[sku]}`,
        sku: sku,
        expected: packRules[sku],
        actual: qty,
      });
    }

    // 1.3. ATP (Available to Promise)
    const skuGrains = inventoryGrains.filter((g) => g.sku === sku);
    const atp = calculateATP({
      grains: skuGrains,
      channelId: order.mode === 'pre_order' ? 'b2b' : order.mode === 'buy_now' ? 'retail' : 'b2b', // Для buy_now проверяем retail сток
      actorId: order.participants.buyerAccountId,
      actorType: 'shop',
      agreementId: order.context.agreementId,
      strictIsolation, // Используем переданный флаг
    });

    if (atp < qty) {
      errors.push({
        code: 'INSUFFICIENT_ATP',
        message: `Insufficient stock for SKU ${sku}. ATP: ${atp}, requested: ${qty}`,
        sku: sku,
        expected: qty,
        actual: atp,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Простая проверка: может ли заказ быть переведен в статус 'confirmed'.
 */
export function canConfirmOrder(order: OrderAggregate): boolean {
  // Нельзя подтвердить отмененный или уже отгруженный заказ
  const forbiddenStatuses: OrderAggregate['status'][] = ['cancelled', 'shipped', 'delivered'];
  if (forbiddenStatuses.includes(order.status)) return false;

  // Заказ должен иметь линии
  if (order.lines.length === 0) return false;

  return true;
}
