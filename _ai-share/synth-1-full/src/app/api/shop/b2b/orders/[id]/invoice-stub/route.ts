import { NextRequest, NextResponse } from 'next/server';

import { buildWorkshop2SchetOffertaPayload } from '@/lib/production/workshop2-schet-offerta';
import { renderWorkshop2SchetOffertaHtml } from '@/lib/production/workshop2-schet-offerta-html';
import {
  WORKSHOP2_INVOICE_PIPELINE_HEADER,
  WORKSHOP2_INVOICE_PIPELINE_HTML_STUB,
  buildWorkshop2B2bSchetOffertaApiUrl,
} from '@/lib/production/workshop2-b2b-invoice-stub';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { upsertWorkshop2B2bInvoiceForOrder } from '@/lib/server/workshop2-b2b-invoice-repository';

/** GET — HTML счёт-оферта (PG lines) или redirect на schet-offerta API (JSON/HTML, не binary PDF). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const { id: orderId } = await ctx.params;
  const id = String(orderId ?? '').trim();
  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'order_id_required', messageRu: 'orderId обязателен.' },
      { status: 400 }
    );
  }

  const pgOrder = await getWorkshop2B2bOrder(id);
  if (!pgOrder?.lines?.length) {
    return NextResponse.json(
      {
        ok: false,
        error: 'order_not_found',
        messageRu: 'Заказ не найден в PG — счёт-оферта недоступна.',
      },
      { status: 404 }
    );
  }

  const accept = req.headers.get('accept') ?? '';
  const schetUrl = buildWorkshop2B2bSchetOffertaApiUrl(id);
  const schetPdfUrl = `${schetUrl}?format=pdf`;
  const lines = pgOrder.lines.map((line) => ({
    name: `${line.articleId} ${line.colorCode}/${line.size}`,
    qty: line.qty,
    priceRub: line.wholesalePriceRub,
    lineNote: line.lineNote,
  }));

  const payload = buildWorkshop2SchetOffertaPayload({
    orderId: id,
    buyerName: pgOrder.buyerId,
    lines,
  });

  await upsertWorkshop2B2bInvoiceForOrder({
    orderId: id,
    brandId: pgOrder.collectionId,
    tenantId: pgOrder.buyerId,
    totalRub: pgOrder.totalRub ?? payload.totalRub,
  });

  const pipelineHeaders = {
    [WORKSHOP2_INVOICE_PIPELINE_HEADER]: WORKSHOP2_INVOICE_PIPELINE_HTML_STUB,
  };

  if (
    accept.includes('application/pdf') &&
    !accept.includes('text/html') &&
    !accept.includes('application/json')
  ) {
    return NextResponse.redirect(new URL(schetPdfUrl, req.url), { status: 307 });
  }

  if (accept.includes('text/html')) {
    return new NextResponse(renderWorkshop2SchetOffertaHtml(payload), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Workshop2-Invoice-Mode': 'pg_schet_offerta_html',
        Link: `<${schetUrl}>; rel="alternate"; type="application/json"`,
        ...pipelineHeaders,
      },
    });
  }

  return NextResponse.redirect(new URL(schetUrl, req.url), {
    status: 307,
    headers: pipelineHeaders,
  });
}
