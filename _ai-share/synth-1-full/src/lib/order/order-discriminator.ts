import { B2BOrder } from '@/lib/types';
import { B2COrder } from '@/lib/types/marketplace';

/**
 * [Phase 2 — Order architecture]
 * Дискриминатор типов заказов (B2B vs B2C).
 * Позволяет системе однозначно определять тип заказа и применять соответствующие политики.
 */

export type OrderType = 'b2b' | 'b2c';

export interface UnifiedOrderReference {
  id: string;
  type: OrderType;
  organizationId: string;
}

/**
 * Определяет тип заказа на основе его структуры или префикса ID.
 */
export function identifyOrderType(order: any): OrderType {
  // 1. По наличию специфичных полей
  if ('orderMode' in order || 'priceTier' in order || order.order?.startsWith('B2B-')) {
    return 'b2b';
  }

  if ('customerId' in order || 'fulfillmentMethod' in order) {
    return 'b2c';
  }

  // 2. Fallback по формату ID
  if (typeof order.id === 'string' && order.id.startsWith('B2B-')) return 'b2b';

  return 'b2c';
}

/**
 * Возвращает канонический идентификатор для логов/связей.
 */
export function getCanonicalOrderId(order: B2BOrder | B2COrder): string {
  const type = identifyOrderType(order);
  if (type === 'b2b') {
    return (order as B2BOrder).order;
  }
  return (order as B2COrder).id;
}

/**
 * Проверяет, применима ли политика к данному типу заказа.
 */
export function isPolicyApplicable(order: any, policyType: OrderType): boolean {
  return identifyOrderType(order) === policyType;
}
