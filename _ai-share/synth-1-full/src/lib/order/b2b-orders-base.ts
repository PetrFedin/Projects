import { mockB2BOrders } from '@/lib/order-data';
import type { B2BOrder } from '@/lib/types';

/**
 * Базовый список B2B-заказов для UI/read-model в demo-режиме.
 * Нужен как единая точка входа, чтобы прикладные модули не зависели от `mockB2BOrders` напрямую.
 */
export function getB2BOrdersBaseForUi(): B2BOrder[] {
  return mockB2BOrders;
}
