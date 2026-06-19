import { NextRequest, NextResponse } from 'next/server';
import { confirmWorkshop2B2bOrderByBrand } from '@/lib/server/workshop2-b2b-production-handoff';
import { confirmOperationalImportOrderByBrand } from '@/lib/integrations/spine/operational-import-handoff.service';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ id: string }> };

/** POST — бренд подтверждает B2B заказ (без передачи в цех). */
export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const orderId = id?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан orderId.' }, { status: 400 });
  }

  const result = isIntegrationImportedWholesaleOrderId(orderId)
    ? await confirmOperationalImportOrderByBrand({ orderId })
    : await confirmWorkshop2B2bOrderByBrand({ orderId });
  if (!result.ok) {
    const status = result.code === 'not_found' ? 404 : 409;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json({
    ok: true,
    orderId: 'order' in result ? result.order.id : result.orderId,
    status: 'order' in result ? result.order.status : result.status,
    alreadyConfirmed: result.alreadyConfirmed,
    messageRu: result.messageRu,
  });
}
