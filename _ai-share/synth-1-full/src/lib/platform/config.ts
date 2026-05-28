/**
 * Переключение источника данных платформенных фич.
 * local — демо + localStorage; api — вызовы бэкенда (заглушки до появления эндпоинтов).
 */
export type PlatformTransport = 'local' | 'api';

export function getPlatformTransport(): PlatformTransport {
  if (
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_SYNTH_PLATFORM_TRANSPORT === 'api'
  ) {
    return 'api';
  }
  return 'local';
}

/** База URL публичного API (без завершающего слэша). */
export function getPlatformApiBaseUrl(): string | null {
  const v = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SYNTH_API_BASE_URL : undefined;
  if (!v?.trim()) return null;
  return v.replace(/\/$/, '');
}
