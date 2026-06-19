/**
 * Wave 25 #28: зеркало CR + gate sample-order (fallback live pending list).
 */
import {
  evaluateWorkshop2PendingChangeRequestGate,
  listWorkshop2PendingChangeRequests,
} from '@/lib/production/workshop2-pending-change-requests';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2ChangeRequestMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['changeRequestMirror']> {
  const pending = listWorkshop2PendingChangeRequests(dossier);
  const total = dossier.changeRequests?.length ?? 0;
  const blockerSampleOrder = pending.length > 0;

  return {
    mirroredAt: new Date().toISOString(),
    totalRequests: total,
    pendingCount: pending.length,
    blockerSampleOrder,
    serverWorkflowEnabled: true,
    hintRu: blockerSampleOrder
      ? `Открыто ${pending.length} CR — закройте перед заказом образца.`
      : total > 0
        ? 'Все CR закрыты — можно заказывать образец.'
        : 'CR не создавались.',
  };
}

export function persistWorkshop2ChangeRequestMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    changeRequestMirror: buildWorkshop2ChangeRequestMirror(dossier),
  };
}

export function evaluateWorkshop2ChangeRequestMirrorGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.changeRequestMirror;
  if (!mirror) {
    return evaluateWorkshop2PendingChangeRequestGate(dossier);
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'change_requests.pending',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        `Закройте ${workshop2PgMirrorNum(mirror, 'pendingCount')} запрос(ов) на изменение перед заказом образца.`,
    };
  }
  return null;
}
