import { NextRequest, NextResponse } from 'next/server';

import {
  listLandedMarginFeedServer,
  refreshLandedMarginFeedServer,
} from '@/lib/server/landed-margin-feed-repository';

/** GET /api/shop/b2b/landed-margin/rollup?collectionId=SS27&orderId=... */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const orderId = req.nextUrl.searchParams.get('orderId') ?? undefined;
  const result = await listLandedMarginFeedServer({ collectionId, orderId, scope: 'shop' });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    orderId: result.orderId,
    rows: result.rows,
    summary: result.summary,
    storageMode: result.storageMode,
    orderLinked: result.orderLinked,
    messageRu:
      result.storageMode === 'pg'
        ? `${result.summary.onTarget}/${result.summary.total} on target · PG margin feed`
        : `${result.summary.onTarget}/${result.summary.total} on target · ${result.storageMode}`,
  });
}

/** POST · re-sync rollup from B2B order or catalog seed. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_BODY', message: 'JSON body required' } },
      { status: 400 }
    );
  }

  const collectionId = String(body.collectionId ?? '').trim();
  if (!collectionId) {
    return NextResponse.json(
      { ok: false, error: { code: 'MISSING_FIELDS', message: 'collectionId required' } },
      { status: 400 }
    );
  }

  const orderId = String(body.orderId ?? '').trim() || undefined;

  try {
    await refreshLandedMarginFeedServer({ collectionId, orderId, scope: 'shop' });
    const listed = await listLandedMarginFeedServer({
      collectionId,
      orderId,
      scope: 'shop',
      seedIfEmpty: false,
    });
    return NextResponse.json({
      ok: true,
      collectionId,
      orderId: listed.orderId,
      rows: listed.rows,
      summary: listed.summary,
      storageMode: listed.storageMode,
      orderLinked: listed.orderLinked,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'ERROR', message: 'Failed to refresh rollup' } },
      { status: 500 }
    );
  }
}
