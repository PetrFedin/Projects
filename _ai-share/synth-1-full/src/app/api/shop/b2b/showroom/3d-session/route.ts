import { NextRequest, NextResponse } from 'next/server';

import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';
import { recordWorkshop2B2b3dSessionEvent } from '@/lib/server/workshop2-b2b-3d-metrics';

type Body = {
  collectionId?: string;
  articleId?: string;
  embedMode?: string;
  durationMs?: number;
  sdkReady?: boolean;
};

/** POST — journal b2b.3d.session + SLA aggregates. */
export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный JSON.' }, { status: 400 });
  }

  const collectionId = body.collectionId?.trim() || 'SS27';
  const articleId = body.articleId?.trim() || 'demo-ss27-01';
  const durationMs = Number(body.durationMs);
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return NextResponse.json(
      { ok: false, messageRu: 'durationMs обязателен (число ≥ 0).' },
      { status: 400 }
    );
  }

  const result = await recordWorkshop2B2b3dSessionEvent({
    collectionId,
    articleId,
    embedMode: body.embedMode?.trim(),
    durationMs,
    sdkReady: body.sdkReady,
  });

  return NextResponse.json({
    ok: true,
    event: 'b2b.3d.session',
    collectionId,
    articleId,
    durationSec: result.durationSec,
    messageRu: `3D-сессия ${result.durationSec}с записана в journal.`,
  });
}
