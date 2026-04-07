import { NextResponse } from 'next/server';
import { aggregateW2DossierMetricsDedupLatest } from '@/lib/server/workshop2-dossier-metrics-store';
import { readW2DossierMetricsUnified } from '@/lib/server/workshop2-dossier-metrics-backend';
import { verifyW2DossierMetricsReadRequest } from '@/lib/server/workshop2-dossier-metrics-auth';
import { applyW2MetricsTimeFilter } from '@/lib/server/workshop2-dossier-metrics-time';
import { buildW2OpsAlerts, buildW2OpsDailySeries } from '@/lib/server/workshop2-dossier-metrics-ops';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!verifyW2DossierMetricsReadRequest(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '4000', 10) || 4000, 1), 5000);
  const daysBack = Math.min(Math.max(parseInt(searchParams.get('daysBack') ?? '14', 10) || 14, 1), 90);
  const colRaw = searchParams.get('collections')?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  const collectionFilter = colRaw.length > 0 ? new Set(colRaw) : undefined;

  try {
    const rawRows = await readW2DossierMetricsUnified(limit);
    const { rows, meta: timeFilter } = applyW2MetricsTimeFilter(rawRows, searchParams);
    const aggregateDedupLatest = aggregateW2DossierMetricsDedupLatest(rows, collectionFilter);
    const dailySeries = buildW2OpsDailySeries(rows, daysBack, collectionFilter);
    const alerts = buildW2OpsAlerts(rows, aggregateDedupLatest);
    return NextResponse.json({
      ok: true,
      dailySeries,
      alerts,
      aggregateDedupLatest,
      rowsLoaded: rows.length,
      rowsRead: rawRows.length,
      timeFilter,
      daysBack,
    });
  } catch (e) {
    console.error('[dossier-metrics-ops]', e);
    return NextResponse.json({ ok: false, error: 'read_failed' }, { status: 500 });
  }
}
