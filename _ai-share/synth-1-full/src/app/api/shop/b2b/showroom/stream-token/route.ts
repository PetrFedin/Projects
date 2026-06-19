import { NextRequest, NextResponse } from 'next/server';

import { buildWorkshop2B2bShowroom3dStreamPayload } from '@/lib/production/workshop2-b2b-showroom-3d-stream';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET — 3D showroom stream token + embed payload для B2b3dStreamPanel. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();
  const origin = req.nextUrl.origin || 'http://localhost:3001';

  const payload = buildWorkshop2B2bShowroom3dStreamPayload({
    collectionId,
    articleId,
    origin,
  });

  return NextResponse.json(payload);
}
