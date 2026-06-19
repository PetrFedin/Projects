import { NextRequest, NextResponse } from 'next/server';

import type { SupplierProcurementBomLine } from '@/lib/platform-core-pillar-snapshot.types';
import {
  listBrandSupplierBomFeedServer,
  refreshBrandSupplierBomFeedServer,
} from '@/lib/server/brand-supplier-bom-repository';

function parseSnapshotLines(raw: unknown): SupplierProcurementBomLine[] {
  if (!Array.isArray(raw)) return [];
  return raw as SupplierProcurementBomLine[];
}

/** POST · list BOM lines (snapshot merge + PG seed). */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_BODY' } }, { status: 400 });
  }
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  if (!collectionId || !articleId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }
  const result = await listBrandSupplierBomFeedServer({
    collectionId,
    articleId,
    snapshotLines: parseSnapshotLines(body.snapshotLines),
    seedIfEmpty: true,
  });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    articleId: result.articleId,
    rows: result.rows,
    summary: result.summary,
    storageMode: result.storageMode,
  });
}

/** PUT · refresh BOM from snapshot or default seed. */
export async function PUT(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_BODY' } }, { status: 400 });
  }
  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  if (!collectionId || !articleId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }
  await refreshBrandSupplierBomFeedServer({
    collectionId,
    articleId,
    snapshotLines: parseSnapshotLines(body.snapshotLines),
  });
  const listed = await listBrandSupplierBomFeedServer({
    collectionId,
    articleId,
    snapshotLines: parseSnapshotLines(body.snapshotLines),
    seedIfEmpty: false,
  });
  return NextResponse.json({
    ok: true,
    collectionId,
    articleId,
    rows: listed.rows,
    summary: listed.summary,
    storageMode: listed.storageMode,
  });
}
