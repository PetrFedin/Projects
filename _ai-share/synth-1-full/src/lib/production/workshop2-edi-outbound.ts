/**
 * Wave 6 P1: EDI outbound 855 ACK / 856 ASN из B2B order context — journal only.
 */
import type {
  Workshop2EdiDocumentType,
  Workshop2EdiJournalEntry,
} from '@/lib/production/workshop2-edi-types';

export type Workshop2EdiOutboundContext = {
  documentType: '855' | '856';
  retailerId?: string;
  purchaseOrderId?: string;
  b2bOrderId?: string;
  lines?: Array<{ sku?: string; qty?: number; unitPrice?: number }>;
  shipNotice?: {
    carrier?: string;
    trackingNumber?: string;
    shipDate?: string;
  };
  raw?: Record<string, unknown>;
};

export function parseWorkshop2EdiOutboundBody(body: unknown): Workshop2EdiOutboundContext | null {
  if (!body || typeof body !== 'object') return null;
  const docType = String((body as { documentType?: string }).documentType ?? '').trim();
  if (docType !== '855' && docType !== '856') return null;
  const b = body as Workshop2EdiOutboundContext;
  return {
    documentType: docType,
    retailerId: b.retailerId != null ? String(b.retailerId) : undefined,
    purchaseOrderId: b.purchaseOrderId != null ? String(b.purchaseOrderId) : undefined,
    b2bOrderId: b.b2bOrderId != null ? String(b.b2bOrderId) : undefined,
    lines: Array.isArray(b.lines) ? b.lines : undefined,
    shipNotice:
      b.shipNotice && typeof b.shipNotice === 'object'
        ? (b.shipNotice as Workshop2EdiOutboundContext['shipNotice'])
        : undefined,
    raw: typeof b.raw === 'object' && b.raw ? (b.raw as Record<string, unknown>) : undefined,
  };
}

export function buildWorkshop2EdiOutboundDocument(
  ctx: Workshop2EdiOutboundContext
): Record<string, unknown> {
  const base = {
    documentType: ctx.documentType,
    retailerId: ctx.retailerId ?? 'unknown',
    purchaseOrderId: ctx.purchaseOrderId ?? ctx.b2bOrderId ?? null,
    generatedAt: new Date().toISOString(),
    direction: 'outbound',
    lines: ctx.lines ?? [],
  };
  if (ctx.documentType === '855') {
    return {
      ...base,
      acknowledgement: {
        status: 'accepted',
        noteRu: '855 PO Ack — сгенерирован из B2B контекста (без fake retailer ACK).',
      },
    };
  }
  return {
    ...base,
    advanceShipNotice: {
      carrier: ctx.shipNotice?.carrier ?? null,
      trackingNumber: ctx.shipNotice?.trackingNumber ?? null,
      shipDate: ctx.shipNotice?.shipDate ?? null,
      noteRu: '856 ASN — journal outbound, без fake carrier ACK.',
    },
  };
}

export function buildWorkshop2EdiOutboundJournalEntry(
  ctx: Workshop2EdiOutboundContext
): Workshop2EdiJournalEntry & { direction: 'outbound'; outboundDocument: Record<string, unknown> } {
  const retailerId = ctx.retailerId?.trim() || 'unknown';
  const outboundDocument = buildWorkshop2EdiOutboundDocument(ctx);
  const typeLabels: Record<Workshop2EdiDocumentType, string> = {
    '850': 'Purchase Order (850)',
    '855': 'PO Acknowledgement (855)',
    '856': 'Advance Ship Notice (856)',
  };
  return {
    id: `edi-out-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    documentType: ctx.documentType,
    retailerId,
    purchaseOrderId: ctx.purchaseOrderId ?? ctx.b2bOrderId,
    receivedAt: new Date().toISOString(),
    status: 'journal_only',
    noteRu: `${typeLabels[ctx.documentType]} outbound — journal в PG, без fake retailer ACK.`,
    payload: {
      documentType: ctx.documentType,
      retailerId,
      purchaseOrderId: ctx.purchaseOrderId,
      lines: ctx.lines,
      raw: { ...ctx.raw, direction: 'outbound', outboundDocument },
    },
    direction: 'outbound',
    outboundDocument,
  };
}

export async function postWorkshop2EdiOutboundWebhook(input: {
  entry: ReturnType<typeof buildWorkshop2EdiOutboundJournalEntry>;
  env?: Record<string, string | undefined>;
}): Promise<{ posted: boolean; httpStatus?: number }> {
  const url = String(
    input.env?.WORKSHOP2_EDI_OUTBOUND_WEBHOOK_URL ??
      process.env.WORKSHOP2_EDI_OUTBOUND_WEBHOOK_URL ??
      ''
  ).trim();
  if (!url) return { posted: false };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: input.entry.id,
        documentType: input.entry.documentType,
        direction: 'outbound',
        document: input.entry.outboundDocument,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    return { posted: res.ok, httpStatus: res.status };
  } catch {
    return { posted: false };
  }
}
