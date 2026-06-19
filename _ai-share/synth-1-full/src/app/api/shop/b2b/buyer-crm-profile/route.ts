import { NextRequest, NextResponse } from 'next/server';

import { resolveShopCoreBuyerIdFromRequest } from '@/lib/order/shop-core-buyer-context';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';
import { getShopBuyerCrmProfileServer } from '@/lib/server/shop-buyer-crm-profile-repository';

/** GET /api/shop/b2b/buyer-crm-profile — brand CRM segment assignment for buyer onboarding. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const buyerId = resolveShopCoreBuyerIdFromRequest(
    req,
    req.nextUrl.searchParams.get('buyerId') ?? checkoutAuth.buyerId
  );
  const { profile, storageMode } = await getShopBuyerCrmProfileServer({ buyerId });

  return NextResponse.json({
    ok: true,
    buyerId,
    profile,
    storageMode,
    messageRu: profile
      ? `${profile.segmentNameRu} · net ${profile.netTermDays} дн.`
      : 'CRM-профиль покупателя недоступен.',
  });
}
