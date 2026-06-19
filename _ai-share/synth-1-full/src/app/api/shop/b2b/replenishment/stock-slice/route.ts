import { NextRequest, NextResponse } from 'next/server';

import {
  getShopReplenishmentStockSliceServer,
  putShopReplenishmentStockSliceServer,
  shopReplenishmentStockSliceStorageMode,
} from '@/lib/server/shop-replenishment-stock-slice-repository';
import { resolveShopCoreBuyerIdFromRequest } from '@/lib/order/shop-core-buyer-context';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

function resolveBuyerId(req: NextRequest, checkoutBuyerId: string, bodyBuyerId?: string): string {
  return resolveShopCoreBuyerIdFromRequest(
    req,
    bodyBuyerId ?? req.nextUrl.searchParams.get('buyerId') ?? checkoutBuyerId
  );
}

/** GET /api/shop/b2b/replenishment/stock-slice — saved filter slice (PG). */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const buyerId = resolveBuyerId(req, checkoutAuth.buyerId);
  const slice = await getShopReplenishmentStockSliceServer(buyerId);
  return NextResponse.json({
    ok: true,
    buyerId,
    slice,
    storageMode: shopReplenishmentStockSliceStorageMode(),
    messageRu: slice ? `Saved slice: ${slice.labelRu}.` : 'Saved slice не задан — preset из URL.',
  });
}

/** PUT — persist active replenishment stock filter slice. */
export async function PUT(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный JSON.' }, { status: 400 });
  }

  const buyerId = resolveBuyerId(req, checkoutAuth.buyerId, String(body.buyerId ?? ''));
  const orgId = String(body.orgId ?? 'shop1').trim();
  const seasonId = String(body.seasonId ?? 'all').trim();
  const collectionId = String(body.collectionId ?? 'all').trim();
  const labelRu = String(body.labelRu ?? `${orgId} · ${seasonId}`).trim();

  const slice = await putShopReplenishmentStockSliceServer({
    buyerId,
    orgId,
    seasonId,
    collectionId,
    labelRu,
  });

  return NextResponse.json({
    ok: true,
    slice,
    storageMode: shopReplenishmentStockSliceStorageMode(),
    messageRu: `Slice сохранён: ${slice.labelRu}.`,
  });
}
