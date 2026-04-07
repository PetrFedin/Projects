import { NextResponse } from 'next/server';
import {
  aggregateW2DossierMetrics,
  aggregateW2DossierMetricsByOrgLatest,
  aggregateW2DossierMetricsByTeamLatest,
  aggregateW2DossierMetricsDedupLatest,
  getW2DossierMetricsFilePath,
} from '@/lib/server/workshop2-dossier-metrics-store';
import { readW2DossierMetricsUnified } from '@/lib/server/workshop2-dossier-metrics-backend';
import { w2DossierMetricsBackendLabel } from '@/lib/server/workshop2-dossier-metrics-upstash';
import { verifyW2DossierMetricsReadRequest } from '@/lib/server/workshop2-dossier-metrics-auth';
import { applyW2MetricsTimeFilter } from '@/lib/server/workshop2-dossier-metrics-time';

export const dynamic = 'force-dynamic';

/**
 * Агрегаты для админ-UI. Тот же секрет, что и GET /api/production/workshop2-dossier-metrics
 * (READ или ADMIN — достаточно одного). X-W2-Metrics-Key также принимается.
 */

export async function GET(request: Request) {
  if (!verifyW2DossierMetricsReadRequest(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '2000', 10) || 2000, 1), 5000);
  const colRaw = searchParams.get('collections')?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const collectionFilter = colRaw.length > 0 ? new Set(colRaw) : undefined;

  try {
    const rawRows = await readW2DossierMetricsUnified(limit);
    const { rows, meta: timeFilter } = applyW2MetricsTimeFilter(rawRows, searchParams);
    const aggregate = aggregateW2DossierMetrics(rows, collectionFilter);
    const aggregateDedupLatest = aggregateW2DossierMetricsDedupLatest(rows, collectionFilter);
    const teamLatest = aggregateW2DossierMetricsByTeamLatest(rows, collectionFilter);
    const orgLatest = aggregateW2DossierMetricsByOrgLatest(rows, collectionFilter);
    return NextResponse.json({
      ok: true,
      storage: w2DossierMetricsBackendLabel(),
      fileFallbackPath: getW2DossierMetricsFilePath(),
      aggregate,
      aggregateDedupLatest,
      teamLatest,
      orgLatest,
      rowsLoaded: rows.length,
      rowsRead: rawRows.length,
      timeFilter,
    });
  } catch (e) {
    console.error('[admin dossier-metrics]', e);
    return NextResponse.json({ ok: false, error: 'read_failed' }, { status: 500 });
  }
}
