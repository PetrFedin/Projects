import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
} from '@/lib/production/workshop2-dossier-phase1.types';

/** Атрибуты, на которые есть привязка меток скетча для данного листа каталога. */
export function collectWorkshop2Phase1LinkedAttributeIdsForLeaf(
  dossier: Workshop2DossierPhase1,
  leafId: string
): Set<string> {
  const ids = new Set<string>();
  const visit = (anns: Workshop2Phase1CategorySketchAnnotation[] | undefined) => {
    for (const a of anns ?? []) {
      if (a.categoryLeafId !== leafId) continue;
      const aid = a.linkedAttributeId?.trim();
      if (aid) ids.add(aid);
    }
  };
  visit(dossier.categorySketchAnnotations);
  for (const sh of dossier.sketchSheets ?? []) visit(sh.annotations);
  return ids;
}
