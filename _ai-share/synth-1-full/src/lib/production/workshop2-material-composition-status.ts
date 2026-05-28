/**
 * Материал и состав: mat-строки, BOM materialLines, сумма состава.
 */
import {
  compositionLabelConstructorFiberHasRows,
  compositionLabelFiberRowsSumIsHundred,
} from '@/lib/production/workshop2-composition-label-constructor';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2MaterialCompositionStatus = {
  matAssignmentCount: number;
  bomMaterialLineCount: number;
  hasCompositionAssignment: boolean;
  compositionConstructorOk: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

function matAssignmentCount(dossier: Workshop2DossierPhase1): number {
  const a = dossier.assignments?.find((x) => x.attributeId === 'mat');
  return a?.values?.filter((v) => (v.displayLabel ?? v.text ?? '').trim()).length ?? 0;
}

function hasCompositionAssignment(dossier: Workshop2DossierPhase1): boolean {
  return (dossier.assignments ?? []).some(
    (a) =>
      (a.attributeId === 'composition' || a.attributeId === 'fabricCompositionPresetOptions') &&
      (a.values?.length ?? 0) > 0
  );
}

export function summarizeWorkshop2MaterialCompositionStatus(
  dossier: Workshop2DossierPhase1
): Workshop2MaterialCompositionStatus {
  const matCount = matAssignmentCount(dossier);
  const model = ensureWorkshop2ProductionModel(dossier);
  const bomMaterialLineCount = model.materialLines?.length ?? 0;
  const hasComposition = hasCompositionAssignment(dossier);
  const spec = dossier.compositionLabelSpec;
  const hasConstructorRows = compositionLabelConstructorFiberHasRows(spec);
  const compositionConstructorOk =
    !hasConstructorRows || compositionLabelFiberRowsSumIsHundred(spec);

  let state: Workshop2MaterialCompositionStatus['state'] = 'empty';
  if (matCount > 0 || bomMaterialLineCount > 0) {
    if (matCount >= 2 && hasComposition && compositionConstructorOk && bomMaterialLineCount > 0) {
      state = 'ready';
    } else {
      state = 'partial';
    }
  }

  let hintRu: string | undefined;
  if (matCount === 0 && bomMaterialLineCount === 0) {
    hintRu = 'Материалы не заданы — выберите mat в секции материалов или синхронизируйте BOM.';
  } else if (matCount < 2) {
    hintRu = 'Добавьте минимум 2 строки mat (корпус + подклад/утеплитель).';
  } else if (!hasComposition) {
    hintRu = 'Состав материала не заполнен — укажите composition или конструктор бирки.';
  } else if (!compositionConstructorOk) {
    hintRu = 'Сумма волокон в конструкторе бирки должна быть 100%.';
  } else if (bomMaterialLineCount === 0) {
    hintRu = 'BOM materialLines пуст — откройте BOM по узлам для синхронизации с productionModel.';
  }

  return {
    matAssignmentCount: matCount,
    bomMaterialLineCount,
    hasCompositionAssignment: hasComposition,
    compositionConstructorOk,
    state,
    hintRu,
  };
}
