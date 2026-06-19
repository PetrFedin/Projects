import { NextRequest, NextResponse } from 'next/server';

import {
  listBrandWssiOtbServer,
  patchBrandWssiMixTargetServer,
  refreshBrandWssiOtbServer,
} from '@/lib/server/brand-wssi-otb-repository';

/** GET /api/brand/merch/wssi-otb?collectionId=SS27 */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const result = await listBrandWssiOtbServer({ collectionId });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    mix: result.mix,
    capacity: result.capacity,
    mixSummary: result.mixSummary,
    storageMode: result.storageMode,
  });
}

/** POST · re-sync mix/capacity from catalog slice. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_BODY' } }, { status: 400 });
  }
  const collectionId = String(body.collectionId ?? '').trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }
  await refreshBrandWssiOtbServer({ collectionId });
  const listed = await listBrandWssiOtbServer({ collectionId, seedIfEmpty: false });
  return NextResponse.json({
    ok: true,
    collectionId,
    mix: listed.mix,
    capacity: listed.capacity,
    mixSummary: listed.mixSummary,
    storageMode: listed.storageMode,
  });
}

/** PATCH · update OTB target % for category. */
export async function PATCH(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_BODY' } }, { status: 400 });
  }
  const collectionId = String(body.collectionId ?? '').trim();
  const category = String(body.category ?? '').trim();
  const targetPct = Number(body.targetPct);
  if (!collectionId || !category || !Number.isFinite(targetPct)) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }
  const saved = await patchBrandWssiMixTargetServer({ collectionId, category, targetPct });
  if (!saved.row) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }
  const listed = await listBrandWssiOtbServer({ collectionId });
  return NextResponse.json({
    ok: true,
    row: saved.row,
    collectionId,
    mix: listed.mix,
    capacity: listed.capacity,
    mixSummary: listed.mixSummary,
    storageMode: saved.storageMode,
  });
}
