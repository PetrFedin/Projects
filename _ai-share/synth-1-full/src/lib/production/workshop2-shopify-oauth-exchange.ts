/**
 * Wave 6 P0: Shopify OAuth token exchange (honest — только при env client_id + secret).
 */
export type Workshop2ShopifyOAuthExchangeResult =
  | { ok: true; accessToken: string; scope: string }
  | { ok: false; reason: 'env_missing' | 'http_error' | 'invalid_response'; messageRu: string };

export function resolveWorkshop2ShopifyOAuthExchangeEnv(env?: Record<string, string | undefined>): {
  clientId: string;
  clientSecret: string;
  redirectUri: string | undefined;
  ready: boolean;
} {
  const e = env ?? process.env;
  const clientId = String(e.WORKSHOP2_SHOPIFY_CLIENT_ID ?? '').trim();
  const clientSecret = String(e.WORKSHOP2_SHOPIFY_CLIENT_SECRET ?? '').trim();
  const redirectUri = String(e.WORKSHOP2_SHOPIFY_REDIRECT_URI ?? '').trim() || undefined;
  return {
    clientId,
    clientSecret,
    redirectUri,
    ready: Boolean(clientId && clientSecret && redirectUri),
  };
}

export function normalizeWorkshop2ShopifyShopDomain(shop: string): string {
  return shop
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

export async function exchangeWorkshop2ShopifyOAuthCode(input: {
  shop: string;
  code: string;
  env?: Record<string, string | undefined>;
}): Promise<Workshop2ShopifyOAuthExchangeResult> {
  const cfg = resolveWorkshop2ShopifyOAuthExchangeEnv(input.env);
  if (!cfg.ready) {
    return {
      ok: false,
      reason: 'env_missing',
      messageRu:
        'Shopify OAuth: задайте WORKSHOP2_SHOPIFY_CLIENT_ID, WORKSHOP2_SHOPIFY_CLIENT_SECRET и WORKSHOP2_SHOPIFY_REDIRECT_URI.',
    };
  }

  const shop = normalizeWorkshop2ShopifyShopDomain(input.shop);
  if (!shop.endsWith('.myshopify.com')) {
    return {
      ok: false,
      reason: 'invalid_response',
      messageRu: 'Shopify shop должен быть в формате brand.myshopify.com.',
    };
  }

  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      code: input.code.trim(),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    return {
      ok: false,
      reason: 'http_error',
      messageRu: `Shopify token exchange HTTP ${res.status} — без fake connected ACK.`,
    };
  }

  let data: { access_token?: string; scope?: string };
  try {
    data = (await res.json()) as { access_token?: string; scope?: string };
  } catch {
    return {
      ok: false,
      reason: 'invalid_response',
      messageRu: 'Shopify token exchange: невалидный JSON ответ.',
    };
  }

  const accessToken = String(data.access_token ?? '').trim();
  if (!accessToken) {
    return {
      ok: false,
      reason: 'invalid_response',
      messageRu: 'Shopify token exchange: access_token отсутствует в ответе.',
    };
  }

  return { ok: true, accessToken, scope: String(data.scope ?? '') };
}
