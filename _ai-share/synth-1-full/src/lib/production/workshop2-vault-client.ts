'use client';

import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2VaultDocumentRecord = {
  documentId: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storagePath?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
};

function vaultPath(collectionId: string, articleId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/vault`;
}

function presignPath(collectionId: string, articleId: string): string {
  return `${vaultPath(collectionId, articleId)}/presign`;
}

export async function listWorkshop2VaultDocumentsFromApi(
  collectionId: string,
  articleId: string
): Promise<
  { ok: true; documents: Workshop2VaultDocumentRecord[] } | { ok: false; message: string }
> {
  try {
    const res = await fetch(vaultPath(collectionId, articleId), {
      headers: buildWorkshop2ApiRequestHeaders(),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      documents?: Workshop2VaultDocumentRecord[];
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, message: json.message ?? 'Не удалось загрузить список документов' };
    }
    return { ok: true, documents: Array.isArray(json.documents) ? json.documents : [] };
  } catch {
    return { ok: false, message: 'Сеть недоступна. Проверьте подключение.' };
  }
}

export async function presignWorkshop2VaultUpload(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}): Promise<
  | { ok: true; uploadUrl: string; storagePath: string; method: 'PUT' }
  | { ok: false; message: string }
> {
  try {
    const res = await fetch(presignPath(input.collectionId, input.articleId), {
      method: 'POST',
      headers: buildWorkshop2ApiRequestHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        intent: 'put',
        documentId: input.documentId,
        fileName: input.fileName,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes,
      }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      uploadUrl?: string;
      storagePath?: string;
      method?: 'PUT';
      message?: string;
      error?: string;
    };
    if (!res.ok) {
      if (json.error === 'vault_s3_not_configured') {
        return {
          ok: false,
          message:
            'Хранилище S3 не настроено. См. /brand/production/workshop2/setup (MinIO и WORKSHOP2_S3_*).',
        };
      }
      return { ok: false, message: json.message ?? 'Не удалось получить URL загрузки' };
    }
    if (!json.uploadUrl || !json.storagePath) {
      return { ok: false, message: 'Некорректный ответ presign' };
    }
    return { ok: true, uploadUrl: json.uploadUrl, storagePath: json.storagePath, method: 'PUT' };
  } catch {
    return { ok: false, message: 'Сеть недоступна при выдаче presign URL' };
  }
}

export async function saveWorkshop2VaultDocumentMetadata(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdBy?: string;
}): Promise<{ ok: true; document: Workshop2VaultDocumentRecord } | { ok: false; message: string }> {
  try {
    const res = await fetch(vaultPath(input.collectionId, input.articleId), {
      method: 'PUT',
      headers: buildWorkshop2ApiRequestHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        documentId: input.documentId,
        fileName: input.fileName,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        storagePath: input.storagePath,
        createdBy: input.createdBy,
      }),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      document?: Workshop2VaultDocumentRecord;
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, message: json.message ?? 'Не удалось сохранить метаданные в БД' };
    }
    if (!json.document) return { ok: false, message: 'Некорректный ответ сервера' };
    return { ok: true, document: json.document };
  } catch {
    return { ok: false, message: 'Сеть недоступна при сохранении метаданных' };
  }
}

export async function uploadWorkshop2VaultFile(input: {
  collectionId: string;
  articleId: string;
  file: File;
  createdBy?: string;
}): Promise<{ ok: true; document: Workshop2VaultDocumentRecord } | { ok: false; message: string }> {
  const documentId = `vault-${Date.now()}`;
  const contentType = input.file.type || 'application/octet-stream';
  const presign = await presignWorkshop2VaultUpload({
    collectionId: input.collectionId,
    articleId: input.articleId,
    documentId,
    fileName: input.file.name,
    contentType,
    sizeBytes: input.file.size,
  });
  if (!presign.ok) return presign;

  try {
    const putRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: input.file,
    });
    if (!putRes.ok) {
      return { ok: false, message: `Ошибка загрузки в S3 (${putRes.status})` };
    }
  } catch {
    return { ok: false, message: 'Не удалось загрузить файл в объектное хранилище' };
  }

  return saveWorkshop2VaultDocumentMetadata({
    collectionId: input.collectionId,
    articleId: input.articleId,
    documentId,
    fileName: input.file.name,
    mimeType: contentType,
    sizeBytes: input.file.size,
    storagePath: presign.storagePath,
    createdBy: input.createdBy,
  });
}
