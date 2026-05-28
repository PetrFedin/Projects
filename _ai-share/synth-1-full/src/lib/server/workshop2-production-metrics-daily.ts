/**
 * Migration 020 helper: upsert daily production metrics rollup.
 */
import 'server-only';

import { randomUUID } from 'node:crypto';
import type { Workshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryRollups: Array<{
  collectionId: string;
  articleId: string;
  metricDate: string;
  snapshot: Workshop2ProductionAnalyticsSnapshot;
}> = [];

export function clearWorkshop2ProductionMetricsMemoryForTests(): void {
  memoryRollups.length = 0;
}

export async function upsertWorkshop2ProductionMetricsDaily(input: {
  snapshot: Workshop2ProductionAnalyticsSnapshot;
  metricDate?: string;
}): Promise<{ ok: boolean; id: string }> {
  const metricDate = (input.metricDate ?? new Date().toISOString().slice(0, 10)).slice(0, 10);
  const s = input.snapshot;
  const id = `${s.collectionId}:${s.articleId}:${metricDate}`;

  if (!isWorkshop2PostgresEnabled()) {
    const idx = memoryRollups.findIndex(
      (r) =>
        r.collectionId === s.collectionId &&
        r.articleId === s.articleId &&
        r.metricDate === metricDate
    );
    const row = { collectionId: s.collectionId, articleId: s.articleId, metricDate, snapshot: s };
    if (idx >= 0) memoryRollups[idx] = row;
    else memoryRollups.push(row);
    return { ok: true, id };
  }

  await ensureWorkshop2PgSchema();
  const pool = getWorkshop2PgPool();
  const rowId = randomUUID();
  await pool.query(
    `INSERT INTO workshop2_production_metrics_daily
      (id, collection_id, article_id, metric_date, sample_lead_time_days, rework_rate,
       defect_count, operations_progress_pct, routing_variance_pct, economics_variance_pct, payload_json, updated_at)
     VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9, $10, $11::jsonb, NOW())
     ON CONFLICT (collection_id, article_id, metric_date)
     DO UPDATE SET
       sample_lead_time_days = EXCLUDED.sample_lead_time_days,
       rework_rate = EXCLUDED.rework_rate,
       defect_count = EXCLUDED.defect_count,
       operations_progress_pct = EXCLUDED.operations_progress_pct,
       routing_variance_pct = EXCLUDED.routing_variance_pct,
       economics_variance_pct = EXCLUDED.economics_variance_pct,
       payload_json = EXCLUDED.payload_json,
       updated_at = NOW()`,
    [
      rowId,
      s.collectionId,
      s.articleId,
      metricDate,
      s.sampleLeadTimeDays,
      s.reworkRate,
      s.defectCount,
      s.operationsProgressPct,
      s.routingVariancePct,
      s.economicsVariancePct,
      JSON.stringify(s),
    ]
  );
  return { ok: true, id: rowId };
}

export async function listWorkshop2ProductionMetricsDaily(input: {
  collectionId: string;
  articleId: string;
  from?: string;
  to?: string;
}): Promise<Workshop2ProductionAnalyticsSnapshot[]> {
  if (!isWorkshop2PostgresEnabled()) {
    return memoryRollups
      .filter(
        (r) =>
          r.collectionId === input.collectionId.trim() && r.articleId === input.articleId.trim()
      )
      .map((r) => r.snapshot);
  }
  await ensureWorkshop2PgSchema();
  const pool = getWorkshop2PgPool();
  const params: unknown[] = [input.collectionId.trim(), input.articleId.trim()];
  let sql = `SELECT payload_json FROM workshop2_production_metrics_daily
             WHERE collection_id = $1 AND article_id = $2`;
  if (input.from) {
    params.push(input.from.slice(0, 10));
    sql += ` AND metric_date >= $${params.length}::date`;
  }
  if (input.to) {
    params.push(input.to.slice(0, 10));
    sql += ` AND metric_date <= $${params.length}::date`;
  }
  sql += ' ORDER BY metric_date DESC LIMIT 90';
  const res = await pool.query<{ payload_json: Workshop2ProductionAnalyticsSnapshot }>(sql, params);
  return res.rows.map((r) => r.payload_json);
}
