/**
 * GET — production analytics snapshot (article scoped).
 * ?format=csv — CFO export.
 */
import { buildWorkshop2ProductionAnalyticsCsv } from '@/lib/production/workshop2-production-analytics-csv';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { buildWorkshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';
import { mapDossierProductionModelToReleaseOperations } from '@/lib/production/article-workspace/sync-operational-from-dossier';
import {
  buildWorkshop2ProductionSparklineFromSnapshot,
  buildWorkshop2ProductionSparklineSeries,
} from '@/lib/production/workshop2-production-sparkline';
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2DomainEventsForArticle } from '@/lib/server/workshop2-domain-events';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2QcDefectsByArticle } from '@/lib/server/workshop2-qc-defects-repository';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import {
  listWorkshop2ProductionMetricsDaily,
  upsertWorkshop2ProductionMetricsDaily,
} from '@/lib/server/workshop2-production-metrics-daily';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function buildAnalyticsResponse(input: {
  collectionId: string;
  articleId: string;
  from?: string;
  to?: string;
  persist?: boolean;
}) {
  const [record, orders, defects, events] = await Promise.all([
    getWorkshop2ServerDossierRecord(input.collectionId, input.articleId),
    listWorkshop2SampleOrders({
      collectionId: input.collectionId,
      articleId: input.articleId,
    }),
    listWorkshop2QcDefectsByArticle({
      collectionId: input.collectionId,
      articleId: input.articleId,
      limit: 100,
    }),
    listWorkshop2DomainEventsForArticle({
      collectionId: input.collectionId,
      articleId: input.articleId,
      limit: 200,
    }),
  ]);

  const activeOrder = orders[0];
  const snapshot = buildWorkshop2ProductionAnalyticsSnapshot({
    collectionId: input.collectionId,
    articleId: input.articleId,
    from: input.from,
    to: input.to,
    dossier: record?.dossier ?? null,
    releaseOperations: record?.dossier
      ? mapDossierProductionModelToReleaseOperations(record.dossier)
      : null,
    statusHistory: activeOrder?.statusHistory,
    qcDefects: defects.map((d) => ({
      defectCode: d.defectCode,
      severity: d.severity,
      source: d.source,
      createdAt: d.createdAt,
    })),
    domainEvents: events,
  });

  if (input.persist) {
    void upsertWorkshop2ProductionMetricsDaily({ snapshot }).catch(() => {});
  }

  const toDate = new Date().toISOString().slice(0, 10);
  const fromDate = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const dailySnapshots = await listWorkshop2ProductionMetricsDaily({
    collectionId: input.collectionId,
    articleId: input.articleId,
    from: fromDate,
    to: toDate,
  });

  const sparklineValues = buildWorkshop2ProductionSparklineFromSnapshot(snapshot);
  const sparklineSeries = buildWorkshop2ProductionSparklineSeries({
    dailySnapshots,
    fallbackSnapshot: snapshot,
    days: 7,
  });

  return {
    snapshot,
    sparklineValues,
    sparklineSeries,
    dailyMetricsCount: dailySnapshots.length,
  };
}

export const GET = withWorkshop2ApiErrorRu(async function getProductionAnalytics(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const from = req.nextUrl.searchParams.get('from')?.trim() || undefined;
  const to = req.nextUrl.searchParams.get('to')?.trim() || undefined;
  const persist = req.nextUrl.searchParams.get('persist') === '1';
  const format = req.nextUrl.searchParams.get('format')?.trim().toLowerCase();

  const { snapshot, sparklineValues, sparklineSeries, dailyMetricsCount } =
    await buildAnalyticsResponse({
      collectionId: cid,
      articleId: aid,
      from,
      to,
      persist,
    });

  if (format === 'csv') {
    const csv = buildWorkshop2ProductionAnalyticsCsv(snapshot);
    const filename = `production-analytics-${cid}-${aid}.csv`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    analytics: snapshot,
    sparklineValues,
    sparklineSeries,
    dailyMetricsCount,
  });
});
