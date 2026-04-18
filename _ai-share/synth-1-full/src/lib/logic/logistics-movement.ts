import {
  publishOrderShipmentCreated,
  publishProductionTransferCreated,
} from '../order/domain-event-factories';

/**
 * [Phase 2 — Inventory / Warehouse / Logistics architecture]
 * Канон: docs/domain-model/inventory-execution.md.
 * Модель логистического перемещения (Logistics Movement / Transfer).
 */

export type MovementType = 'transfer' | 'shipment' | 'return' | 'adjustment';
export type MovementStatus = 'draft' | 'picking' | 'in_transit' | 'delivered' | 'cancelled';

export interface LogisticsMovement {
  id: string;
  type: MovementType;
  status: MovementStatus;

  /** Откуда и куда */
  originLocationId: string;
  destinationLocationId: string;

  /** Ссылка на основание (заказ или Production PO) */
  referenceId?: string;
  referenceType?: 'order' | 'commitment';

  /** [Phase 2 Prod] Группировка по оптовым заказам (для консолидации) */
  wholesaleOrderIds?: string[];

  /** Состав перемещения */
  items: Array<{
    sku: string;
    quantity: number;
    lotId?: string;
  }>;

  /** Логистические детали */
  logistics: {
    carrierId?: string;
    trackingNumber?: string;
    estimatedArrival?: string;
    actualArrival?: string;
  };

  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

/**
 * Проверяет, завершено ли перемещение.
 */
export function isMovementComplete(movement: LogisticsMovement): boolean {
  return movement.status === 'delivered';
}

/**
 * Создает перемещение на основании заказа (Shipment).
 */
export function createMovementFromOrder(params: {
  orderId: string;
  wholesaleOrderIds?: string[]; // [Phase 2 Prod]
  originLocationId: string;
  destinationLocationId: string;
  items: LogisticsMovement['items'];
}): LogisticsMovement {
  const movement: LogisticsMovement = {
    id: `mov-ord-${params.orderId}-${Date.now()}`,
    type: 'shipment',
    status: 'draft',
    originLocationId: params.originLocationId,
    destinationLocationId: params.destinationLocationId,
    referenceId: params.orderId,
    referenceType: 'order',
    wholesaleOrderIds: params.wholesaleOrderIds,
    items: params.items,
    logistics: {},
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  };

  void publishOrderShipmentCreated({
    aggregateId: params.orderId,
    version: 1,
    payload: {
      movementId: movement.id,
      wholesaleOrderIds: params.wholesaleOrderIds ?? [],
      items: params.items,
    },
  });

  return movement;
}

/**
 * Создает перемещение на основании производства (ASN/Receiving).
 */
export function createMovementFromCommitment(params: {
  commitmentId: string;
  wholesaleOrderIds?: string[]; // [Phase 2 Prod]
  originLocationId: string;
  destinationLocationId: string;
  items: LogisticsMovement['items'];
}): LogisticsMovement {
  const movement: LogisticsMovement = {
    id: `mov-com-${params.commitmentId}-${Date.now()}`,
    type: 'transfer',
    status: 'in_transit',
    originLocationId: params.originLocationId,
    destinationLocationId: params.destinationLocationId,
    referenceId: params.commitmentId,
    referenceType: 'commitment',
    wholesaleOrderIds: params.wholesaleOrderIds,
    items: params.items,
    logistics: {},
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  };

  void publishProductionTransferCreated({
    aggregateId: params.commitmentId,
    version: 1,
    payload: {
      movementId: movement.id,
      wholesaleOrderIds: params.wholesaleOrderIds ?? [],
      items: params.items,
    },
  });

  return movement;
}

/**
 * Рассчитывает общее количество единиц в перемещении.
 */
export function getTotalMovementUnits(movement: LogisticsMovement): number {
  return movement.items.reduce((acc, item) => acc + item.quantity, 0);
}
