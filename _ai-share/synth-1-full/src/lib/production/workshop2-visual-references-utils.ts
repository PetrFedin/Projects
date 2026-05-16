import type {
  Workshop2Phase1VisualReference,
  Workshop2VisualRefTakeawayAspect,
} from '@/lib/production/workshop2-dossier-phase1.types';

const MAX_VISUAL_REF_IMAGE_DATA_URL_CHARS = 900_000;
const MAX_VISUAL_REF_VIDEO_DATA_URL_CHARS = 5_000_000;
/** Референсы модели в ТЗ: до 6 файлов (общий реф — сетка 2×3). */
export const MAX_VISUAL_REFERENCES = 6;

function readFileAsDataUrlLimited(file: File, maxChars = 900_000): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

export function readVisualRefFileAsDataUrl(file: File): Promise<string | undefined> {
  const t = file.type?.trim() ?? '';
  const isVideo =
    t.startsWith('video/') || (!t && /\.(mp4|m4v|webm|mov|mkv|ogv)$/i.test(file.name));
  const max = isVideo ? MAX_VISUAL_REF_VIDEO_DATA_URL_CHARS : MAX_VISUAL_REF_IMAGE_DATA_URL_CHARS;
  return readFileAsDataUrlLimited(file, max);
}

function mimeFromDataUrl(dataUrl: string): string | undefined {
  const m = /^data:([^;,]+)/i.exec(dataUrl);
  return m?.[1]?.trim() || undefined;
}

export function inferMimeTypeForVisualRef(file: File, dataUrl?: string): string {
  if (file.type?.trim()) return file.type;
  const fromData = dataUrl ? mimeFromDataUrl(dataUrl) : undefined;
  if (fromData) return fromData;
  const n = file.name.toLowerCase();
  if (/\.(jpe?g)$/.test(n)) return 'image/jpeg';
  if (/\.png$/.test(n)) return 'image/png';
  if (/\.webp$/.test(n)) return 'image/webp';
  if (/\.gif$/.test(n)) return 'image/gif';
  if (/\.(mp4|m4v)$/.test(n)) return 'video/mp4';
  if (/\.webm$/.test(n)) return 'video/webm';
  if (/\.mov$/.test(n)) return 'video/quicktime';
  return 'image/jpeg';
}

export function effectiveVisualRefMime(r: Workshop2Phase1VisualReference): string {
  const t = r.mimeType?.trim();
  if (t) return t;
  if (r.previewDataUrl) return mimeFromDataUrl(r.previewDataUrl) ?? '';
  return '';
}

export function visualRefIsMediaPreview(r: Workshop2Phase1VisualReference): boolean {
  if (!r.previewDataUrl) return false;
  const mt = effectiveVisualRefMime(r).toLowerCase();
  return mt.startsWith('image/') || mt.startsWith('video/');
}

export function visualRefSameUser(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Клик по img с object-contain: точка внутри нарисованного изображения (без полей letterbox). */
export function visualRefImageClickToFocusPx(
  el: HTMLImageElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  let x = clientX - rect.left;
  let y = clientY - rect.top;
  const nw = el.naturalWidth;
  const nh = el.naturalHeight;
  if (nw <= 0 || nh <= 0) return { x, y };
  const ew = el.clientWidth;
  const eh = el.clientHeight;
  const s = Math.min(ew / nw, eh / nh);
  const dw = nw * s;
  const dh = nh * s;
  const ox = (ew - dw) / 2;
  const oy = (eh - dh) / 2;
  return {
    x: Math.min(Math.max(x, ox), ox + dw),
    y: Math.min(Math.max(y, oy), oy + dh),
  };
}

export const VISUAL_REF_TAKEAWAY_LABELS: Record<Workshop2VisualRefTakeawayAspect, string> = {
  silhouette: 'Силуэт',
  color: 'Цвет',
  hardware: 'Фурнитура',
  fit: 'Посадка',
  fabric: 'Ткань',
  mood: 'Mood',
  other: 'Другое',
};
