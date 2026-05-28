/**
 * M6: repository workshop2_qc_defects (PG + memory fallback).
 */
import 'server-only';

import { randomUUID } from 'node:crypto';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2QcDefectRecord = {
  id: string;
  collectionId: string;
  articleId: string;
  sampleOrderId?: string;
  defectCode: string;
  defectLabel?: string;
  severity: 'minor' | 'major' | 'critical';
  qtyAffected?: number;
  source: 'mes' | 'visual_qc' | 'inspector';
  mesEventId?: string;
  pinId?: string;
  createdAt: string;
};

const memoryStore: Workshop2QcDefectRecord[] = [];

export function clearWorkshop2QcDefectsMemoryForTests(): void {
  memoryStore.length = 0;
}

export async function insertWorkshop2QcDefect(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId?: string;
  defectCode: string;
  defectLabel?: string;
  severity: 'minor' | 'major' | 'critical';
  qtyAffected?: number;
  source: Workshop2QcDefectRecord['source'];
  mesEventId?: string;
  pinId?: string;
}): Promise<Workshop2QcDefectRecord> {
  const record: Workshop2QcDefectRecord = {
    id: randomUUID(),
    collectionId: input.collectionId.trim(),
    articleId: input.articleId.trim(),
    sampleOrderId: input.sampleOrderId?.trim() || undefined,
    defectCode: input.defectCode.trim(),
    defectLabel: input.defectLabel?.trim() || undefined,
    severity: input.severity,
    qtyAffected: input.qtyAffected,
    source: input.source,
    mesEventId: input.mesEventId?.trim() || undefined,
    pinId: input.pinId?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  if (!isWorkshop2PostgresEnabled()) {
    memoryStore.unshift(record);
    return record;
  }

  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_qc_defects (
      id, collection_id, article_id, sample_order_id, defect_code, defect_label,
      severity, qty_affected, source, mes_event_id, pin_id, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::timestamptz)`,
    [
      record.id,
      record.collectionId,
      record.articleId,
      record.sampleOrderId ?? null,
      record.defectCode,
      record.defectLabel ?? null,
      record.severity,
      record.qtyAffected ?? null,
      record.source,
      record.mesEventId ?? null,
      record.pinId ?? null,
      record.createdAt,
    ]
  );
  return record;
}

export async function listWorkshop2QcDefectsByArticle(input: {
  collectionId: string;
  articleId: string;
  limit?: number;
}): Promise<Workshop2QcDefectRecord[]> {
  const limit = Math.min(50, Math.max(1, input.limit ?? 20));
  if (!isWorkshop2PostgresEnabled()) {
    return memoryStore
      .filter(
        (r) =>
          r.collectionId === input.collectionId.trim() && r.articleId === input.articleId.trim()
      )
      .slice(0, limit);
  }

  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    collection_id: string;
    article_id: string;
    sample_order_id: string | null;
    defect_code: string;
    defect_label: string | null;
    severity: string;
    qty_affected: number | null;
    source: string;
    mes_event_id: string | null;
    pin_id: string | null;
    created_at: Date;
  }>(
    `SELECT id, collection_id, article_id, sample_order_id, defect_code, defect_label,
            severity, qty_affected, source, mes_event_id, pin_id, created_at
     FROM workshop2_qc_defects
     WHERE collection_id = $1 AND article_id = $2
     ORDER BY created_at DESC
     LIMIT $3`,
    [input.collectionId.trim(), input.articleId.trim(), limit]
  );

  return res.rows.map((row) => ({
    id: row.id,
    collectionId: row.collection_id,
    articleId: row.article_id,
    sampleOrderId: row.sample_order_id ?? undefined,
    defectCode: row.defect_code,
    defectLabel: row.defect_label ?? undefined,
    severity: row.severity as Workshop2QcDefectRecord['severity'],
    qtyAffected: row.qty_affected ?? undefined,
    source: row.source as Workshop2QcDefectRecord['source'],
    mesEventId: row.mes_event_id ?? undefined,
    pinId: row.pin_id ?? undefined,
    createdAt: row.created_at.toISOString(),
  }));
}
