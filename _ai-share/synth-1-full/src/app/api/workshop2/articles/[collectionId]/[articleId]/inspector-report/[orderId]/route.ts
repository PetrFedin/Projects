/**
 * GET/PUT — чек-лист мобильного инспектора ОТК (PG primary).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2InspectorReport,
  putWorkshop2InspectorReport,
} from '@/lib/server/workshop2-inspector-report-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { resolveWorkshop2InspectorReadPath } from '@/lib/production/workshop2-inspector-read-path';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import {
  WORKSHOP2_ARTICLE_CONTEXT_TYPE,
  workshop2ArticleContextId,
} from '@/lib/production/workshop2-domain-event-types';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { syncWorkshop2InspectorReportMirrorAfterPut } from '@/lib/production/workshop2-inspector-report-dossier-persist';
import { syncWorkshop2QcPanelMirrorAfterInspectorPut } from '@/lib/production/workshop2-qc-panel-dossier-persist';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

type RouteCtx = {
  params: Promise<{ collectionId: string; articleId: string; orderId: string }>;
};

export const GET = withWorkshop2ApiErrorRu(async function getInspectorReport(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId, orderId } = await ctx.params;
  const pgEnabled = isWorkshop2PostgresEnabled();
  const report = await getWorkshop2InspectorReport({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
    sampleOrderId: decodeURIComponent(orderId).trim(),
  });
  const readPath = resolveWorkshop2InspectorReadPath({ pgEnabled, report });
  return NextResponse.json({
    ok: true,
    report: readPath.report,
    readPath: {
      readSource: readPath.readSource,
      pgPrimary: readPath.pgPrimary,
      allowLocalStorageFallback: readPath.allowLocalStorageFallback,
      hintRu: readPath.hintRu,
    },
  });
});

export const PUT = withWorkshop2ApiErrorRu(async function putInspectorReport(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId, orderId } = await ctx.params;
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const checkedItemIds = Array.isArray(body.checkedItemIds) ? body.checkedItemIds.map(String) : [];

  if (!isWorkshop2PostgresEnabled()) {
    return jsonWorkshop2ErrorRu(503, 'postgres_disabled', {
      messageRu:
        'PostgreSQL недоступен — inspector-report не записан (fail-closed). Используйте offline-очередь PWA.',
    });
  }

  const report = await putWorkshop2InspectorReport({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
    sampleOrderId: decodeURIComponent(orderId).trim(),
    checkedItemIds,
    notes: body.notes ? String(body.notes) : undefined,
    updatedBy: body.updatedBy ? String(body.updatedBy) : undefined,
  });

  const cid = collectionId.trim();
  const aid = articleId.trim();
  const orderIdDecoded = decodeURIComponent(orderId).trim();

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (record) {
    let orderQty = 1;
    try {
      const orders = await listWorkshop2SampleOrders({ collectionId: cid, articleId: aid });
      const match = orders.find((o) => o.id === orderIdDecoded);
      if (match?.quantity) orderQty = match.quantity;
    } catch {
      /* optional */
    }
    const nextDossier = syncWorkshop2QcPanelMirrorAfterInspectorPut({
      dossier: syncWorkshop2InspectorReportMirrorAfterPut({
        dossier: record.dossier,
        report,
        orderQty,
      }),
      sampleOrderId: orderIdDecoded,
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: nextDossier,
      baseVersion: record.version,
      updatedBy: body.updatedBy ? String(body.updatedBy) : 'inspector-report-put',
      txMeta: { eventType: 'qc_inspector_report_saved' },
    });
  }

  void enqueueWorkshop2DomainEvent({
    type: 'qc.inspector_report.saved',
    collectionId: cid,
    articleId: aid,
    payload: {
      orderId: orderIdDecoded,
      checkedCount: checkedItemIds.length,
      pgSynced: true,
    },
  }).catch(() => {
    /* best-effort */
  });

  void appendWorkshop2ContextualSystemMessage({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    contextId: workshop2ArticleContextId(cid, aid),
    message: `ОТК: отчёт инспектора сохранён (${checkedItemIds.length} пунктов) — заказ ${orderIdDecoded.slice(0, 8)}.`,
  }).catch(() => {
    /* best-effort */
  });

  if (body.offlineReplay === true) {
    void enqueueWorkshop2DomainEvent({
      type: 'sample_order.status_changed',
      collectionId: collectionId.trim(),
      articleId: articleId.trim(),
      payload: {
        orderId: decodeURIComponent(orderId).trim(),
        status: 'inspector_synced',
        source: 'inspector_offline_replay',
        checkedCount: checkedItemIds.length,
      },
    }).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.json({ ok: true, report });
});
