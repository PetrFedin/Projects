import { z } from 'zod';
import { CATALOG_SUMMARY_SOURCE } from '@/lib/b2b/integrations/catalog-summary-source';

/** Ответ GET `/api/b2b/integrations/status` — массив строк матрицы интеграций. */
export const integrationHealthSchema = z.enum(['ok', 'degraded', 'error', 'unknown']);

export const b2BIntegrationStatusRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  configured: z.boolean(),
  lastSync: z.string().optional(),
  health: integrationHealthSchema,
  errors: z.array(z.string()).optional(),
  docsUrl: z.string().optional(),
  description: z.string().optional(),
});

export const b2BIntegrationStatusListSchema = z.array(b2BIntegrationStatusRowSchema);

/** Тело GET `/api/b2b/integrations/catalog-summary` (без HTTP-обёртки). */
export const catalogSummaryForProductionResponseSchema = z.object({
  productCount: z.number().int().nonnegative(),
  orderCount: z.number().int().nonnegative(),
  lastSync: z.string().optional(),
  source: z.literal('platform'),
  catalogSource: z.literal(CATALOG_SUMMARY_SOURCE),
  brandId: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

/** Ответ GET `/api/b2b/integrations/dashboard`. */
export const b2bIntegrationsDashboardSchema = z.object({
  integrations: b2BIntegrationStatusListSchema,
  catalog: catalogSummaryForProductionResponseSchema,
  assembledAt: z.string().min(1),
});
