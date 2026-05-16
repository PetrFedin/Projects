import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { validateSketchPinRequiredLinks } from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import type { Workshop2DossierViewProfile } from '@/lib/production/workshop2-dossier-view-infrastructure';

export type Workshop2SketchPinLinkAuditItem = { id: string; messages: string[] };

type DossierSketchPinsSlice = Pick<
  Workshop2DossierPhase1,
  'categorySketchAnnotations' | 'sketchSheets' | 'subcategorySketchSlots'
>;

/** Пины скетча без обязательных привязок к полям ТЗ (для чеклиста / навигации). */
export function buildWorkshop2SketchPinLinkAudit(opts: {
  leafId: string;
  dossier: DossierSketchPinsSlice;
  showVisualSketchLinkFieldsNav: boolean;
  dossierViewProfile: Workshop2DossierViewProfile;
}): Workshop2SketchPinLinkAuditItem[] {
  const { leafId, dossier, showVisualSketchLinkFieldsNav, dossierViewProfile } = opts;
  const master = (dossier.categorySketchAnnotations ?? []).filter((a) => a.categoryLeafId === leafId);
  const sh = normalizeSketchSheets(dossier.sketchSheets);
  const sheetPins = sh.flatMap((s) => s.annotations.filter((a) => a.categoryLeafId === leafId));
  const slots = dossier.subcategorySketchSlots ?? [];
  const slotPins = slots.flatMap((s) => s.annotations.filter((a) => a.categoryLeafId === leafId));
  const pins = [...master, ...sheetPins, ...slotPins];
  if (!showVisualSketchLinkFieldsNav) {
    return [];
  }
  const mode: 'material' | 'qc' | 'strict' =
    dossierViewProfile === 'supply'
      ? 'material'
      : dossierViewProfile === 'qc'
        ? 'qc'
        : dossierViewProfile === 'designer'
          ? 'material'
          : 'strict';
  const out: Workshop2SketchPinLinkAuditItem[] = [];
  for (const pin of pins) {
    const { ok, issues } = validateSketchPinRequiredLinks(pin, mode);
    if (!ok) out.push({ id: pin.annotationId, messages: issues.map((i) => i.message) });
  }
  return out;
}
