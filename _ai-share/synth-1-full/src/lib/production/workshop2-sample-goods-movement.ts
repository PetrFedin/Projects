/**
 * Логистика образца: created → in_transit → received (связь с заказом образца и приёмкой).
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import { validateSampleIntakeForCollection } from '@/lib/production/workshop2-sample-intake-gate';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2SampleGoodsMovementStatus = 'created' | 'in_transit' | 'received';

export const WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU: Record<
  Workshop2SampleGoodsMovementStatus,
  string
> = {
  created: 'Создан / ожидает отгрузки',
  in_transit: 'В пути',
  received: 'Принят на склад',
};

const NEXT: Record<Workshop2SampleGoodsMovementStatus, Workshop2SampleGoodsMovementStatus | null> =
  {
    created: 'in_transit',
    in_transit: 'received',
    received: null,
  };

/** Статус заказа образца при смене движения (синхронизация W2 ↔ пол). */
export function workshop2MovementStatusToSampleOrderStatus(
  movement: Workshop2SampleGoodsMovementStatus
): Workshop2SampleOrderStatus {
  switch (movement) {
    case 'created':
      return 'draft';
    case 'in_transit':
      return 'in_progress';
    case 'received':
      return 'received';
    default:
      return 'draft';
  }
}

export function workshop2SampleOrderStatusToMovementStatus(
  orderStatus: Workshop2SampleOrderStatus | string | undefined
): Workshop2SampleGoodsMovementStatus {
  switch (orderStatus) {
    case 'sent':
    case 'in_progress':
      return 'in_transit';
    case 'received':
    case 'approved':
      return 'received';
    default:
      return 'created';
  }
}

export type Workshop2MovementTransitionResult =
  | { ok: true; next: Workshop2SampleGoodsMovementStatus; orderStatus: Workshop2SampleOrderStatus }
  | {
      ok: false;
      error: 'invalid_transition' | 'intake_blocked';
      messageRu: string;
      intakeMissing?: string[];
    };

/** Разрешён ли переход движения; при received — проверка sample intake. */
export function transitionWorkshop2SampleGoodsMovement(input: {
  current: Workshop2SampleGoodsMovementStatus;
  target: Workshop2SampleGoodsMovementStatus;
  dossier?: Workshop2DossierPhase1 | null;
  /** Если false — приёмка на склад без полного intake (только предупреждение в ответе API). */
  strictIntakeOnReceived?: boolean;
}): Workshop2MovementTransitionResult {
  const expected = NEXT[input.current];
  if (expected !== input.target) {
    return {
      ok: false,
      error: 'invalid_transition',
      messageRu: `Нельзя перейти из «${WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[input.current]}» в «${WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[input.target]}». Следующий шаг: ${
        expected ? WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[expected] : '—'
      }`,
    };
  }

  if (input.target === 'received' && input.dossier) {
    const intake = validateSampleIntakeForCollection(input.dossier);
    if (!intake.ok && input.strictIntakeOnReceived !== false) {
      return {
        ok: false,
        error: 'intake_blocked',
        messageRu: 'Приёмка образца на склад заблокирована: не выполнены условия Sample Intake.',
        intakeMissing: intake.missing,
      };
    }
  }

  const orderStatus = workshop2MovementStatusToSampleOrderStatus(input.target);
  return { ok: true, next: input.target, orderStatus };
}

export function getNextWorkshop2SampleMovementStatus(
  current: Workshop2SampleGoodsMovementStatus
): Workshop2SampleGoodsMovementStatus | null {
  return NEXT[current];
}
