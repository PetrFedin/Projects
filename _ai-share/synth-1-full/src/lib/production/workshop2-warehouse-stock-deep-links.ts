/**
 * Deep links к Workshop2 WMS (вкладка stock) по коллекциям — без fake materials в legacy tab.
 */
import { INVESTOR_DEMO_ARTICLE_IDS } from '@/lib/production/investor-demo-flow-seed';
import { WORKSHOP2_SYSTEM_COLLECTION_ID } from '@/lib/production/local-collection-inventory';
import { workshop2ArticleHref, workshop2CollectionListHref } from '@/lib/production/workshop2-url';

export type Workshop2WarehouseStockDeepLink = {
  collectionId: string;
  collectionLabel: string;
  articleId: string;
  articleLabel: string;
  href: string;
  kind: 'article_stock' | 'collection_hub';
};

const KNOWN_COLLECTION_ARTICLE_SEGMENTS: Record<string, readonly string[]> = {
  [WORKSHOP2_SYSTEM_COLLECTION_ID]: INVESTOR_DEMO_ARTICLE_IDS,
  Investor: INVESTOR_DEMO_ARTICLE_IDS,
};

export function resolveWorkshop2WarehouseStockArticleSegments(input: {
  collectionId: string;
  articleIds?: readonly string[];
}): readonly string[] {
  const cid = input.collectionId.trim();
  if (!cid) return [];
  if (input.articleIds?.length) return input.articleIds;
  return KNOWN_COLLECTION_ARTICLE_SEGMENTS[cid] ?? [];
}

export function buildWorkshop2WarehouseStockDeepLinks(input: {
  collections: { id: string; name: string; articleIds?: readonly string[] }[];
}): Workshop2WarehouseStockDeepLink[] {
  const links: Workshop2WarehouseStockDeepLink[] = [];
  for (const col of input.collections) {
    const cid = col.id.trim();
    if (!cid) continue;
    const segments = resolveWorkshop2WarehouseStockArticleSegments({
      collectionId: cid,
      articleIds: col.articleIds,
    });
    if (segments.length === 0) {
      links.push({
        collectionId: cid,
        collectionLabel: col.name || cid,
        articleId: '',
        articleLabel: 'Хаб коллекции',
        href: workshop2CollectionListHref(cid),
        kind: 'collection_hub',
      });
      continue;
    }
    for (const seg of segments) {
      links.push({
        collectionId: cid,
        collectionLabel: col.name || cid,
        articleId: seg,
        articleLabel: seg,
        href: workshop2ArticleHref(cid, seg, { w2pane: 'stock' }),
        kind: 'article_stock',
      });
    }
  }
  return links;
}
