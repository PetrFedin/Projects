/**
 * Автозаполнение пустых обязательных canonical-слотов из матрицы InfoPick при сборке артикула.
 */
import { getAttributeById } from '@/lib/production/attribute-catalog';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1AttributeAssignment,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { resolveWorkshop2RequiredFieldIdsForLeaf } from '@/lib/production/workshop2-required-fields';
import { scaffoldPhase1AssignmentsForLeaf } from '@/lib/production/workshop2-article-assembler';

function assignmentHasValue(a: Workshop2Phase1AttributeAssignment): boolean {
  return (a.values ?? []).some((v) => Boolean(v.text?.trim() || v.displayLabel?.trim()));
}

/** Подставляет placeholder в пустые обязательные поля листа (только пустые ячейки). */
export function prefillWorkshop2AssignmentsFromRequiredMatrix(
  dossier: Workshop2DossierPhase1,
  leafId: string
): { dossier: Workshop2DossierPhase1; prefilledCount: number; prefilledAttributeIds: string[] } {
  const lid = leafId.trim();
  if (!lid) {
    return { dossier, prefilledCount: 0, prefilledAttributeIds: [] };
  }

  const required = resolveWorkshop2RequiredFieldIdsForLeaf(lid);
  if (!required?.requiredIds.length) {
    return { dossier, prefilledCount: 0, prefilledAttributeIds: [] };
  }

  const scaffolded = scaffoldPhase1AssignmentsForLeaf(lid, dossier.assignments ?? []);
  const byId = new Map(
    scaffolded
      .filter((a) => a.kind === 'canonical' && a.attributeId)
      .map((a) => [a.attributeId as string, a])
  );

  const prefilledAttributeIds: string[] = [];
  for (const attributeId of required.requiredIds) {
    const row = byId.get(attributeId);
    if (!row || assignmentHasValue(row)) continue;
    const attr = getAttributeById(attributeId);
    const label = attr?.name?.trim() || attributeId;
    byId.set(attributeId, {
      ...row,
      values: [
        {
          valueId: `w2-prefill-${attributeId}-${Date.now().toString(36)}`,
          valueSource: 'free_text',
          text: `[заполнить] ${label}`,
          displayLabel: label,
        },
      ],
    });
    prefilledAttributeIds.push(attributeId);
  }

  if (!prefilledAttributeIds.length) {
    return { dossier, prefilledCount: 0, prefilledAttributeIds: [] };
  }

  const nextAssignments = scaffolded.map((a) => {
    if (a.attributeId && byId.has(a.attributeId)) {
      return byId.get(a.attributeId)!;
    }
    return a;
  });

  return {
    dossier: { ...dossier, assignments: nextAssignments },
    prefilledCount: prefilledAttributeIds.length,
    prefilledAttributeIds,
  };
}
