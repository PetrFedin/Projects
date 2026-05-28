/**
 * M6.1: дефект ОТК → черновик метки на скетче (sketchPropagatedDrafts).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2SketchPropagatedDraft,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function appendWorkshop2QcDefectSketchPropagatedDraft(
  dossier: Workshop2DossierPhase1,
  input: {
    defectLabel: string;
    pinId: string;
    severity?: string;
  }
): Workshop2DossierPhase1 {
  const draft: Workshop2SketchPropagatedDraft = {
    draftId: `qc-sk-${Date.now().toString(36)}`,
    kind: 'qc',
    text: `[ОТК] ${input.defectLabel}${input.severity ? ` · ${input.severity}` : ''}`,
    fromAnnotationId: input.pinId,
    createdAt: new Date().toISOString(),
  };
  const prev = dossier.sketchPropagatedDrafts ?? [];
  return {
    ...dossier,
    sketchPropagatedDrafts: [draft, ...prev].slice(0, 80),
  };
}
