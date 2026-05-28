/**
 * POST — Illustrator webhook: asset ref → vault presign (Wave 6) + journal on failure.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2IllustratorWebhookJournalEntry,
  parseWorkshop2IllustratorWebhookBody,
  verifyWorkshop2IllustratorWebhookSecret,
} from '@/lib/production/workshop2-illustrator-webhook';
import { enqueueWorkshop2IllustratorVaultPresign } from '@/lib/production/workshop2-illustrator-vault-enqueue';

export async function POST(req: NextRequest) {
  const verify = verifyWorkshop2IllustratorWebhookSecret({
    secretHeader: req.headers.get('x-workshop2-illustrator-secret'),
  });
  if (!verify.ok) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized', messageRu: verify.messageRu },
      { status: verify.status ?? 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const payload = parseWorkshop2IllustratorWebhookBody(body);
  if (!payload) {
    return jsonWorkshop2ErrorRu(400, 'invalid_payload', {
      messageRu: 'Укажите assetRef в теле запроса.',
    });
  }

  const vault = await enqueueWorkshop2IllustratorVaultPresign({ payload });
  const entry = buildWorkshop2IllustratorWebhookJournalEntry(payload);
  entry.presignEnqueued = vault.enqueued;
  entry.noteRu = vault.noteRu;

  return NextResponse.json({
    ok: true,
    journal: entry,
    vault,
    presignPlaceholder: vault.presignIssued
      ? {
          route: `/api/workshop2/articles/${payload.collectionId}/${payload.articleId}/vault/presign`,
          storagePath: vault.storagePath,
          attachmentRef: vault.attachmentRef,
          status: 'presign_issued',
        }
      : vault.enqueued
        ? {
            route: `/api/workshop2/articles/${payload.collectionId}/${payload.articleId}/vault/presign`,
            attachmentRef: vault.attachmentRef,
            status: 'journal_only',
          }
        : null,
    messageRu: vault.noteRu,
  });
}
