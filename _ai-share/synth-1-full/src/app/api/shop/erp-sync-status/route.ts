/**
 * GET /api/shop/erp-sync-status — последний успешный обмен с учётом и очередь (без секретов).
 * Клиент: `ErpAccountingSyncBanner`, интеграции.
 */

import { NextResponse } from 'next/server';
import { getErpAccountingSyncStatus } from '@/lib/b2b/erp-accounting-sync-service';
import { observeApiRoute } from '@/lib/server/observe-api-route';

export async function GET(request: Request) {
  return observeApiRoute(request, '/api/shop/erp-sync-status', async () => {
    const body = await getErpAccountingSyncStatus();
    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  });
}
