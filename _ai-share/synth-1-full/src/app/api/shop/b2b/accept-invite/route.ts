/**
 * POST /api/shop/b2b/accept-invite — принять token приглашения байера.
 */
import { NextRequest, NextResponse } from 'next/server';

import { acceptWorkshop2B2bBuyerInviteToken } from '@/lib/production/workshop2-b2b-wave23-parity';

export async function POST(req: NextRequest) {
  let body: { token?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, messageRu: 'Некорректное тело запроса.' },
      { status: 400 }
    );
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ ok: false, messageRu: 'Укажите token.' }, { status: 400 });
  }

  const result = acceptWorkshop2B2bBuyerInviteToken(token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, messageRu: result.messageRu }, { status: 404 });
  }

  const res = NextResponse.json({
    ok: true,
    buyerEmail: result.buyerEmail,
    tier: result.tier,
    sessionId: result.sessionId,
    messageRu: `Partner session для ${result.buyerEmail}.`,
  });
  res.cookies.set('b2b_cart_session', result.sessionId, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  res.cookies.set('b2b_partner_tier', result.tier, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  return res;
}
