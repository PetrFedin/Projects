/**
 * GET /api/workshop2/articles/.../signoff/edo-status — poll Kontur/SBIS EDO status.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  pollWorkshop2EdoSignoffStatus,
  probeWorkshop2KonturDiadocHttp,
  resolveWorkshop2EdoProvider,
} from '@/lib/production/workshop2-edo-signoff';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getEdoStatus(req: NextRequest, ctx: RouteCtx) {
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

  const requestId =
    req.nextUrl.searchParams.get('requestId')?.trim() ??
    record.dossier.edoSignoffMirror?.requestId ??
    null;

  const konturProbe =
    resolveWorkshop2EdoProvider() === 'kontur'
      ? await probeWorkshop2KonturDiadocHttp()
      : { ok: true, probed: false, messageRu: 'Не kontur.' };

  const result = await pollWorkshop2EdoSignoffStatus({
    dossier: record.dossier,
    collectionId: cid,
    articleId: aid,
    requestId,
  });

  const actor = resolveWorkshop2UpdatedBy(req, '', auth.actor) ?? 'edo-status-api';
  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: result.dossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_edo_signoff_poll' },
  });
  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: result.ok && konturProbe.ok,
    mirror: result.mirror,
    error: result.error ?? (konturProbe.ok ? undefined : 'kontur_diadoc_unreachable'),
    konturProbe,
    messageRu: konturProbe.ok ? result.mirror.hintRu : konturProbe.messageRu,
  });
}

export const GET = withWorkshop2ApiErrorRu(getEdoStatus);
