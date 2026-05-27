/**
 * Сводка live health + pg-counts для страницы setup (чистая логика для тестов).
 */

export type Workshop2SetupHealthRow = {
  id: string;
  labelRu: string;
  status: 'ok' | 'warn' | 'off' | 'down';
  detailRu: string;
};

export type Workshop2SetupHealthInput = {
  healthOk: boolean;
  postgres: 'ok' | 'down' | 'disabled';
  storeMode?: string;
  redis?: string;
  vaultS3?: string;
  genkit?: string;
  pgCounts?: {
    collections: number;
    articles: number;
    dossiers: number;
    events: number;
    sampleOrders: number;
  } | null;
};

export function buildWorkshop2SetupHealthRows(
  input: Workshop2SetupHealthInput
): Workshop2SetupHealthRow[] {
  const rows: Workshop2SetupHealthRow[] = [
    {
      id: 'postgres',
      labelRu: 'PostgreSQL',
      status: input.postgres === 'ok' ? 'ok' : input.postgres === 'disabled' ? 'off' : 'down',
      detailRu:
        input.postgres === 'ok'
          ? 'Подключение OK · досье и audit на сервере'
          : input.postgres === 'disabled'
            ? 'WORKSHOP2_DATABASE_URL не задан'
            : 'Ping не прошёл — проверьте Docker и миграции',
    },
    {
      id: 'store',
      labelRu: 'Режим store',
      status: input.healthOk ? 'ok' : 'warn',
      detailRu: input.storeMode?.trim() || '—',
    },
    {
      id: 'vault',
      labelRu: 'Vault S3',
      status: input.vaultS3 === 'configured' ? 'ok' : 'off',
      detailRu:
        input.vaultS3 === 'configured' ? 'Переменные S3 заданы' : 'Не настроен (локальные файлы)',
    },
    {
      id: 'genkit',
      labelRu: 'Genkit / AI',
      status: input.genkit === 'configured' ? 'ok' : 'off',
      detailRu:
        input.genkit === 'configured'
          ? 'GOOGLE_GENAI_API_KEY задан'
          : 'DFM / matchmaker недоступны без ключа',
    },
    {
      id: 'redis',
      labelRu: 'Redis (realtime)',
      status: input.redis === 'configured' ? 'ok' : 'off',
      detailRu: input.redis === 'configured' ? 'REDIS_URL задан' : 'Polling fallback',
    },
  ];

  if (input.pgCounts) {
    rows.push({
      id: 'pg-counts',
      labelRu: 'Счётчики PG',
      status: 'ok',
      detailRu: `коллекции ${input.pgCounts.collections} · артикулы ${input.pgCounts.articles} · досье ${input.pgCounts.dossiers} · события ${input.pgCounts.events} · образцы ${input.pgCounts.sampleOrders}`,
    });
  }

  return rows;
}
