import type { BrandReleaseSyndicationRow } from '@/lib/fashion/brand-release-syndication';
import type { Product } from '@/lib/types';

export type BrandReleaseSyndicationPushResult = {
  pushedAt: string;
  readyCount: number;
  articleIds: string[];
  channels: string[];
};

export function mapSyndicationReadyRowsToArticleIds(
  rows: readonly BrandReleaseSyndicationRow[],
  products: readonly Product[]
): string[] {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const ids: string[] = [];
  for (const row of rows) {
    if (!row.ready) continue;
    const product = bySku.get(row.sku);
    const articleId = product?.slug?.trim() || product?.id?.trim() || row.slug;
    if (articleId) ids.push(articleId);
  }
  return [...new Set(ids)];
}
