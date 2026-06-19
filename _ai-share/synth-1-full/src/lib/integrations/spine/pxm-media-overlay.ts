/**
 * Wave B3 · merge Centric PXM hero into published-articles read-model.
 */
import 'server-only';

import { getCentricPxmMedia } from './centric-pxm-media-persistence.file';

export type PublishedArticleWithPxm = {
  collectionId: string;
  articleId: string;
  name: string;
  wholesalePriceRub: number;
  moq?: number;
  heroImageUrl?: string;
  pxmSource?: boolean;
  pxmAssetCount?: number;
};

export function mergePxmMediaIntoPublishedArticles<
  T extends {
    collectionId: string;
    articleId: string;
    heroImageUrl?: string;
  },
>(articles: T[]): (T & { pxmSource?: boolean; pxmAssetCount?: number })[] {
  return articles.map((article) => {
    const pxm = getCentricPxmMedia(article.collectionId, article.articleId);
    if (!pxm) return article;
    return {
      ...article,
      heroImageUrl: pxm.heroUrl,
      pxmSource: true,
      pxmAssetCount: pxm.assets.length,
    };
  });
}
