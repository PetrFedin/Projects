/**
 * Wave 12: B2B строка заказа → deep link в workspace W2 (если есть articleId / SS27 season).
 */
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { WORKSHOP2_SS27_COLLECTION_ID } from '@/lib/production/workshop2-ru-journey-ss27';

export type B2bOrderLineWorkshop2Ref = {
  id?: string;
  articleId?: string;
  collectionId?: string;
  season?: string;
  sku?: string;
};

export function resolveB2bLineWorkshop2WorkspaceHref(
  line: B2bOrderLineWorkshop2Ref
): string | null {
  const articleId = (line.articleId ?? line.id)?.trim();
  if (!articleId) return null;
  const collectionId =
    line.collectionId?.trim() ||
    (line.season?.trim().toUpperCase() === WORKSHOP2_SS27_COLLECTION_ID
      ? WORKSHOP2_SS27_COLLECTION_ID
      : '');
  if (!collectionId) return null;
  return workshop2ArticleHref(collectionId, articleId, { w2pane: 'overview' });
}

export function buildWorkshop2SchetOffertaApiHref(orderId: string): string {
  return `/api/shop/b2b/orders/${encodeURIComponent(orderId.trim())}/schet-offerta.pdf`;
}
