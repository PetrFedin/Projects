/**
 * GET — список заявок на материал по артикулу; POST — создать заявку по строке BOM.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  createWorkshop2MaterialRequisition,
  listWorkshop2MaterialRequisitions,
} from '@/lib/server/workshop2-material-requisition-repository';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
} from '@/lib/server/workshop2-api-context';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getSampleMaterialRequest(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const requisitions = await listWorkshop2MaterialRequisitions({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
  });
  return NextResponse.json({ ok: true, requisitions });
}

async function postSampleMaterialRequest(req: NextRequest, ctx: RouteCtx) {
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
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(b.createdBy ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const createdBy = resolveWorkshop2UpdatedBy(req, String(b.createdBy ?? ''), auth.actor);
  const requisition = await createWorkshop2MaterialRequisition({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
    bomLineRef: b.bomLineRef != null ? String(b.bomLineRef) : undefined,
    materialLabel: b.materialLabel != null ? String(b.materialLabel) : undefined,
    quantity: typeof b.quantity === 'number' ? b.quantity : undefined,
    unit: b.unit != null ? String(b.unit) : undefined,
    createdBy,
    payload:
      b.payload && typeof b.payload === 'object' ? (b.payload as Record<string, unknown>) : {},
  });

  return NextResponse.json(
    {
      ok: true,
      requisition,
      message: 'Заявка создана (черновик). Интеграция с ERP — в очереди PLM/outbox.',
    },
    { status: 201 }
  );
}

export const GET = withWorkshop2ApiErrorRu(getSampleMaterialRequest);
export const POST = withWorkshop2ApiErrorRu(postSampleMaterialRequest);
