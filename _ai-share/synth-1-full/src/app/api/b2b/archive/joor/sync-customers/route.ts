/**
 * POST /api/b2b/joor/sync-customers — синхрон клиентов/партнёров в JOOR (v4 bulk).
 * Body: JoorSyncCustomersPayload (customers).
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorSyncCustomers } from '@/lib/b2b/integrations/archive/joor-styles-customers';
import type { JoorSyncCustomersPayload } from '@/lib/b2b/integrations/archive/joor-styles-customers';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JoorSyncCustomersPayload;
    if (!body?.customers || !Array.isArray(body.customers)) {
      return NextResponse.json(
        { success: false, error: 'Body must include customers array' },
        { status: 400 }
      );
    }
    const config = getJoorConfigFromEnv();
    const result = await joorSyncCustomers(body, config);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Customers sync failed' },
      { status: 500 }
    );
  }
}
