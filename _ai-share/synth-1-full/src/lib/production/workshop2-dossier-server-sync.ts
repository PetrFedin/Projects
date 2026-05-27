import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  mergeWorkshop2DossierOnServer,
  saveWorkshop2DossierToServer,
} from '@/lib/production/workshop2-server-dossier-client';

export type Workshop2PersistWithMergeResult =
  | {
      ok: true;
      version: number;
      mergedDossier?: Workshop2DossierPhase1;
      manualReviewCriticalFields?: string[];
    }
  | { ok: false; reason: 'save_failed' | 'merge_failed'; detail?: string };

export async function persistWorkshop2DossierWithMerge(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  baseVersion?: number;
}): Promise<Workshop2PersistWithMergeResult> {
  const save = await saveWorkshop2DossierToServer({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    baseVersion: input.baseVersion,
  });
  if (save.ok) return { ok: true, version: save.data.version };
  if (save.reason !== 'version_conflict') {
    return { ok: false, reason: 'save_failed', detail: save.reason };
  }
  const merged = await mergeWorkshop2DossierOnServer({
    collectionId: input.collectionId,
    articleId: input.articleId,
    localDossier: input.dossier,
  });
  if (!merged.ok) {
    return { ok: false, reason: 'merge_failed', detail: merged.reason };
  }
  return {
    ok: true,
    version: merged.data.version,
    mergedDossier: merged.data.dossier,
    manualReviewCriticalFields:
      merged.data.mergeReport?.manualReviewRequired === true
        ? merged.data.mergeReport.criticalConflicts
        : undefined,
  };
}
