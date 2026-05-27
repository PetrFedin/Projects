/**
 * Wave V — канонические URL артикула `/c/{collection}/a/{articleId}` и legacy redirect
 * с `/workshop2/{collectionId}/{articleId}` (SS27 UAT / local-dev deep links).
 */
import {
  WORKSHOP2_BASE_PATH,
  workshop2ArticleHref,
  workshop2ArticlePath,
  type Workshop2ArticleHrefQuery,
} from '@/lib/production/workshop2-url';

/** Сегменты hub, не являющиеся legacy article path. */
export const WORKSHOP2_HUB_RESERVED_SEGMENTS = new Set(['c', 'references', 'setup', 'inspector']);

export type Workshop2LegacyArticlePathMatch = {
  collectionId: string;
  articleId: string;
};

/**
 * Разбирает legacy path `/brand/production/workshop2/SS27/demo-ss27-01`.
 * Возвращает null для канонического `/c/.../a/...` и зарезервированных маршрутов.
 */
export function parseWorkshop2LegacyArticlePath(
  pathname: string
): Workshop2LegacyArticlePathMatch | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const prefix = `${WORKSHOP2_BASE_PATH}/`;
  if (!normalized.startsWith(prefix)) return null;
  const rest = normalized.slice(prefix.length);
  if (!rest || rest.includes('/c/')) return null;
  const parts = rest.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  const [collectionId, articleId] = parts;
  if (!collectionId || !articleId) return null;
  if (WORKSHOP2_HUB_RESERVED_SEGMENTS.has(collectionId)) return null;
  if (WORKSHOP2_HUB_RESERVED_SEGMENTS.has(articleId)) return null;
  return { collectionId, articleId };
}

/** Канонический path + сохранение query/hash для middleware redirect. */
export function buildWorkshop2LegacyArticleRedirectPath(
  match: Workshop2LegacyArticlePathMatch,
  search = ''
): string {
  const base = workshop2ArticlePath(match.collectionId, match.articleId);
  return search ? `${base}${search.startsWith('?') ? search : `?${search}`}` : base;
}

/** Hub / onboarding / warehouse deep links — единая точка (Wave V URL consistency). */
export function buildWorkshop2HubArticleDeepLink(
  collectionId: string,
  articleId: string,
  query?: Workshop2ArticleHrefQuery
): string {
  return workshop2ArticleHref(collectionId, articleId, query);
}

/** SS27 demo-артикулы для local-dev / hub batch (file-store). */
export const WORKSHOP2_SS27_DEMO_ARTICLE_IDS = [
  'demo-ss27-01',
  'demo-ss27-02',
  'demo-ss27-03',
  'demo-ss27-04',
] as const;

export function buildWorkshop2Ss27DemoArticleLinks(
  query?: Workshop2ArticleHrefQuery
): { articleId: string; href: string }[] {
  return WORKSHOP2_SS27_DEMO_ARTICLE_IDS.map((articleId) => ({
    articleId,
    href: buildWorkshop2HubArticleDeepLink('SS27', articleId, query),
  }));
}
