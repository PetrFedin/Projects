/**
 * POST — backfill daily production metrics из PG timestamps.
 */
import { backfillWorkshop2ProductionMetricsDaily } from '@/lib/production/workshop2-production-metrics-backfill';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2QcDefectsByArticle } from '@/lib/server/workshop2-qc-defects-repository';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const POST = withWorkshop2ApiErrorRu(async function postProductionAnalyticsBackfill(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const [record, orders, defects] = await Promise.all([
    getWorkshop2ServerDossierRecord(cid, aid),
    listWorkshop2SampleOrders({ collectionId: cid, articleId: aid }),
    listWorkshop2QcDefectsByArticle({ collectionId: cid, articleId: aid, limit: 500 }),
  ]);

  const activeOrder = orders[0];
  const result = await backfillWorkshop2ProductionMetricsDaily({
    collectionId: cid,
    articleId: aid,
    dossier: record?.dossier ?? null,
    statusHistory: activeOrder?.statusHistory,
    qcDefects: defects.map((d) => ({
      defectCode: d.defectCode,
      severity: d.severity,
      source: d.source,
      createdAt: d.createdAt,
    })),
  });

  return NextResponse.json({
    ok: true,
    daysWritten: result.daysWritten,
    dates: result.dates,
    hintRu:
      result.daysWritten > 0
        ? `Backfill: ${result.daysWritten} дн. из status_history / qc_defects.`
        : 'Нет дат для backfill — нужны status_history или qc_defects.',
  });
});
