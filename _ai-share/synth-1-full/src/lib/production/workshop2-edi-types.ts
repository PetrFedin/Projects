/**
 * Wave 4 P1 B4: minimal EDI adapter scaffold (850/855/856) — journal only.
 */
export type Workshop2EdiDocumentType = '850' | '855' | '856';

export type Workshop2EdiInboundPayload = {
  documentType: Workshop2EdiDocumentType;
  retailerId?: string;
  purchaseOrderId?: string;
  lines?: Array<{ sku?: string; qty?: number; unitPrice?: number }>;
  raw?: Record<string, unknown>;
};

export type Workshop2EdiJournalEntry = {
  id: string;
  documentType: Workshop2EdiDocumentType;
  retailerId: string;
  purchaseOrderId?: string;
  receivedAt: string;
  status: 'journal_only';
  noteRu: string;
  payload: Workshop2EdiInboundPayload;
};

const VALID_TYPES: Workshop2EdiDocumentType[] = ['850', '855', '856'];

export function isWorkshop2EdiDocumentType(value: string): value is Workshop2EdiDocumentType {
  return (VALID_TYPES as readonly string[]).includes(value);
}

export function parseWorkshop2EdiInboundBody(body: unknown): Workshop2EdiInboundPayload | null {
  if (!body || typeof body !== 'object') return null;
  const docType = String((body as { documentType?: string }).documentType ?? '').trim();
  if (!isWorkshop2EdiDocumentType(docType)) return null;
  const b = body as Workshop2EdiInboundPayload;
  return {
    documentType: docType,
    retailerId: b.retailerId != null ? String(b.retailerId) : undefined,
    purchaseOrderId: b.purchaseOrderId != null ? String(b.purchaseOrderId) : undefined,
    lines: Array.isArray(b.lines) ? b.lines : undefined,
    raw: typeof b.raw === 'object' && b.raw ? (b.raw as Record<string, unknown>) : undefined,
  };
}

export function buildWorkshop2EdiJournalEntry(
  payload: Workshop2EdiInboundPayload
): Workshop2EdiJournalEntry {
  const retailerId = payload.retailerId?.trim() || 'unknown';
  const typeLabels: Record<Workshop2EdiDocumentType, string> = {
    '850': 'Purchase Order (850)',
    '855': 'PO Acknowledgement (855)',
    '856': 'Advance Ship Notice (856)',
  };
  return {
    id: `edi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    documentType: payload.documentType,
    retailerId,
    purchaseOrderId: payload.purchaseOrderId,
    receivedAt: new Date().toISOString(),
    status: 'journal_only',
    noteRu: `${typeLabels[payload.documentType]} — journal only, без fake retailer ACK.`,
    payload,
  };
}
