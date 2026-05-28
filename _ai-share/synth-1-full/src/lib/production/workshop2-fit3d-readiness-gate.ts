/**
 * Fit3D: честная готовность vault/CAD без mock-as-success в production (wave 18 #55).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { resolveWorkshop2Fit3dModel } from '@/lib/production/workshop2-fit-3d-model-resolve';

export function evaluateWorkshop2Fit3dReadinessGate(input: {
  cadVersionId?: string | null;
  collectionId?: string;
  articleId?: string;
  waived?: boolean;
}): Workshop2HandoffReadinessCheck | null {
  if (input.waived) return null;
  const resolution = resolveWorkshop2Fit3dModel({
    cadVersionId: input.cadVersionId,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  if (!resolution.isPlaceholder && !resolution.placeholderBlockedInProd) {
    return null;
  }
  if (resolution.placeholderBlockedInProd) {
    return {
      id: 'fit3d.placeholder.blocked_prod',
      severity: 'warning',
      messageRu: resolution.hintRu,
    };
  }
  if (!input.cadVersionId?.trim()) {
    return {
      id: 'fit3d.cad.missing',
      severity: 'warning',
      messageRu: resolution.hintRu,
    };
  }
  return null;
}

export function buildWorkshop2Fit3dReadinessRecord(input: {
  dossier: Workshop2DossierPhase1;
  cadVersionId?: string | null;
  collectionId?: string;
  articleId?: string;
  waived?: boolean;
}): NonNullable<Workshop2DossierPhase1['fit3dReadiness']> {
  const check = evaluateWorkshop2Fit3dReadinessGate({
    cadVersionId: input.cadVersionId ?? input.dossier.fit3dReadiness?.cadVersionId,
    collectionId: input.collectionId,
    articleId: input.articleId,
    waived: input.waived ?? input.dossier.fit3dReadiness?.waived,
  });
  const resolution = resolveWorkshop2Fit3dModel({
    cadVersionId: input.cadVersionId,
    collectionId: input.collectionId,
    articleId: input.articleId,
    forceEnable: input.dossier.fit3dReadiness?.waived,
  });
  return {
    validatedAt: new Date().toISOString(),
    state:
      check?.severity === 'blocker'
        ? 'blocked'
        : resolution.isPlaceholder
          ? 'placeholder'
          : 'vault',
    cadVersionId: input.cadVersionId ?? undefined,
    waived: input.waived,
    viewerEnabled: resolution.viewerEnabled,
    hintRu: check?.messageRu ?? resolution.hintRu,
  };
}
