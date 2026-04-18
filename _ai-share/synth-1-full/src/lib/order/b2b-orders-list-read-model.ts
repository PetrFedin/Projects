/**
 * Канонический **in-memory снимок** строк B2B для demo (brand + shop): один источник — сид + оверлей
 * `getOrdersWithPaymentState` (раньше brand/shop расходились по моку).
 *
 * **HTTP/UI:** списки не ходят в этот модуль напрямую как первая правда — см. **`useB2BOperationalOrdersList`**:
 * 1) **`GET /api/b2b/v1/operational-orders`** (List DTO + `wholesaleOrderId`, заголовки v1 при необходимости),
 * 2) fallback **`GET /api/b2b/operational-orders`** (legacy envelope),
 * 3) затем этот read-model в браузере.
 *
 * @see `docs/domain-model/order.md` §4.1 · TASK_QUEUE — Phase 2 Order (полный aggregate — отдельно)
 */
import { getOrdersWithPaymentState } from '@/lib/b2b/partner-finance-rollup';
import { isDemoBrandName } from '@/lib/data/demo-platform-brands';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';

/** Строка списка заказов (пока совпадает с `B2BOrder`; отдельный List DTO — в TASK_QUEUE). */
export type B2BOrderListRow = B2BOrder;

export function listB2BOrdersForOperationalUi(options?: {
  actorRole?: PlatformRole | null;
  actorId?: string;
}): B2BOrderListRow[] {
  const orders = getOrdersWithPaymentState();

  if (!options?.actorRole) return orders;

  // [Phase 2 — Order architecture] Tenant/Owner filtering.
  // В demo — только заказы демо-брендов Syntha Lab / Nordic Wool.
  if (options.actorRole === 'brand') {
    return orders.filter((o) => isDemoBrandName(o.brand));
  }

  if (options.actorRole === 'retailer' || options.actorRole === 'buyer') {
    return orders.filter((o) => o.shop.startsWith('Демо-магазин'));
  }

  return orders;
}
