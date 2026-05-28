import { NextResponse } from 'next/server';
import { probeWorkshop2ShopifyConnection } from '@/lib/production/workshop2-shopify-oauth-scaffold';
import { getWorkshop2ShopifyConnection } from '@/lib/server/workshop2-shopify-connection-repository';

/** GET — честный Shopify connected / not_connected (token в PG/file-store). */
export async function GET() {
  const probe = probeWorkshop2ShopifyConnection();
  const connection = await getWorkshop2ShopifyConnection();
  const connected = Boolean(connection?.accessToken);

  return NextResponse.json({
    ok: true,
    status: connected ? 'connected' : probe.status,
    configured: probe.configured,
    connected,
    shop: connection?.shop ?? null,
    connectedAt: connection?.connectedAt ?? null,
    scopes: connection?.scopes ?? null,
    messageRu: connected
      ? `Shopify connected (${connection!.shop}) — token сохранён, product sync вне scope Wave 6.`
      : probe.messageRu,
  });
}
