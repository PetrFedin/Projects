/**
 * Определение MIME и типа inline-превью для вложений техпака (фаза 1, localStorage).
 */
import type { Workshop2Phase1TechPackAttachment } from '@/lib/production/workshop2-dossier-phase1.types';

export function mimeFromDataUrl(dataUrl: string): string | undefined {
  const m = /^data:([^;,]+)/i.exec(dataUrl);
  return m?.[1]?.trim() || undefined;
}

export function inferMimeTypeForTechPackFile(file: File, dataUrl?: string): string | undefined {
  const t = file.type?.trim();
  if (t) return t;
  if (dataUrl) {
    const fromData = mimeFromDataUrl(dataUrl);
    if (fromData) return fromData;
  }
  const n = file.name.toLowerCase();
  if (/\.pdf$/i.test(n)) return 'application/pdf';
  if (/\.svg$/i.test(n)) return 'image/svg+xml';
  if (/\.(jpe?g)$/i.test(n)) return 'image/jpeg';
  if (/\.png$/i.test(n)) return 'image/png';
  if (/\.webp$/i.test(n)) return 'image/webp';
  if (/\.gif$/i.test(n)) return 'image/gif';
  return undefined;
}

export function effectiveTechPackAttachmentMime(a: Workshop2Phase1TechPackAttachment): string {
  const t = a.mimeType?.trim();
  if (t) return t;
  if (a.previewDataUrl) {
    return mimeFromDataUrl(a.previewDataUrl) ?? '';
  }
  const n = a.fileName.toLowerCase();
  if (/\.pdf$/i.test(n)) return 'application/pdf';
  if (/\.svg$/i.test(n)) return 'image/svg+xml';
  if (/\.(jpe?g)$/i.test(n)) return 'image/jpeg';
  if (/\.png$/i.test(n)) return 'image/png';
  if (/\.webp$/i.test(n)) return 'image/webp';
  if (/\.gif$/i.test(n)) return 'image/gif';
  return '';
}

/** Те же условия, что у кнопки «Скачать ZIP» (data URL, сессия, IndexedDB). */
export function techPackAttachmentHasZipSourceBytes(
  a: Workshop2Phase1TechPackAttachment,
  sessionBlobById: Record<string, string>
): boolean {
  return (
    Boolean(a.previewDataUrl) ||
    Boolean(sessionBlobById[a.attachmentId]) ||
    a.byteStorage === 'idb'
  );
}

export function techPackInlinePreviewKind(
  effectiveMime: string,
  fileName: string
): 'image' | 'pdf' | '3d' | null {
  const m = effectiveMime.toLowerCase();
  const n = fileName.toLowerCase();
  if (/\.(glb|gltf|obj)$/i.test(n) || m === 'model/gltf-binary' || m === 'model/gltf+json' || m === 'model/obj') {
    return '3d';
  }
  if (m === 'application/pdf' || m === 'application/x-pdf' || /\.pdf$/i.test(n)) {
    return 'pdf';
  }
  if (m.startsWith('image/')) {
    return 'image';
  }
  if (/\.(jpe?g|png|gif|webp|svg)$/i.test(n)) {
    return 'image';
  }
  return null;
}
