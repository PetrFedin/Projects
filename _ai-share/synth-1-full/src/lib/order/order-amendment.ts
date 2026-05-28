import type { OrderAggregate, OrderCommercialStatus } from './order-aggregate';
import type { B2BOrderLineItem } from './b2b-order-payload';

/**
 * [Phase 2 — Order architecture]
 * Модель изменения заказа (Order Amendment).
 * Позволяет отслеживать историю правок и применять их к агрегату.
 */

export type AmendmentType =
  | 'lines_update' // изменение состава (SKU, кол-во)
  | 'terms_update' // изменение цен, валюты, условий оплаты
  | 'status_change' // смена статуса (согласование)
  | 'participant_change' // смена покупателя/локации
  | 'cancel'; // отмена заказа

export interface OrderAmendment {
  id: string;
  orderId: string;
  type: AmendmentType;

  /** Кто инициатор (Brand / Shop / System) */
  initiatorId: string;
  initiatorType: 'brand' | 'shop' | 'system';

  /** Содержимое правки (partial diff) */
  payload: {
    lines?: B2BOrderLineItem[];
    status?: OrderCommercialStatus;
    terms?: Partial<OrderAggregate['terms']>;
    reason?: string;
    /** [Phase 2 Prod] Снапшот состояния ДО применения правки (для отката) */
    snapshotBefore?: Partial<OrderAggregate>;
  };

  /** Статус самой правки */
  status: 'pending' | 'applied' | 'rejected' | 'rolled_back';

  metadata: {
    createdAt: string;
    appliedAt?: string;
    version: number; // версия заказа ПОСЛЕ применения этой правки
  };
}

/**
 * Применяет правку к агрегату заказа.
 * Возвращает новый экземпляр агрегата с инкрементированной версией и записью в аудит-логе.
 */
export function applyAmendment(order: OrderAggregate, amendment: OrderAmendment): OrderAggregate {
  if (amendment.status !== 'pending') {
    throw new Error(`Amendment ${amendment.id} is already ${amendment.status}`);
  }

  const diff: Record<string, any> = {};
  const updatedOrder: OrderAggregate = {
    ...order,
    metadata: {
      ...order.metadata,
      version: order.metadata.version + 1,
      updatedAt: amendment.metadata.createdAt,
    },
  };

  if (amendment.payload.lines) {
    diff.lines = { prev: order.lines.length, next: amendment.payload.lines.length };
    updatedOrder.lines = amendment.payload.lines;
  }

  if (amendment.payload.status) {
    diff.status = { prev: order.status, next: amendment.payload.status };
    updatedOrder.status = amendment.payload.status;
  }

  if (amendment.payload.terms) {
    diff.terms = amendment.payload.terms;
    updatedOrder.terms = {
      ...order.terms,
      ...amendment.payload.terms,
    };
  }

  // [Phase 2 Prod] Добавляем запись в аудит-лог с диффом и ссылкой на правку
  updatedOrder.metadata.auditLog = [
    ...(order.metadata.auditLog || []),
    {
      version: updatedOrder.metadata.version,
      timestamp: amendment.metadata.createdAt,
      actorId: amendment.initiatorId,
      action: `AMENDMENT_${amendment.type.toUpperCase()}`,
      changes: amendment.payload,
      amendmentId: amendment.id,
      diff,
    },
  ];

  return updatedOrder;
}

/**
 * [Phase 2 Prod] Откатывает примененную правку к предыдущему состоянию.
 * Использует snapshotBefore из правки для восстановления агрегата.
 */
export function rollbackAmendment(
  order: OrderAggregate,
  amendment: OrderAmendment
): OrderAggregate {
  if (amendment.status !== 'applied') {
    throw new Error(`Cannot rollback amendment ${amendment.id} with status ${amendment.status}`);
  }
  if (!amendment.payload.snapshotBefore) {
    throw new Error(`No snapshot available for rollback in amendment ${amendment.id}`);
  }

  const restoredOrder: OrderAggregate = {
    ...order,
    ...amendment.payload.snapshotBefore,
    metadata: {
      ...order.metadata,
      version: order.metadata.version + 1,
      updatedAt: new Date().toISOString(),
      auditLog: [
        ...(order.metadata.auditLog || []),
        {
          version: order.metadata.version + 1,
          timestamp: new Date().toISOString(),
          actorId: 'system',
          action: 'ROLLBACK_AMENDMENT',
          changes: { amendmentId: amendment.id, reason: 'Manual rollback' },
          diff: calculateOrderDiff(order, amendment.payload.snapshotBefore as OrderAggregate),
        },
      ],
    },
  };

  return restoredOrder;
}

/**
 * [Phase 2 Prod] Вычисляет разницу между двумя версиями заказа.
 */
export function calculateOrderDiff(
  prev: OrderAggregate,
  next: OrderAggregate
): Record<string, any> {
  const diff: Record<string, any> = {};

  if (prev.status !== next.status) {
    diff.status = { from: prev.status, to: next.status };
  }

  if (JSON.stringify(prev.terms) !== JSON.stringify(next.terms)) {
    diff.terms = { from: prev.terms, to: next.terms };
  }

  if (prev.lines.length !== next.lines.length) {
    diff.linesCount = { from: prev.lines.length, to: next.lines.length };
  }

  return diff;
}

/**
 * [Phase 2 Prod] Создает снапшот аудита для конкретной версии.
 */
export function createAuditSnapshot(
  order: OrderAggregate,
  actorId: string,
  action: string
): NonNullable<OrderAggregate['metadata']['auditLog']>[0] {
  return {
    version: order.metadata.version,
    timestamp: new Date().toISOString(),
    actorId,
    action,
    changes: {}, // Заполняется при применении изменений
    diff: {}, // Заполняется при применении изменений
  };
}

/**
 * Создает черновик правки для изменения состава линий.
 */
export function createLinesAmendment(
  order: OrderAggregate,
  newLines: B2BOrderLineItem[],
  initiatorId: string,
  initiatorType: 'brand' | 'shop'
): OrderAmendment {
  return {
    id: `amend-${order.id}-${Date.now()}`,
    orderId: order.id,
    type: 'lines_update',
    initiatorId,
    initiatorType,
    status: 'pending',
    payload: {
      lines: newLines,
    },
    metadata: {
      createdAt: new Date().toISOString(),
      version: order.metadata.version + 1,
    },
  };
}
