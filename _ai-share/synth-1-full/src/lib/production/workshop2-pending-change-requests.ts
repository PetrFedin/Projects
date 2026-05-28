/**
 * Блокировки workflow при незакрытых CR в досье.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2ChangeRequestPending } from '@/lib/production/workshop2-change-request-workflow';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function listWorkshop2PendingChangeRequests(
  dossier: Workshop2DossierPhase1
): { id: string; description: string }[] {
  return (dossier.changeRequests ?? [])
    .filter((cr) => isWorkshop2ChangeRequestPending(cr.status))
    .map((cr) => ({
      id: cr.id,
      description: cr.description.slice(0, 120),
    }));
}

export function evaluateWorkshop2PendingChangeRequestGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const pending = listWorkshop2PendingChangeRequests(dossier);
  if (pending.length === 0) return null;
  return {
    id: 'change_requests.pending',
    severity: 'blocker',
    messageRu: `Закройте ${pending.length} запрос(ов) на изменение (CR) перед заказом образца: ${pending
      .map((p) => p.id.slice(0, 8))
      .join(', ')}.`,
  };
}

export function evaluateWorkshop2PendingChangeRequestHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const pending = listWorkshop2PendingChangeRequests(dossier);
  if (pending.length === 0) return null;
  return {
    id: 'change_requests.pending_handoff',
    severity: 'blocker',
    messageRu: `Откройтые CR (${pending.length}) — approve/reject через API перед handoff.`,
  };
}
