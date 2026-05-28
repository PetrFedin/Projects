/**
 * Серверный read-model operational B2B: база из снимка `data/b2b-orders.snapshot.json`
 * (или `B2B_ORDERS_SNAPSHOT_FILE`), затем тот же оверлей оплат, что и в UI-сиде.
 *
 * Клиентский fallback (`b2b-orders-list-read-model.ts`) по-прежнему использует только сид —
 * пока страницы не переведены на fetch/API целиком.
 */
import 'server-only';

import { applyOrderPaymentsOverlay } from '@/lib/b2b/partner-finance-rollup';
import { mockB2BOrders } from '@/lib/order-data';
import { loadB2BOrderSnapshotOrNull } from '@/lib/order/b2b-order-persistence.file';
import { filterB2BOrdersByOperationalActor } from '@/lib/order/b2b-orders-read-model-shared';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';

export function getB2BOrdersBaseForOperationalApi(): B2BOrder[] {
  const snap = loadB2BOrderSnapshotOrNull();
  if (snap?.orders?.length) return snap.orders;
  return mockB2BOrders;
}

export function listB2BOrdersForOperationalUiServer(options?: {
  actorRole?: PlatformRole | null;
  actorId?: string;
}): B2BOrder[] {
  const base = getB2BOrdersBaseForOperationalApi();
  const withPayment = applyOrderPaymentsOverlay(base);
  return filterB2BOrdersByOperationalActor(withPayment, options);
}

/**
 * Строки заказа из снимка `lineItemsByOrderId` (ключ = `B2BOrder.order`).
 * Если в JSON нет блока или пустой массив — `undefined` (caller использует демо-линии).
 */
export function getSnapshotLineItemsForOrder(orderId: string): B2BOrderLineItem[] | undefined {
  const snap = loadB2BOrderSnapshotOrNull();
  const raw = snap?.lineItemsByOrderId?.[orderId];
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  return raw as B2BOrderLineItem[];
}
