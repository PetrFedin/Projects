/**
 * URL фото для AI-анализа посадки: превью скетча из досье или vault (без mock data: URLs).
 */

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2VaultGlbPublicUrl } from '@/lib/production/workshop2-fit-3d-model-resolve';

/** Первый непустой data URL листа скетча в досье. */
export function resolveWorkshop2SketchSheetThumbUrl(
  dossier: Workshop2DossierPhase1 | null | undefined
): string | undefined {
  const sheets = dossier?.sketchSheets ?? [];
  for (const sheet of sheets) {
    const url = sheet.imageDataUrl?.trim();
    if (url) return url;
  }
  return undefined;
}

/** Vault-документ скетча (cad-ingest / sketch upload) → URL файла. */
export function resolveWorkshop2SketchVaultThumbUrl(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
}): string {
  return workshop2VaultGlbPublicUrl({
    collectionId: input.collectionId,
    articleId: input.articleId,
    vaultDocumentId: input.documentId,
  });
}

export function pickWorkshop2SketchVaultDocumentId(
  documents: { documentId: string; metadata?: Record<string, unknown>; mimeType?: string }[]
): string | undefined {
  for (const d of documents) {
    const kind = String(d.metadata?.kind ?? d.metadata?.sourceKind ?? '').toLowerCase();
    if (kind === 'sketch') return d.documentId;
    const mime = (d.mimeType ?? '').toLowerCase();
    if (mime.startsWith('image/')) return d.documentId;
  }
  return undefined;
}

export function isWorkshop2EphemeralPhotoUrl(url: string): boolean {
  const t = url.trim().toLowerCase();
  return t.startsWith('blob:') || t.startsWith('blob%3a');
}

/** Список URL для fit-sessions/ai-analysis (пустой — сервер анализирует без фото). */
export function resolveWorkshop2FitSessionPhotoUrls(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  vaultSketchDocumentId?: string | null;
  sessionPhotoVaultDocumentId?: string | null;
  collectionId?: string;
  articleId?: string;
}): string[] {
  const sessionDocId = input.sessionPhotoVaultDocumentId?.trim();
  if (sessionDocId && input.collectionId && input.articleId) {
    return [
      resolveWorkshop2SketchVaultThumbUrl({
        collectionId: input.collectionId,
        articleId: input.articleId,
        documentId: sessionDocId,
      }),
    ];
  }

  const docId = input.vaultSketchDocumentId?.trim();
  if (docId && input.collectionId && input.articleId) {
    return [
      resolveWorkshop2SketchVaultThumbUrl({
        collectionId: input.collectionId,
        articleId: input.articleId,
        documentId: docId,
      }),
    ];
  }

  const sheet = resolveWorkshop2SketchSheetThumbUrl(input.dossier);
  if (sheet && !isWorkshop2EphemeralPhotoUrl(sheet)) return [sheet];
  return [];
}
