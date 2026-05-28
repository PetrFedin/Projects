import {
  getB2BIntegrationStatus,
  getCatalogSummaryForProduction,
  type B2BIntegrationStatus,
} from '@/lib/b2b/integrations/b2b-integration-service';

/** Сводка для экранов «интеграции + каталог» без дублирования двух вызовов в UI. */
export type B2bIntegrationsDashboard = {
  integrations: B2BIntegrationStatus[];
  catalog: Awaited<ReturnType<typeof getCatalogSummaryForProduction>>;
  assembledAt: string;
};

export async function loadB2bIntegrationsDashboard(
  brandId?: string
): Promise<B2bIntegrationsDashboard> {
  const [integrations, catalog] = await Promise.all([
    getB2BIntegrationStatus(),
    getCatalogSummaryForProduction(brandId),
  ]);
  return {
    integrations,
    catalog,
    assembledAt: new Date().toISOString(),
  };
}
