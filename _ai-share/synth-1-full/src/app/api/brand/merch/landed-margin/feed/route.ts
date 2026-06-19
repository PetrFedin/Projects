import { NextRequest, NextResponse } from 'next/server';

import {
  getLandedMarginFeedSkuDefaultsServer,
  listLandedMarginFeedServer,
  refreshLandedMarginFeedServer,
} from '@/lib/server/landed-margin-feed-repository';

/** GET /api/brand/merch/landed-margin/feed?collectionId=SS27&orderId=...&sku=... */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const orderId = req.nextUrl.searchParams.get('orderId') ?? undefined;
  const sku = req.nextUrl.searchParams.get('sku')?.trim();

  if (sku) {
    const defaults = await getLandedMarginFeedSkuDefaultsServer({ collectionId, orderId, sku });
    if (!defaults) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'SKU not in margin feed' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, ...defaults });
  }

  const result = await listLandedMarginFeedServer({ collectionId, orderId, scope: 'brand' });
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
        ? `${result.summary.total} SKU · PG margin feed`
        : `${result.summary.total} SKU · ${result.storageMode}`,
  });
}

/** POST · re-sync brand simulator feed rows. */
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
    await refreshLandedMarginFeedServer({ collectionId, orderId, scope: 'brand' });
    const listed = await listLandedMarginFeedServer({
      collectionId,
      orderId,
      scope: 'brand',
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
      { ok: false, error: { code: 'ERROR', message: 'Failed to refresh margin feed' } },
      { status: 500 }
    );
  }
}
