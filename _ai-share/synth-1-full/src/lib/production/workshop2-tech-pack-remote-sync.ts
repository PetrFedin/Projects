import { getW2TechPackBlob } from '@/lib/production/workshop2-tech-pack-idb';
import type { Workshop2Phase1TechPackAttachment } from '@/lib/production/workshop2-dossier-phase1.types';
import { sha256HexFull } from '@/lib/production/workshop2-tech-pack-fingerprint';
import { inferMimeTypeForTechPackFile } from '@/lib/production/workshop2-tech-pack-attachment-utils';

/**
 * Опциональный Bearer для вызовов вне same-origin (скрипты, отдельный origin).
 * В проде с `W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER=1` + `W2_TECHPACK_API_SECRET` кабинет шлёт fetch без ключа.
 * NEXT_PUBLIC_ попадает в бандл — избегать, если тот же origin.
 */
function w2TechPackWriteAuthHeaders(): Record<string, string> {
  const k =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_W2_TECHPACK_API_KEY?.trim()) || '';
  if (!k) return {};
  return { Authorization: `Bearer ${k}` };
}

export async function fetchW2TechPackRemoteEnabled(): Promise<boolean> {
  try {
    const r = await fetch('/api/brand/workshop2/tech-pack/remote', { method: 'GET', cache: 'no-store' });
    if (!r.ok) return false;
    const d = (await r.json()) as { enabled?: boolean };
    return Boolean(d.enabled);
  } catch {
    return false;
  }
}

async function getBlobForAttachment(
  a: Workshop2Phase1TechPackAttachment,
  sessionBlobById: Record<string, string>,
  collectionId: string,
  articleId: string
): Promise<Blob | null> {
  if (a.byteStorage === 'idb') {
    return (await getW2TechPackBlob(collectionId, articleId, a.attachmentId)) ?? null;
  }
  const url = a.previewDataUrl ?? sessionBlobById[a.attachmentId];
  if (url) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.blob();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Presign → PUT → complete. Обновления статуса — через onPatch.
 */
export async function syncW2TechPackAttachmentToRemote(opts: {
  collectionId: string;
  articleId: string;
  sessionBlobById: Record<string, string>;
  attachment: Workshop2Phase1TechPackAttachment;
  onPatch: (patch: Partial<Workshop2Phase1TechPackAttachment>) => void;
}): Promise<'synced' | 'failed' | 'skipped' | { jobId: string }> {
  const { collectionId, articleId, sessionBlobById, attachment: a, onPatch } = opts;
  if (a.remoteSyncState === 'synced' && a.remoteObjectKey) return 'skipped';
  onPatch({ remoteSyncState: 'uploading', remoteLastError: undefined });
  const blob = await getBlobForAttachment(a, sessionBlobById, collectionId, articleId);
  if (!blob) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: 'нет байтов для выгрузки' });
    return 'failed';
  }
  const contentSha256Hex = await sha256HexFull(blob);
  if (contentSha256Hex.length !== 64) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: 'хеш' });
    return 'failed';
  }
  const f = new File([blob], a.fileName, {
    type: a.mimeType || blob.type || 'application/octet-stream',
  });
  const mimeType = (a.mimeType && a.mimeType.trim()) || inferMimeTypeForTechPackFile(f) || 'application/octet-stream';

  const pres = await fetch('/api/brand/workshop2/tech-pack/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...w2TechPackWriteAuthHeaders() },
    body: JSON.stringify({
      collectionId,
      articleId,
      attachmentId: a.attachmentId,
      fileName: a.fileName,
      contentType: mimeType,
      sizeBytes: blob.size,
      contentSha256Hex,
    }),
  });
  if (!pres.ok) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: `presign ${pres.status}` });
    return 'failed';
  }
  const p = (await pres.json()) as { uploadUrl?: string; objectKey?: string; contentType?: string };
  if (!p.uploadUrl) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: 'presign' });
    return 'failed';
  }
  const put = await fetch(p.uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': mimeType },
  });
  if (!put.ok) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: `put ${put.status}` });
    return 'failed';
  }
  const done = await fetch('/api/brand/workshop2/tech-pack/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...w2TechPackWriteAuthHeaders() },
    body: JSON.stringify({
      collectionId,
      articleId,
      attachmentId: a.attachmentId,
      fileName: a.fileName,
      contentType: mimeType,
      sizeBytes: blob.size,
      contentSha256Hex,
    }),
  });
  if (!done.ok) {
    onPatch({ remoteSyncState: 'failed', remoteLastError: `complete ${done.status}` });
    return 'failed';
  }
  const d = (await done.json()) as {
    objectKey?: string;
    syncedAt?: string;
    ok?: boolean;
    eTag?: string;
    contentLength?: number;
    jobId?: string;
  };

  if (d.jobId) {
    onPatch({ remoteSyncState: 'pending' });
    return { jobId: d.jobId };
  }

  onPatch({
    remoteSyncState: 'synced',
    remoteObjectKey: d.objectKey,
    remoteSyncedAt: d.syncedAt ?? new Date().toISOString(),
    remoteContentVersion: (a.remoteContentVersion ?? 0) + 1,
    remoteLastError: undefined,
    canonicalSource: 'object_store_verified',
    integritySha256Full: contentSha256Hex,
    objectStoreEtag: d.eTag,
    serverIntegrityVerifiedAt: d.syncedAt ?? new Date().toISOString(),
  });
  return 'synced';
}
