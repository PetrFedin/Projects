/**
 * POST — presign для CAD (DXF/PDF) + метаданные vault document kind=cad.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { upsertWorkshop2VaultDocumentToPg } from '@/lib/server/workshop2-dossier-repository';
import {
  presignWorkshop2VaultPut,
  isWorkshop2VaultS3Configured,
} from '@/lib/server/workshop2-vault-s3';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
} from '@/lib/server/workshop2-api-context';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

const CAD_MIME = new Set([
  'application/pdf',
  'application/dxf',
  'image/vnd.dxf',
  'application/octet-stream',
]);

function isCadFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.dxf') || lower.endsWith('.pdf') || lower.endsWith('.dwg');
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }
  if (!isWorkshop2VaultS3Configured()) {
    return NextResponse.json(
      {
        ok: false,
        error: 'vault_s3_not_configured',
        message: 'Настройте WORKSHOP2_S3_* для CAD ingest.',
      },
      { status: 503 }
    );
  }

  const fileName = String(b.fileName ?? 'drawing.dxf');
  const contentType = String(b.contentType ?? 'application/octet-stream')
    .split(';')[0]!
    .trim();
  const sizeBytes = Number(b.sizeBytes ?? 0);
  if (!isCadFileName(fileName) && !CAD_MIME.has(contentType)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_cad_type',
        message: 'Допустимы DXF, PDF или DWG.',
      },
      { status: 400 }
    );
  }

  const documentId = String(b.documentId ?? '').trim() || `cad-${randomUUID().slice(0, 8)}`;
  const createdBy = resolveWorkshop2UpdatedBy(req, String(b.createdBy ?? ''), auth.actor);

  try {
    const { uploadUrl, storagePath, method } = await presignWorkshop2VaultPut({
      collectionId: cid,
      articleId: aid,
      documentId,
      fileName,
      contentType,
      sizeBytes: sizeBytes > 0 ? sizeBytes : 1024,
    });

    let document: Awaited<ReturnType<typeof upsertWorkshop2VaultDocumentToPg>> | null = null;
    if (isWorkshop2PostgresEnabled()) {
      document = await upsertWorkshop2VaultDocumentToPg({
        collectionId: cid,
        articleId: aid,
        documentId,
        organizationId: resolveWorkshop2OrganizationId(req),
        fileName,
        mimeType: contentType,
        sizeBytes: sizeBytes > 0 ? sizeBytes : undefined,
        storagePath,
        metadata: {
          kind: 'cad',
          ingest: 'cad-ingest',
          sourceKind: 'cad',
          ...(Array.isArray(b.measures) ? { measures: b.measures } : {}),
        },
        createdBy,
      });
    }

    return NextResponse.json({
      ok: true,
      documentId,
      uploadUrl,
      storagePath,
      method,
      document,
    });
  } catch (e) {
    const msg = getUnknownErrorMessage(e, 'cad_ingest_failed');
    return NextResponse.json(
      { ok: false, error: 'cad_ingest_failed', message: msg },
      { status: 500 }
    );
  }
}
