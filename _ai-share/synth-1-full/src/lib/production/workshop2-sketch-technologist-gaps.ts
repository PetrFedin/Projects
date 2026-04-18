import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
} from '@/lib/production/workshop2-dossier-phase1.types';

function pinMissingAttrOrBom(a: Workshop2Phase1CategorySketchAnnotation): boolean {
  const attr = a.linkedAttributeId?.trim();
  const bom = a.linkedBomLineRef?.trim() || a.linkedMaterialNote?.trim();
  return !attr && !bom;
}

function collectAllPins(
  dossier: Workshop2DossierPhase1,
  leafId: string
): Workshop2Phase1CategorySketchAnnotation[] {
  const master = (dossier.categorySketchAnnotations ?? []).filter(
    (x) => x.categoryLeafId === leafId
  );
  const fromSheets = (dossier.sketchSheets ?? []).flatMap((s) => s.annotations ?? []);
  return [...master, ...fromSheets];
}

export type Workshop2SketchTechnologistGaps = {
  pinsWithoutAttrOrBom: number;
  criticalPinsWithoutDue: number;
};

/** Метки без привязки к атрибуту/BOM и критичные без срока — для подсказки технологу. */
export function workshop2SketchTechnologistGaps(
  dossier: Workshop2DossierPhase1,
  leafId: string | undefined
): Workshop2SketchTechnologistGaps {
  const lid = leafId?.trim();
  if (!lid) return { pinsWithoutAttrOrBom: 0, criticalPinsWithoutDue: 0 };
  const pins = collectAllPins(dossier, lid);
  let pinsWithoutAttrOrBom = 0;
  let criticalPinsWithoutDue = 0;
  for (const a of pins) {
    if (pinMissingAttrOrBom(a)) pinsWithoutAttrOrBom++;
    if (a.priority === 'critical' && !String(a.dueDate ?? '').trim()) criticalPinsWithoutDue++;
  }
  return { pinsWithoutAttrOrBom, criticalPinsWithoutDue };
}
