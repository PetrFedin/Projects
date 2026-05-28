import { workshop2ArticleHref, workshop2ArticleUrlSegment } from '@/lib/production/workshop2-url';

export type Workshop2RouteHandoffTab = 'fit' | 'qc' | 'supply';

/** Абсолютный URL для handoff (fit / qc / supply) с якорем DOM. */
export function buildWorkshop2Phase1DossierRouteHandoffAbsoluteUrl(
  ctx: { collectionId: string; articleId: string; internalArticleCode: string | undefined },
  tab: Workshop2RouteHandoffTab,
  domId: string
): string {
  if (typeof window === 'undefined') return '';
  const seg = workshop2ArticleUrlSegment(ctx.internalArticleCode, ctx.articleId);
  const id = domId.replace(/^#/, '');
  const rel = workshop2ArticleHref(ctx.collectionId, seg, { w2pane: tab, hash: id });
  return `${window.location.origin}${rel}`;
}
