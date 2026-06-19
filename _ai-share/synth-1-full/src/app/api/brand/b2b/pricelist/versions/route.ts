import { NextRequest, NextResponse } from 'next/server';

import { filterBrandPricelistVersions } from '@/lib/b2b/brand-pricelist-versions-feed';
import {
  listBrandPricelistVersionsServer,
  patchBrandPricelistVersionServer,
  refreshBrandPricelistVersionsServer,
} from '@/lib/server/brand-pricelist-versions-repository';

/** GET /api/brand/b2b/pricelist/versions?collectionId=SS27&groupId=... */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const groupId = req.nextUrl.searchParams.get('groupId') ?? undefined;
  const result = await listBrandPricelistVersionsServer({ collectionId });
  const rows = filterBrandPricelistVersions(result.rows, groupId);
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    rows,
    summary: result.summary,
    storageMode: result.storageMode,
    messageRu:
      result.storageMode === 'pg'
        ? `${result.summary.active}/${result.summary.total} active · PG pricelist`
        : `${result.summary.active}/${result.summary.total} active · ${result.storageMode}`,
  });
}

/** POST · re-seed pricelist versions for collection. */
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

  try {
    await refreshBrandPricelistVersionsServer({ collectionId });
    const listed = await listBrandPricelistVersionsServer({ collectionId, seedIfEmpty: false });
    return NextResponse.json({
      ok: true,
      collectionId,
      rows: listed.rows,
      summary: listed.summary,
      storageMode: listed.storageMode,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'ERROR', message: 'Failed to refresh pricelist versions' } },
      { status: 500 }
    );
  }
}

/** PATCH · update multiplier or validTo for pricelist row. */
export async function PATCH(req: NextRequest) {
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
  const id = String(body.id ?? '').trim();
  if (!collectionId || !id) {
    return NextResponse.json(
      { ok: false, error: { code: 'MISSING_FIELDS', message: 'collectionId, id required' } },
      { status: 400 }
    );
  }

  const multiplier =
    body.multiplier === undefined || body.multiplier === null
      ? undefined
      : Number.isFinite(Number(body.multiplier))
        ? Number(body.multiplier)
        : undefined;
  const validTo = typeof body.validTo === 'string' ? body.validTo.trim() : undefined;

  try {
    const saved = await patchBrandPricelistVersionServer({
      collectionId,
      id,
      multiplier,
      validTo,
    });
    if (!saved.row) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'Pricelist not found' } },
        { status: 404 }
      );
    }
    const listed = await listBrandPricelistVersionsServer({ collectionId });
    return NextResponse.json({
      ok: true,
      row: saved.row,
      collectionId,
      rows: listed.rows,
      summary: listed.summary,
      storageMode: saved.storageMode,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'ERROR', message: 'Failed to update pricelist' } },
      { status: 500 }
    );
  }
}
