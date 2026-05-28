/**
 * Phase 4: backfill daily metrics из PG timestamps (status_history, qc_defects).
 */
import {
  buildWorkshop2ProductionAnalyticsSnapshot,
  type Workshop2ProductionAnalyticsDefectRow,
} from '@/lib/production/workshop2-production-analytics';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleOrderStatusHistoryEntry } from '@/lib/server/workshop2-sample-order-repository';
import { upsertWorkshop2ProductionMetricsDaily } from '@/lib/server/workshop2-production-metrics-daily';

function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

function collectMetricDates(input: {
  statusHistory?: Workshop2SampleOrderStatusHistoryEntry[];
  qcDefects?: Workshop2ProductionAnalyticsDefectRow[];
}): string[] {
  const dates = new Set<string>();
  for (const h of input.statusHistory ?? []) {
    if (h.at) dates.add(isoDate(h.at));
  }
  for (const d of input.qcDefects ?? []) {
    if (d.createdAt) dates.add(isoDate(d.createdAt));
  }
  return [...dates].sort();
}

export async function backfillWorkshop2ProductionMetricsDaily(input: {
  collectionId: string;
  articleId: string;
  dossier?: Workshop2DossierPhase1 | null;
  statusHistory?: Workshop2SampleOrderStatusHistoryEntry[];
  qcDefects?: Workshop2ProductionAnalyticsDefectRow[];
}): Promise<{ ok: boolean; daysWritten: number; dates: string[] }> {
  const dates = collectMetricDates(input);
  if (dates.length === 0) {
    return { ok: true, daysWritten: 0, dates: [] };
  }

  let daysWritten = 0;
  for (const metricDate of dates) {
    const from = `${metricDate}T00:00:00.000Z`;
    const to = `${metricDate}T23:59:59.999Z`;
    const snapshot = buildWorkshop2ProductionAnalyticsSnapshot({
      collectionId: input.collectionId,
      articleId: input.articleId,
      from,
      to,
      dossier: input.dossier ?? null,
      statusHistory: input.statusHistory,
      qcDefects: input.qcDefects,
    });
    await upsertWorkshop2ProductionMetricsDaily({ snapshot, metricDate });
    daysWritten += 1;
  }

  return { ok: true, daysWritten, dates };
}
