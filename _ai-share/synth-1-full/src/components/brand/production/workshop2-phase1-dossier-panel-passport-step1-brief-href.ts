import { workshop2ArticleHref, workshop2ArticleUrlSegment } from '@/lib/production/workshop2-url';

/** Относительный href на бриф паспорта (шаг 1, вкладка ТЗ, якорь). */
export function buildWorkshop2Phase1DossierPassportStep1BriefHref(ctx: {
  collectionId: string;
  articleId: string;
  internalArticleCode: string | undefined;
}): string {
  const seg = workshop2ArticleUrlSegment(ctx.internalArticleCode, ctx.articleId);
  return workshop2ArticleHref(ctx.collectionId, seg, {
    w2step: '1',
    w2sec: 'general',
    w2pane: 'tz',
    hash: 'w2-passport-brief',
  });
}
