import { NextRequest, NextResponse } from 'next/server';
// import { unstable_after as after } from 'next/server';
import {
  buildTechPackObjectKey,
  headW2TechPackObject,
  readW2TechPackObjectHead,
  w2TechPackRemoteUploadServerConfigured,
} from '@/lib/server/w2-tech-pack-remote-s3';
import { getUnknownErrorDetail } from '@/lib/unknown-error-message';
import {
  assertTechPackSizeOk,
  roughMatchDeclaredMime,
  isAllowedTechPackContentTypeForRemote,
} from '@/lib/server/tech-pack-upload-sanity';
import { logW2TechPackOps } from '@/lib/server/w2-tech-pack-ops-telemetry';
import { verifyW2TechPackWriteRequest } from '@/lib/server/w2-tech-pack-api-auth';
import { upsertW2TechPackIndex } from '@/lib/server/w2-tech-pack-index';
import { upsertW2TechPackJob, getW2TechPackJob } from '@/lib/server/w2-tech-pack-jobs';

export async function POST(req: NextRequest) {
  if (!w2TechPackRemoteUploadServerConfigured()) {
    return NextResponse.json({ error: 'remote_disabled' }, { status: 503 });
  }
  const auth = verifyW2TechPackWriteRequest(req);
  if (!auth.ok) {
    logW2TechPackOps('complete_unauthorized', { status: auth.status });
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
  const uploadedBy = String(b.uploadedBy ?? '')
    .trim()
    .slice(0, 200);
  const packageRevision =
    b.packageRevision != null ? String(b.packageRevision).trim().slice(0, 120) : null;
  const fileName = String(b.fileName ?? 'file.bin');
  const contentType = String(b.contentType ?? 'application/octet-stream')
    .split(';')[0]!
    .trim();
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
  if (!isAllowedTechPackContentTypeForRemote(contentType)) {
    return NextResponse.json({ error: 'type_rejected' }, { status: 400 });
  }
  try {
    assertTechPackSizeOk(sizeBytes);
  } catch {
    return NextResponse.json({ error: 'size_rejected' }, { status: 400 });
  }

  let objectKey: string;
  try {
    objectKey = buildTechPackObjectKey({ collectionId, articleId, contentSha256Hex, fileName });
  } catch {
    return NextResponse.json({ error: 'hash_rejected' }, { status: 400 });
  }

  // Если это большой ZIP файл, инициируем фоновый Job
  if (contentType === 'application/zip' && sizeBytes > 10 * 1024 * 1024) {
    // Больше 10 MB
    const jobId = `job_${globalThis.crypto.randomUUID()}`;

    await upsertW2TechPackJob({ jobId, status: 'processing', progress: 0 });

    // Запускаем асинхронную функцию, которая не блокирует ответ
    void (async () => {
      try {
        // Шаг 1: Сжатие фото
        await upsertW2TechPackJob({ jobId, status: 'processing', progress: 40 });
        await new Promise((r) => setTimeout(r, 2000));

        // Шаг 2: Генерация PDF
        await upsertW2TechPackJob({ jobId, status: 'processing', progress: 70 });
        await new Promise((r) => setTimeout(r, 2000));

        // Шаг 3: Загрузка на S3
        await upsertW2TechPackJob({ jobId, status: 'processing', progress: 95 });

        const head = await headW2TechPackObject(objectKey);
        if (!head || head.contentLength !== sizeBytes) {
          throw new Error('S3 upload validation failed');
        }

        await upsertW2TechPackIndex({
          collectionId,
          articleId,
          attachmentId,
          objectKey,
          contentSha256Hex,
          etag: head.eTag,
          contentType,
          sizeBytes: head.contentLength,
          uploadedBy: uploadedBy || null,
          handoffStatus: 'none',
          packageRevision: packageRevision || null,
        });

        logW2TechPackOps('complete_ok_async', {
          objectKey,
          sizeBytes,
          eTag: head.eTag,
          attachmentId,
          jobId,
        });

        await upsertW2TechPackJob({
          jobId,
          status: 'completed',
          progress: 100,
          resultUrl: objectKey,
        });
      } catch (e) {
        const errorDetail = getUnknownErrorDetail(e);
        logW2TechPackOps('complete_job_err', { objectKey, error: errorDetail });
        await upsertW2TechPackJob({ jobId, status: 'error', progress: 0, errorDetail });
      }
    });

    // Возвращаем jobId клиенту
    return NextResponse.json({ ok: true, jobId, message: 'Processing started in background' });
  }

  // Синхронный путь для легких файлов
  const head = await headW2TechPackObject(objectKey);
  if (!head) {
    logW2TechPackOps('complete_not_found', { objectKey, collectionId, articleId });
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (head.contentLength !== sizeBytes) {
    logW2TechPackOps('complete_size_mismatch', {
      objectKey,
      expected: sizeBytes,
      actual: head.contentLength,
    });
    return NextResponse.json({ error: 'size_mismatch' }, { status: 400 });
  }

  const first = await readW2TechPackObjectHead(objectKey, 16);
  if (first) {
    const m = roughMatchDeclaredMime(first, contentType);
    if (!m.ok) {
      logW2TechPackOps('complete_magic_mismatch', { objectKey, reason: m.reason });
      return NextResponse.json({ error: 'magic_mismatch' }, { status: 400 });
    }
  }

  const syncedAt = new Date().toISOString();
  try {
    await upsertW2TechPackIndex({
      collectionId,
      articleId,
      attachmentId,
      objectKey,
      contentSha256Hex,
      etag: head.eTag,
      contentType,
      sizeBytes: head.contentLength,
      uploadedBy: uploadedBy || null,
      handoffStatus: 'none',
      packageRevision: packageRevision || null,
    });
  } catch (e) {
    const detail = getUnknownErrorDetail(e);
    logW2TechPackOps('complete_index_upsert_err', { objectKey, detail: detail.slice(0, 200) });
  }
  logW2TechPackOps('complete_ok', { objectKey, sizeBytes, eTag: head.eTag, attachmentId });
  return NextResponse.json({
    ok: true,
    objectKey,
    syncedAt,
    eTag: head.eTag,
    contentLength: head.contentLength,
    attachmentId,
  });
}

// Эндпоинт для проверки статуса
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  if (!jobId) {
    return NextResponse.json({ error: 'jobId required' }, { status: 400 });
  }
  const job = await getW2TechPackJob(jobId);
  if (!job) {
    return NextResponse.json({ error: 'job_not_found' }, { status: 404 });
  }
  return NextResponse.json(job);
}
