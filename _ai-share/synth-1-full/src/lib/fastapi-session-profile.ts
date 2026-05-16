/**
 * Снимок сессии кабинета из FastAPI (`GET /profile/me` → `data`) и синтетический сид в dev.
 * Контракт API доращивается точечно; индекс для полей вне `user`.
 */
export type FastApiSessionProfile = {
  user?: {
    roles?: unknown;
    role?: unknown;
  };
  alerts?: unknown;
  navigation?: unknown;
  [key: string]: unknown;
};
