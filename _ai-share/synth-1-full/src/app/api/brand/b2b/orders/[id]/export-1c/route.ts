/**
 * GET /api/brand/b2b/orders/[id]/export-1c — CommerceML/JSON из строк B2B заказа.
 */
import { NextRequest, NextResponse } from 'next/server';

import { buildWorkshop2B2bOrderExport1cPayload } from '@/lib/production/workshop2-b2b-wave23-parity';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const orderId = id?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Укажите id заказа.' }, { status: 400 });
  }

  const order = await getWorkshop2B2bOrder(orderId);
  if (!order) {
    return NextResponse.json({ ok: false, messageRu: 'B2B заказ не найден.' }, { status: 404 });
  }

  const dossierByArticle = new Map<string, Workshop2DossierPhase1>();
  const articleIds = [...new Set(order.lines.map((l) => l.articleId))];
  for (const articleId of articleIds) {
    const collectionId =
      order.lines.find((l) => l.articleId === articleId)?.collectionId ??
      order.collectionId ??
      'SS27';
    const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
    if (record?.dossier) dossierByArticle.set(articleId, record.dossier);
  }

  const exportPayload = buildWorkshop2B2bOrderExport1cPayload({ order, dossierByArticle });

  const format = req.nextUrl.searchParams.get('format')?.trim().toLowerCase() ?? 'json';
  if (format === 'commerceml' && exportPayload.commerceMl) {
    return new NextResponse(exportPayload.commerceMl, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="b2b-order-${orderId}.xml"`,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    export: exportPayload,
    specRu: 'B2B заказ → BOM 1С; CommerceML: ?format=commerceml',
  });
}
