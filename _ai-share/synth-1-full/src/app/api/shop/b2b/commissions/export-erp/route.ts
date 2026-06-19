/**
 * POST /api/shop/b2b/commissions/export-erp — journal commission batch → factory ERP.
 */
import { NextRequest, NextResponse } from 'next/server';
import { exportWorkshop2CommissionBatchToErp } from '@/lib/production/workshop2-commission-erp-export';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const repId = String(body.repId ?? '').trim();
  if (!repId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'repId_required',
        messageRu: 'Укажите repId для экспорта комиссий в ERP.',
      },
      { status: 400 }
    );
  }

  const result = await exportWorkshop2CommissionBatchToErp({ repId });
  const status = result.ok ? 200 : result.mode === 'journal_stub' ? 503 : 502;

  return NextResponse.json(result, { status });
}
