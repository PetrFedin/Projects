import { z } from 'zod';

/**
 * [Phase 62 — Domain Event Payload Schemas]
 * Единый источник правды для runtime-валидации payload (Zod).
 * Используется фабриками публикации в domain-event-factories.ts.
 */

export const orderLineSkuQuantitySchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().nonnegative(),
});

export const orderConfirmedPayloadSchema = z.object({
  confirmedBy: z.string().min(1),
  totalAmount: z.number().finite(),
  totalAmountBase: z.number().finite().optional(),
  currency: z.string().min(1),
  exchangeRate: z.number().finite().optional(),
  tenantId: z.string().optional(),
});

export const orderPartialCancelledPayloadSchema = z.object({
  orderId: z.string().min(1),
  cancelLines: z.array(orderLineSkuQuantitySchema),
  actorId: z.string().min(1),
  tenantId: z.string().optional(),
});

export const orderShippedPayloadSchema = z.object({
  orderId: z.string().min(1),
  shipLines: z.array(orderLineSkuQuantitySchema),
  actorId: z.string().min(1),
  tenantId: z.string().optional(),
});

export const productionQcUpdatedPayloadSchema = z.object({
  gateId: z.string().min(1),
  status: z.string().min(1),
  defectsFound: z.number().int().nonnegative(),
});

export const inventoryCustomerReturnPayloadSchema = z.object({
  locationId: z.string().min(1),
  quantity: z.number().finite(),
  condition: z.enum(['resellable', 'damaged']),
  actorId: z.string().min(1),
  tenantId: z.string().min(1),
});

export const inventoryChannelTransferPayloadSchema = z.object({
  locationId: z.string().min(1),
  quantity: z.number().finite(),
  fromChannel: z.string().min(1),
  toChannel: z.string().min(1),
  financialImpact: z.number().finite(),
  actorId: z.string().min(1),
  tenantId: z.string().min(1),
  agreementId: z.string().optional(),
});

export const inventoryReconciliationCompletedPayloadSchema = z.object({
  locationId: z.string().min(1),
  discrepancy: z.number().finite(),
  actionTaken: z.enum(['adjusted', 'locked', 'flagged']),
  actorId: z.string().min(1),
  tenantId: z.string().min(1),
});

export type OrderConfirmedPayload = z.infer<typeof orderConfirmedPayloadSchema>;
export type OrderPartialCancelledPayload = z.infer<typeof orderPartialCancelledPayloadSchema>;
export type OrderShippedPayload = z.infer<typeof orderShippedPayloadSchema>;
export type ProductionQcUpdatedPayload = z.infer<typeof productionQcUpdatedPayloadSchema>;
export type InventoryCustomerReturnPayload = z.infer<typeof inventoryCustomerReturnPayloadSchema>;
export type InventoryChannelTransferPayload = z.infer<typeof inventoryChannelTransferPayloadSchema>;
export type InventoryReconciliationCompletedPayload = z.infer<typeof inventoryReconciliationCompletedPayloadSchema>;

/** inventory.discrepancy_detected — отчёт сверки + detectedBy */
export const inventoryDiscrepancyDetectedPayloadSchema = z.object({
  sku: z.string().min(1),
  channelId: z.string().optional(),
  merchQuantity: z.number().finite(),
  ledgerQuantity: z.number().finite(),
  diff: z.number().finite(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  actionRequired: z.boolean(),
  detectedBy: z.string().min(1),
});

export const orderClaimResolvedPayloadSchema = z.object({
  orderId: z.string().min(1),
  action: z.string().min(1),
  approvedAmount: z.number().finite().optional(),
  actorId: z.string().min(1),
  tenantId: z.string().optional(),
});

export const inventoryOwnershipTransferredPayloadSchema = z.object({
  locationId: z.string().min(1),
  quantity: z.number().finite(),
  fromOwnerId: z.string().min(1),
  toOwnerId: z.string().min(1),
  settlementAmount: z.number().finite(),
  actorId: z.string().min(1),
  tenantId: z.string().min(1),
  agreementId: z.string().optional(),
});

export const inventoryGrainUnlockedPayloadSchema = z.object({
  grainId: z.string().min(1),
  actorId: z.string().min(1),
  reason: z.string().min(1),
  tenantId: z.string().optional(),
});

export const inventorySnapshotCreatedPayloadSchema = z.object({
  snapshotId: z.string().min(1),
  grainCount: z.number().int().nonnegative(),
  actorId: z.string().min(1),
  reason: z.string().min(1),
});

export const inventoryCycleCountCompletedPayloadSchema = z.object({
  locationId: z.string().min(1),
  newQuantity: z.number().finite(),
  actorId: z.string().min(1),
  reason: z.string().min(1),
  tenantId: z.string().optional(),
});

export const articleReadyForProductionPayloadSchema = z.object({
  collectionId: z.string().min(1),
  readinessScore: z.number().finite(),
});

export const controlRiskAlertPayloadSchema = z.object({
  riskLevel: z.string().min(1),
  factors: z.array(z.string()),
  autoCreateInteraction: z.boolean().optional(),
});

export const orderShipmentCreatedPayloadSchema = z.object({
  movementId: z.string().min(1),
  wholesaleOrderIds: z.array(z.string()),
  items: z.array(z.unknown()),
});

export const productionTransferCreatedPayloadSchema = z.object({
  movementId: z.string().min(1),
  wholesaleOrderIds: z.array(z.string()),
  items: z.array(z.unknown()),
});

export const productionDraftCreatedPayloadSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().finite(),
  factoryId: z.string().min(1),
  reason: z.string().min(1),
});

export const inventoryStockLowPayloadSchema = z.object({
  sku: z.string().min(1),
  currentAtp: z.number().finite(),
  threshold: z.number().finite(),
  suggestedReplenishment: z.number().finite(),
});

export const inventoryReservationExpiredPayloadSchema = z.object({
  grainId: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().finite(),
  ownerId: z.string().min(1),
  tenantId: z.string().optional(),
});

export const inventoryB2b2cAllocationCompletedPayloadSchema = z.object({
  parentGrainId: z.string().min(1),
  targetChannelId: z.string().min(1),
  quantity: z.number().finite(),
  actorId: z.string().min(1),
  tenantId: z.string().min(1),
});

export const storeEslPriceUpdatedPayloadSchema = z.object({
  sku: z.string().min(1),
  shelfId: z.string().min(1),
  newPrice: z.number().finite(),
  oldPrice: z.number().finite(),
});

export const systemGlobalAnomalyDetectedPayloadSchema = z.object({
  targetEventId: z.string().min(1),
  targetEventType: z.string().min(1),
  targetAggregate: z.string().min(1),
  anomalyScore: z.number().finite(),
  confidence: z.number().finite(),
  detectedPatterns: z.array(z.string()),
  recommendedAction: z.enum(['ignore', 'investigate', 'quarantine']),
});
