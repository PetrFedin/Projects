/**
 * POST /api/workshop2/articles/.../signoff/edo-request
 * GET  .../signoff/edo-status — poll (см. edo-status/route.ts)
 *
 * Контур Diadoc pattern: POST {WORKSHOP2_KONTUR_EDO_API_URL}/signoff-request
 * СБИС pattern: POST {WORKSHOP2_SBIS_EDO_API_URL}/signoff-request
 * Fail-closed без env URL — только mirror в dossier.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  requestWorkshop2EdoSignoff,
  resolveWorkshop2EdoProvider,
} from '@/lib/production/workshop2-edo-signoff';
import {
  buildWorkshop2KonturEdoNotConfiguredResponse,
  resolveWorkshop2KonturEdoConfigured,
} from '@/lib/production/workshop2-edo-kontur-client';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function postEdoRequest(req: NextRequest, ctx: RouteCtx) {
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

  const actor = resolveWorkshop2UpdatedBy(req, '', auth.actor) ?? 'edo-request-api';

  const provider = resolveWorkshop2EdoProvider();
  if (provider === 'kontur' && !resolveWorkshop2KonturEdoConfigured().configured) {
    const notConfigured = buildWorkshop2KonturEdoNotConfiguredResponse();
    return NextResponse.json(notConfigured.body, { status: notConfigured.status });
  }

  const result = await requestWorkshop2EdoSignoff({
    dossier: record.dossier,
    collectionId: cid,
    articleId: aid,
    actor,
  });

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: result.dossier,
    updatedBy: actor,
    txMeta: { eventType: 'workshop2_edo_signoff_request' },
  });
  if (!saved.ok) {
    return jsonWorkshop2ErrorRu(409, String(saved.error));
  }

  return NextResponse.json({
    ok: result.ok,
    mirror: result.mirror,
    error: result.error,
    messageRu: result.mirror.hintRu,
  });
}

export const POST = withWorkshop2ApiErrorRu(postEdoRequest);
