/**
 * GET /api/b2b/integrations/dashboard — матрица интеграций + сводка каталога одним ответом (use-case).
 */

import { NextResponse } from 'next/server';
import { loadB2bIntegrationsDashboard } from '@/lib/use-cases/b2b/load-integrations-dashboard';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { apiTraceHeaders, HEADER_DATA_SOURCE } from '@/lib/api/response-trace-headers';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function GET(request: Request) {
  const requestId = getOrCreateRequestId(request);
  const mode = getRuntimeMode();
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId') ?? undefined;
  const dash = await loadB2bIntegrationsDashboard(brandId);
  const headers = apiTraceHeaders(requestId, mode, {
    [HEADER_DATA_SOURCE]: `integrations-dashboard:${dash.catalog.catalogSource}`,
  });
  return NextResponse.json(dash, { headers });
}
