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
  // В demo-контуре мы фильтруем по строковым названиям 'Syntha', 'Podium' и т.д.
  // В prod это будет фильтрация по organizationId в OrderAggregate.
  
  if (options.actorRole === 'brand') {
    // Бренд видит только свои заказы (в моке Syntha, A.P.C., Acne Studios)
    // Для демо Syntha — основной бренд.
    return orders.filter((o) => o.brand === 'Syntha' || o.brand === 'A.P.C.' || o.brand === 'Acne Studios');
  }

  if (options.actorRole === 'retailer' || options.actorRole === 'buyer') {
    // Ритейлер видит только заказы своих магазинов
    return orders.filter((o) => o.shop.includes('Podium') || o.shop.includes('ЦУМ') || o.shop.includes('Boutique'));
  }

  return orders;
}
