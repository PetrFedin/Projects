/**
 * Wave 6 P1 #7: Illustrator webhook → vault presign slot + dossier attachment ref (при S3/MinIO).
 */
import { isWorkshop2VaultS3ConfiguredFromEnv } from '@/lib/production/workshop2-vault-presign-prod-guard';
import type { Workshop2IllustratorWebhookPayload } from '@/lib/production/workshop2-illustrator-webhook';

export type Workshop2IllustratorVaultEnqueueResult = {
  enqueued: boolean;
  presignIssued: boolean;
  attachmentRef?: string;
  storagePath?: string;
  uploadUrl?: string;
  noteRu: string;
  journalOnly: boolean;
};

export function buildWorkshop2IllustratorAttachmentRef(input: {
  collectionId: string;
  articleId: string;
  assetRef: string;
}): string {
  const safe = input.assetRef.replace(/[^\w./-]+/g, '_').slice(0, 120);
  return `illustrator://${input.collectionId}/${input.articleId}/${safe}`;
}

export async function enqueueWorkshop2IllustratorVaultPresign(input: {
  payload: Workshop2IllustratorWebhookPayload;
  env?: Record<string, string | undefined>;
}): Promise<Workshop2IllustratorVaultEnqueueResult> {
  const env = input.env ?? process.env;
  const { collectionId, articleId, assetRef, fileName, mimeType } = input.payload;

  if (!collectionId?.trim() || !articleId?.trim()) {
    return {
      enqueued: false,
      presignIssued: false,
      noteRu: 'Illustrator: укажите collectionId и articleId для vault presign.',
      journalOnly: true,
    };
  }

  const attachmentRef = buildWorkshop2IllustratorAttachmentRef({
    collectionId,
    articleId,
    assetRef,
  });

  if (!isWorkshop2VaultS3ConfiguredFromEnv(env)) {
    return {
      enqueued: true,
      presignIssued: false,
      attachmentRef,
      noteRu:
        'Illustrator asset ref журналирован — S3/MinIO не настроен (WORKSHOP2_S3_*), presign пропущен.',
      journalOnly: true,
    };
  }

  try {
    const { presignWorkshop2VaultPut } = await import('@/lib/server/workshop2-vault-s3');
    const docId = `ill-${Date.now()}`;
    const name = fileName?.trim() || assetRef.split('/').pop() || 'illustrator.ai';
    const contentType = mimeType?.trim() || 'application/octet-stream';
    const presign = await presignWorkshop2VaultPut({
      collectionId,
      articleId,
      documentId: docId,
      fileName: name,
      contentType,
      sizeBytes: 1024,
    });
    return {
      enqueued: true,
      presignIssued: true,
      attachmentRef,
      storagePath: presign.storagePath,
      uploadUrl: presign.uploadUrl,
      noteRu: 'Illustrator → vault presign slot выдан; attachment ref записан в journal.',
      journalOnly: false,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'presign_failed';
    return {
      enqueued: true,
      presignIssued: false,
      attachmentRef,
      noteRu: `Illustrator presign ошибка (${msg}) — событие журналировано.`,
      journalOnly: true,
    };
  }
}
