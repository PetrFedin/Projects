function s3NativeEnvOk(): boolean {
  return Boolean(
    process.env.W2_METRICS_S3_BUCKET?.trim() &&
    process.env.W2_METRICS_S3_REGION?.trim() &&
    process.env.W2_METRICS_S3_ACCESS_KEY_ID?.trim() &&
    process.env.W2_METRICS_S3_SECRET_ACCESS_KEY?.trim()
  );
}

export function isW2MetricsS3NativeConfigured(): boolean {
  return s3NativeEnvOk();
}

/** PutObject через @aws-sdk/client-s3 (без presigned URL). */
export async function putW2MetricsNdjsonToS3(
  body: string,
  fingerprintShort16: string
): Promise<void> {
  if (!s3NativeEnvOk()) {
    throw new Error('s3_env_incomplete');
  }
  const Bucket = process.env.W2_METRICS_S3_BUCKET!.trim();
  const region = process.env.W2_METRICS_S3_REGION!.trim();
  const accessKeyId = process.env.W2_METRICS_S3_ACCESS_KEY_ID!.trim();
  const secretAccessKey = process.env.W2_METRICS_S3_SECRET_ACCESS_KEY!.trim();
  const rawPrefix = process.env.W2_METRICS_S3_PREFIX?.trim() || 'w2-metrics';
  const prefix = rawPrefix.replace(/^\/*/, '').replace(/\/*$/, '');

  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const Key = `${prefix}/w2-dossier-metrics-${fingerprintShort16}-${stamp}.ndjson`;

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
  await client.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body: Buffer.from(body, 'utf8'),
      ContentType: 'application/x-ndjson',
    })
  );
}
