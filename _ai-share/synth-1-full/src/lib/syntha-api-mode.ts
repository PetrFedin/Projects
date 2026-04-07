/**
 * MVP (по умолчанию): без исходящих вызовов FastAPI.
 * Включить бэкенд: `NEXT_PUBLIC_USE_FASTAPI=true` в `.env.local`.
 *
 * Связанные флаги для локального MVP:
 * - `NEXT_PUBLIC_PRODUCTION_DATA_HTTP` — не задавать / `false`: данные производства из localStorage.
 * - `NEXT_PUBLIC_API_URL` — учитывается только при включённом бэкенде (ниже), иначе прокси/хуки не бьют в сеть.
 */
export const USE_FASTAPI = process.env.NEXT_PUBLIC_USE_FASTAPI === 'true';

/** Явный HTTP для production-data порта (см. `production-data-bootstrap.tsx`). */
export const USE_PRODUCTION_DATA_HTTP = process.env.NEXT_PUBLIC_PRODUCTION_DATA_HTTP === 'true';

/**
 * Любой режим с исходящими запросами на `NEXT_PUBLIC_API_URL` (FastAPI и т.п.).
 * Пока false — демо/моки без сетевых попыток к localhost:8000.
 */
export const ENABLE_BACKEND_HTTP = USE_FASTAPI || USE_PRODUCTION_DATA_HTTP;

/** Полноэкранные спиннеры в хаб-лейаутах только при реальной проверке сессии через API. */
export const HUB_AUTH_FULLSCREEN_SPINNER = USE_FASTAPI;
