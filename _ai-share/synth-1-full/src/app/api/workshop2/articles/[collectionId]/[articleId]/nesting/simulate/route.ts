/**
 * POST — симуляция nesting (stub; честная подпись «не CAD-движок»).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { runWorkshop2NestingStagingWithJournal } from '@/lib/production/workshop2-nesting-staging-journal';
import { resolveWorkshop2NestingApiUrl } from '@/lib/production/workshop2-nesting-request';
import { isWorkshop2NestingProductionMode } from '@/lib/production/workshop2-nesting-prod-guard';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const sampleOrderId = body.sampleOrderId ? String(body.sampleOrderId).trim() : '';
  if (!sampleOrderId) {
    return jsonWorkshop2ErrorRu(400, 'sample_order_id_required');
  }

  const nesting =
    body.nesting && typeof body.nesting === 'object'
      ? (body.nesting as Record<string, unknown>)
      : {};

  const cid = collectionId.trim();
  const aid = articleId.trim();
  const actor = resolveWorkshop2UpdatedBy(req, '', auth.actor) ?? 'nesting-simulate-api';
  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const dossier = record?.dossier ?? emptyWorkshop2DossierPhase1();

  const journalRun = await runWorkshop2NestingStagingWithJournal({
    dossier,
    collectionId: cid,
    articleId: aid,
    sampleOrderId,
    nesting:
      nesting as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2NestingRequest,
    actor,
  });

  if (record) {
    await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: journalRun.dossier,
      updatedBy: actor,
      txMeta: { eventType: 'workshop2_nesting_staging_journal' },
    });
  }

  const nestingUrl = resolveWorkshop2NestingApiUrl();
  if (
    isWorkshop2NestingProductionMode() &&
    !nestingUrl &&
    journalRun.source === 'local_heuristic'
  ) {
    return NextResponse.json(
      {
        ok: false,
        source: journalRun.source,
        error: 'nesting_api_url_required',
        messageRu:
          'WORKSHOP2_NESTING_API_URL обязателен в production — heuristic stub не считается success path.',
        mirror: journalRun.dossier.nestingStagingMirror,
      },
      { status: 503 }
    );
  }

  const status = !journalRun.ok
    ? journalRun.source === 'external_api'
      ? 502
      : isWorkshop2NestingProductionMode() && !nestingUrl
        ? 503
        : 409
    : journalRun.source === 'external_api' || !isWorkshop2NestingProductionMode()
      ? 200
      : 503;

  const messageRu = !nestingUrl
    ? 'Nesting API не настроен — задайте WORKSHOP2_NESTING_API_URL (heuristic stub ≠ live ACK).'
    : !journalRun.ok
      ? journalRun.error === 'nesting_api_url_required'
        ? 'WORKSHOP2_NESTING_API_URL обязателен в production — heuristic stub не считается success path.'
        : `Nesting simulate fail-closed: ${journalRun.error ?? 'unknown'}`
      : journalRun.source === 'local_heuristic'
        ? 'Heuristic nesting (dev) — не CAD-движок, без fake live ACK.'
        : 'Nesting simulate выполнен через external API.';

  return NextResponse.json(
    {
      ok: journalRun.ok,
      source: journalRun.source,
      error: journalRun.error,
      messageRu,
      mirror: journalRun.dossier.nestingStagingMirror,
    },
    { status }
  );
}
