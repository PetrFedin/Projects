import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { isW2MetricsS3NativeConfigured } from '@/lib/server/workshop2-metrics-s3-archive';

const MAX_W2_TECHPACK_BYTES = 25 * 1024 * 1024;

export function w2TechPackRemoteUploadServerConfigured(): boolean {
  if (process.env.W2_TECHPACK_REMOTE === '0') return false;
  return isW2MetricsS3NativeConfigured();
}

export { MAX_W2_TECHPACK_BYTES };

function s3ClientAndBucket(): {
  client: S3Client;
  bucket: string;
  region: string;
  prefix: string;
} | null {
  if (!w2TechPackRemoteUploadServerConfigured()) return null;
  const bucket = process.env.W2_METRICS_S3_BUCKET!.trim();
  const region = process.env.W2_METRICS_S3_REGION!.trim();
  const accessKeyId = process.env.W2_METRICS_S3_ACCESS_KEY_ID!.trim();
  const secretAccessKey = process.env.W2_METRICS_S3_SECRET_ACCESS_KEY!.trim();
  const rawPrefix = process.env.W2_METRICS_S3_PREFIX?.trim() || 'w2-metrics';
  const prefix = `${rawPrefix.replace(/^\/*/, '').replace(/\/*$/, '')}/techpack`;
  const client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  return { client, bucket, region, prefix };
}

function objectStoragePrefixOrThrow(): string {
  const env = s3ClientAndBucket();
  if (!env) throw new Error('s3_unavailable');
  return env.prefix;
}

export function buildTechPackObjectKey(opts: {
  collectionId: string;
  articleId: string;
  contentSha256Hex: string;
  fileName: string;
}): string {
  const base = objectStoragePrefixOrThrow();
  const safe = (opts.fileName || 'file.bin')
    .replace(/[\\/]+/g, '-')
    .replace(/\.\./g, '.')
    .slice(0, 180);
  const col = encodeURIComponent(String(opts.collectionId).trim() || 'col');
  const art = encodeURIComponent(String(opts.articleId).trim() || 'art');
  const h = (opts.contentSha256Hex || '').toLowerCase().replace(/[^a-f0-9]/g, '');
  if (h.length !== 64) {
    throw new Error('hash_rejected');
  }
  return `${base}/${col}/${art}/${h}/${safe}`;
}

export async function presignW2TechPackPutObject(opts: {
  collectionId: string;
  articleId: string;
  contentSha256Hex: string;
  fileName: string;
  sizeBytes: number;
  contentType: string;
}): Promise<{ uploadUrl: string; objectKey: string; method: 'PUT' }> {
  const env = s3ClientAndBucket();
  if (!env) throw new Error('s3_unavailable');
  if (
    !Number.isFinite(opts.sizeBytes) ||
    opts.sizeBytes < 1 ||
    opts.sizeBytes > MAX_W2_TECHPACK_BYTES
  ) {
    throw new Error('size_rejected');
  }
  const objectKey = buildTechPackObjectKey({
    collectionId: opts.collectionId,
    articleId: opts.articleId,
    contentSha256Hex: opts.contentSha256Hex,
    fileName: opts.fileName,
  });
  const command = new PutObjectCommand({
    Bucket: env.bucket,
    Key: objectKey,
    ContentType: opts.contentType,
  });
  const uploadUrl = await getSignedUrl(env.client, command, { expiresIn: 900 });
  return { uploadUrl, objectKey, method: 'PUT' };
}

const W2_TECHPACK_GET_PRESIGN_TTL_SEC = 900;

export async function presignW2TechPackGetObject(objectKey: string): Promise<{
  downloadUrl: string;
  expiresIn: number;
}> {
  const env = s3ClientAndBucket();
  if (!env) throw new Error('s3_unavailable');
  const command = new GetObjectCommand({ Bucket: env.bucket, Key: objectKey });
  const downloadUrl = await getSignedUrl(env.client, command, {
    expiresIn: W2_TECHPACK_GET_PRESIGN_TTL_SEC,
  });
  return { downloadUrl, expiresIn: W2_TECHPACK_GET_PRESIGN_TTL_SEC };
}

export async function headW2TechPackObject(objectKey: string): Promise<{
  contentLength: number;
  contentType: string;
  eTag: string;
} | null> {
  const env = s3ClientAndBucket();
  if (!env) return null;
  try {
    const out = await env.client.send(
      new HeadObjectCommand({ Bucket: env.bucket, Key: objectKey })
    );
    return {
      contentLength: Number(out.ContentLength ?? 0),
      contentType: String(out.ContentType ?? 'application/octet-stream'),
      eTag: String(out.ETag ?? '').replace(/^"|"$/g, '') || 'unknown',
    };
  } catch {
    return null;
  }
}

export async function readW2TechPackObjectHead(
  objectKey: string,
  max = 32
): Promise<Uint8Array | null> {
  const env = s3ClientAndBucket();
  if (!env) return null;
  try {
    const out = await env.client.send(
      new GetObjectCommand({
        Bucket: env.bucket,
        Key: objectKey,
        Range: `bytes=0-${Math.max(0, max - 1)}`,
      })
    );
    const buf = await out.Body?.transformToByteArray();
    return buf ? new Uint8Array(buf) : null;
  } catch {
    return null;
  }
}
