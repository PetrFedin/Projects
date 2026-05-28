/**
 * Wave 11: batch hub summary для строк артикулов (gates, ₽, edo, marking) — без N+1 dossier fetch на клиенте.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2RuStatusStrip } from '@/lib/production/workshop2-ru-status-strip-summary';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { workshop2ArticleContextDescriptor } from '@/lib/production/workshop2-dossier-linked-paths';

export type Workshop2HubArticleMiniStatus = {
  articleId: string;
  gateBlockerCount: number;
  totalRubLabel: string | null;
  edoLabelRu: string;
  markingLabelRu: string;
  workspaceHref: string;
  /** Wave 13: preview последнего сообщения contextual chat. */
  chatLastMessagePreview?: string | null;
};

export type Workshop2CollectionHubSummary = {
  collectionId: string;
  articles: Workshop2HubArticleMiniStatus[];
  generatedAt: string;
};

export function buildWorkshop2CollectionHubSummary(input: {
  collectionId: string;
  articles: {
    articleId: string;
    dossier: Workshop2DossierPhase1 | null;
    chatLastMessagePreview?: string | null;
  }[];
}): Workshop2CollectionHubSummary {
  const cid = input.collectionId.trim();
  return {
    collectionId: cid,
    generatedAt: new Date().toISOString(),
    articles: input.articles.map(({ articleId, dossier, chatLastMessagePreview }) => {
      const strip = summarizeWorkshop2RuStatusStrip(dossier, { collectionId: cid, articleId });
      return {
        articleId,
        gateBlockerCount: strip?.gateBlockerCount ?? 0,
        totalRubLabel: strip?.totalRubLabel ?? null,
        edoLabelRu: strip?.edoLabelRu ?? '—',
        markingLabelRu: strip?.markingLabelRu ?? '—',
        workspaceHref: workshop2ArticleHref(cid, articleId),
        chatLastMessagePreview: chatLastMessagePreview ?? null,
      };
    }),
  };
}

export function workshop2HubChatContextKey(
  collectionId: string,
  articleId: string
): {
  contextType: string;
  contextId: string;
} {
  return workshop2ArticleContextDescriptor(collectionId, articleId);
}

/** Wave 16: один batch-fetch hub-summary на коллекцию (SWR key = collectionId + sorted articleIds). */
export function workshop2HubSummaryCacheKey(collectionId: string, articleIds: string[]): string {
  const sorted = [...articleIds]
    .map((s) => s.trim())
    .filter(Boolean)
    .sort();
  return `w2-hub-summary:${collectionId.trim()}:${sorted.join(',')}`;
}

export async function fetchWorkshop2CollectionHubSummary(input: {
  collectionId: string;
  articleIds: string[];
  headers?: Record<string, string>;
}): Promise<Workshop2CollectionHubSummary | null> {
  const cid = input.collectionId.trim();
  const ids = input.articleIds
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 80);
  if (!cid || !ids.length) return null;
  const res = await fetch(
    `/api/workshop2/collections/${encodeURIComponent(cid)}/hub-summary?articleIds=${encodeURIComponent(ids.join(','))}`,
    { headers: input.headers, cache: 'no-store' }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as Workshop2CollectionHubSummary & { ok?: boolean };
  if (!json?.articles) return null;
  return {
    collectionId: json.collectionId ?? cid,
    articles: json.articles,
    generatedAt: json.generatedAt ?? new Date().toISOString(),
  };
}
