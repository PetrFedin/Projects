/**
 * GET — готовность к передаче / заказу образца (sample-order gate, parity с POST sample-order).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2HandoffReadinessApiPayload } from '@/lib/production/workshop2-handoff-readiness-api';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  resolveWorkshop2OrganizationId,
  workshop2DatabaseNotConfiguredResponse,
} from '@/lib/server/workshop2-api-context';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getHandoffReadiness(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  try {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (!record) {
      return jsonWorkshop2ErrorRu(404, 'not_found');
    }

    const organizationId = resolveWorkshop2OrganizationId(req);
    let vaultFileCount = 0;
    try {
      const docs = await listWorkshop2VaultDocumentsFromPg({
        collectionId: cid,
        articleId: aid,
        organizationId,
      });
      vaultFileCount = docs.filter((d) => d.storagePath?.trim()).length;
    } catch {
      vaultFileCount = (record.dossier.vaultDocuments ?? []).filter((d) =>
        (d as { storagePath?: string }).storagePath?.trim()
      ).length;
    }
    const leafId =
      req.nextUrl.searchParams.get('categoryLeafId')?.trim() ||
      record.dossier.categoryBindings?.[0]?.categoryLeafId;

    const orders = await listWorkshop2SampleOrders({
      collectionId: cid,
      articleId: aid,
      organizationId,
    });
    const latest = [...orders].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )[0];
    const payload = buildWorkshop2HandoffReadinessApiPayload({
      dossier: record.dossier,
      categoryLeafId: leafId,
      vaultFileCount,
      actor: 'handoff-readiness-get',
      latestSampleOrder: latest
        ? {
            id: latest.id,
            status: latest.status,
            movementStatus: latest.movementStatus,
            movementLogLength: latest.movementLog?.length ?? 0,
          }
        : null,
    });

    return NextResponse.json({
      ok: true,
      ...payload,
      articleDevelopmentStatePersisted: Boolean(record.dossier.articleDevelopmentStateMirror),
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
});
