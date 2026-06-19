import { NextRequest, NextResponse } from 'next/server';

import { loadShopMatrixSizeCurveView } from '@/lib/server/shop-matrix-size-curve';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET /api/shop/b2b/matrix/size-curve?collectionId=&articleId= — W2 size chart SoT для pre-pack. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? '';
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();

  const result = await loadShopMatrixSizeCurveView({ collectionId, articleId });
  if (!result.ok) {
    return NextResponse.json({ ok: false, messageRu: result.messageRu }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    view: result.view,
    messageRu: `Size curve · ${result.view.source} · ${result.view.articleId}.`,
  });
}
