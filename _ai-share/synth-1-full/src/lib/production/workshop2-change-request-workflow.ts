/**
 * Workflow approve/reject для CR в досье (PG PUT через API route).
 */
import { appendWorkshop2TzDossierEditLog } from '@/lib/production/workshop2-dossier-activity-log';
import type {
  Workshop2ChangeRequest,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2ChangeRequestDecision = 'approved' | 'rejected';

const PENDING_STATUSES = new Set(['pending', 'open', 'submitted']);

export function isWorkshop2ChangeRequestPending(status: string | undefined): boolean {
  const s = (status ?? '').trim().toLowerCase();
  return PENDING_STATUSES.has(s) || s === '';
}

export function applyWorkshop2ChangeRequestDecision(input: {
  dossier: Workshop2DossierPhase1;
  changeRequestId: string;
  decision: Workshop2ChangeRequestDecision;
  decidedBy: string;
}): { dossier: Workshop2DossierPhase1; changeRequest?: Workshop2ChangeRequest } | null {
  const list = input.dossier.changeRequests ?? [];
  const idx = list.findIndex((c) => c.id === input.changeRequestId);
  if (idx === -1) return null;
  const prev = list[idx]!;
  if (!isWorkshop2ChangeRequestPending(prev.status)) return null;

  const decidedAt = new Date().toISOString();
  const nextCr: Workshop2ChangeRequest = {
    ...prev,
    status: input.decision,
    decidedBy: input.decidedBy,
    decidedAt,
    requestedBy: prev.requestedBy ?? input.decidedBy,
  };
  const nextList = list.map((c, i) => (i === idx ? nextCr : c));
  const withCrs = { ...input.dossier, changeRequests: nextList };
  const dossier = appendWorkshop2TzDossierEditLog(withCrs, input.decidedBy, [
    `CR ${input.decision}: ${prev.description.slice(0, 200)}`,
    ...(prev.targetNode ? [`Узел: ${prev.targetNode}`] : []),
  ]);

  return {
    dossier,
    changeRequest: nextCr,
  };
}
