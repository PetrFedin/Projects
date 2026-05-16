import { NextRequest, NextResponse } from 'next/server';
import {
  presignW2TechPackPutObject,
  w2TechPackRemoteUploadServerConfigured,
} from '@/lib/server/w2-tech-pack-remote-s3';
import { getUnknownErrorDetail } from '@/lib/unknown-error-message';
import { assertTechPackSizeOk, isAllowedTechPackContentTypeForRemote } from '@/lib/server/tech-pack-upload-sanity';
import { logW2TechPackOps } from '@/lib/server/w2-tech-pack-ops-telemetry';
import { verifyW2TechPackWriteRequest } from '@/lib/server/w2-tech-pack-api-auth';

export async function POST(req: NextRequest) {
  if (!w2TechPackRemoteUploadServerConfigured()) {
    return NextResponse.json({ error: 'remote_disabled' }, { status: 503 });
  }
  const auth = verifyW2TechPackWriteRequest(req);
  if (!auth.ok) {
    logW2TechPackOps('presign_unauthorized', { status: auth.status });
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (typeof body !== 'object' || !body) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const attachmentId = String(b.attachmentId ?? '').trim();
  const fileName = String(b.fileName ?? 'file.bin');
  const contentType = String(b.contentType ?? 'application/octet-stream').split(';')[0]!.trim();
  const sizeBytes = Number(b.sizeBytes);
  const contentSha256Hex = String(b.contentSha256Hex ?? '')
    .toLowerCase()
    .replace(/[^a-f0-9]/g, '');

  if (!collectionId || !articleId || !attachmentId) {
    return NextResponse.json({ error: 'ids_required' }, { status: 400 });
  }
  if (contentSha256Hex.length !== 64) {
    return NextResponse.json({ error: 'hash_required' }, { status: 400 });
  }
  try {
    assertTechPackSizeOk(sizeBytes);
  } catch {
    return NextResponse.json({ error: 'size_rejected' }, { status: 400 });
  }
  if (!isAllowedTechPackContentTypeForRemote(contentType)) {
    return NextResponse.json({ error: 'type_rejected' }, { status: 400 });
  }

  try {
    const { uploadUrl, objectKey, method } = await presignW2TechPackPutObject({
      collectionId,
      articleId,
      contentSha256Hex,
      fileName,
      sizeBytes,
      contentType,
    });
    logW2TechPackOps('presign_ok', { objectKey, attachmentId, sizeBytes });
    return NextResponse.json({ uploadUrl, objectKey, method, contentType, attachmentId });
  } catch (e) {
    const msg = getUnknownErrorDetail(e);
    logW2TechPackOps('presign_err', { detail: msg.slice(0, 200) });
    if (msg === 'hash_rejected' || msg === 'size_rejected') {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: 'presign_failed' }, { status: 500 });
  }
}
