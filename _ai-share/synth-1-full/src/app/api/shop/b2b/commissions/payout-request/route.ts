import { NextRequest, NextResponse } from 'next/server';
import { markWorkshop2B2bCommissionsPayoutPending } from '@/lib/server/workshop2-b2b-commission-repository';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** POST — пометить commissions rep как payout_pending в PG. */
export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: { repId?: string; orderIds?: string[]; organizationId?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const repId = String(body.repId ?? '').trim();
  if (!repId) {
    return NextResponse.json(
      { ok: false, error: 'missing_rep_id', messageRu: 'Укажите repId.' },
      { status: 400 }
    );
  }

  const orderIds = Array.isArray(body.orderIds)
    ? body.orderIds.map((id) => String(id).trim()).filter(Boolean)
    : undefined;

  const result = await markWorkshop2B2bCommissionsPayoutPending({
    repId,
    orderIds,
    organizationId: body.organizationId,
  });

  if (result.mode === 'pg_only_blocked') {
    return NextResponse.json(
      {
        ok: false,
        error: 'pg_only_no_fallback',
        messageRu: 'WORKSHOP2_PG_ONLY: payout request требует PostgreSQL.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    repId,
    updatedCount: result.updatedCount,
    persistMode: result.mode,
    messageRu:
      result.updatedCount > 0
        ? `${result.updatedCount} комиссий помечены payout_pending (${result.mode}).`
        : 'Нет комиссий для обновления — проверьте repId/orderIds.',
  });
}
