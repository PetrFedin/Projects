/**
 * POST — запись движения internal WMS (receipt | issue | reserve | release).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import {
  buildWorkshop2InternalWmsMirror,
  persistWorkshop2InternalWmsToDossier,
} from '@/lib/production/workshop2-internal-wms';
import {
  listWorkshop2WmsBalancesForArticle,
  listWorkshop2WmsMovements,
  recordWorkshop2WmsMovement,
  type Workshop2WmsMovementKind,
} from '@/lib/server/workshop2-wms-repository';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

const KINDS: Workshop2WmsMovementKind[] = ['reserve', 'release', 'receipt', 'issue'];

async function postWmsMovements(req: NextRequest, ctx: RouteCtx) {
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

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const kind = String(body.kind ?? '').trim() as Workshop2WmsMovementKind;
  if (!KINDS.includes(kind)) {
    return jsonWorkshop2ErrorRu(400, 'invalid_kind');
  }

  const itemId = String(body.itemId ?? '').trim();
  const qty = Number(body.qty);
  if (!itemId || !Number.isFinite(qty) || qty <= 0) {
    return jsonWorkshop2ErrorRu(400, 'invalid_item_or_qty');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'wms-movement-api';
  const { movement, balance } = await recordWorkshop2WmsMovement({
    collectionId: cid,
    articleId: aid,
    kind,
    qty,
    itemId,
    supplyLineRef: body.supplyLineRef != null ? String(body.supplyLineRef) : undefined,
    bomLineRef: body.bomLineRef != null ? String(body.bomLineRef) : undefined,
    actor,
    note: body.note != null ? String(body.note) : undefined,
  });

  const balances = await listWorkshop2WmsBalancesForArticle({
    collectionId: cid,
    articleId: aid,
  });
  const movements = await listWorkshop2WmsMovements({
    collectionId: cid,
    articleId: aid,
    limit: 50,
  });

  const mirror = buildWorkshop2InternalWmsMirror({
    balances: balances.map((b) => ({
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

  const nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, { mirror });
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_wms_movement', eventPayload: { kind, itemId } },
  });

  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: true,
    movement,
    balance,
    mirror: nextDossier.internalWmsMirror,
    dossierVersion: saved.record.version,
  });
}

export const POST = withWorkshop2ApiErrorRu(postWmsMovements);
