import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2B2bChainStatus } from '@/lib/server/workshop2-b2b-production-handoff';
import { getOperationalImportChainStatus } from '@/lib/integrations/spine/operational-import-handoff.service';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ orderId: string }> };

/** GET — статус сквозной цепочки shop → brand → production для заказа. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId: raw } = await ctx.params;
  const orderId = raw?.trim();
  if (!orderId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан orderId.' }, { status: 400 });
  }

  let chain = await getWorkshop2B2bChainStatus(orderId);
  if (!chain) {
    chain = await getOperationalImportChainStatus(orderId);
  }
  if (!chain) {
    return NextResponse.json({ ok: false, messageRu: 'B2B заказ не найден.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, chain });
}
