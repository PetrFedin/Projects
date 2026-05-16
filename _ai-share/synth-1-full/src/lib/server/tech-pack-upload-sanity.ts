import { MAX_W2_TECHPACK_BYTES } from '@/lib/server/w2-tech-pack-remote-s3';

const ALLOWED_CT = new Set(
  [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/zip',
    'application/x-zip-compressed',
    'application/dxf',
    'application/acad',
    'application/dwg',
    'application/x-dxf',
  ].map((s) => s.toLowerCase())
);

export function isAllowedTechPackContentTypeForRemote(ct: string): boolean {
  const t = (ct || '').split(';')[0]!.trim().toLowerCase();
  if (ALLOWED_CT.has(t)) return true;
  if (t.startsWith('text/') || t.startsWith('image/') || t.startsWith('application/')) {
    if (t.includes('pdf') || t.includes('dxf') || t.includes('dwg') || t.includes('postscript') || t.includes('zip')) {
      return true;
    }
  }
  return false;
}

/** Первые байты vs ожидаемый «канон» (сервер, после загрузки). */
export function roughMatchDeclaredMime(
  firstBytes: Uint8Array,
  contentType: string
): { ok: boolean; reason?: string } {
  const t = (contentType || '').split(';')[0]!.trim().toLowerCase();
  const b = firstBytes;
  if (b.length < 3) return { ok: false, reason: 'empty_or_tiny' };
  if (t.includes('pdf') || t === 'application/pdf') {
    if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return { ok: true };
    return { ok: false, reason: 'not_pdf' };
  }
  if (t.includes('zip') || t === 'application/zip' || t === 'application/x-zip-compressed') {
    if (b[0] === 0x50 && b[1] === 0x4b) return { ok: true };
    return { ok: false, reason: 'not_zip' };
  }
  if (t.startsWith('image/jpeg') || t === 'image/jpg') {
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ok: true };
    return { ok: false, reason: 'not_jpeg' };
  }
  if (t === 'image/png') {
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ok: true };
    return { ok: false, reason: 'not_png' };
  }
  if (t.startsWith('text/') || t.includes('dxf') || t.includes('dwg')) {
    return { ok: true };
  }
  if (t.includes('svg')) {
    return { ok: true };
  }
  return { ok: true };
}

export function assertTechPackSizeOk(size: number): void {
  if (!Number.isFinite(size) || size < 1 || size > MAX_W2_TECHPACK_BYTES) {
    throw new Error('size_rejected');
  }
}
