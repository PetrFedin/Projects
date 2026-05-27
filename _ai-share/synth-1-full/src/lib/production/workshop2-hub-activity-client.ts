/**
 * Клиент: подтягивает server audit events для журнала хаба.
 */

import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { Workshop2ServerDossierEventRow } from '@/lib/production/workshop2-hub-activity-merge';

export async function fetchWorkshop2ArticleServerEvents(
  collectionId: string,
  articleId: string,
  limit = 15
): Promise<Workshop2ServerDossierEventRow[]> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/events?limit=${limit}`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (res.status === 503 || res.status === 404) return [];
  if (!res.ok) return [];
  const json = (await res.json()) as {
    events?: Workshop2ServerDossierEventRow[];
  };
  return Array.isArray(json.events) ? json.events : [];
}

/** Параллельный fetch для видимых артикулов коллекции (ограничение — не DDOS). */
export async function fetchWorkshop2HubServerActivityBatch(input: {
  articles: { collectionId: string; articleId: string }[];
  limitPerArticle?: number;
  maxArticles?: number;
}): Promise<Workshop2ServerDossierEventRow[]> {
  const maxArticles = Math.min(input.maxArticles ?? 8, input.articles.length);
  const slice = input.articles.slice(0, maxArticles);
  const limit = input.limitPerArticle ?? 10;
  const batches = await Promise.all(
    slice.map(({ collectionId, articleId }) =>
      fetchWorkshop2ArticleServerEvents(collectionId, articleId, limit)
    )
  );
  return batches.flat();
}
