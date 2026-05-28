/**
 * Workspace handoff: evaluateWorkshop2HandoffReadiness + честно про gate вкладок.
 */
import {
  evaluateWorkshop2HandoffReadiness,
  type Workshop2HandoffReadinessResult,
} from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2WorkspaceHandoffChecklistStatus = {
  handoff: Workshop2HandoffReadinessResult;
  allTabsBlockedUntilHandoff: false;
  sampleOrderGateOnly: true;
  blockerCount: number;
  state: 'blocked' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2WorkspaceHandoffChecklistStatus(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeafId?: string;
  vaultFileCount: number;
}): Workshop2WorkspaceHandoffChecklistStatus {
  const handoff = evaluateWorkshop2HandoffReadiness({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeafId,
    vaultFileCount: input.vaultFileCount,
  });
  const blockerCount = handoff.checks.filter((c) => c.severity === 'blocker').length;

  let state: Workshop2WorkspaceHandoffChecklistStatus['state'] = 'ready';
  if (!handoff.ready && blockerCount > 0) {
    state = 'blocked';
  } else if (!handoff.ready) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'blocked') {
    const first = handoff.checks.find((c) => c.severity === 'blocker');
    hintRu =
      first?.messageRu ??
      `Handoff: ${blockerCount} блокер(ов); score ${handoff.score10}/10. Вкладки workspace не блокируются целиком — gate на заказ образца.`;
  } else if (state === 'partial') {
    hintRu = `Handoff почти готов (ТЗ ${handoff.tzOverallPct}%, vault ${handoff.vaultFileCount}). Полная блокировка всех вкладок — не включена.`;
  } else {
    hintRu = `Handoff готов: ТЗ ${handoff.tzOverallPct}%, vault ${handoff.vaultFileCount} файл(ов). Gate вкладок — только sample-order, не все вкладки.`;
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
