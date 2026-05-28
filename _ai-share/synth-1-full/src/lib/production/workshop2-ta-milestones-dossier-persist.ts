/**
 * Persist T&A из bundle workspace → taMilestones досье (PG PUT).
 */
import type { TimeAndActionSnapshot } from '@/lib/production/article-workspace/types';
import type {
  Workshop2DossierPhase1,
  Workshop2TaMilestone,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { resolveWorkshop2TaMilestones } from '@/lib/production/workshop2-ta-milestones-status';

export function copyTaMilestonesToDossier(input: {
  dossier: Workshop2DossierPhase1;
  bundleTa?: TimeAndActionSnapshot | null;
  /** Явный список (приоритет над bundle). */
  milestones?: Workshop2TaMilestone[];
}): Workshop2DossierPhase1 {
  const resolved = input.milestones?.length
    ? { milestones: input.milestones, source: 'bundle' as const }
    : resolveWorkshop2TaMilestones({
        dossier: input.dossier,
        bundleTa: input.bundleTa,
      });

  if (!resolved.milestones.length) {
    return input.dossier;
  }

  return {
    ...input.dossier,
    taMilestones: resolved.milestones.map((m) => ({ ...m })),
    taMilestonesPersistedAt: new Date().toISOString(),
    taMilestonesPersistSource:
      resolved.source === 'dossier' ? 'dossier_refresh' : 'workspace_bundle',
  };
}
