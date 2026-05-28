/**
 * Wave 21 #7: зеркало backend health (хаб banner) в досье + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { isWorkshop2FilePersistStoreMode } from '@/lib/production/workshop2-dossier-store-mode';

export function buildWorkshop2BackendHealthMirror(input: {
  healthOk: boolean;
  postgres?: string;
  storeMode?: string;
}): NonNullable<Workshop2DossierPhase1['backendHealthMirror']> {
  const serverOk =
    input.healthOk && (input.postgres === 'ok' || input.storeMode === 'server_postgres');
  const storeMode: 'server' | 'offline' | 'local' = serverOk
    ? 'server'
    : input.healthOk
      ? 'local'
      : 'offline';

  let hintRu: string | undefined;
  if (storeMode === 'offline') {
    hintRu = 'API /health недоступен — sample-order только с local cache.';
  } else if (storeMode === 'local') {
    hintRu = isWorkshop2FilePersistStoreMode(input.storeMode)
      ? 'PostgreSQL недоступен — досье на файловом сервере (не PG primary). Поднимите PG: bash scripts/workshop2-pg-bootstrap.sh'
      : 'Досье не на server_postgres — проверьте WORKSHOP2_DATABASE_URL.';
  }

  const blockerSampleOrder = storeMode !== 'server';

  return {
    mirroredAt: new Date().toISOString(),
    storeMode,
    healthOk: Boolean(input.healthOk),
    blockerSampleOrder,
    blockerHandoff: blockerSampleOrder,
    hintRu,
  };
}

export function evaluateWorkshop2BackendHealthHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.backendHealthMirror;
  if (!mirror) {
    return {
      id: 'backend.health.mirror_missing_handoff',
      severity: 'warning',
      messageRu: 'Backend health не зафиксирован в досье — обновите перед handoff commit.',
    };
  }
  if (mirror.blockerHandoff) {
    return {
      id: 'backend.health.not_server_handoff',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Серверный режим досье недоступен — handoff commit заблокирован.',
    };
  }
  return null;
}

export function persistWorkshop2BackendHealthMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: { healthOk: boolean; postgres?: string; storeMode?: string }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    backendHealthMirror: buildWorkshop2BackendHealthMirror(input),
  };
}

export function evaluateWorkshop2BackendHealthSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.backendHealthMirror;
  if (!mirror) {
    return {
      id: 'backend.health.mirror_missing',
      severity: 'warning',
      messageRu: 'Backend health не зафиксирован в досье — откройте артикул после проверки API.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'backend.health.not_server',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Серверный режим досье недоступен — заказ образца на PG заблокирован.',
    };
  }
  return null;
}
