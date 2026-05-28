/**
 * POST — мягкий резерв WMS под образец (не в sample-order gate; вызывается после gate pass).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import { persistWorkshop2InternalWmsToDossier } from '@/lib/production/workshop2-internal-wms';
import { buildWorkshop2WmsFileModeHonesty } from '@/lib/production/workshop2-wms-file-mode-honesty';
import { appendWorkshop2InternalWmsMemoryJournal } from '@/lib/production/workshop2-internal-wms-memory-journal';
import { reserveWorkshop2WmsForSampleOrder } from '@/lib/server/workshop2-internal-wms-server';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function postWmsReserveSample(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  if (!isWorkshop2InternalWmsEnabled()) {
    const storeMode = getWorkshop2ServerDossierStoreMode();
    const honesty = buildWorkshop2WmsFileModeHonesty({
      storeMode,
      internalWmsEnabled: false,
      reserveOk: false,
    });
    return jsonWorkshop2ErrorRu(503, 'internal_wms_disabled', {
      messageRu: honesty.messageRu,
      storeMode,
      pgPrimary: honesty.pgPrimary,
      filePersistOnly: honesty.filePersistOnly,
      wmsSyncStatus: honesty.wmsSyncStatus,
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // optional
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'wms-reserve-api';
  const result = await reserveWorkshop2WmsForSampleOrder({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    supply: body.supply as Parameters<typeof reserveWorkshop2WmsForSampleOrder>[0]['supply'],
    actor,
    sampleOrderId: body.sampleOrderId != null ? String(body.sampleOrderId) : undefined,
  });

  let nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, {
    mirror: result.mirror,
  });
  if (result.mirror.wmsSyncStatus === 'memory_fallback') {
    nextDossier = appendWorkshop2InternalWmsMemoryJournal(nextDossier, {
      kind: 'reserve',
      actor,
      sampleOrderId: body.sampleOrderId != null ? String(body.sampleOrderId) : undefined,
      qty: result.mirror.reservedQty,
      movementCount: result.mirror.movementCount,
      messageRu: result.ok
        ? `Reserve sample (memory): ${result.reservedLines} lines`
        : `Reserve failed: ${result.reason ?? 'unknown'}`,
    });
  }
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: nextDossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_wms_reserve_sample' },
  });

  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  const storeMode = getWorkshop2ServerDossierStoreMode();
  const honesty = buildWorkshop2WmsFileModeHonesty({
    storeMode,
    mirror: result.mirror,
    internalWmsEnabled: true,
    reserveOk: result.ok,
  });

  return NextResponse.json({
    ok: result.ok,
    reservedLines: result.reservedLines,
    deficitLineCount: result.deficitLineCount,
    balances: result.balances,
    movements: result.movements,
    mirror: result.mirror,
    dossierVersion: saved.record.version,
    warningDeficit: result.deficitLineCount > 0,
    storeMode,
    pgPrimary: honesty.pgPrimary,
    filePersistOnly: honesty.filePersistOnly,
    wmsSyncStatus: honesty.wmsSyncStatus,
    messageRu: honesty.messageRu,
  });
}

export const POST = withWorkshop2ApiErrorRu(postWmsReserveSample);
