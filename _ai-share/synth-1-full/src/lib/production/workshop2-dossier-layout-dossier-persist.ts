/**
 * Wave 27 #25: зеркало layout full/dense + gate sample-order warning.
 */
import {
  resolveWorkshop2DossierLayoutPreference,
  type Workshop2DossierLayoutMode,
} from '@/lib/production/workshop2-dossier-layout-mode';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2DossierLayoutMirror(
  dossier: Workshop2DossierPhase1,
  urlParam?: string | null
): NonNullable<Workshop2DossierPhase1['dossierLayoutMirror']> {
  const mode = resolveWorkshop2DossierLayoutPreference({ dossier, urlParam });
  const persistedAt =
    dossier.dossierLayoutPersistedAt ??
    dossier.dossierLayoutMirror?.persistedAt ??
    new Date().toISOString();

  return {
    mirroredAt: new Date().toISOString(),
    mode,
    persistedAt,
    hintRu:
      mode === 'dense'
        ? 'Макет Dense — боковые aside скрыты; handoff через основную колонку.'
        : undefined,
  };
}

export function persistWorkshop2DossierLayoutMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  opts?: { urlParam?: string | null; mode?: Workshop2DossierLayoutMode }
): Workshop2DossierPhase1 {
  const stamped =
    opts?.mode != null
      ? {
          ...dossier,
          dossierLayoutPreference: opts.mode,
          dossierLayoutPersistedAt: new Date().toISOString(),
        }
      : dossier;
  return {
    ...stamped,
    dossierLayoutMirror: buildWorkshop2DossierLayoutMirror(stamped, opts?.urlParam),
  };
}

export function evaluateWorkshop2DossierLayoutSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.dossierLayoutMirror;
  if (!mirror) {
    return {
      id: 'dossier.layout.mirror_missing',
      severity: 'warning',
      messageRu: 'Макет ТЗ не в PG — переключите full/dense или «Layout → PG».',
    };
  }
  return null;
}
