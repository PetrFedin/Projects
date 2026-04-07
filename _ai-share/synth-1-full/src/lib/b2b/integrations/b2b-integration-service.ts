/**
 * B2B-интеграции для РФ: Wildberries, Ozon, Яндекс Маркет — через маркетплейс-интеграции.
 * Western платформы (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk) — в archive/.
 */

export interface B2BIntegrationStatus {
  id: string;
  name: string;
  configured: boolean;
  docsUrl?: string;
  description?: string;
}

/** Статус B2B-интеграций. Western платформы в archive. */
export function getB2BIntegrationStatus(): B2BIntegrationStatus[] {
  return [
    // РФ: WB, Ozon, Lamoda — через /brand/integrations (маркетплейсы)
  ];
}

export type OrderExportProvider = 'platform';

export interface OrderExportResult {
  success: boolean;
  provider: OrderExportProvider;
  orderId?: string;
  error?: string;
}

/** Экспорт заказа. Western провайдеры в archive. */
export async function exportOrderToProvider(
  _provider: 'platform',
  _payload: unknown
): Promise<OrderExportResult> {
  return { success: false, provider: 'platform', error: 'Экспорт: используйте платформу или маркетплейсы РФ' };
}

/** Прайс-листы — платформа. */
export async function getPriceListsForOrder(): Promise<{ slug: string; name: string; currency?: string }[]> {
  return [];
}

/** Расчёт суммы — платформа. */
export async function calculateOrderPricing(_request: unknown): Promise<{ total?: number; lines?: unknown[] }> {
  return { total: 0, lines: [] };
}

/** Сводка каталога для производства. */
export async function getCatalogSummaryForProduction(_brandId?: string): Promise<{
  productCount: number;
  lastSync?: string;
  source: 'platform';
  errors?: string[];
}> {
  return { productCount: 0, source: 'platform' };
}
