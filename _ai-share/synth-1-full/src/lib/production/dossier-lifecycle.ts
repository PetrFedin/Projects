/**
 * Управление жизненным циклом досье ТЗ.
 *
 * Состояния:
 *   draft → handoff_ready → sent_to_production → accepted
 *                        ↓                        ↑
 *                  rework_requested ───────────────┘
 */

import type {
  Workshop2DossierPhase1,
  Workshop2DossierLifecycleState,
  Workshop2DossierRevision,
  Workshop2DossierApprovalRecord,
} from './workshop2-dossier-phase1.types';
import {
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from './workshop2-phase1-dossier-storage';

function newRevisionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function newApprovalId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `apr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<Workshop2DossierLifecycleState, Workshop2DossierLifecycleState[]> = {
  draft: ['handoff_ready'],
  handoff_ready: ['sent_to_production', 'draft'],
  sent_to_production: ['accepted', 'rework_requested'],
  accepted: [],
  rework_requested: ['draft'],
};

export function canTransition(
  from: Workshop2DossierLifecycleState,
  to: Workshop2DossierLifecycleState
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAvailableTransitions(
  state: Workshop2DossierLifecycleState
): Workshop2DossierLifecycleState[] {
  return VALID_TRANSITIONS[state] ?? [];
}

export function getLifecycleStateLabel(state: Workshop2DossierLifecycleState): string {
  switch (state) {
    case 'draft': return 'Черновик';
    case 'handoff_ready': return 'Готово к передаче';
    case 'sent_to_production': return 'Передано в производство';
    case 'accepted': return 'Принято';
    case 'rework_requested': return 'Возврат на доработку';
  }
}

export function getLifecycleStateBadgeClass(state: Workshop2DossierLifecycleState): string {
  switch (state) {
    case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'handoff_ready': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'sent_to_production': return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'accepted': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'rework_requested': return 'bg-rose-50 text-rose-800 border-rose-200';
  }
}

// ---------------------------------------------------------------------------
// Transition execution
// ---------------------------------------------------------------------------

export type TransitionResult = {
  success: boolean;
  error?: string;
  dossier: Workshop2DossierPhase1;
};

export function transitionDossierState(
  collectionId: string,
  articleId: string,
  targetState: Workshop2DossierLifecycleState,
  changedBy: string,
  comment?: string
): TransitionResult {
  const dossier = getWorkshop2Phase1Dossier(collectionId, articleId);
  if (!dossier) {
    return {
      success: false,
      error: 'Досье не найдено.',
      dossier: { schemaVersion: 1, assignments: [] },
    };
  }

  const currentState: Workshop2DossierLifecycleState = dossier.lifecycleState ?? 'draft';
  if (!canTransition(currentState, targetState)) {
    return {
      success: false,
      error: `Переход из «${getLifecycleStateLabel(currentState)}» в «${getLifecycleStateLabel(targetState)}» не разрешён.`,
      dossier,
    };
  }

  const revision: Workshop2DossierRevision = {
    revisionId: newRevisionId(),
    state: targetState,
    changedAt: new Date().toISOString(),
    changedBy,
    comment,
  };

  const updated: Workshop2DossierPhase1 = {
    ...dossier,
    lifecycleState: targetState,
    revisions: [...(dossier.revisions ?? []), revision],
    updatedAt: revision.changedAt,
    updatedBy: changedBy,
  };

  setWorkshop2Phase1Dossier(collectionId, articleId, updated);
  return { success: true, dossier: updated };
}

// ---------------------------------------------------------------------------
// Approval management
// ---------------------------------------------------------------------------

export function addApprovalRecord(
  collectionId: string,
  articleId: string,
  record: Omit<Workshop2DossierApprovalRecord, 'approvalId'>
): Workshop2DossierPhase1 | null {
  const dossier = getWorkshop2Phase1Dossier(collectionId, articleId);
  if (!dossier) return null;

  const approval: Workshop2DossierApprovalRecord = {
    ...record,
    approvalId: newApprovalId(),
  };

  const updated: Workshop2DossierPhase1 = {
    ...dossier,
    approvalRecords: [...(dossier.approvalRecords ?? []), approval],
    updatedAt: new Date().toISOString(),
  };

  setWorkshop2Phase1Dossier(collectionId, articleId, updated);
  return updated;
}

export function getLatestApprovalByRole(
  dossier: Workshop2DossierPhase1,
  role: Workshop2DossierApprovalRecord['role']
): Workshop2DossierApprovalRecord | undefined {
  const records = dossier.approvalRecords ?? [];
  return records.filter((r) => r.role === role).at(-1);
}

export function getLatestApprovalBySection(
  dossier: Workshop2DossierPhase1,
  section: string
): Workshop2DossierApprovalRecord | undefined {
  const records = dossier.approvalRecords ?? [];
  return records.filter((r) => r.section === section).at(-1);
}

// ---------------------------------------------------------------------------
// Revision history helpers
// ---------------------------------------------------------------------------

export function getRevisionHistory(
  dossier: Workshop2DossierPhase1
): Workshop2DossierRevision[] {
  return dossier.revisions ?? [];
}

export function getLastRevision(
  dossier: Workshop2DossierPhase1
): Workshop2DossierRevision | undefined {
  return (dossier.revisions ?? []).at(-1);
}
