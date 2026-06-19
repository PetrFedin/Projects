/**
 * Stub: подтверждение приёмки пакета фабрикой (factoryReceivedAt на handoff row).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { applyWorkshop2FactoryHandoffAck } from '@/lib/production/workshop2-factory-handoff-ack';
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

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

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
  const handoffId = String(b.handoffId ?? '').trim();
  if (!cid || !aid || !handoffId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const receivedAt =
    typeof b.receivedAt === 'string' && b.receivedAt.trim()
      ? b.receivedAt.trim()
      : new Date().toISOString();
  const receivedBy =
    resolveWorkshop2UpdatedBy(req, String(b.receivedBy ?? ''), auth.actor) ??
    auth.actor?.actorLabel ??
    'factory-ack-api';

  const applied = applyWorkshop2FactoryHandoffAck({
    dossier: record.dossier,
    handoffId,
    receivedAt,
    receivedBy,
  });
  if (!applied) {
    return jsonWorkshop2ErrorRu(404, 'handoff_not_found');
  }

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: applied.dossier,
    updatedBy: receivedBy,
    txMeta: { eventType: 'workshop2_factory_handoff_ack' },
  });
  if (!saved.ok) {
    return NextResponse.json(workshop2DossierPutFailureBody(saved), {
      status: workshop2DossierPutFailureStatus(saved),
    });
  }

  return NextResponse.json({
    ok: true,
    handoff: applied.handoff,
    version: saved.record.version,
  });
}
