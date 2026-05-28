'use client';

import {
  fetchWorkshop2DossierReadinessBatch,
  type Workshop2BatchReadinessRow,
} from '@/lib/production/workshop2-api-client';
import { workshop2Phase1DossierStorageKey } from '@/lib/production/workshop2-phase1-dossier-storage';

/** Лимит карточек хаба за один batch-запрос (сервер режет до 200). */
export const WORKSHOP2_HUB_BATCH_MAX_CARDS = 20;

export const WORKSHOP2_HUB_BATCH_DEBOUNCE_MS = 400;

export type Workshop2HubServerScore = {
  tzPct: number;
  pulseScore: number;
  found: boolean;
  developmentPath?: Workshop2BatchReadinessRow['developmentPath'];
  goldSampleApproved?: boolean;
};

export function hubScoreKey(collectionId: string, articleId: string): string {
  return workshop2Phase1DossierStorageKey(collectionId, articleId);
}

export function rowsToHubScoreMap(
  rows: Workshop2BatchReadinessRow[]
): Record<string, Workshop2HubServerScore> {
  const out: Record<string, Workshop2HubServerScore> = {};
  for (const row of rows) {
    out[hubScoreKey(row.collectionId, row.articleId)] = {
      tzPct: row.tzOverallPct,
      pulseScore: row.preflightScore,
      found: row.found,
      developmentPath: row.developmentPath,
      goldSampleApproved: row.goldSampleApproved,
    };
  }
  return out;
}

export async function fetchWorkshop2HubBatchScores(
  items: {
    collectionId: string;
    articleId: string;
    categoryLeafId?: string;
    articleSkuDraft?: string;
    articleNameDraft?: string;
  }[]
): Promise<Record<string, Workshop2HubServerScore>> {
  const slice = items.slice(0, WORKSHOP2_HUB_BATCH_MAX_CARDS);
  if (!slice.length) return {};
  const res = await fetchWorkshop2DossierReadinessBatch(slice);
  if (!res.ok) return {};
  return rowsToHubScoreMap(res.items);
}
