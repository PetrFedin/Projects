/**
 * «Висячие» canonical-назначения после смены L1/L2/L3: attributeId не входит в набор листа.
 */
import { resolveMergedAttributeIdsForLeaf, resolvePhase1AttributeRows } from './attribute-catalog';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import { expandCatalogAttributeIdsWithInfoPickAliases } from './workshop2-attribute-id-aliases';

export type Workshop2OrphanAssignment = {
  assignmentId: string;
  attributeId: string;
  displayHint: string;
};

export function validCatalogAttributeIdSetForLeaf(leafId: string): Set<string> {
  const merged = resolveMergedAttributeIdsForLeaf(leafId);
  return expandCatalogAttributeIdsWithInfoPickAliases(merged);
}

/** Назначения canonical, не относящиеся к текущему листу (custom_proposed не трогаем). */
export function findOrphanCanonicalAssignments(
  dossier: Workshop2DossierPhase1,
  leafId: string
): Workshop2OrphanAssignment[] {
  const allowed = validCatalogAttributeIdSetForLeaf(leafId);
  const labelById = new Map(
    resolvePhase1AttributeRows(leafId).map((r) => [r.attribute.attributeId, r.attribute.name])
  );
  const out: Workshop2OrphanAssignment[] = [];
  for (const a of dossier.assignments ?? []) {
    if (a.kind !== 'canonical') continue;
    const id = a.attributeId?.trim();
    if (!id || allowed.has(id)) continue;
    out.push({
      assignmentId: a.assignmentId,
      attributeId: id,
      displayHint: labelById.get(id) ?? id,
    });
  }
  return out;
}

export function pruneOrphanCanonicalAssignments(
  dossier: Workshop2DossierPhase1,
  orphanAssignmentIds: readonly string[]
): Workshop2DossierPhase1 {
  const drop = new Set(orphanAssignmentIds);
  if (!drop.size) return dossier;
  return {
    ...dossier,
    assignments: (dossier.assignments ?? []).filter((a) => !drop.has(a.assignmentId)),
  };
}

/** Краткое описание для toast / диалога (рус.). */
export function formatOrphanAssignmentsRuMessage(orphans: Workshop2OrphanAssignment[]): string {
  if (!orphans.length) return '';
  const sample = orphans
    .slice(0, 4)
    .map((o) => o.displayHint)
    .join(', ');
  const tail = orphans.length > 4 ? ` и ещё ${orphans.length - 4}` : '';
  return `После смены категории остались поля не из нового справочника: ${sample}${tail}.`;
}
