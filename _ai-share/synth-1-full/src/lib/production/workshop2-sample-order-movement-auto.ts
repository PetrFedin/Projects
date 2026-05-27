/**
 * Авто-синхронизация movement при смене статуса заказа образца.
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import { workshop2SampleOrderStatusToMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';

export type Workshop2SampleMovementLogEntry = {
  at: string;
  from: Workshop2SampleGoodsMovementStatus;
  to: Workshop2SampleGoodsMovementStatus;
  actor?: string;
  reason?: 'order_status_change';
};

export function syncMovementOnSampleOrderStatusChange(input: {
  previousStatus: Workshop2SampleOrderStatus;
  nextStatus: Workshop2SampleOrderStatus;
  previousMovement: Workshop2SampleGoodsMovementStatus;
  movementLog: Workshop2SampleMovementLogEntry[];
  actor?: string;
  at?: string;
}): {
  movementStatus: Workshop2SampleGoodsMovementStatus;
  movementLog: Workshop2SampleMovementLogEntry[];
} {
  const nextMovement = workshop2SampleOrderStatusToMovementStatus(input.nextStatus);
  if (nextMovement === input.previousMovement) {
    return { movementStatus: input.previousMovement, movementLog: input.movementLog };
  }
  const entry: Workshop2SampleMovementLogEntry = {
    at: input.at ?? new Date().toISOString(),
    from: input.previousMovement,
    to: nextMovement,
    actor: input.actor,
    reason: 'order_status_change',
  };
  return {
    movementStatus: nextMovement,
    movementLog: [...input.movementLog, entry],
  };
}
