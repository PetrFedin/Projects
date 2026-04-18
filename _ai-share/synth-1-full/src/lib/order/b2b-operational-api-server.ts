import { listB2BOrdersForOperationalUi } from '@/lib/order/b2b-orders-list-read-model';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';
import { initialOrderItems, mockOrderDetailJoors } from '@/lib/order-data';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import {
  toOperationalOrderDetailDto,
  toOperationalOrderListRowDto,
} from '@/lib/order/operational-order-dto';

const ACTOR_HEADER = 'x-syntha-api-actor-role';

function actorRoleFromHeader(req: Request): PlatformRole | undefined {
  const raw = req.headers.get(ACTOR_HEADER)?.trim().toLowerCase();
  if (raw === 'brand') return 'brand';
  if (raw === 'shop' || raw === 'retailer' || raw === 'buyer') return 'retailer';
  return undefined;
}

/** Список заказов с учётом optional tenant header (см. e2e `b2b-v1-api-headers`). */
export function operationalOrdersForRequest(req: Request): B2BOrder[] {
  const role = actorRoleFromHeader(req);
  if (role) return listB2BOrdersForOperationalUi({ actorRole: role });
  return listB2BOrdersForOperationalUi();
}

export function findOperationalOrderForRequest(req: Request, orderId: string): B2BOrder | null {
  const rows = operationalOrdersForRequest(req);
  return rows.find((o) => o.order === orderId) ?? null;
}

/** Демо-линии для detail DTO (совпадают с экраном карточки заказа в demo). */
export function demoOperationalDetailLineItems(): B2BOrderLineItem[] {
  return initialOrderItems.map((p) => ({
    productId: p.id,
    size: 'M',
    quantity: p.orderedQuantity,
    price: p.price,
    currency: 'RUB',
  }));
}

export function toV1DetailDto(order: B2BOrder) {
  return toOperationalOrderDetailDto(
    order,
    demoOperationalDetailLineItems(),
    mockOrderDetailJoors.orderNotes,
    undefined
  );
}

export function toV1ListDto(orders: B2BOrder[]) {
  return orders.map((o) => toOperationalOrderListRowDto(o));
}
