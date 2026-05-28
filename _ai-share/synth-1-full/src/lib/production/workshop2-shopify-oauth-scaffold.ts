/**
 * Wave 4 P1 B5: Shopify OAuth scaffold — honest not_connected, probe only.
 */
export type Workshop2ShopifyConnectionStatus = 'not_connected' | 'pending' | 'connected';

export function resolveWorkshop2ShopifyOAuthConfig(env?: Record<string, string | undefined>): {
  clientIdConfigured: boolean;
  redirectUri: string | undefined;
  scopes: string[];
} {
  const e = env ?? process.env;
  const clientId = String(e.WORKSHOP2_SHOPIFY_CLIENT_ID ?? '').trim();
  const redirectUri = String(e.WORKSHOP2_SHOPIFY_REDIRECT_URI ?? '').trim() || undefined;
  const scopesRaw = String(e.WORKSHOP2_SHOPIFY_SCOPES ?? 'read_products,read_orders').trim();
  return {
    clientIdConfigured: Boolean(clientId),
    redirectUri,
    scopes: scopesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function buildWorkshop2ShopifyOAuthAuthorizeUrl(input: {
  shop: string;
  state: string;
  env?: Record<string, string | undefined>;
}): { url: string | null; messageRu: string } {
  const shop = input.shop
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  if (!shop.endsWith('.myshopify.com')) {
    return { url: null, messageRu: 'Укажите shop в формате brand.myshopify.com' };
  }
  const cfg = resolveWorkshop2ShopifyOAuthConfig(input.env);
  if (!cfg.clientIdConfigured || !cfg.redirectUri) {
    return {
      url: null,
      messageRu:
        'OAuth не настроен — задайте WORKSHOP2_SHOPIFY_CLIENT_ID и WORKSHOP2_SHOPIFY_REDIRECT_URI (probe only, sync не выполняется).',
    };
  }
  const clientId = String((input.env ?? process.env).WORKSHOP2_SHOPIFY_CLIENT_ID).trim();
  const params = new URLSearchParams({
    client_id: clientId,
    scope: cfg.scopes.join(','),
    redirect_uri: cfg.redirectUri,
    state: input.state,
  });
  return {
    url: `https://${shop}/admin/oauth/authorize?${params.toString()}`,
    messageRu: 'Redirect на Shopify OAuth (без fake sync ACK).',
  };
}

export function probeWorkshop2ShopifyConnection(
  env?: Record<string, string | undefined>,
  options?: { hasStoredConnection?: boolean }
): {
  status: Workshop2ShopifyConnectionStatus;
  configured: boolean;
  messageRu: string;
} {
  const cfg = resolveWorkshop2ShopifyOAuthConfig(env);
  const token = String((env ?? process.env).WORKSHOP2_SHOPIFY_ACCESS_TOKEN ?? '').trim();
  if (token || options?.hasStoredConnection) {
    return {
      status: 'connected',
      configured: true,
      messageRu: options?.hasStoredConnection
        ? 'Shopify token в PG/file-store — product sync вне scope Wave 6.'
        : 'Shopify access token задан — live sync вне scope Wave 4 scaffold.',
    };
  }
  if (cfg.clientIdConfigured && cfg.redirectUri) {
    return {
      status: 'not_connected',
      configured: true,
      messageRu:
        'OAuth scaffold готов — подключение через authorize/callback (sync не выполняется автоматически).',
    };
  }
  return {
    status: 'not_connected',
    configured: false,
    messageRu: 'Shopify not_connected — задайте OAuth env для probe.',
  };
}

export function createWorkshop2ShopifyOAuthState(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `shopify-oauth-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
