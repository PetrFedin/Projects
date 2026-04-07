import type {
  Workshop2DossierPhase1,
  Workshop2SketchLabelsSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';

const MAX_SNAPSHOTS = 12;

function newUuid(): string {
  return crypto.randomUUID();
}

export function buildSketchLabelsSnapshot(
  dossier: Workshop2DossierPhase1,
  by: string,
  label?: string
): Workshop2SketchLabelsSnapshot {
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  return {
    snapshotId: newUuid(),
    at: new Date().toISOString(),
    by: by.slice(0, 200),
    label: label?.trim() ? label.trim().slice(0, 200) : undefined,
    masterAnnotations: [...(dossier.categorySketchAnnotations ?? [])].map((a) => ({ ...a })),
    sheets: sheets.map((s) => ({
      sheetId: s.sheetId,
      title: s.title,
      viewKind: s.viewKind,
      annotations: s.annotations.map((a) => ({ ...a })),
    })),
  };
}

export function appendSketchLabelSnapshot(
  dossier: Workshop2DossierPhase1,
  by: string,
  label?: string
): { dossier: Workshop2DossierPhase1; snapshot: Workshop2SketchLabelsSnapshot } {
  const snapshot = buildSketchLabelsSnapshot(dossier, by, label);
  const prev = dossier.sketchLabelSnapshots ?? [];
  const nextList = [...prev, snapshot].slice(-MAX_SNAPSHOTS);
  return {
    snapshot: snapshot,
    dossier: { ...dossier, sketchLabelSnapshots: nextList },
  };
}

export function restoreSketchLabelsSnapshot(
  dossier: Workshop2DossierPhase1,
  snapshot: Workshop2SketchLabelsSnapshot
): Workshop2DossierPhase1 {
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const bySheetId = new Map(snapshot.sheets?.map((s) => [s.sheetId, s.annotations]) ?? []);
  const mergedSheets = sheets.map((s) => {
    const ann = bySheetId.get(s.sheetId);
    return ann ? { ...s, annotations: ann.map((a) => ({ ...a })) } : s;
  });
  return {
    ...dossier,
    categorySketchAnnotations: snapshot.masterAnnotations?.map((a) => ({ ...a })) ?? dossier.categorySketchAnnotations,
    sketchSheets: mergedSheets,
  };
}
