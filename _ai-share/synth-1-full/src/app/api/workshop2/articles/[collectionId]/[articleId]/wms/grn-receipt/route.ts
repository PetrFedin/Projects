/**
 * POST — GRN-lite: приход (receipt) по строке снабжения после получения PO.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import { persistWorkshop2InternalWmsToDossier } from '@/lib/production/workshop2-internal-wms';
import { recordWorkshop2WmsGrnReceiptForSupplyLine } from '@/lib/server/workshop2-internal-wms-server';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
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

  const supplyLineId = String(body.supplyLineId ?? '').trim();
  const qty = Number(body.qty);
  if (!supplyLineId || !Number.isFinite(qty) || qty <= 0) {
    return jsonWorkshop2ErrorRu(400, 'invalid_line_or_qty');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'wms-grn-api';
  const result = await recordWorkshop2WmsGrnReceiptForSupplyLine({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    supplyLineId,
    qty,
    actor,
    poLineRef: body.poLineRef != null ? String(body.poLineRef) : undefined,
  });

  if (!result.ok) {
    return jsonWorkshop2ErrorRu(400, 'grn_failed', { messageRu: result.messageRu });
  }

  const nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, {
    mirror: result.mirror,
  });
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_wms_grn_receipt', eventPayload: { supplyLineId } },
  });

  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: true,
    movement: result.movement,
    balance: result.balance,
    mirror: result.mirror,
    dossierVersion: saved.record.version,
  });
}
