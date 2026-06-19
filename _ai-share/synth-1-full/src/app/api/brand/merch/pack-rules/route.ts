import { NextRequest, NextResponse } from 'next/server';

import {
  listBrandPackRulesServer,
  patchBrandPackRulesServer,
  refreshBrandPackRulesServer,
} from '@/lib/server/brand-pack-rules-repository';

/** GET /api/brand/merch/pack-rules?collectionId=SS27 */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const result = await listBrandPackRulesServer({ collectionId });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    rows: result.rows,
    summary: result.summary,
    storageMode: result.storageMode,
    messageRu:
      result.storageMode === 'pg'
        ? `${result.summary.withMoq}/${result.summary.total} MOQ · PG pack rules`
        : `${result.summary.withMoq}/${result.summary.total} MOQ · ${result.storageMode}`,
  });
}

/** POST · re-sync pack rules from catalog PIM slice. */
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
    const refreshed = await refreshBrandPackRulesServer({ collectionId });
    const listed = await listBrandPackRulesServer({ collectionId, seedIfEmpty: false });
    return NextResponse.json({
      ok: true,
      collectionId,
      rows: listed.rows,
      summary: listed.summary,
      storageMode: refreshed.storageMode,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'ERROR', message: 'Failed to refresh pack rules' } },
      { status: 500 }
    );
  }
}

/** PATCH · persist MOQ / case pack for SKU. */
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
  const sku = String(body.sku ?? '').trim();
  if (!collectionId || !sku) {
    return NextResponse.json(
      { ok: false, error: { code: 'MISSING_FIELDS', message: 'collectionId, sku required' } },
      { status: 400 }
    );
  }

  const moq =
    body.moq === null || body.moq === undefined
      ? undefined
      : Number.isFinite(Number(body.moq))
        ? Number(body.moq)
        : undefined;
  const casePack =
    body.casePack === null || body.casePack === undefined
      ? undefined
      : Number.isFinite(Number(body.casePack))
        ? Number(body.casePack)
        : undefined;

  try {
    const saved = await patchBrandPackRulesServer({ collectionId, sku, moq, casePack });
    if (!saved.row) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'SKU not found' } },
        { status: 404 }
      );
    }
    const listed = await listBrandPackRulesServer({ collectionId });
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
      { ok: false, error: { code: 'ERROR', message: 'Failed to update pack rule' } },
      { status: 500 }
    );
  }
}
