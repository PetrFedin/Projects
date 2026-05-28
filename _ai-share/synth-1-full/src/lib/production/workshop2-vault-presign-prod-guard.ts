/**
 * Wave 36 #75: presign в production только при настроенном S3 (client-safe env probe).
 */
export type Workshop2VaultPresignProdGuard = {
  allowed: boolean;
  s3PresignGuard: 'allowed' | 'prod_blocked';
  messageRu?: string;
  code?: 'vault_s3_required_in_prod' | 'ok';
};

export type Workshop2ProcessEnvLike = Record<string, string | undefined>;

function envTrim(env: Workshop2ProcessEnvLike, key: string): string {
  return String(env[key] ?? '').trim();
}

export function isWorkshop2VaultS3ConfiguredFromEnv(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  const bucket = envTrim(env, 'WORKSHOP2_S3_BUCKET') || envTrim(env, 'W2_METRICS_S3_BUCKET');
  const region = envTrim(env, 'WORKSHOP2_S3_REGION') || envTrim(env, 'W2_METRICS_S3_REGION');
  const key =
    envTrim(env, 'WORKSHOP2_S3_ACCESS_KEY_ID') || envTrim(env, 'W2_METRICS_S3_ACCESS_KEY_ID');
  const secret =
    envTrim(env, 'WORKSHOP2_S3_SECRET_ACCESS_KEY') ||
    envTrim(env, 'W2_METRICS_S3_SECRET_ACCESS_KEY');
  return Boolean(bucket && region && key && secret);
}

export function evaluateWorkshop2VaultPresignProdGuard(
  env: Workshop2ProcessEnvLike = process.env
): Workshop2VaultPresignProdGuard {
  const s3Configured = isWorkshop2VaultS3ConfiguredFromEnv(env);
  const isProd = envTrim(env, 'NODE_ENV') === 'production';
  if (isProd && !s3Configured) {
    return {
      allowed: false,
      s3PresignGuard: 'prod_blocked',
      code: 'vault_s3_required_in_prod',
      messageRu:
        'Production: presign заблокирован без WORKSHOP2_S3_* — настройте MinIO/S3 (см. workshop2/setup).',
    };
  }
  return { allowed: true, s3PresignGuard: 'allowed', code: 'ok' };
}
