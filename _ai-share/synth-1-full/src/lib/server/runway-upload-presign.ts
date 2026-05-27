/**
 * Presigned PUT for runway section MP4 (Cloudflare R2 or S3-compatible).
 * Gated by RUNWAY_UPLOAD_ENABLED=1 and bucket credentials — no stub URLs when misconfigured.
 */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  RUNWAY_UPLOAD_ALLOWED_MIME,
  RUNWAY_UPLOAD_MAX_BYTES,
  sanitizeRunwayBrandSlug,
} from '@/lib/server/runway-upload';

export const RUNWAY_PRESIGN_EXPIRES_SEC = 900;

export interface RunwayUploadPresignInput {
  brandSlug: string;
  productSlug?: string;
  /** Section clip → videos/sections/{slug}-{n}.mp4; omit for hero → videos/{slug}-hero.mp4 */
  sectionIndex?: number;
  filename?: string;
  contentType?: string;
  contentLength?: number;
}

export interface RunwayUploadPresignResult {
  ok: true;
  mode: 's3';
  uploadUrl: string;
  method: 'PUT';
  publicUrl: string;
  storageKey: string;
  relativePath: string;
  expiresIn: number;
  headers: Record<string, string>;
  maxBytes: number;
  contentType: string;
}

export function isRunwayUploadPresignEnabled(): boolean {
  return process.env.RUNWAY_UPLOAD_ENABLED === '1';
}

export function runwayUploadPresignDisabledMessage(): string {
  return 'Runway upload is disabled. Set RUNWAY_UPLOAD_ENABLED=1 and configure RUNWAY_R2_* or RUNWAY_S3_* env vars.';
}

/** Product slug for object keys under videos/sections/. */
export function sanitizeRunwayProductSlug(raw: string): string | null {
  const slug = raw.trim().toLowerCase();
  if (!slug || slug.length > 120) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  return slug;
}

export function buildRunwayVideoStorageKey(input: {
  brandSlug: string;
  productSlug?: string;
  sectionIndex?: number;
  filename?: string;
}): string {
  const safeBrand = sanitizeRunwayBrandSlug(input.brandSlug);
  if (!safeBrand) throw new Error('Invalid brandSlug');

  if (input.productSlug?.trim()) {
    const product = sanitizeRunwayProductSlug(input.productSlug);
    if (!product) throw new Error('Invalid productSlug');
    if (input.sectionIndex === undefined) {
      return `videos/${product}-hero.mp4`;
    }
    const index = input.sectionIndex;
    if (!Number.isInteger(index) || index < 0 || index > 98) {
      throw new Error('sectionIndex must be 0–98');
    }
    return `videos/sections/${product}-${index}.mp4`;
  }

  const base = (input.filename ?? 'clip.mp4').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-');
  const safeName = base.endsWith('.mp4') ? base.slice(0, 80) : `${base.slice(0, 76)}.mp4`;
  return `videos/brands/${safeBrand}/${safeName}`;
}

type S3Env = {
  bucket: string;
  client: S3Client;
  publicBase: string;
};

function resolveR2Env(): S3Env | null {
  const accountId = process.env.RUNWAY_R2_ACCOUNT_ID?.trim();
  const accessKey = process.env.RUNWAY_R2_ACCESS_KEY?.trim();
  const secretKey = process.env.RUNWAY_R2_SECRET_KEY?.trim();
  const bucket = process.env.RUNWAY_R2_BUCKET?.trim();
  const publicBase = process.env.RUNWAY_R2_PUBLIC_BASE_URL?.trim()?.replace(/\/+$/, '');

  if (!accountId || !accessKey || !secretKey || !bucket || !publicBase) return null;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });

  return { bucket, client, publicBase };
}

function resolveLegacyS3Env(): S3Env | null {
  const bucket = process.env.RUNWAY_S3_BUCKET?.trim();
  if (!bucket) return null;

  const region = process.env.RUNWAY_S3_REGION?.trim() || process.env.AWS_REGION?.trim() || 'auto';
  const endpoint = process.env.RUNWAY_S3_ENDPOINT?.trim();
  const accessKeyId =
    process.env.RUNWAY_S3_ACCESS_KEY_ID?.trim() || process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    process.env.RUNWAY_S3_SECRET_ACCESS_KEY?.trim() || process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const publicBase = (
    process.env.RUNWAY_S3_PUBLIC_BASE_URL?.trim() ||
    process.env.RUNWAY_R2_PUBLIC_BASE_URL?.trim() ||
    process.env.RUNWAY_VIDEO_CDN_BASE?.trim() ||
    ''
  ).replace(/\/+$/, '');

  if (!publicBase) return null;

  const client = new S3Client({
    region,
    ...(endpoint
      ? { endpoint, forcePathStyle: process.env.RUNWAY_S3_FORCE_PATH_STYLE === '1' }
      : {}),
    ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {}),
  });

  return { bucket, client, publicBase };
}

export function isRunwayUploadS3Configured(): boolean {
  return Boolean(resolveR2Env() || resolveLegacyS3Env());
}

function resolveS3Env(): S3Env {
  const env = resolveR2Env() ?? resolveLegacyS3Env();
  if (!env) {
    throw new Error(
      'Runway upload storage is not configured. Set RUNWAY_R2_ACCOUNT_ID, RUNWAY_R2_ACCESS_KEY, RUNWAY_R2_SECRET_KEY, RUNWAY_R2_BUCKET, RUNWAY_R2_PUBLIC_BASE_URL (or legacy RUNWAY_S3_*).'
    );
  }
  return env;
}

/** Issue presigned PUT URL — fails with 503 message when storage env is incomplete. */
export async function createRunwayUploadPresign(
  input: RunwayUploadPresignInput
): Promise<RunwayUploadPresignResult> {
  if (!isRunwayUploadPresignEnabled()) {
    throw new Error(runwayUploadPresignDisabledMessage());
  }

  const safeBrand = sanitizeRunwayBrandSlug(input.brandSlug);
  if (!safeBrand) {
    throw new Error('Invalid brandSlug');
  }

  const contentType = input.contentType?.trim() || RUNWAY_UPLOAD_ALLOWED_MIME;
  if (contentType !== RUNWAY_UPLOAD_ALLOWED_MIME) {
    throw new Error('contentType must be video/mp4');
  }

  const contentLength = input.contentLength;
  if (contentLength != null && (contentLength <= 0 || contentLength > RUNWAY_UPLOAD_MAX_BYTES)) {
    throw new Error(`contentLength must be 1–${RUNWAY_UPLOAD_MAX_BYTES}`);
  }

  const storageKey = buildRunwayVideoStorageKey({
    brandSlug: safeBrand,
    productSlug: input.productSlug,
    sectionIndex: input.sectionIndex,
    filename: input.filename,
  });

  const { bucket, client, publicBase } = resolveS3Env();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: storageKey,
    ContentType: contentType,
    ...(contentLength != null ? { ContentLength: contentLength } : {}),
    Metadata: { 'brand-slug': safeBrand },
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: RUNWAY_PRESIGN_EXPIRES_SEC,
  });

  const publicUrl = `${publicBase}/${storageKey}`;

  return {
    ok: true,
    mode: 's3',
    uploadUrl,
    method: 'PUT',
    publicUrl,
    storageKey,
    relativePath: `/${storageKey}`,
    expiresIn: RUNWAY_PRESIGN_EXPIRES_SEC,
    headers: { 'Content-Type': contentType },
    maxBytes: RUNWAY_UPLOAD_MAX_BYTES,
    contentType,
  };
}
