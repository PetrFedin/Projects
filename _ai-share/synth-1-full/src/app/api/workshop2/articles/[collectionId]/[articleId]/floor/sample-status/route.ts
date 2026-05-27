/**
 * GET: poll MES sample-status (proxy, fail-closed без WORKSHOP2_FLOOR_MES_URL).
 * POST: обратная синхронизация статуса образца с пола → sample order + floorBridgeMirror в досье.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import { resolveWorkshop2FloorSampleSync } from '@/lib/production/workshop2-floor-sample-sync';
import { applyWorkshop2FloorBridgeSyncToDossier } from '@/lib/production/workshop2-floor-bridge-dossier-persist';
import {
  listWorkshop2SampleOrders,
  updateWorkshop2SampleOrder,
} from '@/lib/server/workshop2-sample-order-repository';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import {
  isWorkshop2FloorMesReverseSyncAllowed,
  pollWorkshop2FloorMesSampleStatus,
  resolveWorkshop2FloorMesPollToOrderStatus,
} from '@/lib/production/workshop2-floor-mes';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const orderId = req.nextUrl.searchParams.get('orderId')?.trim();
  const poll = await pollWorkshop2FloorMesSampleStatus({
    collectionId: cid,
    articleId: aid,
    orderId,
  });

  if (!poll.ok) {
    return NextResponse.json(
      {
        ok: false,
        pollState: poll.pollState,
        error:
          poll.pollState === 'fail_closed' ? 'floor_mes_not_configured' : 'floor_mes_poll_failed',
        messageRu:
          poll.pollState === 'fail_closed'
            ? 'WORKSHOP2_FLOOR_MES_URL не задан — poll fail-closed (без fake ACK).'
            : 'MES poll недоступен — проверьте partner URL и сеть.',
        status: poll.status,
      },
      { status: poll.pollState === 'fail_closed' ? 503 : 502 }
    );
  }

  const orderStatus = resolveWorkshop2FloorMesPollToOrderStatus(poll.payload);
  return NextResponse.json({
    ok: true,
    pollState: poll.pollState,
    payload: poll.payload,
    resolvedOrderStatus: orderStatus,
    source: 'floor_mes_poll',
  });
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  if (b.testHarness === true && process.env.NODE_ENV === 'test') {
    return NextResponse.json({
      ok: true,
      testHarness: true,
      mockStatus: String(b.mockStatus ?? 'in_progress'),
      messageRu: 'MES E2E harness (только NODE_ENV=test) — mock floor sample-status.',
    });
  }

  const orderId = typeof b.orderId === 'string' ? b.orderId.trim() : undefined;
  const floorTab = typeof b.floorTab === 'string' ? b.floorTab.trim() : undefined;
  const manualBrandSync =
    b.source === 'release_floor_panel' || b.source === 'manual_tab' || Boolean(b.sampleOrderStatus);
  const reverseFromFloor = Boolean(floorTab) || b.source === 'mes_poll';

  if (reverseFromFloor && !manualBrandSync && !isWorkshop2FloorMesReverseSyncAllowed(process.env)) {
    return jsonWorkshop2ErrorRu(503, 'floor_mes_not_configured', {
      messageRu: 'WORKSHOP2_FLOOR_MES_URL не задан — обратная синхронизация с пола fail-closed.',
    });
  }
  const sampleOrderStatus = b.sampleOrderStatus as Workshop2SampleOrderStatus | undefined;
  const movementStatus = b.movementStatus as Workshop2SampleGoodsMovementStatus | undefined;

  const resolved = resolveWorkshop2FloorSampleSync({
    floorTab,
    sampleOrderStatus,
    movementStatus,
  });

  const orders = await listWorkshop2SampleOrders({ collectionId: cid, articleId: aid });
  const target = orderId ? orders.find((o) => o.id === orderId) : orders[0];
  if (!target) {
    return jsonWorkshop2ErrorRu(404, 'sample_order_not_found');
  }

  const previousStatus = target.status;
  const actor =
    resolveWorkshop2UpdatedBy(req, String(b.actor ?? ''), auth.actor) ?? 'floor-sync-api';

  const order = await updateWorkshop2SampleOrder({
    id: target.id,
    collectionId: cid,
    articleId: aid,
    status: resolved.orderStatus,
  });

  const syncedAt = new Date().toISOString();
  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  let dossierVersion: number | undefined;
  if (record) {
    const nextDossier = applyWorkshop2FloorBridgeSyncToDossier(record.dossier, {
      floorTab,
      orderStatus: resolved.orderStatus,
      syncedAt,
      source: manualBrandSync ? 'manual_tab' : floorTab ? 'floor_api' : 'manual_tab',
      orderId: target.id,
    });
    const saved = await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: nextDossier,
      updatedBy: actor,
      txMeta: { eventType: 'workshop2_floor_bridge_sync' },
    });
    if (saved.ok) dossierVersion = saved.record.version;
  }

  try {
    const { isWorkshop2PostgresEnabled, getWorkshop2PgPool } =
      await import('@/lib/server/workshop2-pg-pool');
    if (isWorkshop2PostgresEnabled()) {
      await getWorkshop2PgPool().query(
        `INSERT INTO workshop2_floor_events
          (collection_id, article_id, order_id, floor_tab, order_status, source, actor, synced_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)`,
        [
          cid,
          aid,
          target.id,
          floorTab ?? null,
          resolved.orderStatus,
          manualBrandSync ? 'release_floor_panel' : floorTab ? 'floor_api' : 'manual_tab',
          actor,
          syncedAt,
        ]
      );
    }
  } catch {
    /* best-effort — таблица может отсутствовать до migration 018 */
  }

  if (previousStatus !== resolved.orderStatus) {
    void enqueueWorkshop2DomainEvent({
      type: 'sample_order.status_changed',
      collectionId: cid,
      articleId: aid,
      payload: {
        orderId: target.id,
        status: resolved.orderStatus,
        previousStatus,
        source: floorTab ? 'floor_mes_reverse_sync' : 'floor_bridge_api',
        mesStatus: resolved.movementStatus,
      },
    }).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.json({
    ok: true,
    order,
    resolved,
    actor,
    dossierVersion,
    source: 'floor_bridge_api',
  });
}
