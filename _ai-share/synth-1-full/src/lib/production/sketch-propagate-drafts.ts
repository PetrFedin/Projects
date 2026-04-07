import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchPropagatedDraft,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { propagateAnnotationsToFit, propagateAnnotationsToQc } from '@/lib/production/sketch-link-model';

/** То же, что `buildPropagatedDraftsFromSketch`, только по массиву меток (без полного досье). */
export function buildPropagatedDraftsFromAnnotationsOnly(
  annotations: Workshop2Phase1CategorySketchAnnotation[]
): Workshop2SketchPropagatedDraft[] {
  const dossier: Workshop2DossierPhase1 = {
    schemaVersion: 1,
    assignments: [],
    categorySketchAnnotations: annotations,
  };
  return buildPropagatedDraftsFromSketch(dossier);
}

/** Собирает черновики из текущих меток master-скетча (посадка / ОТК). */
export function buildPropagatedDraftsFromSketch(dossier: Workshop2DossierPhase1): Workshop2SketchPropagatedDraft[] {
  const at = new Date().toISOString();
  const fit = propagateAnnotationsToFit(dossier).map(
    (x): Workshop2SketchPropagatedDraft => ({
      draftId: x.id,
      kind: 'fit',
      text: x.text,
      fromAnnotationId: x.fromAnnotation,
      createdAt: at,
    })
  );
  const qc = propagateAnnotationsToQc(dossier).map(
    (x): Workshop2SketchPropagatedDraft => ({
      draftId: x.id,
      kind: 'qc',
      text: x.text,
      fromAnnotationId: x.fromAnnotation,
      createdAt: at,
    })
  );
  return [...fit, ...qc];
}

/** Объединяет с уже сохранёнными: одна запись на пару kind + fromAnnotationId. */
export function mergePropagatedDrafts(
  existing: Workshop2SketchPropagatedDraft[] | undefined,
  incoming: Workshop2SketchPropagatedDraft[]
): Workshop2SketchPropagatedDraft[] {
  const map = new Map<string, Workshop2SketchPropagatedDraft>();
  for (const d of existing ?? []) {
    map.set(`${d.kind}:${d.fromAnnotationId}`, d);
  }
  for (const d of incoming) {
    map.set(`${d.kind}:${d.fromAnnotationId}`, d);
  }
  return [...map.values()];
}
