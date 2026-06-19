import { NextRequest, NextResponse } from 'next/server';

import { listBrandPricelistTierSyncServer } from '@/lib/server/brand-pricelist-tier-sync-repository';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET /api/shop/b2b/pricelist/tier-sync — shop read mirror of brand tier sync. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const result = await listBrandPricelistTierSyncServer({ collectionId });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    rows: result.rows.filter((row) => row.shopSynced),
    allRows: result.rows,
    summary: result.summary,
    storageMode: result.storageMode,
  });
}
