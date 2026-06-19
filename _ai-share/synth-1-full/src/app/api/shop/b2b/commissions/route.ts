import { NextRequest, NextResponse } from 'next/server';
import {
  calculateWorkshop2B2bCommission,
  listWorkshop2B2bCommissionsForRep,
} from '@/lib/production/workshop2-b2b-commission';
import { listWorkshop2B2bCommissionLinesForOrganization } from '@/lib/server/workshop2-b2b-commission-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

function resolveCommissionMode(lineCount: number): 'postgres' | 'file' | 'memory' | 'empty' {
  if (lineCount === 0) return 'empty';
  if (isWorkshop2PostgresEnabled()) return 'postgres';
  return process.env.NODE_ENV === 'test' ? 'memory' : 'file';
}

/** GET — commission по repId: persisted ledger (seed on empty). */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const repId = req.nextUrl.searchParams.get('repId')?.trim();
  if (!repId) {
    return NextResponse.json(
      { ok: false, error: 'repId_required', messageRu: 'Укажите repId в query.' },
      { status: 400 }
    );
  }

  const pgLines = await listWorkshop2B2bCommissionLinesForOrganization({
    repId,
    limit: 100,
    seedIfEmpty: true,
  });
  const mode = resolveCommissionMode(pgLines.length);
  const summary = listWorkshop2B2bCommissionsForRep({
    repId,
    lines: pgLines.length > 0 ? pgLines : undefined,
  });

  return NextResponse.json({
    ok: true,
    repId: summary.repId,
    orderCount: summary.orderCount,
    totalCommissionRub: summary.totalCommissionRub,
    lines: summary.lines,
    mode,
    messageRu:
      summary.orderCount > 0
        ? `${summary.orderCount} заказ(ов) · комиссия ${summary.totalCommissionRub.toLocaleString('ru-RU')} ₽ (${mode === 'postgres' ? 'PG' : mode} ledger).`
        : 'Нет атрибуции заказов для repId.',
  });
}

/** POST — рассчитать и persist commission row в PG (optional). */
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
  const orderId = String(body.orderId ?? '').trim();
  const orderTotalRub = Number(body.orderTotalRub);
  if (!repId || !orderId || !Number.isFinite(orderTotalRub) || orderTotalRub <= 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_payload',
        messageRu: 'Укажите repId, orderId и orderTotalRub > 0.',
      },
      { status: 400 }
    );
  }

  const line = calculateWorkshop2B2bCommission({
    repId,
    orderId,
    orderTotalRub,
    commissionPct: body.commissionPct != null ? Number(body.commissionPct) : undefined,
    customerName: body.customerName != null ? String(body.customerName) : undefined,
  });

  const { persistWorkshop2B2bCommissionLine } =
    await import('@/lib/server/workshop2-b2b-commission-repository');
  const persist = await persistWorkshop2B2bCommissionLine({ line });

  return NextResponse.json({
    ok: persist.persisted,
    line,
    persistMode: persist.mode,
    messageRu: persist.persisted
      ? `Комиссия ${line.commissionRub.toLocaleString('ru-RU')} ₽ записана (${persist.mode}).`
      : 'PG-only: запись комиссии недоступна без PostgreSQL.',
  });
}
