/**
 * Движение образца: FSM + intake block на received + movement_log.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getNextWorkshop2SampleMovementStatus,
  transitionWorkshop2SampleGoodsMovement,
  WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU,
  type Workshop2SampleGoodsMovementStatus,
} from '@/lib/production/workshop2-sample-goods-movement';

export type Workshop2SampleMovementSummary = {
  movement: Workshop2SampleGoodsMovementStatus;
  next: Workshop2SampleGoodsMovementStatus | null;
  hasSampleOrder: boolean;
  movementLogEntries: number;
  receivedBlockedByIntake: boolean;
  state: 'no_order' | 'created' | 'in_transit' | 'received' | 'intake_blocked';
  hintRu?: string;
};

export function summarizeWorkshop2SampleMovementStatus(input: {
  hasSampleOrder: boolean;
  movement: Workshop2SampleGoodsMovementStatus;
  movementLogEntries: number;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2SampleMovementSummary {
  const next = getNextWorkshop2SampleMovementStatus(input.movement);
  const receivedProbe =
    input.movement === 'in_transit'
      ? transitionWorkshop2SampleGoodsMovement({
          current: input.movement,
          target: 'received',
          dossier: input.dossier,
        })
      : null;
  const receivedBlockedByIntake =
    receivedProbe?.ok === false && receivedProbe.error === 'intake_blocked';

  let state: Workshop2SampleMovementSummary['state'] = 'created';
  if (!input.hasSampleOrder) {
    state = 'no_order';
  } else if (receivedBlockedByIntake) {
    state = 'intake_blocked';
  } else if (input.movement === 'received') {
    state = 'received';
  } else if (input.movement === 'in_transit') {
    state = 'in_transit';
  }

  let hintRu: string | undefined;
  if (state === 'no_order') {
    hintRu = 'Нет sample-order — создайте заказ на вкладке «Примерка».';
  } else if (state === 'intake_blocked') {
    hintRu =
      receivedProbe && !receivedProbe.ok
        ? receivedProbe.messageRu
        : 'Переход received заблокирован Sample Intake.';
  } else if (state === 'received') {
    hintRu = `На складе · ${input.movementLogEntries} записей movement_log · inspector link доступен.`;
  } else if (next) {
    hintRu = `Следующий шаг: ${WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[next]} (PATCH movement API + auto order status).`;
  } else {
    hintRu = WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[input.movement];
  }

  return {
    movement: input.movement,
    next,
    hasSampleOrder: input.hasSampleOrder,
    movementLogEntries: input.movementLogEntries,
    receivedBlockedByIntake,
    state,
    hintRu,
  };
}
