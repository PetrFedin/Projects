/**
 * Wave 28 #10: зеркало PG overlay инвентаря + gate sample-order.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2HubInventoryMirror(
  dossier: Workshop2DossierPhase1,
  opts?: { driftDetected?: boolean }
): NonNullable<Workshop2DossierPhase1['hubInventoryMirror']> {
  const hasOverlay = Boolean(dossier.hubPgOverlayAt?.trim());
  const driftDetected = Boolean(opts?.driftDetected);
  const blockerSampleOrder = !hasOverlay;

  let hintRu: string | undefined;
  if (!hasOverlay) {
    hintRu = 'PG overlay хаба не зафиксирован — откройте артикул после синхронизации с сервером.';
  } else if (driftDetected) {
    hintRu = 'Обнаружен drift local↔PG overlay — обновите «Inventory → PG» перед заказом образца.';
  }

  return {
    mirroredAt: new Date().toISOString(),
    hubPgOverlayAt: dossier.hubPgOverlayAt,
    hasOverlay,
    driftDetected,
    blockerSampleOrder,
    hintRu,
  };
}

export function persistWorkshop2HubInventoryMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  opts?: { driftDetected?: boolean }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    hubInventoryMirror: buildWorkshop2HubInventoryMirror(dossier, opts),
  };
}

export function evaluateWorkshop2HubInventoryHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.hubInventoryMirror;
  if (!mirror?.hasOverlay) {
    return {
      id: 'hub.inventory.no_overlay_handoff',
      severity: 'warning',
      messageRu: 'PG overlay инвентаря не зафиксирован — «Inventory → PG» перед handoff.',
    };
  }
  if (mirror.driftDetected === true) {
    return {
      id: 'hub.inventory.drift_handoff',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Drift local↔PG overlay — синхронизируйте перед handoff.',
    };
  }
  return null;
}

export function evaluateWorkshop2HubInventorySampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.hubInventoryMirror;
  if (!mirror) {
    return {
      id: 'hub.inventory.mirror_missing',
      severity: 'warning',
      messageRu: 'Inventory overlay не в PG — «Inventory → PG» после загрузки досье с сервера.',
    };
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'hub.inventory.no_overlay',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Нет PG overlay — sample-order возможен только из local cache.',
    };
  }
  if (mirror.driftDetected === true) {
    return {
      id: 'hub.inventory.drift',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Drift local↔PG — синхронизируйте overlay перед образцом.',
    };
  }
  return null;
}
