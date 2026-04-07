import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchPinTemplate,
  Workshop2SketchSheetViewKind,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { MAX_ANNOTATIONS_PER_SKETCH_SHEET, normalizeSketchSheets, patchSketchSheet } from '@/lib/production/workshop2-sketch-sheets';

const MAX_PIN_TEMPLATES = 24;

/** Пустой или отсутствующий leafId в старых данных — считаем метку относящейся к целевой ветке при показе/шаблонах. */
export function sketchPinBelongsToLeaf(
  a: Workshop2Phase1CategorySketchAnnotation,
  leafId: string
): boolean {
  const t = a.categoryLeafId?.trim();
  return !t || t === leafId;
}

function newUuid(): string {
  return crypto.randomUUID();
}

export function createSketchPinTemplateRecord(input: {
  name: string;
  viewKind?: Workshop2SketchSheetViewKind;
  sourceLeafId: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
}): Workshop2SketchPinTemplate {
  const trimmed = input.name.trim().slice(0, 120) || 'Шаблон меток';
  return {
    templateId: newUuid(),
    name: trimmed,
    createdAt: new Date().toISOString(),
    viewKind: input.viewKind,
    annotations: input.annotations
      .filter((a) => sketchPinBelongsToLeaf(a, input.sourceLeafId))
      .map((a) => ({ ...a })),
  };
}

/** pick: `d:{id}` досье, `o:{id}` библиотека коллекции, либо голый id (досье, обратная совместимость). */
export function resolveSketchPinTemplatePick(
  pick: string,
  dossier: Workshop2DossierPhase1,
  orgTemplates: Workshop2SketchPinTemplate[]
): Workshop2SketchPinTemplate | undefined {
  const p = pick.trim();
  if (!p) return undefined;
  if (p.startsWith('d:')) {
    return dossier.sketchPinTemplates?.find((t) => t.templateId === p.slice(2));
  }
  if (p.startsWith('o:')) {
    return orgTemplates.find((t) => t.templateId === p.slice(2));
  }
  return dossier.sketchPinTemplates?.find((t) => t.templateId === p);
}

/** Копии меток с новыми id и целевым листом; связи к атрибутам/задачам сброшены. */
export function remapSketchPinsToLeaf(
  annotations: Workshop2Phase1CategorySketchAnnotation[],
  sourceLeafId: string,
  targetLeafId: string
): Workshop2Phase1CategorySketchAnnotation[] {
  return annotations
    .filter((a) => sketchPinBelongsToLeaf(a, sourceLeafId))
    .map((a) => ({
      ...a,
      annotationId: newUuid(),
      categoryLeafId: targetLeafId,
      linkedAttributeId: undefined,
      linkedQcZoneId: undefined,
      linkedTaskId: undefined,
    }));
}

export function appendSketchPinTemplate(
  dossier: Workshop2DossierPhase1,
  input: {
    name: string;
    viewKind?: Workshop2SketchSheetViewKind;
    sourceLeafId: string;
    annotations: Workshop2Phase1CategorySketchAnnotation[];
  }
): { dossier: Workshop2DossierPhase1; template: Workshop2SketchPinTemplate } {
  const template = createSketchPinTemplateRecord(input);
  const prev = dossier.sketchPinTemplates ?? [];
  const nextList = [...prev, template].slice(-MAX_PIN_TEMPLATES);
  return {
    dossier: { ...dossier, sketchPinTemplates: nextList },
    template,
  };
}

export function removeSketchPinTemplate(dossier: Workshop2DossierPhase1, templateId: string): Workshop2DossierPhase1 {
  return {
    ...dossier,
    sketchPinTemplates: (dossier.sketchPinTemplates ?? []).filter((t) => t.templateId !== templateId),
  };
}

const MASTER_PIN_CAP = 40;

export function applySketchPinTemplateToMaster(
  dossier: Workshop2DossierPhase1,
  template: Workshop2SketchPinTemplate,
  targetLeafId: string,
  mode: 'replace' | 'merge'
): Workshop2DossierPhase1 {
  const sourceLeafId = template.annotations[0]?.categoryLeafId ?? targetLeafId;
  const fresh = remapSketchPinsToLeaf(template.annotations, sourceLeafId, targetLeafId);
  const existing = dossier.categorySketchAnnotations ?? [];
  const others = existing.filter((a) => !sketchPinBelongsToLeaf(a, targetLeafId));
  const sameLeaf = existing.filter((a) => sketchPinBelongsToLeaf(a, targetLeafId));
  let own =
    mode === 'replace' ? fresh : [...sameLeaf, ...fresh];
  if (own.length > MASTER_PIN_CAP) own = own.slice(0, MASTER_PIN_CAP);
  return {
    ...dossier,
    categorySketchAnnotations: [...others, ...own],
  };
}

export function applySketchPinTemplateToSheet(
  dossier: Workshop2DossierPhase1,
  sheetId: string,
  template: Workshop2SketchPinTemplate,
  targetLeafId: string,
  mode: 'replace' | 'merge'
): Workshop2DossierPhase1 {
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const sheet = sheets.find((s) => s.sheetId === sheetId);
  if (!sheet) return dossier;

  const sourceLeafId = template.annotations[0]?.categoryLeafId ?? targetLeafId;
  const fresh = remapSketchPinsToLeaf(template.annotations, sourceLeafId, targetLeafId);
  const sameLeaf = sheet.annotations.filter((a) => sketchPinBelongsToLeaf(a, targetLeafId));
  const othersInSheet = sheet.annotations.filter((a) => !sketchPinBelongsToLeaf(a, targetLeafId));
  let own =
    mode === 'replace' ? fresh : [...sameLeaf, ...fresh];
  if (own.length > MAX_ANNOTATIONS_PER_SKETCH_SHEET) {
    own = own.slice(0, MAX_ANNOTATIONS_PER_SKETCH_SHEET);
  }

  return {
    ...dossier,
    sketchSheets: patchSketchSheet(dossier.sketchSheets, sheetId, {
      annotations: [...othersInSheet, ...own],
    }),
  };
}
