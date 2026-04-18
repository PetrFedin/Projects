import type { Workshop2Phase1CategorySketchAnnotation } from '@/lib/production/workshop2-dossier-phase1.types';

export type SketchMasterAnnotationDiff = {
  addedIds: string[];
  removedIds: string[];
  moved: {
    annotationId: string;
    before: { xPct: number; yPct: number };
    after: { xPct: number; yPct: number };
  }[];
  textChanged: { annotationId: string; before: string; after: string }[];
};

const POS_EPS = 0.4;

export function diffMasterSketchAnnotations(
  before: Workshop2Phase1CategorySketchAnnotation[] | undefined,
  after: Workshop2Phase1CategorySketchAnnotation[] | undefined
): SketchMasterAnnotationDiff {
  const bMap = new Map((before ?? []).map((a) => [a.annotationId, a]));
  const aMap = new Map((after ?? []).map((a) => [a.annotationId, a]));
  const addedIds: string[] = [];
  const removedIds: string[] = [];
  const moved: SketchMasterAnnotationDiff['moved'] = [];
  const textChanged: SketchMasterAnnotationDiff['textChanged'] = [];

  for (const id of aMap.keys()) {
    if (!bMap.has(id)) addedIds.push(id);
  }
  for (const id of bMap.keys()) {
    if (!aMap.has(id)) removedIds.push(id);
  }
  for (const id of bMap.keys()) {
    if (!aMap.has(id)) continue;
    const pb = bMap.get(id)!;
    const pa = aMap.get(id)!;
    const dx = Math.abs(pb.xPct - pa.xPct);
    const dy = Math.abs(pb.yPct - pa.yPct);
    if (dx > POS_EPS || dy > POS_EPS) {
      moved.push({
        annotationId: id,
        before: { xPct: pb.xPct, yPct: pb.yPct },
        after: { xPct: pa.xPct, yPct: pa.yPct },
      });
    }
    const tb = (pb.text ?? '').trim();
    const ta = (pa.text ?? '').trim();
    if (tb !== ta) {
      textChanged.push({ annotationId: id, before: tb, after: ta });
    }
  }

  return { addedIds, removedIds, moved, textChanged };
}
