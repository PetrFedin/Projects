/**
 * GET /api/b2b/archive/zedonk/orders — upstream list for spine import (live credentials only).
 */
import { getZedonkConfigFromEnv } from '@/lib/b2b/integrations/archive/zedonk-client';
import { zedonkFetchOrders } from '@/lib/b2b/integrations/archive/zedonk-client';
import {
  archiveUpstreamFetchFailedResponse,
  archiveUpstreamNotConfiguredResponse,
  parseArchiveUpstreamQuery,
  toSpineImportOrderPayloadList,
} from '@/lib/integrations/spine/archive-upstream-orders.server';

export async function GET(request: Request) {
  const config = getZedonkConfigFromEnv();
  if (!config) {
    return archiveUpstreamNotConfiguredResponse('Агентская консолидация');
  }

  const { since, until, status, limit } = parseArchiveUpstreamQuery(request);

  try {
    const imported = await zedonkFetchOrders(config, { since, until, status, limit });
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
