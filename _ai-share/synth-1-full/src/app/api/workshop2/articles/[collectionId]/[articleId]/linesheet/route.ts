/**
 * GET — linesheet payload из досье + showroom campaign (B2B export / webhook preview).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2ShowroomLinesheetPayload } from '@/lib/production/workshop2-showroom-linesheet-payload';
import { getWorkshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const org = resolveWorkshop2OrganizationId(req);
  const record = await getWorkshop2ServerDossierRecord(cid, aid, org);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const campaign = await getWorkshop2ShowroomCampaign({ collectionId: cid, articleId: aid });
  const linesheet = buildWorkshop2ShowroomLinesheetPayload({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    campaign,
  });

  return NextResponse.json({ ok: true, linesheet });
}
