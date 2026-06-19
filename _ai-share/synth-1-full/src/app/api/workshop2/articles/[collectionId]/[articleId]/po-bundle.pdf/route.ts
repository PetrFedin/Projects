/**
 * GET PO bundle — JSON или jsPDF binary (BOM × серия + PO rows).
 */
import { NextRequest, NextResponse } from 'next/server';

import { buildWorkshop2PoBundlePayload } from '@/lib/production/workshop2-po-bundle-payload';
import { buildWorkshop2PoBundlePdfBytes } from '@/lib/production/workshop2-po-bundle-pdf';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2PurchaseOrders } from '@/lib/server/workshop2-purchase-order-repository';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

function wantsPdf(req: NextRequest): boolean {
  const format = req.nextUrl.searchParams.get('format')?.trim().toLowerCase();
  if (format === 'pdf') return true;
  const accept = req.headers.get('accept') ?? '';
  return (
    accept.includes('application/pdf') &&
    !accept.includes('text/html') &&
    !accept.includes('application/json')
  );
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return NextResponse.json({ ok: false, error: 'invalid_path' }, { status: 400 });
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  if (!record?.dossier) {
    return NextResponse.json(
      { ok: false, messageRu: 'Досье не найдено — синхронизируйте W2.' },
      { status: 404 }
    );
  }

  const purchaseOrders = await listWorkshop2PurchaseOrders({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
  });

  const seriesQtyRaw = Number(req.nextUrl.searchParams.get('seriesQty') ?? '');
  const seriesQty = Number.isFinite(seriesQtyRaw) ? seriesQtyRaw : undefined;
  const b2bOrderId = req.nextUrl.searchParams.get('b2bOrderId')?.trim() || undefined;

  const payload = buildWorkshop2PoBundlePayload({
    collectionId: cid,
    articleId: aid,
    dossier: record.dossier,
    purchaseOrders,
    seriesQty,
    b2bOrderId,
  });

  if (wantsPdf(req)) {
    const bytes = buildWorkshop2PoBundlePdfBytes(payload);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="po-bundle-${cid}-${aid}.pdf"`,
        'Cache-Control': 'no-store',
        'X-Workshop2-Po-Bundle-Pipeline': 'jspdf_binary_v1',
      },
    });
  }

  return NextResponse.json({ ok: true, payload });
}
