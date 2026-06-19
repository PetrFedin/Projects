/**
 * Wave 22 #54: зеркало fit sessions в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import {
  summarizeWorkshop2FitSessionsStatus,
  type Workshop2FitSessionsStatus,
} from '@/lib/production/workshop2-fit-sessions-status';
import type { FitSession } from '@/lib/production/article-workspace/types';

export function buildWorkshop2FitSessionsMirrorFromStatus(
  status: Workshop2FitSessionsStatus
): NonNullable<Workshop2DossierPhase1['fitSessionsMirror']> {
  const blockerSampleOrder = status.state === 'empty';

  const blockerHandoff = status.state === 'empty';

  return {
    mirroredAt: new Date().toISOString(),
    sessionCount: status.sessionCount,
    withVaultPhotoCount: status.withVaultPhotoCount,
    approvedCount: status.approvedCount,
    state: status.state,
    blockerSampleOrder,
    blockerHandoff,
    hintRu: status.hintRu,
  };
}

export function evaluateWorkshop2FitSessionsHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.fitSessionsMirror;
  if (!mirror) {
    return {
      id: 'fit.sessions.mirror_missing_handoff',
      severity: 'blocker',
      messageRu: 'Сессии примерки не в досье — сохраните «Fit → PG» перед handoff.',
    };
  }
  if (mirror.blockerHandoff === true) {
    return {
      id: 'fit.sessions.empty_handoff',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Нет сессий примерки — handoff commit заблокирован.',
    };
  }
  return null;
}

export function persistWorkshop2FitSessionsMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  sessions: FitSession[]
): Workshop2DossierPhase1 {
  const status = summarizeWorkshop2FitSessionsStatus({ sessions });
  return {
    ...dossier,
    fitSessionsMirror: buildWorkshop2FitSessionsMirrorFromStatus(status),
  };
}

export function evaluateWorkshop2FitSessionsSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.fitSessionsMirror;
  if (!mirror) {
    return {
      id: 'fit.sessions.mirror_missing',
      severity: 'warning',
      messageRu: 'Сессии примерки не в досье — сохраните «Fit → PG» на вкладке Примерка.',
    };
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'fit.sessions.empty',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Нет сессий примерки — рекомендуется proto/SMS перед образцом.',
    };
  }
  if (mirror.state === 'partial') {
    return {
      id: 'fit.sessions.partial',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Сессии без vault-фото — AI/дельты посадки могут быть неполными.',
    };
  }
  return null;
}
