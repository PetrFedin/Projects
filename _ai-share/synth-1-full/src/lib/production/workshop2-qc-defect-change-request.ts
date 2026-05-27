/**
 * M6.2: major/critical дефект → auto-draft Change Request.
 */
import { persistWorkshop2ChangeRequestMirrorToDossier } from '@/lib/production/workshop2-change-request-dossier-persist';
import type {
  Workshop2ChangeRequest,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2PendingChangeRequestGate } from '@/lib/production/workshop2-pending-change-requests';

export function shouldAutoDraftWorkshop2QcChangeRequest(severity: string | undefined): boolean {
  const s = (severity ?? '').trim().toLowerCase();
  return s === 'major' || s === 'critical';
}

export function appendWorkshop2QcAutoChangeRequest(
  dossier: Workshop2DossierPhase1,
  input: {
    defectCode: string;
    defectLabel?: string;
    severity: 'major' | 'critical';
    source: 'mes' | 'visual_qc';
  }
): Workshop2DossierPhase1 {
  const description = `Авто-CR (${input.source}): ${input.defectLabel ?? input.defectCode} [${input.severity}]`;
  const cr: Workshop2ChangeRequest = {
    id: `cr-qc-${Date.now().toString(36)}`,
    description: description.slice(0, 500),
    priority: input.severity === 'critical' ? 'High' : 'Medium',
    status: 'pending',
    requestedBy: 'qc-auto',
    createdAt: new Date().toISOString(),
    targetNode: 'qc',
  };
  const withCrs = {
    ...dossier,
    changeRequests: [...(dossier.changeRequests ?? []), cr],
  };
  return persistWorkshop2ChangeRequestMirrorToDossier(withCrs);
}

/** Блок повторного заказа образца при открытых CR (reorder). */
export function evaluateWorkshop2PendingChangeRequestReorderGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const gate = evaluateWorkshop2PendingChangeRequestGate(dossier);
  if (!gate) return null;
  return {
    ...gate,
    id: 'change_requests.pending_reorder',
    messageRu:
      gate.messageRu.replace('перед заказом образца', 'перед повторным заказом образца') ??
      'Открытые CR — повторный заказ образца заблокирован.',
  };
}
