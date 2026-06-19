/**
 * GET /api/shop/b2b/orders — список W2 B2B заказов магазина (buyerId, опционально collectionId).
 */
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2B2bOrdersForBuyer } from '@/lib/server/workshop2-b2b-orders-repository';
import { workshop2B2bOrderContextId } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  resolveShopCoreBuyerIdFromRequest,
  shopCoreBuyerLabelRu,
} from '@/lib/order/shop-core-buyer-context';
import { shopB2bOrderHref } from '@/lib/routes';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const buyerId = resolveShopCoreBuyerIdFromRequest(
    req,
    req.nextUrl.searchParams.get('buyerId') ?? checkoutAuth.buyerId
  );
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();

  let orders = await listWorkshop2B2bOrdersForBuyer(buyerId);
  if (collectionId) {
    orders = orders.filter((o) => o.collectionId?.trim() === collectionId);
  }

  return NextResponse.json({
    ok: true,
    buyerId,
    collectionId: collectionId ?? null,
    orders: orders.map((o) => ({
      ...o,
      detailHref: shopB2bOrderHref(o.id),
      chatHref: `/shop/messages?contextType=b2b_order&contextId=${encodeURIComponent(workshop2B2bOrderContextId(o.id))}`,
    })),
    buyerLabelRu: shopCoreBuyerLabelRu(buyerId),
    messageRu: `${orders.length} заказ(ов) · ${shopCoreBuyerLabelRu(buyerId)}.`,
  });
}
