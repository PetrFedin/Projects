/**
 * POST /api/shop/b2b/cart/split-by-brand — rep splits mixed-brand cart into per-brand sessions.
 * Wave 33: { sessions: [{ brandId, sessionId, lines }] }
 */
import { NextRequest, NextResponse } from 'next/server';

import {
  getWorkshop2B2bCartSession,
  splitWorkshop2B2bCartByBrand,
  summarizeWorkshop2B2bMixedBrandCheckoutRu,
} from '@/lib/production/workshop2-b2b-wave23-parity';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

function resolveSessionId(req: NextRequest, bodySessionId?: string): string {
  return bodySessionId?.trim() || req.cookies.get('b2b_cart_session')?.value?.trim() || '';
}

export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: { sessionId?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* empty body ok — cookie session */
  }

  const sessionId = resolveSessionId(req, body.sessionId);
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Укажите sessionId или cookie b2b_cart_session.' },
      { status: 400 }
    );
  }

  const session = getWorkshop2B2bCartSession(sessionId);
  if (!session?.lines.length) {
    return NextResponse.json({ ok: false, messageRu: 'Корзина пуста.' }, { status: 400 });
  }

  const summary = summarizeWorkshop2B2bMixedBrandCheckoutRu({ lines: session.lines });
  if (!summary.mixed) {
    return NextResponse.json({
      ok: true,
      mixed: false,
      messageRu: 'Один бренд — разделение не требуется.',
      sessions: [
        {
          brandId: summary.brandIds[0] ?? 'syntha-lab',
          sessionId: session.sessionId,
          lines: session.lines,
        },
      ],
    });
  }

  const split = splitWorkshop2B2bCartByBrand({ session });
  const res = NextResponse.json({
    ok: true,
    mixed: true,
    sourceSessionId: split.sourceSessionId,
    messageRu: summary.headlineRu,
    brandIds: summary.brandIds,
    sessions: split.sessions,
  });
  if (split.sessions.length === 1) {
    res.cookies.set('b2b_cart_session', split.sessions[0]!.sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
