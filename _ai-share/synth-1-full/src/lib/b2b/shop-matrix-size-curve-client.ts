import type { ShopMatrixSizeCurveView } from '@/lib/b2b/shop-matrix-size-curve';

export async function fetchShopMatrixSizeCurveView(input: {
  collectionId: string;
  articleId?: string;
}): Promise<{ ok: true; view: ShopMatrixSizeCurveView } | { ok: false; messageRu: string }> {
  const collectionId = input.collectionId.trim();
  if (!collectionId) {
    return { ok: false, messageRu: 'collectionId обязателен.' };
  }
  const sp = new URLSearchParams({ collectionId });
  if (input.articleId?.trim()) sp.set('articleId', input.articleId.trim());
  const res = await fetch(`/api/shop/b2b/matrix/size-curve?${sp.toString()}`, {
    cache: 'no-store',
  });
  const json = (await res.json()) as {
    ok?: boolean;
    view?: ShopMatrixSizeCurveView;
    messageRu?: string;
  };
  if (!res.ok || !json.ok || !json.view) {
    return { ok: false, messageRu: json.messageRu ?? 'Size curve недоступен.' };
  }
  return { ok: true, view: json.view };
}
