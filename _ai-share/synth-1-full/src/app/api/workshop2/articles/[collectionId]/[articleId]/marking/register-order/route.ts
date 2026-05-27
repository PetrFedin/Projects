/**
 * POST /api/workshop2/articles/.../marking/register-order
 * Journal-only маркировка «Честный ЗНАК» — без fake ACK ЦРПТ без WORKSHOP2_MARKING_API_URL.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  attemptWorkshop2MarkingHonestSignHttpPostWithRetry,
  buildWorkshop2MarkingJournalEventPayload,
  isWorkshop2MarkingApiConfigured,
  registerWorkshop2MarkingOrderJournal,
  resolveWorkshop2MarkingUiStatusRu,
  workshop2MarkingUiStatusLabelRu,
} from '@/lib/production/workshop2-marking-honest-sign';
import {
  appendWorkshop2ServerDossierEvent,
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function postMarkingRegisterOrder(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    /* optional body */
  }

  const actor = resolveWorkshop2UpdatedBy(req, '', auth.actor) ?? 'marking-api';
  const result = registerWorkshop2MarkingOrderJournal({
    dossier: record.dossier,
    collectionId: cid,
    articleId: aid,
    actor,
    gtin: body.gtin != null ? String(body.gtin) : undefined,
    markingRequired: body.markingRequired === true || body.markingRequired === 'true',
  });

  if (!result.ok) {
    return jsonWorkshop2ErrorRu(400, String(result.error ?? 'invalid_request'), {
      messageRu: result.mirror.hintRu,
    });
  }

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: result.dossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_marking_register' },
  });
  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  let httpProbe:
    | Awaited<ReturnType<typeof attemptWorkshop2MarkingHonestSignHttpPostWithRetry>>
    | undefined;
  const apiUrl = String(process.env.WORKSHOP2_MARKING_API_URL ?? '').trim();
  const apiConfigured = isWorkshop2MarkingApiConfigured();
  if (apiConfigured && result.mirror.markingOrderId) {
    httpProbe = await attemptWorkshop2MarkingHonestSignHttpPostWithRetry({
      apiUrl,
      payload: {
        gtin: result.mirror.gtin,
        markingOrderId: result.mirror.markingOrderId,
        collectionId: cid,
        articleId: aid,
      },
    });
  }

  const crptOrderId = httpProbe?.crptOrderId?.trim() || null;
  let finalDossier = result.dossier;
  let finalMirror = result.mirror;
  if (crptOrderId) {
    finalMirror = {
      ...result.mirror,
      markingOrderId: crptOrderId,
      status: 'registered',
      hintRu: `Честный ЗНАК: заказ ${crptOrderId} зарегистрирован (id из ответа API).`,
    };
    finalDossier = {
      ...result.dossier,
      markingHonestSignMirror: finalMirror,
      passportProductionBrief: {
        ...result.dossier.passportProductionBrief,
        markingOrderId: crptOrderId,
      },
    };
    const savedCrpt = await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: finalDossier,
      updatedBy: actor,
      txMeta: { eventType: 'workshop2_marking_crpt_ack' },
    });
    if (!savedCrpt.ok) {
      return jsonWorkshop2ErrorRu(409, String(savedCrpt.error));
    }
  }

  const sentToApi = Boolean(httpProbe?.ok);
  const uiStatusRu = resolveWorkshop2MarkingUiStatusRu({
    apiConfigured,
    crptOrderId,
    mirrorStatus: finalMirror.status,
    httpOk: sentToApi,
  });
  const uiStatusLabelRu = workshop2MarkingUiStatusLabelRu(uiStatusRu);

  void appendWorkshop2ServerDossierEvent({
    collectionId: cid,
    articleId: aid,
    eventType: 'workshop2_marking_journal',
    createdBy: actor,
    eventPayload: buildWorkshop2MarkingJournalEventPayload({
      collectionId: cid,
      articleId: aid,
      gtin: finalMirror.gtin,
      markingOrderId: finalMirror.markingOrderId ?? result.mirror.markingOrderId ?? '',
      uiStatusRu,
      actor,
      httpOk: sentToApi,
      crptOrderId,
    }),
  }).catch(() => {
    /* best-effort journal */
  });

  return NextResponse.json({
    ok: true,
    sentToCrpt: sentToApi || result.sentToCrpt,
    uiStatusRu,
    uiStatusLabelRu,
    mirror: finalMirror,
    crptOrderId,
    httpProbe,
    retried: httpProbe?.retried ?? false,
    probe: 'markingHonestSign',
    messageRu: httpProbe?.messageRu ?? finalMirror.hintRu,
  });
}

export const POST = withWorkshop2ApiErrorRu(postMarkingRegisterOrder);
