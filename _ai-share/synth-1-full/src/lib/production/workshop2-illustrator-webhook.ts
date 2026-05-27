/**
 * Wave 5 P2 #8: Illustrator webhook journal → vault presign placeholder enqueue.
 */
export type Workshop2IllustratorWebhookPayload = {
  assetRef: string;
  fileName?: string;
  mimeType?: string;
  collectionId?: string;
  articleId?: string;
  illustratorJobId?: string;
};

export type Workshop2IllustratorWebhookJournalEntry = {
  id: string;
  receivedAt: string;
  status: 'journal_only';
  presignEnqueued: boolean;
  noteRu: string;
  payload: Workshop2IllustratorWebhookPayload;
};

export function parseWorkshop2IllustratorWebhookBody(
  body: unknown
): Workshop2IllustratorWebhookPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const assetRef = String(b.assetRef ?? b.asset_ref ?? b.path ?? '').trim();
  if (!assetRef) return null;
  return {
    assetRef,
    fileName:
      b.fileName != null
        ? String(b.fileName)
        : b.file_name != null
          ? String(b.file_name)
          : undefined,
    mimeType: b.mimeType != null ? String(b.mimeType) : undefined,
    collectionId: b.collectionId != null ? String(b.collectionId) : undefined,
    articleId: b.articleId != null ? String(b.articleId) : undefined,
    illustratorJobId:
      b.illustratorJobId != null
        ? String(b.illustratorJobId)
        : b.jobId != null
          ? String(b.jobId)
          : undefined,
  };
}

export function verifyWorkshop2IllustratorWebhookSecret(input: {
  secretHeader?: string | null;
  env?: Record<string, string | undefined>;
}): { ok: boolean; status?: 401; messageRu?: string } {
  const expected = String(
    input.env?.WORKSHOP2_ILLUSTRATOR_WEBHOOK_SECRET ??
      process.env.WORKSHOP2_ILLUSTRATOR_WEBHOOK_SECRET ??
      ''
  ).trim();
  if (!expected) return { ok: true };
  if (input.secretHeader?.trim() === expected) return { ok: true };
  return { ok: false, status: 401, messageRu: 'Illustrator webhook: неверный секрет.' };
}

export function buildWorkshop2IllustratorWebhookJournalEntry(
  payload: Workshop2IllustratorWebhookPayload
): Workshop2IllustratorWebhookJournalEntry {
  const canEnqueue = Boolean(payload.collectionId && payload.articleId);
  return {
    id: `ill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    status: 'journal_only',
    presignEnqueued: canEnqueue,
    noteRu: canEnqueue
      ? 'Illustrator asset ref принят — vault presign placeholder поставлен в очередь (journal only).'
      : 'Illustrator asset ref принят — укажите collectionId/articleId для presign enqueue.',
    payload,
  };
}
