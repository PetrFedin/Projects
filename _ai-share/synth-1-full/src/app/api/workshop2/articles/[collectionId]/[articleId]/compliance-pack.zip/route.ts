/**
 * GET — ZIP «пакет соответствия РФ»: readiness, бирка PDF, CSV ЧЗ, GTIN, DPP json-ld (если готов).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { buildWorkshop2RuCompliancePackZip } from '@/lib/server/workshop2-ru-compliance-pack';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

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

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const sku = req.nextUrl.searchParams.get('sku')?.trim() || undefined;
  const name = req.nextUrl.searchParams.get('name')?.trim() || undefined;
  const categoryLeafId =
    req.nextUrl.searchParams.get('categoryLeafId')?.trim() ||
    record.dossier.categoryBindings?.[0]?.categoryLeafId;

  const { buffer, filename } = await buildWorkshop2RuCompliancePackZip({
    collectionId: cid,
    articleId: aid,
    articleSku: sku,
    articleName: name,
    categoryLeafId,
    dossier: record.dossier,
    version: record.version,
    updatedAt: record.updatedAt,
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
