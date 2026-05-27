/**
 * POST: создать change request в PG досье (wave 34 #28).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { appendWorkshop2TzDossierEditLog } from '@/lib/production/workshop2-dossier-activity-log';
import type { Workshop2ChangeRequest } from '@/lib/production/workshop2-dossier-phase1.types';
import { persistWorkshop2ChangeRequestMirrorToDossier } from '@/lib/production/workshop2-change-request-dossier-persist';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const POST = withWorkshop2ApiErrorRu(async function postChangeRequest(
  req: NextRequest,
  ctx: RouteCtx
) {
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
  const description = String(b.description ?? '').trim();
  if (!cid || !aid || !description) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const requestedBy =
    resolveWorkshop2UpdatedBy(req, String(b.requestedBy ?? ''), auth.actor) ??
    auth.actor?.actorLabel ??
    'cr-create-api';

  const priority = (['Low', 'Medium', 'High'] as const).includes(
    b.priority as 'Low' | 'Medium' | 'High'
  )
    ? (b.priority as 'Low' | 'Medium' | 'High')
    : 'Medium';

  const targetNode = typeof b.targetNode === 'string' ? b.targetNode.trim() : 'Material';

  const newCr: Workshop2ChangeRequest = {
    id: crypto.randomUUID(),
    description,
    priority,
    targetNode,
    status: 'pending',
    requestedBy,
    createdAt: new Date().toISOString(),
  };

  let dossier = appendWorkshop2TzDossierEditLog(
    {
      ...record.dossier,
      changeRequests: [...(record.dossier.changeRequests ?? []), newCr],
    },
    requestedBy,
    [`CR created: ${description.slice(0, 120)}`]
  );
  dossier = persistWorkshop2ChangeRequestMirrorToDossier(dossier);

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier,
    updatedBy: requestedBy,
    txMeta: { eventType: 'workshop2_change_request_create' },
  });
  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, error: 'version_conflict', currentVersion: saved.currentVersion },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    changeRequest: newCr,
    version: saved.record.version,
  });
});
