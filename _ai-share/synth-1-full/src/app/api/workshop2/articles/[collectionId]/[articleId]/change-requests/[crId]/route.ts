/**
 * PATCH approve/reject для change request в досье.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { applyWorkshop2ChangeRequestDecision } from '@/lib/production/workshop2-change-request-workflow';
import { persistWorkshop2ChangeRequestMirrorToDossier } from '@/lib/production/workshop2-change-request-dossier-persist';
import type { Workshop2ChangeRequestDecision } from '@/lib/production/workshop2-change-request-workflow';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

type RouteCtx = {
  params: Promise<{ collectionId: string; articleId: string; crId: string }>;
};

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId, crId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  const changeRequestId = crId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const decision = String(
    (body as { decision?: string }).decision ?? ''
  ).trim() as Workshop2ChangeRequestDecision;
  if (!cid || !aid || !changeRequestId || (decision !== 'approved' && decision !== 'rejected')) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const decidedBy =
    resolveWorkshop2UpdatedBy(
      req,
      String((body as { decidedBy?: string }).decidedBy ?? ''),
      auth.actor
    ) ??
    auth.actor?.actorLabel ??
    'cr-workflow-api';

  const applied = applyWorkshop2ChangeRequestDecision({
    dossier: record.dossier,
    changeRequestId,
    decision,
    decidedBy,
  });
  if (!applied) {
    return jsonWorkshop2ErrorRu(404, 'change_request_not_found');
  }

  const dossierWithMirror = persistWorkshop2ChangeRequestMirrorToDossier(applied.dossier);

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: dossierWithMirror,
    updatedBy: decidedBy,
    txMeta: { eventType: 'workshop2_change_request_decision' },
  });
  if (!saved.ok) {
    return NextResponse.json(workshop2DossierPutFailureBody(saved), {
      status: workshop2DossierPutFailureStatus(saved),
    });
  }

  if (decision === 'approved') {
    void enqueueWorkshop2DomainEvent({
      type: 'change_request.approved',
      collectionId: cid,
      articleId: aid,
      payload: {
        changeRequestId,
        decidedBy,
        description: applied.changeRequest.description.slice(0, 200),
      },
    }).catch(() => {
      /* best-effort */
    });
  }

  return NextResponse.json({
    ok: true,
    changeRequest: applied.changeRequest,
    version: saved.record.version,
  });
}
