import { NextRequest, NextResponse } from 'next/server';

import type { BrandSizeChartGradeState } from '@/lib/fashion/brand-size-chart-grade';
import {
  listBrandAttributeSchemaFeedServer,
  listBrandSizeChartGradeFeedServer,
  patchBrandSizeChartGradeFeedServer,
  refreshBrandAttributeSchemaFeedServer,
} from '@/lib/server/brand-attribute-schema-repository';

/** GET ?collectionId=SS27&kind=schemas|size-chart */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const kind = req.nextUrl.searchParams.get('kind') ?? 'schemas';

  if (kind === 'size-chart') {
    const result = await listBrandSizeChartGradeFeedServer({ collectionId });
    return NextResponse.json({
      ok: true,
      collectionId: result.collectionId,
      rows: result.rows,
      summary: result.summary,
      storageMode: result.storageMode,
    });
  }

  const result = await listBrandAttributeSchemaFeedServer({ collectionId });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    schemas: result.schemas,
    schemaSummary: result.schemaSummary,
    storageMode: result.storageMode,
  });
}

/** POST · re-sync catalog slice to feed. */
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
  await refreshBrandAttributeSchemaFeedServer({ collectionId });
  const schemas = await listBrandAttributeSchemaFeedServer({ collectionId, seedIfEmpty: false });
  const sizeChart = await listBrandSizeChartGradeFeedServer({ collectionId, seedIfEmpty: false });
  return NextResponse.json({
    ok: true,
    collectionId,
    schemas: schemas.schemas,
    schemaSummary: schemas.schemaSummary,
    rows: sizeChart.rows,
    summary: sizeChart.summary,
    storageMode: schemas.storageMode,
  });
}

/** PATCH · update size-chart grade state for SKU. */
export async function PATCH(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_BODY' } }, { status: 400 });
  }
  const collectionId = String(body.collectionId ?? '').trim();
  const sku = String(body.sku ?? '').trim();
  const gradeState = String(body.gradeState ?? '').trim() as BrandSizeChartGradeState;
  if (!collectionId || !sku || !['empty', 'partial', 'ready'].includes(gradeState)) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }
  const saved = await patchBrandSizeChartGradeFeedServer({ collectionId, sku, gradeState });
  if (!saved.row) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }
  const listed = await listBrandSizeChartGradeFeedServer({ collectionId });
  return NextResponse.json({
    ok: true,
    row: saved.row,
    rows: listed.rows,
    summary: listed.summary,
    storageMode: saved.storageMode,
  });
}
