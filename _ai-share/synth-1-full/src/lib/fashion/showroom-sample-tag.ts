/**
 * Бирки образцов в шоуруме: короткий registry id → GET /api/showroom-sample/:id.
 * Устаревшие: base64 в query `add` и строка SYNTH1|… — поддерживаются в сканере для совместимости.
 */

export const SHOWROOM_TAG_STORAGE_KEY = 'synth1_showroom_scan_selection_v1';

/** Короткий id после POST /api/showroom-sample (QR + штрихкод). */
export const SHOWROOM_REGISTRY_ID_RE = /^srs-[a-f0-9]{20}$/i;

export function isShowroomRegistryShortId(s: string): boolean {
  return SHOWROOM_REGISTRY_ID_RE.test(s.trim());
}

export type ShowroomSampleTagPayloadV1 = {
  v: 1;
  sampleId: string;
  sku: string;
  productId: string;
  name: string;
  color?: string;
  sampleSize?: string;
  collectionId?: string;
  /** Внутренний номер артикула (Цех 2 и т.п.), если известен. */
  internalArticleCode?: string;
};

export type ShowroomScannedLineV1 = {
  id: string;
  scannedAt: string;
  source: 'qr' | 'barcode';
  payload: ShowroomSampleTagPayloadV1;
  /** Свободный ввод: «S:2, M:1» — парсинг размеров позже */
  sizesQtyNote: string;
};

function utf8ToBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUtf8(b64url: string): string {
  const pad = b64url.length % 4 === 0 ? '' : '='.repeat(4 - (b64url.length % 4));
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeShowroomTagPayload(p: ShowroomSampleTagPayloadV1): string {
  return utf8ToBase64Url(JSON.stringify(p));
}

export function decodeShowroomTagPayload(b64url: string): ShowroomSampleTagPayloadV1 | null {
  try {
    const raw = base64UrlToUtf8(b64url.trim());
    const data = JSON.parse(raw) as ShowroomSampleTagPayloadV1;
    if (data?.v !== 1 || !data.sampleId || !data.sku || !data.productId) return null;
    return {
      ...data,
      name: typeof data.name === 'string' ? data.name : data.sku,
    };
  } catch {
    return null;
  }
}

/** Компактная строка для Code128 / ручного ввода: SYNTH1|1|sampleId|sku|productId */
export function buildShowroomSampleBarcodeLine(
  p: Pick<ShowroomSampleTagPayloadV1, 'sampleId' | 'sku' | 'productId'>
): string {
  const esc = (s: string) => s.replace(/\|/g, '_');
  return `SYNTH1|1|${esc(p.sampleId)}|${esc(p.sku)}|${esc(p.productId)}`;
}

export function parseShowroomSampleBarcodeLine(line: string): ShowroomSampleTagPayloadV1 | null {
  const t = line.trim();
  const parts = t.split('|');
  if (parts[0] !== 'SYNTH1' || parts[1] !== '1' || parts.length < 5) return null;
  return {
    v: 1,
    sampleId: parts[2],
    sku: parts[3],
    productId: parts[4],
    name: parts[3],
  };
}

export function buildShowroomScanUrl(origin: string, pathname: string, payload: ShowroomSampleTagPayloadV1): string {
  const add = encodeShowroomTagPayload(payload);
  const u = new URL(pathname, origin);
  u.searchParams.set('add', add);
  return u.toString();
}

/** QR на сканер: только registry id (после регистрации на сервере). */
export function buildShowroomScanUrlWithRegistryId(origin: string, pathname: string, registryId: string): string {
  const u = new URL(pathname, origin);
  u.searchParams.set('sampleId', registryId.trim());
  return u.toString();
}

export function qrImageUrlForText(text: string, size = 160): string {
  const enc = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${enc}`;
}

/** Внешний рендер Code128 (без npm-зависимости). */
export function barcodeImageUrlCode128(text: string): string {
  const enc = encodeURIComponent(text);
  return `https://bwipjs-api.metafloor.com/?bcid=code128&includetext&scale=2&text=${enc}`;
}

export function loadShowroomSelection(): ShowroomScannedLineV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SHOWROOM_TAG_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ShowroomScannedLineV1[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveShowroomSelection(lines: ShowroomScannedLineV1[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHOWROOM_TAG_STORAGE_KEY, JSON.stringify(lines));
}
