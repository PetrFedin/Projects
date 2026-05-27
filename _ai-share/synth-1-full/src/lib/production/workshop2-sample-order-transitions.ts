/**
 * Допустимые переходы статуса заказа образца (workshop2_sample_orders).
 * Используется POST .../sample-order/[orderId]/transition и UI «Следующий шаг».
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';

const ALLOWED_FROM: Record<Workshop2SampleOrderStatus, readonly Workshop2SampleOrderStatus[]> = {
  draft: ['sent', 'cancelled'],
  sent: ['in_progress', 'cancelled'],
  in_progress: ['received', 'cancelled'],
  received: ['approved', 'cancelled'],
  approved: [],
  cancelled: ['draft'],
};

export type Workshop2SampleOrderTransitionResult = {
  allowed: boolean;
  from: Workshop2SampleOrderStatus;
  to: Workshop2SampleOrderStatus;
  messageRu?: string;
};

export function normalizeWorkshop2SampleOrderStatus(
  value: string | undefined | null
): Workshop2SampleOrderStatus | null {
  const v = value?.trim() as Workshop2SampleOrderStatus | undefined;
  if (!v) return null;
  if (v in ALLOWED_FROM) return v;
  return null;
}

export function validateWorkshop2SampleOrderTransition(
  from: Workshop2SampleOrderStatus | string | undefined,
  to: Workshop2SampleOrderStatus | string | undefined
): Workshop2SampleOrderTransitionResult {
  const fromState = normalizeWorkshop2SampleOrderStatus(from ?? '') ?? 'draft';
  const toState = normalizeWorkshop2SampleOrderStatus(to ?? '');
  if (!toState) {
    return {
      allowed: false,
      from: fromState,
      to: 'draft',
      messageRu: 'Некорректный целевой статус заказа образца.',
    };
  }
  if (fromState === toState) {
    return { allowed: true, from: fromState, to: toState };
  }
  const allowed = ALLOWED_FROM[fromState]?.includes(toState) ?? false;
  return {
    allowed,
    from: fromState,
    to: toState,
    messageRu: allowed
      ? undefined
      : `Переход «${fromState}» → «${toState}» запрещён. Допустимо: ${(ALLOWED_FROM[fromState] ?? []).join(', ') || '—'}.`,
  };
}

/** Следующий статус по happy-path (без cancelled). */
export function getNextWorkshop2SampleOrderStatus(
  current: Workshop2SampleOrderStatus | string | undefined
): Workshop2SampleOrderStatus | null {
  const from = normalizeWorkshop2SampleOrderStatus(current ?? '');
  if (!from) return null;
  const happy: Partial<Record<Workshop2SampleOrderStatus, Workshop2SampleOrderStatus>> = {
    draft: 'sent',
    sent: 'in_progress',
    in_progress: 'received',
    received: 'approved',
  };
  return happy[from] ?? null;
}

export function listAllowedWorkshop2SampleOrderTransitions(
  from: Workshop2SampleOrderStatus | string | undefined
): Workshop2SampleOrderStatus[] {
  const fromState = normalizeWorkshop2SampleOrderStatus(from ?? '') ?? 'draft';
  return [...(ALLOWED_FROM[fromState] ?? [])];
}
