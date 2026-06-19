/**
 * POST — расчёт рисков из BOM досье и persist в supplyRiskSnapshot.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { computeWorkshop2RiskFromDossier } from '@/lib/production/workshop2-risk-from-dossier';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { putWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    /* пустое тело */
  }

  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(body.updatedBy ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'dossier_not_found');
  }

  const snapshot = computeWorkshop2RiskFromDossier(record.dossier);
  const merged = {
    ...record.dossier,
    supplyRiskSnapshot: snapshot,
    updatedAt: new Date().toISOString(),
    updatedBy: resolveWorkshop2UpdatedBy(req, String(body.updatedBy ?? '')),
  };

  const saved = await putWorkshop2ServerDossierRecord({
    collectionId: cid,
    articleId: aid,
    dossier: merged,
    baseVersion: record.version,
    updatedBy: merged.updatedBy,
  });

  if (!saved.ok) {
    return NextResponse.json(workshop2DossierPutFailureBody(saved), {
      status: workshop2DossierPutFailureStatus(saved),
    });
  }

  return NextResponse.json({
    ok: true,
    snapshot,
    version: saved.record.version,
  });
}
