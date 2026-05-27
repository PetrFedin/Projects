/**
 * Валидация переходов lifecycleState досье + запись в revisions.
 */
import type {
  Workshop2DossierLifecycleState,
  Workshop2DossierPhase1,
  Workshop2DossierRevision,
} from '@/lib/production/workshop2-dossier-phase1.types';

const ALLOWED_FROM: Record<
  Workshop2DossierLifecycleState,
  readonly Workshop2DossierLifecycleState[]
> = {
  draft: ['handoff_ready', 'rework_requested'],
  handoff_ready: ['draft', 'sent_to_production', 'rework_requested'],
  sent_to_production: ['accepted', 'rework_requested', 'handoff_ready'],
  accepted: ['sent_to_production', 'rework_requested'],
  rework_requested: ['draft', 'handoff_ready'],
};

export type Workshop2LifecycleTransitionResult = {
  allowed: boolean;
  from: Workshop2DossierLifecycleState;
  to: Workshop2DossierLifecycleState;
  messageRu?: string;
};

export function normalizeWorkshop2LifecycleState(
  value: string | undefined | null
): Workshop2DossierLifecycleState {
  const v = value?.trim() as Workshop2DossierLifecycleState | undefined;
  if (v && v in ALLOWED_FROM) return v;
  return 'draft';
}

export function validateWorkshop2LifecycleTransition(
  from: Workshop2DossierLifecycleState | undefined,
  to: Workshop2DossierLifecycleState | undefined
): Workshop2LifecycleTransitionResult {
  const fromState = normalizeWorkshop2LifecycleState(from ?? 'draft');
  const toState = normalizeWorkshop2LifecycleState(to ?? 'draft');
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
      : `Переход lifecycle «${fromState}» → «${toState}» запрещён. Допустимо: ${(ALLOWED_FROM[fromState] ?? []).join(', ') || '—'}.`,
  };
}

export function applyWorkshop2LifecycleTransition(
  dossier: Workshop2DossierPhase1,
  to: Workshop2DossierLifecycleState,
  actor?: string
): { dossier: Workshop2DossierPhase1; transition: Workshop2LifecycleTransitionResult } {
  const from = normalizeWorkshop2LifecycleState(dossier.lifecycleState);
  const transition = validateWorkshop2LifecycleTransition(from, to);
  if (!transition.allowed) {
    return { dossier, transition };
  }
  if (from === to) {
    return { dossier, transition };
  }
  const now = new Date().toISOString();
  const by = actor?.trim().slice(0, 120) || dossier.updatedBy || 'system';
  const revision: Workshop2DossierRevision = {
    revisionId: `lc-${Date.now().toString(36)}`,
    state: to,
    changedAt: now,
    changedBy: by,
    comment: `lifecycle: ${from} → ${to}`,
  };
  const revisions = [...(dossier.revisions ?? []), revision].slice(-50);
  return {
    dossier: {
      ...dossier,
      lifecycleState: to,
      revisions,
      updatedAt: now,
      updatedBy: by,
    },
    transition,
  };
}
