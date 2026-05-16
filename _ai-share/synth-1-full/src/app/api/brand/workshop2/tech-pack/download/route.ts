import { NextRequest, NextResponse } from 'next/server';
import { presignW2TechPackGetObject, w2TechPackRemoteUploadServerConfigured } from '@/lib/server/w2-tech-pack-remote-s3';
import { logW2TechPackOps } from '@/lib/server/w2-tech-pack-ops-telemetry';
import { verifyW2TechPackReadRequest } from '@/lib/server/w2-tech-pack-api-auth';
import { getW2TechPackIndex } from '@/lib/server/w2-tech-pack-index';
import { getUnknownErrorDetail } from '@/lib/unknown-error-message';

/**
 * Presigned GET по строке индекса: тот же objectKey, что прошёл complete (SHA + magic + размер).
 */
export async function GET(req: NextRequest) {
  if (!w2TechPackRemoteUploadServerConfigured()) {
    return NextResponse.json({ error: 'remote_disabled' }, { status: 503 });
  }
  const auth = verifyW2TechPackReadRequest(req);
  if (!auth.ok) {
    logW2TechPackOps('download_unauthorized', { status: auth.status });
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { searchParams } = new URL(req.url);
  const collectionId = String(searchParams.get('collectionId') ?? '').trim();
  const articleId = String(searchParams.get('articleId') ?? '').trim();
  const attachmentId = String(searchParams.get('attachmentId') ?? '').trim();
  if (!collectionId || !articleId || !attachmentId) {
    return NextResponse.json({ error: 'ids_required' }, { status: 400 });
  }
  const row = await getW2TechPackIndex(collectionId, articleId, attachmentId);
  if (!row) {
    logW2TechPackOps('download_index_miss', { collectionId, articleId, attachmentId });
    return NextResponse.json({ error: 'not_indexed' }, { status: 404 });
  }
  try {
    const { downloadUrl, expiresIn } = await presignW2TechPackGetObject(row.objectKey);
    logW2TechPackOps('download_presign_ok', { objectKey: row.objectKey, attachmentId });
    return NextResponse.json({
      downloadUrl,
      expiresIn,
      objectKey: row.objectKey,
      contentSha256Hex: row.contentSha256Hex,
      etag: row.etag,
      contentType: row.contentType,
      sizeBytes: row.sizeBytes,
      uploadedBy: row.uploadedBy,
      handoffStatus: row.handoffStatus,
      packageRevision: row.packageRevision,
      updatedAt: row.updatedAt,
    });
  } catch (e) {
    const msg = getUnknownErrorDetail(e);
    logW2TechPackOps('download_presign_err', { detail: msg.slice(0, 200) });
    return NextResponse.json({ error: 'presign_failed' }, { status: 500 });
  }
}
