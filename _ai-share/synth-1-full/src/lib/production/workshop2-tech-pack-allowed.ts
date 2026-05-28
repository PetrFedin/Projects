import type { Workshop2Phase1TechPackSourceKind } from '@/lib/production/workshop2-dossier-phase1.types';

/** Расширения, разрешённые для загрузки (клиент; сервер в проде — отдельно). */
const BLOCKED_EXT = new Set([
  'exe',
  'com',
  'cmd',
  'bat',
  'ps1',
  'msi',
  'scr',
  'vbs',
  'js',
  'jar',
  'app',
  'deb',
  'rpm',
  'sh',
  'htm',
  'html',
]);

const ALLOWED_MIME_PREFIX = new Set<string>(['application/', 'image/', 'text/']);

function extFromName(name: string): string {
  const m = /\.([a-z0-9_]{1,20})$/i.exec(name.toLowerCase());
  return m?.[1] ?? '';
}

/** CAD/PLM, часто `application/octet-stream` в браузере. */
const FASHION_CAD_BUNDLE_EXT = new Set([
  'stp',
  'step',
  'igs',
  'iges',
  'prt',
  'sat',
  '3dm',
  'rvm',
  'x_t',
  'x_b',
]);

export function isTechPackFileAllowedForUpload(
  file: File
): { ok: true } | { ok: false; reason: string } {
  const ext = extFromName(file.name);
  if (ext && BLOCKED_EXT.has(ext)) {
    return { ok: false, reason: `Тип «.${ext}» не принимаем в вложениях (исполняемые/опасные).` };
  }
  if (ext && FASHION_CAD_BUNDLE_EXT.has(ext)) {
    return { ok: true };
  }
  const t = (file.type || '').toLowerCase();
  if (t) {
    const allowedByMime =
      ALLOWED_MIME_PREFIX.has(t.slice(0, 12)) ||
      t === 'image/svg+xml' ||
      t.includes('pdf') ||
      t.includes('postscript') ||
      t.includes('dxf') ||
      t.includes('dwg') ||
      t.includes('zip') ||
      t.includes('cad');
    if (!allowedByMime) {
      return { ok: false, reason: `MIME «${t}» не в списке разрешённых для техпака.` };
    }
  }
  return { ok: true };
}

export function inferTechPackSourceKind(
  fileName: string,
  mimeType: string | undefined
): Workshop2Phase1TechPackSourceKind {
  const n = fileName.toLowerCase();
  const m = (mimeType || '').toLowerCase();
  if (m === 'application/pdf' || m.includes('pdf') || /\.pdf$/i.test(n)) return 'pdf';
  if (m.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg)$/i.test(n)) return 'image';
  if (m.includes('zip') || /\.(zip|aama?)$/i.test(n)) return 'archive';
  if (m.includes('dxf') || m.includes('dwg') || /\.(dxf|dwg)$/i.test(n)) return 'cad';
  return 'other';
}
