/**
 * Wave 19 #10: аудит PG overlay хаба поверх localStorage dual-write.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2Phase1DossierStorageKey } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2HubArticleRef } from '@/lib/production/workshop2-hub-dossier-map';

export function stampWorkshop2HubPgOverlayOnDossier(
  dossier: Workshop2DossierPhase1,
  input?: { collectionId?: string; articleId?: string; serverVersion?: number }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    hubPgOverlayAt: new Date().toISOString(),
    hubPgOverlayMeta: {
      collectionId: input?.collectionId,
      articleId: input?.articleId,
      serverVersion: input?.serverVersion,
    },
  };
}

/** Сравнение local vs merged: были ли поля досье перезаписаны с PG. */
export function detectWorkshop2HubInventoryOverlayDrift(input: {
  local: Workshop2DossierPhase1;
  merged: Workshop2DossierPhase1;
}): boolean {
  const localTs = input.local.hubPgOverlayAt;
  const mergedTs = input.merged.hubPgOverlayAt;
  if (!mergedTs) return false;
  if (!localTs) return true;
  return mergedTs !== localTs;
}

export function summarizeWorkshop2HubInventoryOverlayBatch(input: {
  localMap: Record<string, Workshop2DossierPhase1>;
  mergedMap: Record<string, Workshop2DossierPhase1>;
  articles: Workshop2HubArticleRef[];
}): { overlaidCount: number; driftCount: number } {
  let overlaidCount = 0;
  let driftCount = 0;
  for (const { collectionId, articleId } of input.articles) {
    const key = workshop2Phase1DossierStorageKey(collectionId, articleId);
    const local = input.localMap[key];
    const merged = input.mergedMap[key];
    if (!merged?.hubPgOverlayAt) continue;
    overlaidCount += 1;
    if (local && detectWorkshop2HubInventoryOverlayDrift({ local, merged })) {
      driftCount += 1;
    }
  }
  return { overlaidCount, driftCount };
}
