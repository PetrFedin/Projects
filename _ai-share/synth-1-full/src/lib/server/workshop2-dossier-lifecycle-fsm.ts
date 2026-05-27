import type {
  Workshop2DossierLifecycleState,
  Workshop2DossierPhase1,
  Workshop2DossierRevision,
} from '@/lib/production/workshop2-dossier-phase1.types';

const VALID_TRANSITIONS: Record<Workshop2DossierLifecycleState, Workshop2DossierLifecycleState[]> =
  {
    draft: ['handoff_ready'],
    handoff_ready: ['sent_to_production', 'draft'],
    sent_to_production: ['accepted', 'rework_requested'],
    accepted: [],
    rework_requested: ['draft'],
  };

function canTransition(
  from: Workshop2DossierLifecycleState,
  to: Workshop2DossierLifecycleState
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function applyLifecycleTransition(
  dossier: Workshop2DossierPhase1,
  targetState: Workshop2DossierLifecycleState,
  actorLabel: string,
  comment?: string
):
  | { ok: true; dossier: Workshop2DossierPhase1 }
  | {
      ok: false;
      error: 'lifecycle_transition_forbidden';
      reasonCode: 'FSM_INVALID_TRANSITION';
      fromState: Workshop2DossierLifecycleState;
      toState: Workshop2DossierLifecycleState;
    } {
  const fromState: Workshop2DossierLifecycleState = dossier.lifecycleState ?? 'draft';
  if (fromState === targetState) return { ok: true, dossier };
  if (!canTransition(fromState, targetState)) {
    return {
      ok: false,
      error: 'lifecycle_transition_forbidden',
      reasonCode: 'FSM_INVALID_TRANSITION',
      fromState,
      toState: targetState,
    };
  }
  const revision: Workshop2DossierRevision = {
    revisionId: makeId(),
    state: targetState,
    changedAt: new Date().toISOString(),
    changedBy: actorLabel.slice(0, 200),
    comment,
  };
  return {
    ok: true,
    dossier: {
      ...dossier,
      lifecycleState: targetState,
      revisions: [...(dossier.revisions ?? []), revision],
      updatedAt: revision.changedAt,
      updatedBy: actorLabel.slice(0, 200),
    },
  };
}
