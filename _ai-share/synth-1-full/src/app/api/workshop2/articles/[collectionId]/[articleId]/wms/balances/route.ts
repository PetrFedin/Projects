/**
 * GET — балансы internal WMS; POST — sync items из BOM/supply + seed balances.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2InternalWmsMirror,
  isWorkshop2InternalWmsEnabled,
  persistWorkshop2InternalWmsToDossier,
} from '@/lib/production/workshop2-internal-wms';
import {
  listWorkshop2WmsBalancesForArticle,
  listWorkshop2WmsMovements,
} from '@/lib/server/workshop2-wms-repository';
import { syncWorkshop2WmsItemsFromSupplyBom } from '@/lib/server/workshop2-internal-wms-server';
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
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getWmsBalances(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const pgOn = isWorkshop2PostgresEnabled();
  const wmsOn = isWorkshop2InternalWmsEnabled();

  if (!wmsOn) {
    return NextResponse.json(
      {
        ok: false,
        error: 'internal_wms_disabled',
        pgEnabled: pgOn,
        internalWmsEnabled: false,
        balances: [],
        movements: [],
        failClosed: true,
        messageRu:
          'Internal WMS выключен (нет WORKSHOP2_DATABASE_URL или WORKSHOP2_INTERNAL_WMS=false).',
      },
      { status: 503 }
    );
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: cid,
    articleId: aid,
  });
  const movements = await listWorkshop2WmsMovements({
    collectionId: cid,
    articleId: aid,
    limit: 30,
  });

  return NextResponse.json({
    ok: true,
    pgEnabled: pgOn,
    internalWmsEnabled: true,
    balances,
    movements,
    dossierMirror: record?.dossier.internalWmsMirror ?? null,
    stockWmsLedger: record?.dossier.stockWmsLedger ?? null,
    failClosed: false,
  });
}

async function postWmsBalances(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  if (!isWorkshop2InternalWmsEnabled()) {
    return jsonWorkshop2ErrorRu(503, 'internal_wms_disabled', {
      messageRu: 'Internal WMS недоступен без PostgreSQL.',
    });
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // optional body
  }

  const sync = await syncWorkshop2WmsItemsFromSupplyBom({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    supply: body.supply as Parameters<typeof syncWorkshop2WmsItemsFromSupplyBom>[0]['supply'],
  });

  const movements = await listWorkshop2WmsMovements({
    collectionId: cid,
    articleId: aid,
    limit: 30,
  });

  const mirror = buildWorkshop2InternalWmsMirror({
    balances: sync.balances.map((b) => ({
      itemId: b.itemId,
      sku: b.sku,
      label: b.label,
      unit: b.unit,
      locationCode: b.locationCode,
      qtyOnHand: b.qtyOnHand,
      qtyReserved: b.qtyReserved,
      qtyAvailable: b.qtyAvailable,
    })),
    movementCount: movements.length,
    reserveDeficitCount: record.dossier.internalWmsMirror?.reserveDeficitCount ?? 0,
    pgBacked: isWorkshop2PostgresEnabled(),
  });

  const actor =
    resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'wms-sync-api';
  const nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, { mirror });
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_wms_sync_bom' },
  });

  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: true,
    itemsSynced: sync.itemsSynced,
    balances: sync.balances,
    mirror: nextDossier.internalWmsMirror,
    dossierVersion: saved.record.version,
  });
}

export const GET = withWorkshop2ApiErrorRu(getWmsBalances);
export const POST = withWorkshop2ApiErrorRu(postWmsBalances);
