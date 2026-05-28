import { NextRequest, NextResponse } from 'next/server';
import { exchangeWorkshop2ShopifyOAuthCode } from '@/lib/production/workshop2-shopify-oauth-exchange';
import {
  normalizeWorkshop2ShopifyShopDomain,
  resolveWorkshop2ShopifyOAuthExchangeEnv,
} from '@/lib/production/workshop2-shopify-oauth-exchange';
import { probeWorkshop2ShopifyConnection } from '@/lib/production/workshop2-shopify-oauth-scaffold';
import { upsertWorkshop2ShopifyConnection } from '@/lib/server/workshop2-shopify-connection-repository';

/** GET — OAuth callback: token exchange при env, иначе честный not_connected. */
export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')?.trim() ?? '';
  const state = req.nextUrl.searchParams.get('state')?.trim();
  const code = req.nextUrl.searchParams.get('code')?.trim();
  const probe = probeWorkshop2ShopifyConnection();
  const exchangeCfg = resolveWorkshop2ShopifyOAuthExchangeEnv();

  if (!code || !shop) {
    return NextResponse.json({
      ok: true,
      status: 'not_connected',
      configured: probe.configured,
      shop: shop || null,
      state: state ?? null,
      codeReceived: Boolean(code),
      messageRu: 'OAuth callback без code/shop — not_connected.',
    });
  }

  if (!exchangeCfg.ready) {
    return NextResponse.json({
      ok: true,
      status: 'not_connected',
      configured: probe.configured,
      shop,
      state: state ?? null,
      codeReceived: true,
      messageRu:
        'OAuth callback получен — token exchange не настроен (WORKSHOP2_SHOPIFY_CLIENT_SECRET).',
    });
  }

  const exchanged = await exchangeWorkshop2ShopifyOAuthCode({ shop, code });
  if (!exchanged.ok) {
    return NextResponse.json(
      {
        ok: false,
        status: 'not_connected',
        configured: probe.configured,
        shop,
        reason: exchanged.reason,
        messageRu: exchanged.messageRu,
      },
      { status: 502 }
    );
  }

  const normalizedShop = normalizeWorkshop2ShopifyShopDomain(shop);
  const persist = await upsertWorkshop2ShopifyConnection({
    shop: normalizedShop,
    accessToken: exchanged.accessToken,
    scopes: exchanged.scope,
  });

  if (persist.mode === 'pg_only_blocked') {
    return NextResponse.json(
      {
        ok: false,
        status: 'not_connected',
        error: 'pg_only_no_fallback',
        messageRu: 'WORKSHOP2_PG_ONLY: Shopify token требует PostgreSQL.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    status: 'connected',
    configured: true,
    connected: true,
    shop: normalizedShop,
    state: state ?? null,
    persistMode: persist.mode,
    messageRu: `Shopify OAuth завершён — token сохранён (${persist.mode}). Product sync не выполняется.`,
  });
}
