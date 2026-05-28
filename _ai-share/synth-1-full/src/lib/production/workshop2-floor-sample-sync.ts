/**
 * Обратная синхронизация статуса образца с пола → sample order + досье (wave 34).
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import {
  workshop2SampleOrderStatusToMovementStatus,
  workshop2MovementStatusToSampleOrderStatus,
} from '@/lib/production/workshop2-sample-goods-movement';
import { mapWorkshop2FloorTabToSampleOrderStatus } from '@/lib/production/workshop2-floor-bridge-sync';

export { mapWorkshop2FloorTabToSampleOrderStatus } from '@/lib/production/workshop2-floor-bridge-sync';

export function resolveWorkshop2FloorSampleSync(input: {
  floorTab?: string;
  sampleOrderStatus?: Workshop2SampleOrderStatus;
  movementStatus?: Workshop2SampleGoodsMovementStatus;
}): {
  orderStatus: Workshop2SampleOrderStatus;
  movementStatus: Workshop2SampleGoodsMovementStatus;
} {
  if (input.movementStatus) {
    return {
      movementStatus: input.movementStatus,
      orderStatus: workshop2MovementStatusToSampleOrderStatus(input.movementStatus),
    };
  }
  if (input.sampleOrderStatus) {
    return {
      orderStatus: input.sampleOrderStatus,
      movementStatus: workshop2SampleOrderStatusToMovementStatus(input.sampleOrderStatus),
    };
  }
  const fromTab = mapWorkshop2FloorTabToSampleOrderStatus(input.floorTab);
  const orderStatus = fromTab ?? 'draft';
  return {
    orderStatus,
    movementStatus: workshop2SampleOrderStatusToMovementStatus(orderStatus),
  };
}
