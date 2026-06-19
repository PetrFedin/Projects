/**
 * POST /api/brand/b2b/invites — токен приглашения байера → /shop/b2b/accept-invite?token=
 */
import { NextRequest, NextResponse } from 'next/server';

import { createWorkshop2B2bBuyerInviteToken } from '@/lib/production/workshop2-b2b-wave23-parity';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

export async function POST(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: { buyerEmail?: string; tier?: 'standard' | 'vip' | 'prebook' } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, messageRu: 'Некорректное тело запроса.' },
      { status: 400 }
    );
  }

  const buyerEmail = body.buyerEmail?.trim();
  if (!buyerEmail || !buyerEmail.includes('@')) {
    return NextResponse.json(
      { ok: false, messageRu: 'Укажите buyerEmail (email партнёра).' },
      { status: 400 }
    );
  }

  const invite = createWorkshop2B2bBuyerInviteToken({
    buyerEmail,
    tier: body.tier,
  });

  const origin = req.nextUrl.origin;
  return NextResponse.json({
    ok: true,
    token: invite.token,
    acceptUrl: `${origin}${invite.acceptPath}`,
    messageRu: `Приглашение для ${buyerEmail} — ссылка действительна до первого входа.`,
  });
}
