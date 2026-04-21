import {
  getSnapshotLineItemsForOrder,
  listB2BOrdersForOperationalUiServer,
} from '@/lib/order/b2b-orders-list-read-model.server';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';
import { initialOrderItems, mockOrderDetailJoors } from '@/lib/order-data';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import {
  toOperationalOrderDetailDto,
  toOperationalOrderListRowDto,
} from '@/lib/order/operational-order-dto';
import { getOperationalNotesRecord } from '@/lib/order/b2b-operational-notes-persistence.file';
import { getOperationalStatusRecord } from '@/lib/order/b2b-operational-status-persistence.file';

const ACTOR_HEADER = 'x-syntha-api-actor-role';

/** Роль из `x-syntha-api-actor-role` (Playwright / e2e `b2b-v1-api-headers`). */
export function getOperationalApiActorRole(req: Request): PlatformRole | undefined {
  const raw = req.headers.get(ACTOR_HEADER)?.trim().toLowerCase();
  if (raw === 'brand') return 'brand';
  if (raw === 'shop' || raw === 'retailer' || raw === 'buyer') return 'retailer';
  return undefined;
}

function actorRoleFromHeader(req: Request): PlatformRole | undefined {
  return getOperationalApiActorRole(req);
}

/** Список заказов с учётом optional tenant header (см. e2e `b2b-v1-api-headers`). */
export function operationalOrdersForRequest(req: Request): B2BOrder[] {
  const role = actorRoleFromHeader(req);
  if (role) return listB2BOrdersForOperationalUiServer({ actorRole: role });
  return listB2BOrdersForOperationalUiServer();
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

/** Подмешивает статус из `b2b-operational-status.json` (PATCH брендом). */
function applyOperationalStatusOverlay<T extends { wholesaleOrderId: string; status: string }>(
  dto: T
): T {
  const rec = getOperationalStatusRecord(dto.wholesaleOrderId);
  if (!rec) return dto;
  return { ...dto, status: rec.status };
}

export function toV1DetailDto(order: B2BOrder) {
  const saved = getOperationalNotesRecord(order.order);
  const orderNotes =
    saved !== undefined ? saved.note : mockOrderDetailJoors.orderNotes;
  const internalNotes = saved?.internalNote;
  const lineItems =
    getSnapshotLineItemsForOrder(order.order) ?? demoOperationalDetailLineItems();
  return applyOperationalStatusOverlay(
    toOperationalOrderDetailDto(order, lineItems, orderNotes, internalNotes)
  );
}

export function toV1ListDto(orders: B2BOrder[]) {
  return orders.map((o) =>
    applyOperationalStatusOverlay(toOperationalOrderListRowDto(o))
  );
}
