/**
 * Пробелы матрицы InfoPick vs заполненность досье (честный gap, не «всё ок»).
 */
import { getAttributeById } from '@/lib/production/attribute-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { isWorkshop2AttributeLinkedToInfoPickMatrix } from '@/lib/production/workshop2-attribute-registry';
import { resolveWorkshop2RequiredFieldIdsForLeaf } from '@/lib/production/workshop2-required-fields';

export type Workshop2InfoPickMatrixGapRow = {
  attributeId: string;
  labelRu: string;
  linkedToMatrix: boolean;
  filled: boolean;
};

export type Workshop2InfoPickMatrixGapSummary = {
  leafId: string;
  pathLabel?: string;
  totalRequired: number;
  missingCount: number;
  missingMatrixCount: number;
  rows: Workshop2InfoPickMatrixGapRow[];
  hintRu?: string;
};

function assignmentFilled(dossier: Workshop2DossierPhase1, attributeId: string): boolean {
  const a = dossier.assignments?.find((x) => x.attributeId === attributeId);
  if (!a) return false;
  return (a.values ?? []).some((v) => Boolean(v.text?.trim() || v.displayLabel?.trim()));
}

/** Обязательные для листа поля из info-pick + catalog; что ещё пусто в досье. */
export function evaluateWorkshop2InfoPickMatrixFillGaps(
  dossier: Workshop2DossierPhase1 | null | undefined,
  leafId: string | null | undefined
): Workshop2InfoPickMatrixGapSummary | null {
  const lid = leafId?.trim();
  if (!dossier || !lid) return null;
  const required = resolveWorkshop2RequiredFieldIdsForLeaf(lid);
  if (!required) return null;

  const rows: Workshop2InfoPickMatrixGapRow[] = required.requiredIds.map((attributeId) => {
    const attr = getAttributeById(attributeId);
    return {
      attributeId,
      labelRu: attr?.nameRu ?? attributeId,
      linkedToMatrix: isWorkshop2AttributeLinkedToInfoPickMatrix(attributeId),
      filled: assignmentFilled(dossier, attributeId),
    };
  });

  const missing = rows.filter((r) => !r.filled);
  const missingMatrix = missing.filter((r) => r.linkedToMatrix);

  let hintRu: string | undefined;
  if (missingMatrix.length > 0) {
    hintRu = `Пусто ${missingMatrix.length} обязательных полей из матрицы InfoPick — заполните до handoff.`;
  } else if (missing.length > 0) {
    hintRu = `Пусто ${missing.length} обязательных полей каталога (вне матрицы InfoPick).`;
  }

  return {
    leafId: required.leafId,
    pathLabel: required.pathLabel,
    totalRequired: rows.length,
    missingCount: missing.length,
    missingMatrixCount: missingMatrix.length,
    rows,
    hintRu,
  };
}
