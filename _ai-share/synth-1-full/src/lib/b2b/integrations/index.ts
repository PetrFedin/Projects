/**
 * B2B интеграции для РФ.
 * Western платформы (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk) — в archive/.
 * Маркетплейсы РФ: Wildberries, Ozon, Lamoda — на странице /brand/integrations.
 */

export {
  getB2BIntegrationStatus,
  exportOrderToProvider,
  getPriceListsForOrder,
  calculateOrderPricing,
  getCatalogSummaryForProduction,
  type B2BIntegrationStatus,
  type OrderExportProvider,
  type OrderExportResult,
} from './b2b-integration-service';

export {
  joorGetDeliveryWindows,
  isNuOrderConfigured,
  type JoorDeliveryWindow,
} from './joor-delivery-mocks';
