/**
 * Готовность блока «Референсы и мудборд» — связь с visual handoff gate.
 */

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { visualRefIsMediaPreview } from '@/lib/production/workshop2-visual-references-utils';
import { getVisualHandoffQuickSummary } from '@/lib/production/workshop2-visual-handoff-export';

export type Workshop2VisualReferencesReadiness = {
  refCount: number;
  mediaRefCount: number;
  openDiscussionCount: number;
  handoffChecklistDone: number;
  handoffChecklistTotal: number;
  readyForVisualGate: boolean;
  blockerRu?: string;
};

/** Минимальный срез досье для блока референсов (без полного Workshop2DossierPhase1 в UI). */
export type Workshop2VisualReferencesReadinessInput = Pick<
  Workshop2DossierPhase1,
  'visualReferences' | 'canonicalMainPhotoRefId' | 'canonicalMainSketchTarget'
> &
  Partial<
    Pick<
      Workshop2DossierPhase1,
      | 'categorySketchAnnotations'
      | 'categorySketchImageDataUrl'
      | 'sketchSheets'
      | 'designerIntent'
      | 'brandNotes'
      | 'visualReadinessChecklist'
    >
  >;

export function countWorkshop2VisualRefOpenDiscussions(
  dossier: Workshop2VisualReferencesReadinessInput | null | undefined
): number {
  let n = 0;
  for (const r of dossier?.visualReferences ?? []) {
    const cs = r.comments ?? [];
    if (cs.length > 0 && cs.some((c) => !c.resolved)) n++;
  }
  return n;
}

export function evaluateWorkshop2VisualReferencesReadiness(
  dossier: Workshop2VisualReferencesReadinessInput | null | undefined
): Workshop2VisualReferencesReadiness {
  const refs = dossier?.visualReferences ?? [];
  const mediaRefCount = refs.filter((r) => visualRefIsMediaPreview(r)).length;
  const openDiscussionCount = countWorkshop2VisualRefOpenDiscussions(dossier);
  const summary = dossier ? getVisualHandoffQuickSummary(dossier as Workshop2DossierPhase1) : null;
  const canonSet = Boolean(
    dossier?.canonicalMainPhotoRefId?.trim() && dossier?.canonicalMainSketchTarget
  );

  const readyForVisualGate =
    mediaRefCount >= 1 &&
    openDiscussionCount === 0 &&
    (canonSet || Boolean(summary?.referenceCount));

  let blockerRu: string | undefined;
  if (mediaRefCount < 1) {
    blockerRu = 'Добавьте хотя бы один референс с превью (фото или видео).';
  } else if (openDiscussionCount > 0) {
    blockerRu = `Закройте обсуждения по референсам (${openDiscussionCount} открыто).`;
  } else if (!canonSet && !summary?.canonicalPhotoAndSketchSet) {
    blockerRu = 'Выберите главное фото и канонический скетч для handoff.';
  }

  return {
    refCount: refs.length,
    mediaRefCount,
    openDiscussionCount,
    handoffChecklistDone: summary?.checklistDone ?? 0,
    handoffChecklistTotal: summary?.checklistTotal ?? 0,
    readyForVisualGate,
    blockerRu,
  };
}
