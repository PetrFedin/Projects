import type { LocalCollectionInventory } from '@/lib/production/local-collection-inventory';
import { workshop2MergedItemsForCollectionList } from '@/lib/production/workshop2-articles';
import {
  loadWorkshop2Phase1DossierMap,
  workshop2Phase1DossierStorageKey,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2PgPublishedArticleRow } from '@/lib/production/workshop2-pg-collection-hydrate';
import type { RangePlannerOverlayDoc } from '@/lib/production/workshop2-range-planner-overlay';

export type Workshop2PublishedArticlesReadPath = 'api' | 'localStorage';

export type Workshop2PgSourceStats = {
  pgArticlesCount: number;
  localOverlayArticlesCount: number;
  dossiersFromPgCount: number;
  rangePlannerOverlaySynced: boolean;
  rangePlannerArticleCount: number | null;
  publishedArticlesReadPath: Workshop2PublishedArticlesReadPath;
};

export function countWorkshop2DossiersFromPgOverlay(
  collectionId: string,
  articleIds: readonly string[]
): number {
  const map = loadWorkshop2Phase1DossierMap();
  const cid = collectionId.trim();
  let count = 0;
  for (const rawId of articleIds) {
    const articleId = rawId.trim();
    if (!articleId) continue;
    const key = workshop2Phase1DossierStorageKey(cid, articleId);
    if (map[key]?.hubPgOverlayAt?.trim()) count += 1;
  }
  return count;
}

export function countWorkshop2LocalOverlayArticles(
  inv: LocalCollectionInventory,
  collectionId: string,
  seedLines: unknown[],
  pgArticleIds: ReadonlySet<string>
): number {
  const merged = workshop2MergedItemsForCollectionList(collectionId, inv, seedLines);
  let localOnly = 0;
  for (const item of merged) {
    const id = String((item as { id?: string }).id ?? '').trim();
    if (!id) continue;
    if (!pgArticleIds.has(id)) localOnly += 1;
  }
  return localOnly;
}

export function buildWorkshop2PgSourceStats(input: {
  collectionId: string;
  pgArticles: readonly Workshop2PgPublishedArticleRow[];
  localInventory: LocalCollectionInventory;
  seedLines: unknown[];
  rangePlannerOverlay?: RangePlannerOverlayDoc;
  publishedArticlesReadPath: Workshop2PublishedArticlesReadPath;
}): Workshop2PgSourceStats {
  const pgIds = new Set(input.pgArticles.map((a) => a.articleId.trim()).filter(Boolean));
  return {
    pgArticlesCount: input.pgArticles.length,
    localOverlayArticlesCount: countWorkshop2LocalOverlayArticles(
      input.localInventory,
      input.collectionId,
      input.seedLines,
      pgIds
    ),
    dossiersFromPgCount: countWorkshop2DossiersFromPgOverlay(
      input.collectionId,
      input.pgArticles.map((a) => a.articleId)
    ),
    rangePlannerOverlaySynced: Boolean(
      input.rangePlannerOverlay?.tiersFromPg && input.rangePlannerOverlay.syncedFromPgAt
    ),
    rangePlannerArticleCount: input.rangePlannerOverlay?.articleCount ?? null,
    publishedArticlesReadPath: input.publishedArticlesReadPath,
  };
}

export function formatWorkshop2PgSourceStatsRu(stats: Workshop2PgSourceStats): string {
  const readPath =
    stats.publishedArticlesReadPath === 'api' ? 'список из API' : 'список из localStorage';
  const parts = [
    `PG: ${stats.pgArticlesCount} опубликованных (${readPath})`,
    `локальный overlay: +${stats.localOverlayArticlesCount}`,
    `досье из PG: ${stats.dossiersFromPgCount}`,
  ];
  if (stats.rangePlannerOverlaySynced) {
    parts.push(
      `range planner: overlay из PG${
        stats.rangePlannerArticleCount != null ? ` (${stats.rangePlannerArticleCount} SKU)` : ''
      }`
    );
  } else {
    parts.push('range planner: без PG overlay');
  }
  return parts.join(' · ');
}
