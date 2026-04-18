import { ENABLE_BACKEND_HTTP } from '@/lib/syntha-api-mode';

/** Режим окружения для API-метаданных и диагностики. */
export function getRuntimeMode(): 'development' | 'production' | 'test' {
  const n = process.env.NODE_ENV;
  if (n === 'production') return 'production';
  if (n === 'test') return 'test';
  return 'development';
}

/** Контракт operational B2B: `meta.mode` — только `demo` | `prod` (см. Zod-обёртки и e2e). */
export function getApiContractMode(): 'demo' | 'prod' {
  return getRuntimeMode() === 'production' ? 'prod' : 'demo';
}

/** Флаги режима клиента (WebSocket / SSE / polling). */
export function isWebSocketTransportEnabled(): boolean {
  if (typeof process === 'undefined') return false;
  return Boolean(process.env.NEXT_PUBLIC_WS_URL);
}

/** Исходящие вызовы на FastAPI разрешены и задан базовый URL. */
export function isFastApiEnabled(): boolean {
  if (typeof process === 'undefined') return false;
  return ENABLE_BACKEND_HTTP && Boolean((process.env.NEXT_PUBLIC_API_URL || '').trim());
}
