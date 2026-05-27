/**
 * Wave 6 P1: JOOR/NuORDER inbound order webhook → internal B2B order stub.
 */
export type Workshop2B2bMarketplaceProvider = 'joor' | 'nuorder';

export type Workshop2B2bMarketplaceInboundPayload = {
  provider: Workshop2B2bMarketplaceProvider;
  externalOrderId: string;
  campaignId?: string;
  retailerName?: string;
  lines?: Array<{ sku?: string; qty?: number; wholesalePrice?: number }>;
  raw?: Record<string, unknown>;
};

export type Workshop2B2bMarketplaceOrderStub = {
  id: string;
  externalOrderId: string;
  provider: Workshop2B2bMarketplaceProvider;
  campaignId?: string;
  status: 'stub_received';
  receivedAt: string;
  noteRu: string;
  payload: Workshop2B2bMarketplaceInboundPayload;
};

const VALID_PROVIDERS: Workshop2B2bMarketplaceProvider[] = ['joor', 'nuorder'];

export function isWorkshop2B2bMarketplaceProvider(v: string): v is Workshop2B2bMarketplaceProvider {
  return (VALID_PROVIDERS as readonly string[]).includes(v);
}

export function parseWorkshop2B2bMarketplaceInboundBody(
  body: unknown
): Workshop2B2bMarketplaceInboundPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const providerRaw = String(b.provider ?? b.source ?? 'joor')
    .trim()
    .toLowerCase();
  const provider = isWorkshop2B2bMarketplaceProvider(providerRaw) ? providerRaw : 'joor';
  const externalOrderId = String(
    b.externalOrderId ?? b.orderId ?? b.external_order_id ?? ''
  ).trim();
  if (!externalOrderId) return null;
  return {
    provider,
    externalOrderId,
    campaignId:
      b.campaignId != null
        ? String(b.campaignId)
        : b.campaign_id != null
          ? String(b.campaign_id)
          : undefined,
    retailerName: b.retailerName != null ? String(b.retailerName) : undefined,
    lines: Array.isArray(b.lines)
      ? (b.lines as Workshop2B2bMarketplaceInboundPayload['lines'])
      : undefined,
    raw: typeof b.raw === 'object' && b.raw ? (b.raw as Record<string, unknown>) : undefined,
  };
}

export function verifyWorkshop2B2bMarketplaceInboundSecret(input: {
  secretHeader?: string | null;
  env?: Record<string, string | undefined>;
}): { ok: boolean; status?: 401; messageRu?: string } {
  const expected = String(
    input.env?.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET ??
      process.env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET ??
      ''
  ).trim();
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return {
        ok: false,
        status: 401,
        messageRu:
          'B2B marketplace inbound: задайте WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET (fail-closed).',
      };
    }
    return { ok: true };
  }
  if (input.secretHeader?.trim() === expected) return { ok: true };
  return { ok: false, status: 401, messageRu: 'B2B marketplace inbound: неверный секрет.' };
}

/** Wave 17 RU: нейтральная подпись внешнего B2B заказа без JOOR/NuOrder branding при market=ru. */
export function summarizeWorkshop2B2bExternalOrderNeutralRu(input: {
  externalOrderId?: string | null;
  provider?: string | null;
  market?: 'ru' | 'global';
}): { orderId: string; labelRu: string; providerLabelRu: string | null } | null {
  const orderId = String(input.externalOrderId ?? '').trim();
  if (!orderId) return null;
  const market = input.market ?? 'ru';
  const providerRaw = String(input.provider ?? '')
    .trim()
    .toLowerCase();
  if (market === 'ru') {
    return {
      orderId,
      labelRu: `Внешний заказ: ${orderId}`,
      providerLabelRu: providerRaw ? `источник: ${providerRaw}` : null,
    };
  }
  const providerLabel =
    providerRaw === 'joor'
      ? 'JOOR'
      : providerRaw === 'nuorder'
        ? 'NuOrder'
        : providerRaw || 'marketplace';
  return {
    orderId,
    labelRu: `${providerLabel} · ${orderId}`,
    providerLabelRu: providerLabel,
  };
}

export function buildWorkshop2B2bMarketplaceOrderStub(
  payload: Workshop2B2bMarketplaceInboundPayload
): Workshop2B2bMarketplaceOrderStub {
  const campaignNote = payload.campaignId ? ` · кампания ${payload.campaignId}` : '';
  return {
    id: `bmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    externalOrderId: payload.externalOrderId,
    provider: payload.provider,
    campaignId: payload.campaignId,
    status: 'stub_received',
    receivedAt: new Date().toISOString(),
    noteRu: `${payload.provider.toUpperCase()} заказ ${payload.externalOrderId} принят в PG stub${campaignNote}.`,
    payload,
  };
}
