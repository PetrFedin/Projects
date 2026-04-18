/**
 * B2B интеграции для РФ.
 * Western платформы (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk) — в archive/.
 * Маркетплейсы РФ: Wildberries, Ozon, Lamoda — на странице /brand/integrations.
 *
 * Только client-safe экспорты (без Node fs, без `server-only`).
 * Серверные API: импортируйте из `@/lib/b2b/integrations/b2b-integration-service` в route handlers и Server Components.
 */

export {
  joorGetDeliveryWindows,
  isNuOrderConfigured,
  type JoorDeliveryWindow,
} from './joor-delivery-mocks';
