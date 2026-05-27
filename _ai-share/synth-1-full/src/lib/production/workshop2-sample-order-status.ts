/**
 * Заказ образца: handoff gate + PG sample-order (критический путь).
 */
import {
  evaluateWorkshop2SampleOrderGate,
  type Workshop2SampleOrderGateResult,
} from '@/lib/production/workshop2-sample-order-gate';
import type { Workshop2HandoffReadinessInput } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2SampleOrderStatus = {
  gateAllowed: boolean;
  handoffScore10: number;
  activeOrderCount: number;
  activeOrderStatus?: string;
  movementStatus?: string;
  state: 'blocked' | 'ready_no_order' | 'in_progress' | 'complete';
  hintRu?: string;
};

export function summarizeWorkshop2SampleOrderStatus(input: {
  handoffInput: Workshop2HandoffReadinessInput;
  activeOrderCount: number;
  activeOrderStatus?: string;
  movementStatus?: string;
  /** true когда список заказов с GET sample-order API (PG или memory repo в тестах). */
  pgBacked: boolean;
  /** Опционально: уже получен gate с API handoff-readiness. */
  gateFromApi?: Workshop2SampleOrderGateResult | null;
}): Workshop2SampleOrderStatus {
  const gate = input.gateFromApi ?? evaluateWorkshop2SampleOrderGate(input.handoffInput);
  const gateAllowed = gate.allowed;

  let state: Workshop2SampleOrderStatus['state'] = 'ready_no_order';
  if (!gateAllowed) {
    state = 'blocked';
  } else if (input.activeOrderCount === 0) {
    state = 'ready_no_order';
  } else if (input.activeOrderStatus === 'received' || input.activeOrderStatus === 'approved') {
    state = 'complete';
  } else {
    state = 'in_progress';
  }

  let hintRu: string | undefined;
  if (!gateAllowed) {
    const blocker = gate.readiness.checks.find((c) => c.severity === 'blocker');
    hintRu =
      blocker?.messageRu ??
      `Handoff ${gate.readiness.score10}/10 — заказ образца вернёт 409 без vault/ТЗ.`;
  } else if (input.activeOrderCount === 0) {
    hintRu = `Handoff готов (${gate.readiness.score10}/10) — создайте заказ; API ${input.pgBacked ? 'PG' : 'offline'}.`;
  } else if (state === 'complete') {
    hintRu = `Заказ ${input.activeOrderStatus} · движение ${input.movementStatus ?? '—'} → intake/склад.`;
  } else {
    hintRu = `Активный заказ: ${input.activeOrderStatus ?? 'draft'}; PATCH статуса синхронизирует movement_log.`;
  }

  return {
    gateAllowed,
    handoffScore10: gate.readiness.score10,
    activeOrderCount: input.activeOrderCount,
    activeOrderStatus: input.activeOrderStatus,
    movementStatus: input.movementStatus,
    state,
    hintRu,
  };
}
