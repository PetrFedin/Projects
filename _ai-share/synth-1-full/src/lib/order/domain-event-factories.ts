import { z } from 'zod';
import { eventBus } from './domain-events';
import type { DomainEvent } from './domain-events';
import {
  orderConfirmedPayloadSchema,
  orderPartialCancelledPayloadSchema,
  orderShippedPayloadSchema,
  productionQcUpdatedPayloadSchema,
  inventoryCustomerReturnPayloadSchema,
  inventoryChannelTransferPayloadSchema,
  inventoryReconciliationCompletedPayloadSchema,
  inventoryDiscrepancyDetectedPayloadSchema,
  orderClaimResolvedPayloadSchema,
  inventoryOwnershipTransferredPayloadSchema,
  inventoryGrainUnlockedPayloadSchema,
  inventorySnapshotCreatedPayloadSchema,
  inventoryCycleCountCompletedPayloadSchema,
  inventoryShopStockFileIngestedPayloadSchema,
  articleReadyForProductionPayloadSchema,
  controlRiskAlertPayloadSchema,
  orderShipmentCreatedPayloadSchema,
  productionTransferCreatedPayloadSchema,
  productionDraftCreatedPayloadSchema,
  inventoryStockLowPayloadSchema,
  inventoryReservationExpiredPayloadSchema,
  inventoryB2b2cAllocationCompletedPayloadSchema,
  storeEslPriceUpdatedPayloadSchema,
  systemGlobalAnomalyDetectedPayloadSchema,
  type OrderConfirmedPayload,
  type OrderPartialCancelledPayload,
  type OrderShippedPayload,
  type ProductionQcUpdatedPayload,
  type InventoryCustomerReturnPayload,
  type InventoryChannelTransferPayload,
  type InventoryReconciliationCompletedPayload,
} from './domain-event-schemas';
import { DomainEventTypes } from './domain-event-catalog';

function nextEventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildEvent<T extends DomainEvent['payload']>(params: {
  eventIdPrefix: string;
  aggregateId: string;
  aggregateType: DomainEvent['aggregateType'];
  version: number;
  type: string;
  payload: T;
}): DomainEvent {
  return {
    eventId: nextEventId(params.eventIdPrefix),
    occurredAt: new Date().toISOString(),
    aggregateId: params.aggregateId,
    aggregateType: params.aggregateType,
    version: params.version,
    type: params.type,
    payload: params.payload,
  };
}

async function publishTyped<P>(
  schema: z.ZodType<P>,
  args: {
    eventIdPrefix: string;
    aggregateId: string;
    aggregateType: DomainEvent['aggregateType'];
    version: number;
    type: string;
    payload: unknown;
  }
): Promise<void> {
  const payload = schema.parse(args.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: args.eventIdPrefix,
      aggregateId: args.aggregateId,
      aggregateType: args.aggregateType,
      version: args.version,
      type: args.type,
      payload,
    })
  );
}

/** Публикует событие после Zod-parse payload (ошибка = баг вызывающего кода). */
export async function publishOrderConfirmed(params: {
  aggregateId: string;
  version: number;
  payload: OrderConfirmedPayload;
}): Promise<void> {
  const payload = orderConfirmedPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-confirm',
      aggregateId: params.aggregateId,
      aggregateType: 'order',
      version: params.version,
      type: DomainEventTypes.order.confirmed,
      payload,
    })
  );
}

export async function publishOrderPartialCancelled(params: {
  aggregateId: string;
  version: number;
  payload: OrderPartialCancelledPayload;
}): Promise<void> {
  const payload = orderPartialCancelledPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-partial-cancel',
      aggregateId: params.aggregateId,
      aggregateType: 'order',
      version: params.version,
      type: DomainEventTypes.order.partialCancelled,
      payload,
    })
  );
}

export async function publishOrderShipped(params: {
  aggregateId: string;
  version: number;
  payload: OrderShippedPayload;
}): Promise<void> {
  const payload = orderShippedPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-partial-ship',
      aggregateId: params.aggregateId,
      aggregateType: 'order',
      version: params.version,
      type: DomainEventTypes.order.shipped,
      payload,
    })
  );
}

export async function publishProductionQcUpdated(params: {
  aggregateId: string;
  version: number;
  payload: ProductionQcUpdatedPayload;
}): Promise<void> {
  const payload = productionQcUpdatedPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-qc',
      aggregateId: params.aggregateId,
      aggregateType: 'production',
      version: params.version,
      type: DomainEventTypes.production.qcUpdated,
      payload,
    })
  );
}

export async function publishInventoryCustomerReturnProcessed(params: {
  aggregateId: string;
  version: number;
  payload: InventoryCustomerReturnPayload;
}): Promise<void> {
  const payload = inventoryCustomerReturnPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-inv-return',
      aggregateId: params.aggregateId,
      aggregateType: 'inventory',
      version: params.version,
      type: DomainEventTypes.inventory.customerReturnProcessed,
      payload,
    })
  );
}

export async function publishInventoryChannelTransferCompleted(params: {
  aggregateId: string;
  version: number;
  payload: InventoryChannelTransferPayload;
}): Promise<void> {
  const payload = inventoryChannelTransferPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-inv-ch-transfer',
      aggregateId: params.aggregateId,
      aggregateType: 'inventory',
      version: params.version,
      type: DomainEventTypes.inventory.channelTransferCompleted,
      payload,
    })
  );
}

export async function publishInventoryReconciliationCompleted(params: {
  aggregateId: string;
  version: number;
  payload: InventoryReconciliationCompletedPayload;
}): Promise<void> {
  const payload = inventoryReconciliationCompletedPayloadSchema.parse(params.payload);
  return eventBus.publish(
    buildEvent({
      eventIdPrefix: 'evt-inv-reconcile',
      aggregateId: params.aggregateId,
      aggregateType: 'inventory',
      version: params.version,
      type: DomainEventTypes.inventory.reconciliationCompleted,
      payload,
    })
  );
}

export async function publishInventoryDiscrepancyDetected(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryDiscrepancyDetectedPayloadSchema, {
    eventIdPrefix: 'evt-reconcile',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.discrepancyDetected,
    payload: params.payload,
  });
}

export async function publishOrderClaimResolved(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(orderClaimResolvedPayloadSchema, {
    eventIdPrefix: 'evt-claim-resolved',
    aggregateId: params.aggregateId,
    aggregateType: 'order',
    version: params.version,
    type: DomainEventTypes.order.claimResolved,
    payload: params.payload,
  });
}

export async function publishInventoryOwnershipTransferred(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryOwnershipTransferredPayloadSchema, {
    eventIdPrefix: 'evt-inv-own-transfer',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.ownershipTransferred,
    payload: params.payload,
  });
}

export async function publishInventoryGrainUnlocked(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryGrainUnlockedPayloadSchema, {
    eventIdPrefix: 'evt-inv-unlock',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.grainUnlocked,
    payload: params.payload,
  });
}

export async function publishInventorySnapshotCreated(params: {
  aggregateId: string;
  version: number;
  occurredAt?: string;
  payload: unknown;
}): Promise<void> {
  const payload = inventorySnapshotCreatedPayloadSchema.parse(params.payload);
  const event: DomainEvent = {
    eventId: nextEventId('evt-inv-snap'),
    occurredAt: params.occurredAt ?? new Date().toISOString(),
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.snapshotCreated,
    payload,
  };
  return eventBus.publish(event);
}

export async function publishInventoryCycleCountCompleted(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryCycleCountCompletedPayloadSchema, {
    eventIdPrefix: 'evt-inv-cycle',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.cycleCountCompleted,
    payload: params.payload,
  });
}

export async function publishInventoryShopStockFileIngested(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryShopStockFileIngestedPayloadSchema, {
    eventIdPrefix: 'evt-inv-stock-file',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.shopStockFileIngested,
    payload: params.payload,
  });
}

export async function publishArticleReadyForProduction(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(articleReadyForProductionPayloadSchema, {
    eventIdPrefix: 'evt-art-ready',
    aggregateId: params.aggregateId,
    aggregateType: 'article',
    version: params.version,
    type: DomainEventTypes.article.readyForProduction,
    payload: params.payload,
  });
}

export async function publishControlRiskAlert(params: {
  aggregateId: string;
  aggregateType: 'control' | 'inventory';
  version: number;
  eventIdPrefix?: string;
  payload: unknown;
}): Promise<void> {
  return publishTyped(controlRiskAlertPayloadSchema, {
    eventIdPrefix: params.eventIdPrefix ?? 'control-risk',
    aggregateId: params.aggregateId,
    aggregateType: params.aggregateType,
    version: params.version,
    type: DomainEventTypes.control.riskAlert,
    payload: params.payload,
  });
}

export async function publishOrderShipmentCreated(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(orderShipmentCreatedPayloadSchema, {
    eventIdPrefix: 'evt-mov-ord',
    aggregateId: params.aggregateId,
    aggregateType: 'order',
    version: params.version,
    type: DomainEventTypes.order.shipmentCreated,
    payload: params.payload,
  });
}

export async function publishProductionTransferCreated(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(productionTransferCreatedPayloadSchema, {
    eventIdPrefix: 'evt-mov-com',
    aggregateId: params.aggregateId,
    aggregateType: 'production',
    version: params.version,
    type: DomainEventTypes.production.transferCreated,
    payload: params.payload,
  });
}

export async function publishProductionDraftCreated(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(productionDraftCreatedPayloadSchema, {
    eventIdPrefix: 'autopilot-evt',
    aggregateId: params.aggregateId,
    aggregateType: 'production',
    version: params.version,
    type: DomainEventTypes.production.draftCreated,
    payload: params.payload,
  });
}

export async function publishInventoryStockLow(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryStockLowPayloadSchema, {
    eventIdPrefix: 'stock-low',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.stockLow,
    payload: params.payload,
  });
}

export async function publishInventoryReservationExpired(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryReservationExpiredPayloadSchema, {
    eventIdPrefix: 'evt-res-expired',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.reservationExpired,
    payload: params.payload,
  });
}

export async function publishInventoryB2b2cAllocationCompleted(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(inventoryB2b2cAllocationCompletedPayloadSchema, {
    eventIdPrefix: 'evt-b2b2c',
    aggregateId: params.aggregateId,
    aggregateType: 'inventory',
    version: params.version,
    type: DomainEventTypes.inventory.b2b2cAllocationCompleted,
    payload: params.payload,
  });
}

export async function publishStoreEslPriceUpdated(params: {
  aggregateId: string;
  version: number;
  payload: unknown;
}): Promise<void> {
  return publishTyped(storeEslPriceUpdatedPayloadSchema, {
    eventIdPrefix: 'evt-esl',
    aggregateId: params.aggregateId,
    aggregateType: 'store',
    version: params.version,
    type: DomainEventTypes.store.eslPriceUpdated,
    payload: params.payload,
  });
}

/**
 * [Phase 62] Urgent path: safeParse — невалидный payload не ломает шину.
 */
export async function publishUrgentGlobalAnomalyDetected(params: {
  aggregateId: string;
  payload: unknown;
}): Promise<void> {
  const parsed = systemGlobalAnomalyDetectedPayloadSchema.safeParse(params.payload);
  if (!parsed.success) {
    console.error(
      '[DomainEventFactories] Invalid system.global_anomaly_detected payload',
      parsed.error.flatten()
    );
    return;
  }
  return eventBus.publishUrgent(
    buildEvent({
      eventIdPrefix: 'anom',
      aggregateId: params.aggregateId,
      aggregateType: 'system',
      version: 1,
      type: DomainEventTypes.system.globalAnomalyDetected,
      payload: parsed.data,
    })
  );
}
