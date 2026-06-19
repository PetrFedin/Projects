import { NextRequest, NextResponse } from 'next/server';

import {
  listBrandMaterialPassportCertsServer,
  patchBrandMaterialPassportCertReadyServer,
} from '@/lib/server/brand-material-passport-certs-repository';

/** GET /api/brand/merch/material-passport/certs?collectionId=SS27 */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId') ?? undefined;
  const result = await listBrandMaterialPassportCertsServer({ collectionId });
  return NextResponse.json({
    ok: true,
    collectionId: result.collectionId,
    rows: result.rows,
    summary: result.summary,
    releaseBlocked: result.releaseBlocked,
    storageMode: result.storageMode,
    messageRu:
      result.storageMode === 'pg'
        ? `${result.summary.ready}/${result.summary.total} certs ready · PG`
        : `${result.summary.ready}/${result.summary.total} certs · ${result.storageMode}`,
  });
}

/** PATCH · persist cert_ready for SKU (release gate linkage). */
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
  const certReady = body.certReady === true;
  if (!collectionId || !sku) {
    return NextResponse.json(
      { ok: false, error: { code: 'MISSING_FIELDS', message: 'collectionId, sku required' } },
      { status: 400 }
    );
  }

  try {
    const saved = await patchBrandMaterialPassportCertReadyServer({ collectionId, sku, certReady });
    if (!saved.row) {
      return NextResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: 'SKU not found in catalog slice' } },
        { status: 404 }
      );
    }
    const listed = await listBrandMaterialPassportCertsServer({ collectionId });
    return NextResponse.json({
      ok: true,
      row: saved.row,
      collectionId,
      rows: listed.rows,
      summary: listed.summary,
      releaseBlocked: listed.releaseBlocked,
      storageMode: saved.storageMode,
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'CERT_GAPS') {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'CERT_GAPS',
            message: 'Cannot mark ready — composition/care gaps remain',
          },
        },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { ok: false, error: { code: 'ERROR', message: 'Failed to update cert' } },
      { status: 500 }
    );
  }
}
