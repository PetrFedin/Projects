import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2ShopifyOAuthAuthorizeUrl,
  createWorkshop2ShopifyOAuthState,
  probeWorkshop2ShopifyConnection,
} from '@/lib/production/workshop2-shopify-oauth-scaffold';

/** GET — redirect stub на Shopify OAuth authorize (probe only). */
export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')?.trim() ?? '';
  const state = req.nextUrl.searchParams.get('state')?.trim() || createWorkshop2ShopifyOAuthState();
  const built = buildWorkshop2ShopifyOAuthAuthorizeUrl({ shop, state });
  if (!built.url) {
    return NextResponse.json(
      { ok: false, status: 'not_connected', messageRu: built.messageRu },
      { status: 503 }
    );
  }
  return NextResponse.redirect(built.url);
}

/** POST — probe connection status (honest not_connected). */
export async function POST() {
  const probe = probeWorkshop2ShopifyConnection();
  return NextResponse.json({
    ok: true,
    status: probe.status,
    configured: probe.configured,
    messageRu: probe.messageRu,
  });
}
