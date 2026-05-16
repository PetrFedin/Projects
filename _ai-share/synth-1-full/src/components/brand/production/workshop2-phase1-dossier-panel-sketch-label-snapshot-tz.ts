import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { appendSketchLabelSnapshot } from '@/lib/production/workshop2-sketch-snapshots';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Снимок меток скетча + запись в журнал ТЗ (редьюсер для `setDossier`). */
export function applySaveSketchLabelsSnapshotWithTzLog(
  prev: Workshop2DossierPhase1,
  updatedByLabel: string,
  label: string | undefined,
  leafId: string
): Workshop2DossierPhase1 {
  const masterPins = (prev.categorySketchAnnotations ?? []).filter(
    (a) => a.categoryLeafId === leafId
  ).length;
  const sheetPinsTotal = normalizeSketchSheets(prev.sketchSheets).reduce(
    (acc, s) => acc + s.annotations.filter((a) => a.categoryLeafId === leafId).length,
    0
  );
  const { dossier: next } = appendSketchLabelSnapshot(
    prev,
    updatedByLabel.slice(0, 200),
    label || undefined
  );
  return pushTzActionLog(next, updatedByLabel, {
    type: 'sketch_labels_snapshot',
    label: label || undefined,
    masterPins,
    sheetPinsTotal,
  });
}
