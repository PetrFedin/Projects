import 'server-only';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { isW2MetricsS3NativeConfigured } from '@/lib/server/workshop2-metrics-s3-archive';

const MAX_VAULT_BYTES = 50 * 1024 * 1024;

function vaultS3Env(): { client: S3Client; bucket: string; prefix: string } | null {
  const bucket =
    process.env.WORKSHOP2_S3_BUCKET?.trim() || process.env.W2_METRICS_S3_BUCKET?.trim();
  const region =
    process.env.WORKSHOP2_S3_REGION?.trim() || process.env.W2_METRICS_S3_REGION?.trim();
  const accessKeyId =
    process.env.WORKSHOP2_S3_ACCESS_KEY_ID?.trim() ||
    process.env.W2_METRICS_S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    process.env.WORKSHOP2_S3_SECRET_ACCESS_KEY?.trim() ||
    process.env.W2_METRICS_S3_SECRET_ACCESS_KEY?.trim();
  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    if (isW2MetricsS3NativeConfigured()) {
      return vaultS3EnvFromMetrics();
    }
    return null;
  }
  const rawPrefix = process.env.WORKSHOP2_S3_PREFIX?.trim() || 'workshop2-vault';
  const prefix = rawPrefix.replace(/^\/*/, '').replace(/\/*$/, '');
  const endpoint = process.env.WORKSHOP2_S3_ENDPOINT?.trim();
  return {
    client: new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    }),
    bucket,
    prefix,
  };
}

function vaultS3EnvFromMetrics(): { client: S3Client; bucket: string; prefix: string } | null {
  if (!isW2MetricsS3NativeConfigured()) return null;
  const region = process.env.W2_METRICS_S3_REGION!.trim();
  const accessKeyId = process.env.W2_METRICS_S3_ACCESS_KEY_ID!.trim();
  const secretAccessKey = process.env.W2_METRICS_S3_SECRET_ACCESS_KEY!.trim();
  const bucket = process.env.W2_METRICS_S3_BUCKET!.trim();
  const rawPrefix = process.env.W2_METRICS_S3_PREFIX?.trim() || 'w2-metrics';
  const prefix = `${rawPrefix.replace(/^\/*/, '').replace(/\/*$/, '')}/vault`;
  const endpoint = process.env.WORKSHOP2_S3_ENDPOINT?.trim();
  return {
    client: new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    }),
    bucket,
    prefix,
  };
}

export function isWorkshop2VaultS3Configured(): boolean {
  return vaultS3Env() !== null;
}

export function buildWorkshop2VaultObjectKey(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName: string;
}): string {
  const env = vaultS3Env();
  if (!env) throw new Error('vault_s3_unavailable');
  const safeName = (input.fileName || 'file.bin')
    .replace(/[\\/]+/g, '-')
    .replace(/\.\./g, '.')
    .slice(0, 180);
  const col = encodeURIComponent(input.collectionId.trim() || 'col');
  const art = encodeURIComponent(input.articleId.trim() || 'art');
  const doc = encodeURIComponent(input.documentId.trim() || 'doc');
  return `${env.prefix}/${col}/${art}/${doc}/${safeName}`;
}

export async function presignWorkshop2VaultPut(input: {
  collectionId: string;
  articleId: string;
  documentId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}): Promise<{ uploadUrl: string; storagePath: string; method: 'PUT' }> {
  const env = vaultS3Env();
  if (!env) throw new Error('vault_s3_unavailable');
  if (
    !Number.isFinite(input.sizeBytes) ||
    input.sizeBytes < 1 ||
    input.sizeBytes > MAX_VAULT_BYTES
  ) {
    throw new Error('size_rejected');
  }
  const storagePath = buildWorkshop2VaultObjectKey(input);
  const command = new PutObjectCommand({
    Bucket: env.bucket,
    Key: storagePath,
    ContentType: input.contentType,
  });
  const uploadUrl = await getSignedUrl(env.client, command, { expiresIn: 900 });
  return { uploadUrl, storagePath, method: 'PUT' };
}

export async function presignWorkshop2VaultGet(storagePath: string): Promise<{
  downloadUrl: string;
  expiresIn: number;
}> {
  const env = vaultS3Env();
  if (!env) throw new Error('vault_s3_unavailable');
  const command = new GetObjectCommand({ Bucket: env.bucket, Key: storagePath });
  const downloadUrl = await getSignedUrl(env.client, command, { expiresIn: 900 });
  return { downloadUrl, expiresIn: 900 };
}

/** Скачивает объект vault в буфер (для ZIP export). */
export async function getWorkshop2VaultObjectBuffer(storagePath: string): Promise<Buffer | null> {
  const env = vaultS3Env();
  if (!env) return null;
  const key = storagePath.trim();
  if (!key) return null;
  try {
    const out = await env.client.send(new GetObjectCommand({ Bucket: env.bucket, Key: key }));
    const body = out.Body;
    if (!body) return null;
    const chunks: Uint8Array[] = [];
    for await (const chunk of body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch {
    return null;
  }
}

export { MAX_VAULT_BYTES };
