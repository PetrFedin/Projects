/**
 * Wave 24 #16: зеркало merge категории при edit + gate sample-order warning.
 */
import type { Workshop2AssemblyMergeDiff } from '@/lib/production/workshop2-article-assembler';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2CategoryMergeMirror(input: {
  categoryLeafId: string;
  mergeDiff: Workshop2AssemblyMergeDiff;
}): NonNullable<Workshop2DossierPhase1['categoryMergeMirror']> {
  const orphanCount = input.mergeDiff.orphanFilledAttributeIds.length;
  const blockerSampleOrder = orphanCount > 0;

  return {
    mirroredAt: new Date().toISOString(),
    categoryLeafId: input.categoryLeafId,
    hasChanges: input.mergeDiff.hasChanges,
    orphanAttributeCount: orphanCount,
    warningCount: input.mergeDiff.warningsRu.length,
    blockerSampleOrder,
    hintRu: blockerSampleOrder
      ? `${orphanCount} canonical-атрибутов станут сиротами после смены листа — проверьте матрицу.`
      : input.mergeDiff.warningsRu[0],
  };
}

export function persistWorkshop2CategoryMergeMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: { categoryLeafId: string; mergeDiff: Workshop2AssemblyMergeDiff }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    categoryMergeMirror: buildWorkshop2CategoryMergeMirror(input),
  };
}

export function evaluateWorkshop2CategoryMergeSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.categoryMergeMirror;
  if (!mirror) return null;
  if (mirror.blockerSampleOrder) {
    return {
      id: 'category.merge.orphans',
      severity: 'warning',
      messageRu:
        mirror.hintRu ??
        'После смены категории остались сиротские атрибуты — очистите или переназначьте.',
    };
  }
  return null;
}

/** Wave 26 #16: blocker handoff-commit при сиротах после merge (2-й слой). */
export function evaluateWorkshop2CategoryMergeHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.categoryMergeMirror;
  if (!mirror) return null;
  if (mirror.blockerSampleOrder) {
    return {
      id: 'category.merge.orphans',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Сиротские атрибуты после смены категории — handoff commit заблокирован.',
    };
  }
  return null;
}
