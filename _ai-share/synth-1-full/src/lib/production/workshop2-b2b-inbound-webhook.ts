/**
 * Wave 34 P1: B2B inbound order webhook (shop path) — HMAC, draft order, journal_only без PG.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import type {
  Workshop2B2bOrderLine,
  Workshop2B2bOrderRecord,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import type { Workshop2B2bCalendarEvent } from '@/lib/production/workshop2-b2b-campaign-hub';

export function isWorkshop2B2bInboundWebhookEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return (
    String(env.WORKSHOP2_B2B_INBOUND_WEBHOOK_ENABLED ?? '')
      .trim()
      .toLowerCase() === 'true'
  );
}

export function verifyWorkshop2B2bInboundWebhookHmac(input: {
  rawBody: string;
  signatureHeader?: string | null;
  env?: Record<string, string | undefined>;
}): { ok: boolean; status?: 401; messageRu?: string } {
  const secret = String(
    input.env?.WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET ??
      process.env.WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET ??
      ''
  ).trim();
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return {
        ok: false,
        status: 401,
        messageRu:
          'B2B inbound webhook: задайте WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET (fail-closed).',
      };
    }
    return { ok: true };
  }
  const header = String(input.signatureHeader ?? '').trim();
  if (!header) {
    return {
      ok: false,
      status: 401,
      messageRu: 'B2B inbound webhook: заголовок x-b2b-webhook-secret обязателен.',
    };
  }
  const expected = createHmac('sha256', secret).update(input.rawBody).digest('hex');
  try {
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, status: 401, messageRu: 'B2B inbound webhook: неверная HMAC-подпись.' };
    }
  } catch {
    return { ok: false, status: 401, messageRu: 'B2B inbound webhook: неверная HMAC-подпись.' };
  }
  return { ok: true };
}

export type Workshop2B2bInboundOrderPayload = {
  externalOrderRef: string;
  collectionId?: string;
  articleId?: string;
  buyerId?: string;
  brandId?: string;
  lines?: Workshop2B2bOrderLine[];
  requestedDeliveryDate?: string;
  provider?: string;
};

export function parseWorkshop2B2bInboundOrderWebhookBody(
  body: unknown
): Workshop2B2bInboundOrderPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const externalOrderRef = String(
    b.externalOrderRef ?? b.externalOrderId ?? b.orderRef ?? b.orderId ?? ''
  ).trim();
  if (!externalOrderRef) return null;
  return {
    externalOrderRef,
    collectionId: b.collectionId != null ? String(b.collectionId) : undefined,
    articleId: b.articleId != null ? String(b.articleId) : undefined,
    buyerId: b.buyerId != null ? String(b.buyerId) : undefined,
    brandId: b.brandId != null ? String(b.brandId) : undefined,
    lines: Array.isArray(b.lines) ? (b.lines as Workshop2B2bOrderLine[]) : undefined,
    requestedDeliveryDate:
      typeof b.requestedDeliveryDate === 'string' ? b.requestedDeliveryDate : undefined,
    provider: b.provider != null ? String(b.provider) : undefined,
  };
}

/** Внешний ref → внутренний draft order id (детерминированный префикс inbound). */
export function mapWorkshop2B2bInboundExternalRefToOrderId(externalOrderRef: string): string {
  const slug = externalOrderRef.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 48);
  return `inbound-${slug}`;
}

export function buildWorkshop2B2bInboundDraftOrder(
  payload: Workshop2B2bInboundOrderPayload
): Workshop2B2bOrderRecord {
  const now = new Date().toISOString();
  const lines = payload.lines ?? [];
  const totalRub = lines.reduce(
    (sum, l) => sum + (Number(l.qty) || 0) * (Number(l.wholesalePriceRub) || 0),
    0
  );
  return {
    id: mapWorkshop2B2bInboundExternalRefToOrderId(payload.externalOrderRef),
    collectionId: payload.collectionId ?? 'SS27',
    articleId: payload.articleId ?? 'demo-ss27-01',
    buyerId: payload.buyerId ?? 'inbound-buyer',
    brandId: payload.brandId,
    status: 'draft',
    tier: 'standard',
    totalRub,
    lines,
    requestedDeliveryDate: payload.requestedDeliveryDate,
    createdAt: now,
    updatedAt: now,
  };
}

/** Calendar stub для inbound draft (без PG sync). */
export function buildWorkshop2B2bInboundCalendarStubEvent(
  order: Workshop2B2bOrderRecord,
  externalOrderRef: string
): Workshop2B2bCalendarEvent {
  const date =
    order.requestedDeliveryDate?.trim().slice(0, 10) ??
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  return {
    id: `b2b-inbound-stub-${order.id}`,
    collectionId: order.collectionId ?? 'SS27',
    articleId: order.articleId,
    source: 'b2b',
    title: `Inbound webhook · ${externalOrderRef}`,
    startAt: `${date}T10:00:00.000Z`,
    endAt: `${date}T11:00:00.000Z`,
    kind: 'market_date',
  };
}

export function summarizeWorkshop2B2bInboundOrderChatRu(input: {
  externalOrderRef: string;
  orderId: string;
  persistMode: string;
}): string {
  return `[Система] B2B inbound: внешний заказ ${input.externalOrderRef} → черновик ${input.orderId} (${input.persistMode}).`;
}
