/**
 * Локальная загрузка MP4 для brand admin (dev/demo).
 * Production: заменить на S3/CDN — см. docs/runway-production-runbook.md.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const RUNWAY_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;
export const RUNWAY_UPLOAD_ALLOWED_MIME = 'video/mp4';

export interface RunwayUploadResult {
  url: string;
  filename: string;
  bytes: number;
}

export function sanitizeRunwayBrandSlug(raw: string): string | null {
  const slug = raw.trim().toLowerCase();
  if (!slug || slug.length > 80) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  return slug;
}

export function sanitizeRunwayUploadFilename(originalName: string): string {
  const base = path
    .basename(originalName)
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-');
  const withoutExt = base.replace(/\.mp4$/i, '');
  const safe = withoutExt.slice(0, 80) || 'clip';
  return `${safe}-${Date.now()}.mp4`;
}

export function isRunwayUploadAllowedInRuntime(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.RUNWAY_ALLOW_LOCAL_UPLOAD === '1';
}

/** Сохраняет MP4 в public/videos/brands/{brandSlug}/ и возвращает public URL. */
export async function saveRunwayBrandVideoUpload(
  brandSlug: string,
  file: File
): Promise<RunwayUploadResult> {
  if (!isRunwayUploadAllowedInRuntime()) {
    throw new Error('Local runway upload disabled in production — configure S3/CDN');
  }

  if (file.type !== RUNWAY_UPLOAD_ALLOWED_MIME) {
    throw new Error('Допустим только video/mp4');
  }

  if (file.size <= 0 || file.size > RUNWAY_UPLOAD_MAX_BYTES) {
    throw new Error('Размер файла должен быть от 1 байта до 50 МБ');
  }

  const safeBrand = sanitizeRunwayBrandSlug(brandSlug);
  if (!safeBrand) {
    throw new Error('Некорректный brandSlug');
  }

  const filename = sanitizeRunwayUploadFilename(file.name);
  const dir = path.join(process.cwd(), 'public', 'videos', 'brands', safeBrand);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const diskPath = path.join(dir, filename);
  await writeFile(diskPath, buffer);

  return {
    url: `/videos/brands/${safeBrand}/${filename}`,
    filename,
    bytes: buffer.length,
  };
}
