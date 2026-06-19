/**
 * GET /api/b2b/archive/joor/orders — upstream list for spine import (live credentials only).
 */
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorFetchOrders } from '@/lib/b2b/integrations/archive/joor-orders';
import {
  archiveUpstreamFetchFailedResponse,
  archiveUpstreamNotConfiguredResponse,
  parseArchiveUpstreamQuery,
  toSpineImportOrderPayloadList,
} from '@/lib/integrations/spine/archive-upstream-orders.server';

export async function GET(request: Request) {
  const config = getJoorConfigFromEnv();
  if (!config) {
    return archiveUpstreamNotConfiguredResponse('Партнёрская сеть');
  }

  const { since, until, status, limit } = parseArchiveUpstreamQuery(request);

  try {
    const imported = await joorFetchOrders(config, { since, until, status, limit });
    const payloads = toSpineImportOrderPayloadList(
      imported.map((o) => ({
        id: o.id,
        ...(o.raw ? (o.raw as Record<string, unknown>) : {}),
      }))
    );
    return Response.json(payloads);
  } catch (e) {
    return archiveUpstreamFetchFailedResponse(
      e instanceof Error ? e.message : 'Не удалось загрузить заказы из upstream'
    );
  }
}
