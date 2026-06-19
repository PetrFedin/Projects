import { NextRequest, NextResponse } from 'next/server';

import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';
import { recordWorkshop2B2b3dViewEvent } from '@/lib/server/workshop2-b2b-3d-metrics';

type Body = {
  collectionId?: string;
  articleId?: string;
  embedMode?: string;
};

/** POST — journal b2b.3d.view + contextual system line. */
export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный JSON.' }, { status: 400 });
  }

  const collectionId = body.collectionId?.trim() || 'SS27';
  const articleId = body.articleId?.trim() || 'demo-ss27-01';

  await recordWorkshop2B2b3dViewEvent({
    collectionId,
    articleId,
    embedMode: body.embedMode?.trim(),
  });

  return NextResponse.json({
    ok: true,
    event: 'b2b.3d.view',
    collectionId,
    articleId,
    messageRu: '3D просмотр зафиксирован в journal и чате артикула.',
  });
}
