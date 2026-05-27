/** Источник каталога runway: статический JSON (демо) или API (прод). */
export type RunwayDataSource = 'json' | 'api';

const ENV_KEY = 'NEXT_PUBLIC_RUNWAY_DATA_SOURCE';

/** Единая точка чтения env — default json для обратной совместимости. */
export function resolveRunwayDataSource(): RunwayDataSource {
  const raw = typeof process !== 'undefined' ? process.env[ENV_KEY] : undefined;
  return raw === 'api' ? 'api' : 'json';
}

export function isRunwayApiDataSource(): boolean {
  return resolveRunwayDataSource() === 'api';
}
