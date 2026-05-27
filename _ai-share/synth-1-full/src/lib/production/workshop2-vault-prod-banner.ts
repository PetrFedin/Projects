/**
 * Баннер Vault в production, когда S3 не сконфигурирован.
 */
export type Workshop2VaultS3ProdBanner = {
  show: boolean;
  severity: 'info' | 'warning';
  messageRu: string;
  code: 'vault_s3_not_configured' | 'ok';
};

export function getWorkshop2VaultS3ProdBanner(input: {
  nodeEnv?: string;
  s3Configured: boolean;
}): Workshop2VaultS3ProdBanner {
  const isProd = (input.nodeEnv ?? process.env.NODE_ENV) === 'production';
  if (!isProd || input.s3Configured) {
    return {
      show: false,
      severity: 'info',
      messageRu: '',
      code: 'ok',
    };
  }
  return {
    show: true,
    severity: 'warning',
    code: 'vault_s3_not_configured',
    messageRu:
      'Vault S3 не настроен в production (WORKSHOP2_S3_*). Загрузка файлов недоступна до настройки хранилища.',
  };
}
