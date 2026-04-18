/**
 * B2B-интеграции для РФ: Wildberries, Ozon, Яндекс Маркет — через маркетплейс-интеграции.
 * Western платформы (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk) — в archive/.
 */

import { b2bPlatformExportPayloadSchema } from '@/lib/b2b/integrations/b2b-integration-api.zod';
import { CATALOG_SUMMARY_SOURCE } from '@/lib/b2b/integrations/catalog-summary-source';
import {
  enqueuePlatformExport,
  retryPlatformExport,
} from '@/lib/b2b/integrations/integration-export-persistence';
import { DomainEventTypes, eventBus } from '@/lib/order/domain-events';

export type IntegrationHealth = 'ok' | 'degraded' | 'error' | 'unknown';

export interface B2BIntegrationStatus {
  id: string;
  name: string;
  configured: boolean;
  health: IntegrationHealth;
  lastSync?: string;
  errors?: string[];
  docsUrl?: string;
  description?: string;
}

/** Статус B2B-интеграций. Western платформы в archive. */
export function getB2BIntegrationStatus(): B2BIntegrationStatus[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'platform',
      name: 'Платформа Syntha',
      configured: true,
      health: 'ok',
      lastSync: now,
      docsUrl: '/brand/integrations',
      description: 'Экспорт заказов и сводки каталога для производства.',
    },
    {
      id: 'marketplaces-rf',
      name: 'Маркетплейсы РФ (WB, Ozon, Lamoda)',
      configured: false,
      health: 'unknown',
      description: 'Подключение через раздел интеграций бренда.',
    },
  ];
}

export type OrderExportProvider = 'platform';

export interface OrderExportResult {
  success: boolean;
  provider: OrderExportProvider;
  orderId?: string;
  error?: string;
}

function nextExportEventId(): string {
  return `evt-b2b-export-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Экспорт заказа на platform. Повтор с тем же Idempotency-Key не публикует второе доменное событие. */
export async function exportOrderToProvider(
  _provider: 'platform',
  payload: unknown,
  opts?: { idempotencyKey?: string }
): Promise<OrderExportResult> {
  const parsed = b2bPlatformExportPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, provider: 'platform', error: 'payload: orderId обязателен' };
  }
  const { orderId } = parsed.data;
  const idem = opts?.idempotencyKey?.trim();

  const job = await enqueuePlatformExport({
    orderId,
    idempotencyKey: idem,
  });

  if (!job.success) {
    return {
      success: false,
      provider: 'platform',
      orderId,
      error: job.error ?? 'export rejected',
    };
  }

  if (!job.fromIdempotencyReplay && job.status === 'accepted') {
    const dedupeKey = idem ? `b2b-platform-export:idem:${idem}` : undefined;
    await eventBus.publish({
      eventId: nextExportEventId(),
      occurredAt: new Date().toISOString(),
      aggregateId: orderId,
      aggregateType: 'order',
      version: 1,
      type: DomainEventTypes.order.b2bPlatformExportResult,
      payload: {
        orderId,
        exportJobId: job.exportJobId,
        provider: 'platform' as const,
        success: true,
        status: 'accepted' as const,
      },
      dedupeKey,
      correlationId: idem,
    });
  }

  return { success: true, provider: 'platform', orderId };
}

/** Повтор экспорта по id джоба (см. `retryPlatformExport`). */
export async function retryOrderExportFromJob(
  exportJobId: string,
  opts?: { simulateReject?: boolean }
): ReturnType<typeof retryPlatformExport> {
  return retryPlatformExport(exportJobId, opts);
}

/** Прайс-листы — платформа. */
export async function getPriceListsForOrder(): Promise<
  { slug: string; name: string; currency?: string }[]
> {
  return [];
}

/** Расчёт суммы — платформа. */
export async function calculateOrderPricing(
  _request: unknown
): Promise<{ total?: number; lines?: unknown[] }> {
  return { total: 0, lines: [] };
}

/** Сводка каталога для производства (форма совпадает с публичным Zod-контрактом API). */
export async function getCatalogSummaryForProduction(brandId?: string): Promise<{
  productCount: number;
  orderCount: number;
  lastSync?: string;
  source: 'platform';
  catalogSource: typeof CATALOG_SUMMARY_SOURCE;
  brandId?: string;
  errors?: string[];
}> {
  return {
    productCount: 0,
    orderCount: 0,
    lastSync: new Date().toISOString(),
    source: 'platform',
    catalogSource: CATALOG_SUMMARY_SOURCE,
    brandId: brandId?.trim() || undefined,
  };
}
