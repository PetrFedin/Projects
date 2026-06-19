import 'server-only';

import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool } from '@/lib/server/workshop2-pg-pool';
import {
  buildWorkshop2B2bInvoiceHtmlUrl,
  buildWorkshop2B2bSchetOffertaApiUrl,
  readWorkshop2B2bInvoiceStubJournal,
  appendWorkshop2B2bInvoiceStubJournal,
} from '@/lib/production/workshop2-b2b-invoice-stub';

export type Workshop2B2bInvoiceRow = {
  id: string;
  orderId: string;
  brandId: string;
  tenantId: string;
  totalRub: number;
  status: string;
  pdfPathPlaceholderRu?: string;
  invoiceHtmlUrl?: string;
  createdAt: string;
  updatedAt: string;
  mode: 'pg' | 'journal_only';
};

function rowToInvoice(row: {
  id: string;
  order_id: string;
  brand_id: string;
  tenant_id: string;
  total_rub: string;
  status: string;
  pdf_path_placeholder_ru: string | null;
  invoice_html_url: string | null;
  created_at: Date;
  updated_at: Date;
}): Workshop2B2bInvoiceRow {
  return {
    id: row.id,
    orderId: row.order_id,
    brandId: row.brand_id,
    tenantId: row.tenant_id,
    totalRub: Number(row.total_rub) || 0,
    status: row.status,
    pdfPathPlaceholderRu: row.pdf_path_placeholder_ru ?? undefined,
    invoiceHtmlUrl: row.invoice_html_url ?? buildWorkshop2B2bInvoiceHtmlUrl(row.order_id),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    mode: 'pg',
  };
}

/** Wave 54: list invoice rows scoped by tenantId — PG when DATABASE_URL, else journal stub. */
export async function listWorkshop2B2bInvoicesByTenantId(
  tenantId: string
): Promise<Workshop2B2bInvoiceRow[]> {
  const tid = tenantId.trim();
  if (!tid) return [];

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query(
      `SELECT id, order_id, brand_id, tenant_id, total_rub, status,
              pdf_path_placeholder_ru, invoice_html_url, created_at, updated_at
       FROM workshop2_b2b_invoice
       WHERE tenant_id = $1
       ORDER BY updated_at DESC
       LIMIT 500`,
      [tid]
    );
    return res.rows.map(rowToInvoice);
  }

  const journal = readWorkshop2B2bInvoiceStubJournal();
  return journal
    .filter((e) => e.tenantId === tid)
    .map((e) => ({
      id: e.id,
      orderId: e.orderId,
      brandId: e.brandId,
      tenantId: e.tenantId,
      totalRub: e.totalRub,
      status: 'journal_only',
      pdfPathPlaceholderRu: e.pdfPathPlaceholderRu,
      invoiceHtmlUrl: buildWorkshop2B2bInvoiceHtmlUrl(e.orderId),
      createdAt: e.at,
      updatedAt: e.at,
      mode: 'journal_only' as const,
    }));
}

/** Upsert stub row into journal when PG unavailable (export fallback). */
export function ensureWorkshop2B2bInvoiceJournalStub(input: {
  orderId: string;
  brandId: string;
  tenantId: string;
  totalRub: number;
}): void {
  if (isWorkshop2PostgresEnabled()) return;
  appendWorkshop2B2bInvoiceStubJournal(input);
}

/** PG-primary invoice row for native B2B order (replaces journal-only stub when PG on). */
export async function upsertWorkshop2B2bInvoiceForOrder(input: {
  orderId: string;
  brandId?: string;
  tenantId?: string;
  totalRub: number;
  status?: string;
}): Promise<void> {
  const orderId = input.orderId.trim();
  if (!orderId) return;

  const brandId = input.brandId?.trim() || 'brand-syntha-lab';
  const tenantId = input.tenantId?.trim() || brandId;
  const totalRub = Math.max(0, Math.round(input.totalRub));
  const status = input.status?.trim() || 'issued';
  const htmlUrl = buildWorkshop2B2bInvoiceHtmlUrl(orderId);
  const pdfUrl = buildWorkshop2B2bSchetOffertaApiUrl(orderId);

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const id = `inv-${orderId}`;
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_b2b_invoice
         (id, order_id, brand_id, tenant_id, total_rub, status, pdf_path_placeholder_ru, invoice_html_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         total_rub = EXCLUDED.total_rub,
         status = EXCLUDED.status,
         pdf_path_placeholder_ru = EXCLUDED.pdf_path_placeholder_ru,
         invoice_html_url = EXCLUDED.invoice_html_url,
         updated_at = NOW()`,
      [id, orderId, brandId, tenantId, totalRub, status, pdfUrl, htmlUrl]
    );
    return;
  }

  ensureWorkshop2B2bInvoiceJournalStub({
    orderId,
    brandId,
    tenantId,
    totalRub,
  });
}
