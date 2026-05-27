/**
 * Wave 23 #34: зеркало InfoPick matrix gaps + gate sample-order.
 */
import { evaluateWorkshop2InfoPickMatrixFillGaps } from '@/lib/production/workshop2-infopick-matrix-fill-gaps';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2InfopickMatrixMirror(
  dossier: Workshop2DossierPhase1,
  categoryLeafId: string
): NonNullable<Workshop2DossierPhase1['infopickMatrixMirror']> {
  const gaps = evaluateWorkshop2InfoPickMatrixFillGaps(dossier, categoryLeafId);
  const missingMatrixCount = gaps?.missingMatrixCount ?? 0;
  const blockerSampleOrder = missingMatrixCount > 0;

  return {
    mirroredAt: new Date().toISOString(),
    leafId: categoryLeafId,
    totalRequired: gaps?.totalRequired ?? 0,
    missingCount: gaps?.missingCount ?? 0,
    missingMatrixCount,
    blockerSampleOrder,
    hintRu: gaps?.hintRu,
  };
}

export function persistWorkshop2InfopickMatrixMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  categoryLeafId: string
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    infopickMatrixMirror: buildWorkshop2InfopickMatrixMirror(dossier, categoryLeafId),
  };
}

export function evaluateWorkshop2InfopickMatrixMirrorGate(
  dossier: Workshop2DossierPhase1,
  categoryLeafId?: string
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.infopickMatrixMirror;
  if (!mirror) {
    const gaps = evaluateWorkshop2InfoPickMatrixFillGaps(dossier, categoryLeafId);
    if (gaps && gaps.missingMatrixCount > 0) {
      return {
        id: 'infopick.matrix.required',
        severity: 'blocker',
        messageRu:
          gaps.hintRu ??
          `Заполните ${gaps.missingMatrixCount} обязательных полей матрицы InfoPick.`,
      };
    }
    return {
      id: 'infopick.matrix.mirror_missing',
      severity: 'warning',
      messageRu: 'Матрица InfoPick не в PG — «Матрица → PG» в паспорте.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'infopick.matrix.required',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ??
        `Заполните ${mirror.missingMatrixCount} обязательных полей матрицы InfoPick.`,
    };
  }
  return null;
}
