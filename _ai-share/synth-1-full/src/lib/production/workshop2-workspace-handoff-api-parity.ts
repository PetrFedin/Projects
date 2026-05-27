/**
 * Wave W — parity workspace header handoff chip с GET /handoff-readiness (sample-order gate).
 */
import type { Workshop2HandoffReadinessResult } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2WorkspaceHandoffChecklistStatus } from '@/lib/production/workshop2-workspace-handoff-checklist-status';

export type Workshop2HandoffReadinessApiPayload = Workshop2HandoffReadinessResult & {
  ok?: boolean;
  allowed?: boolean;
  gateScope?: string;
};

/** Маппинг ответа API → chip status (без client-side drift от evaluateWorkshop2HandoffReadiness). */
export function summarizeWorkshop2WorkspaceHandoffFromApiPayload(
  payload: Workshop2HandoffReadinessApiPayload
): Workshop2WorkspaceHandoffChecklistStatus {
  const handoff: Workshop2HandoffReadinessResult = {
    ready: payload.ready,
    vaultFileCount: payload.vaultFileCount,
    tzOverallPct: payload.tzOverallPct,
    preflightScore: payload.preflightScore,
    checks: payload.checks,
    score10: payload.score10,
  };
  const blockerCount = handoff.checks.filter((c) => c.severity === 'blocker').length;
  const gateBlocked = payload.allowed === false;

  let state: Workshop2WorkspaceHandoffChecklistStatus['state'] = 'ready';
  if (gateBlocked || (!handoff.ready && blockerCount > 0)) {
    state = 'blocked';
  } else if (!handoff.ready) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'blocked') {
    const first = handoff.checks.find((c) => c.severity === 'blocker');
    hintRu =
      first?.messageRu ??
      `Handoff API (${payload.gateScope ?? 'sample_order'}): ${blockerCount} блокер(ов); score ${handoff.score10}/10.`;
  } else if (state === 'partial') {
    hintRu = `Handoff API: почти готов (ТЗ ${handoff.tzOverallPct}%, vault ${handoff.vaultFileCount}). Gate — sample-order.`;
  } else {
    hintRu = `Handoff API: готов · score ${handoff.score10}/10 · vault ${handoff.vaultFileCount} файл(ов).`;
  }

  return {
    handoff,
    allTabsBlockedUntilHandoff: false,
    sampleOrderGateOnly: true,
    blockerCount,
    state,
    hintRu,
  };
}
