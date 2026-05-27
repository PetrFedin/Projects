/**
 * Смена листа категории: поиск и очистка «висячих» canonical-назначений.
 */
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import {
  findOrphanCanonicalAssignments,
  pruneOrphanCanonicalAssignments,
  type Workshop2OrphanAssignment,
} from './workshop2-dossier-orphan-assignments';

export type Workshop2CategoryLeafChangeResult = {
  dossier: Workshop2DossierPhase1;
  orphans: Workshop2OrphanAssignment[];
};

export function applyWorkshop2CategoryLeafToDossier(
  dossier: Workshop2DossierPhase1,
  newLeafId: string,
  opts?: { clearOrphans?: boolean }
): Workshop2CategoryLeafChangeResult {
  const orphans = findOrphanCanonicalAssignments(dossier, newLeafId);
  if (!opts?.clearOrphans || !orphans.length) {
    return { dossier, orphans };
  }
  return {
    dossier: pruneOrphanCanonicalAssignments(
      dossier,
      orphans.map((o) => o.assignmentId)
    ),
    orphans,
  };
}
