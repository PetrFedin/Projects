import 'server-only';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2InspectorReport = {
  sampleOrderId: string;
  collectionId: string;
  articleId: string;
  checkedItemIds: string[];
  notes?: string;
  updatedBy?: string;
  updatedAt: string;
};

const memoryReports = new Map<string, Workshop2InspectorReport>();

function reportKey(sampleOrderId: string): string {
  return sampleOrderId.trim();
}

function mapPgRow(r: {
  sample_order_id: string;
  collection_id: string;
  article_id: string;
  checked_item_ids: string[];
  notes: string | null;
  updated_by: string | null;
  updated_at: Date;
}): Workshop2InspectorReport {
  return {
    sampleOrderId: r.sample_order_id,
    collectionId: r.collection_id,
    articleId: r.article_id,
    checkedItemIds: Array.isArray(r.checked_item_ids) ? r.checked_item_ids : [],
    notes: r.notes ?? undefined,
    updatedBy: r.updated_by ?? undefined,
    updatedAt: r.updated_at.toISOString(),
  };
}

export async function getWorkshop2InspectorReport(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
}): Promise<Workshop2InspectorReport | null> {
  const orderId = input.sampleOrderId.trim();
  if (!orderId) return null;

  if (!isWorkshop2PostgresEnabled()) {
    const row = memoryReports.get(reportKey(orderId));
    if (!row) return null;
    if (row.collectionId !== input.collectionId || row.articleId !== input.articleId) return null;
    return row;
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `SELECT sample_order_id, collection_id, article_id, checked_item_ids, notes, updated_by, updated_at
     FROM workshop2_inspector_reports
     WHERE sample_order_id = $1 AND collection_id = $2 AND article_id = $3`,
    [orderId, input.collectionId, input.articleId]
  );
  const row = res.rows[0];
  return row ? mapPgRow(row as Parameters<typeof mapPgRow>[0]) : null;
}

export async function putWorkshop2InspectorReport(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
  checkedItemIds: string[];
  notes?: string;
  updatedBy?: string;
}): Promise<Workshop2InspectorReport> {
  const now = new Date().toISOString();
  const orderId = input.sampleOrderId.trim();
  const report: Workshop2InspectorReport = {
    sampleOrderId: orderId,
    collectionId: input.collectionId.trim(),
    articleId: input.articleId.trim(),
    checkedItemIds: [...new Set(input.checkedItemIds.filter(Boolean))],
    notes: input.notes?.trim() || undefined,
    updatedBy: input.updatedBy?.trim() || undefined,
    updatedAt: now,
  };

  if (!isWorkshop2PostgresEnabled()) {
    memoryReports.set(reportKey(orderId), report);
    return report;
  }

  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_inspector_reports
      (sample_order_id, collection_id, article_id, checked_item_ids, notes, updated_by, updated_at)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7::timestamptz)
     ON CONFLICT (sample_order_id)
     DO UPDATE SET
       checked_item_ids = EXCLUDED.checked_item_ids,
       notes = EXCLUDED.notes,
       updated_by = EXCLUDED.updated_by,
       updated_at = EXCLUDED.updated_at`,
    [
      report.sampleOrderId,
      report.collectionId,
      report.articleId,
      JSON.stringify(report.checkedItemIds),
      report.notes ?? null,
      report.updatedBy ?? null,
      report.updatedAt,
    ]
  );
  return report;
}

export function clearWorkshop2InspectorReportsMemoryForTests(): void {
  memoryReports.clear();
}
