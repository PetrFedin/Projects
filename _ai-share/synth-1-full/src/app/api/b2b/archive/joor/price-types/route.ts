/**
 * GET /api/b2b/joor/price-types — типы цен JOOR (v4).
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorGetPriceTypes } from '@/lib/b2b/integrations/archive/joor-prices';

export async function GET() {
  try {
    const config = getJoorConfigFromEnv();
    const types = await joorGetPriceTypes(config);
    return NextResponse.json(types);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch price types' },
      { status: 500 }
    );
  }
}
