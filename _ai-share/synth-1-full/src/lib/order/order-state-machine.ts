import type { OrderAggregate, OrderCommercialStatus } from './order-aggregate';

/**
 * [Phase 2 — Order architecture]
 * Машина состояний заказа (Order State Machine).
 * Определяет правила переходов между коммерческими статусами.
 */

export interface StateTransition {
  from: OrderCommercialStatus;
  to: OrderCommercialStatus;
  allowedActors: Array<'brand' | 'shop' | 'system'>;
  conditions?: (order: OrderAggregate) => boolean;
}

export const STATE_TRANSITIONS: StateTransition[] = [
  // 1. Из черновика в ожидание проверки
  {
    from: 'draft',
    to: 'pending_approval',
    allowedActors: ['shop', 'brand'],
    conditions: (order) => order.lines.length > 0,
  },
  // 2. Из ожидания проверки в подтвержденный
  {
    from: 'pending_approval',
    to: 'confirmed',
    allowedActors: ['brand'],
    conditions: (order) => order.lines.length > 0,
  },
  // 3. Из ожидания проверки в переговоры (правки)
  {
    from: 'pending_approval',
    to: 'negotiation',
    allowedActors: ['brand', 'shop'],
  },
  // 4. Из переговоров обратно в ожидание проверки
  {
    from: 'negotiation',
    to: 'pending_approval',
    allowedActors: ['shop', 'brand'],
  },
  // 5. Из подтвержденного в отгруженный (исполнение)
  {
    from: 'confirmed',
    to: 'shipped',
    allowedActors: ['system', 'brand'],
    conditions: (order) =>
      order.projections.fulfillment === 'packed' ||
      order.projections.fulfillment === 'ready_for_shipment' ||
      order.projections.fulfillment === 'shipped' ||
      order.projections.fulfillment === 'partially_shipped' ||
      order.projections.fulfillment === 'in_transit',
  },
  // 5.1. Из подтвержденного в частично отгруженный
  {
    from: 'confirmed',
    to: 'partially_shipped',
    allowedActors: ['system', 'brand'],
    conditions: (order) => order.projections.fulfillment === 'partially_shipped',
  },
  // 5.2. Из частично отгруженного в отгруженный
  {
    from: 'partially_shipped',
    to: 'shipped',
    allowedActors: ['system', 'brand'],
    conditions: (order) => order.projections.fulfillment === 'shipped',
  },
  // 5.3. Из отгруженного в доставленный
  {
    from: 'shipped',
    to: 'delivered',
    allowedActors: ['system', 'brand'],
    conditions: (order) => order.projections.fulfillment === 'delivered',
  },
  // 6. Отмена заказа (почти из любого статуса до отгрузки)
  {
    from: 'draft',
    to: 'cancelled',
    allowedActors: ['shop', 'brand'],
  },
  {
    from: 'pending_approval',
    to: 'cancelled',
    allowedActors: ['brand', 'shop'],
  },
  {
    from: 'negotiation',
    to: 'cancelled',
    allowedActors: ['brand', 'shop'],
  },
  {
    from: 'confirmed',
    to: 'cancelled',
    allowedActors: ['brand', 'shop'],
    conditions: (order) => order.projections.fulfillment === 'not_started',
  },
  // 7. Спор (Dispute)
  {
    from: 'delivered',
    to: 'disputed',
    allowedActors: ['shop'],
    conditions: (order) => order.projections.dispute === 'open',
  },
  {
    from: 'shipped',
    to: 'disputed',
    allowedActors: ['shop'],
    conditions: (order) => order.projections.dispute === 'open',
  },
  // 8. Разрешение спора
  {
    from: 'disputed',
    to: 'delivered',
    allowedActors: ['brand', 'system'],
    conditions: (order) => order.projections.dispute === 'resolved',
  },
  // 9. Возврат (Return)
  {
    from: 'delivered',
    to: 'cancelled', // В коммерческой модели возврат часто ведет к аннуляции (полной или частичной)
    allowedActors: ['shop', 'brand'],
    conditions: (order) => order.projections.fulfillment === 'delivered', // Только после доставки
  },
];

/**
 * Проверяет возможность перехода в новый статус.
 */
export function canTransitionTo(
  order: OrderAggregate,
  to: OrderCommercialStatus,
  actor: 'brand' | 'shop' | 'system'
): { allowed: boolean; reason?: string } {
  const transition = STATE_TRANSITIONS.find((t) => t.from === order.status && t.to === to);

  if (!transition) {
    return { allowed: false, reason: `No transition from ${order.status} to ${to}` };
  }

  if (!transition.allowedActors.includes(actor)) {
    return { allowed: false, reason: `Actor ${actor} is not allowed to perform this transition` };
  }

  if (transition.conditions && !transition.conditions(order)) {
    return {
      allowed: false,
      reason: `Conditions for transition from ${order.status} to ${to} are not met`,
    };
  }

  return { allowed: true };
}

/**
 * Дискриминатор: автоопределение типа заказа (B2B vs B2C).
 * B2B заказы имеют wholesaleOrderId и buyerAccountId.
 */
export function isB2BOrder(order: OrderAggregate): boolean {
  return !!order.participants.buyerAccountId && !!order.id;
}

/**
 * Дискриминатор: автоопределение режима заказа (Buy Now vs Pre-order).
 */
export function isPreOrder(order: OrderAggregate): boolean {
  return order.mode === 'pre_order';
}
