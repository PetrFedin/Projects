/**
 * Один ZIP со всеми байтами вложений техпака
 * (data: из досье, blob: сессии, IndexedDB).
 */
import JSZip from 'jszip';
import type { Workshop2Phase1TechPackAttachment } from '@/lib/production/workshop2-dossier-phase1.types';

function sanitizeZipEntryName(name: string, fallbackStem: string): string {
  const n = (name || '').trim() || `${fallbackStem}.bin`;
  const cleaned = n.replace(/[\\/]+/g, '-').replace(/\.\./g, '.');
  return cleaned.slice(0, 200) || 'file.bin';
}

async function readUrlAsBlob(url: string): Promise<Blob> {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`readUrlAsBlob: ${r.status}`);
  }
  return r.blob();
}

export type BuildWorkshop2TechPackZipResult = {
  blob: Blob;
  included: number;
  skippedNoUrl: number;
  skippedByFilter: number;
};

export type BuildW2TechPackZipOptions = {
  attachments: Workshop2Phase1TechPackAttachment[];
  sessionBlobById: Record<string, string>;
  getIdbBlob?: (attachmentId: string) => Promise<Blob | undefined>;
  includeAttachment?: (a: Workshop2Phase1TechPackAttachment) => boolean;
  /** Не класть в архив файлы с расширением .zip (политика «без вложенных архивов»). */
  excludeZipExtensions?: boolean;
  onProgress?: (metadata: { percent: number; currentFile: string }) => void;
};

/**
 * @throws Error с message `no_bytes` или `all_filtered`
 */
export async function buildWorkshop2TechPackZipBlob(
  opts: BuildW2TechPackZipOptions
): Promise<BuildWorkshop2TechPackZipResult> {
  const {
    attachments,
    sessionBlobById,
    getIdbBlob,
    includeAttachment = () => true,
    excludeZipExtensions = false,
  } = opts;
  const zip = new JSZip();
  const usedLower = new Set<string>();
  let included = 0;
  let skippedNoUrl = 0;
  let skippedByFilter = 0;

  for (let i = 0; i < attachments.length; i++) {
    const a = attachments[i];
    if (!includeAttachment(a)) {
      skippedByFilter += 1;
      continue;
    }
    const lowName = a.fileName.toLowerCase();
    if (excludeZipExtensions && (lowName.endsWith('.zip') || lowName.endsWith('.aama'))) {
      skippedByFilter += 1;
      continue;
    }

    if (opts.onProgress) {
      opts.onProgress({
        percent: Math.round((i / attachments.length) * 50),
        currentFile: `Сборка файла: ${a.fileName}`,
      });
    }

    // Yield to the event loop to prevent UI freezing
    await new Promise((resolve) => setTimeout(resolve, 15));

    const id = a.attachmentId;
    const storage = a.byteStorage ?? (a.previewDataUrl ? 'dataurl' : 'session');

    if (storage === 'idb') {
      if (!getIdbBlob) {
        skippedNoUrl += 1;
        continue;
      }
      const b = await getIdbBlob(id);
      if (!b) {
        skippedNoUrl += 1;
        continue;
      }
      const name = uniqueZipName(usedLower, a);
      zip.file(name, b);
      included += 1;
      continue;
    }

    const url = a.previewDataUrl ?? sessionBlobById[id];
    if (!url) {
      skippedNoUrl += 1;
      continue;
    }
    const blob = await readUrlAsBlob(url);
    const name = uniqueZipName(usedLower, a);
    zip.file(name, blob);
    included += 1;
  }

  if (included === 0) {
    if (attachments.length > 0 && skippedByFilter >= attachments.length) {
      const e = new Error('all_filtered');
      e.name = 'TechPackZipError';
      throw e;
    }
    const e = new Error('no_bytes');
    e.name = 'TechPackZipError';
    throw e;
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }, (metadata) => {
    if (opts.onProgress) {
      // Zip generation takes the second 50%
      opts.onProgress({
        percent: 50 + Math.round(metadata.percent / 2),
        currentFile: metadata.currentFile || 'Архивация...',
      });
    }
  });
  return { blob, included, skippedNoUrl, skippedByFilter };
}

function uniqueZipName(usedLower: Set<string>, a: Workshop2Phase1TechPackAttachment): string {
  const base = sanitizeZipEntryName(a.fileName, a.attachmentId.slice(0, 8));
  let name = base;
  let n = 2;
  while (usedLower.has(name.toLowerCase())) {
    const dot = base.lastIndexOf('.');
    const stem = dot > 0 ? base.slice(0, dot) : base;
    const ext = dot > 0 ? base.slice(dot) : '';
    name = `${stem}_${n}${ext}`;
    n += 1;
  }
  usedLower.add(name.toLowerCase());
  return name;
}

export function triggerBrowserDownloadBlob(blob: Blob, fileName: string): void {
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u;
  a.download = fileName;
  a.rel = 'noreferrer';
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(u), 90_000);
}

export function sanitizeTechPackZipStem(raw: string): string {
  const s = raw
    .trim()
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.slice(0, 64) || 'article';
}
