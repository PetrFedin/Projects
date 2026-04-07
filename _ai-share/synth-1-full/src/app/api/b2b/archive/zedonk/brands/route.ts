/**
 * GET /api/b2b/zedonk/brands — список брендов (multi-brand / agent). При появлении API.
 */

import { NextResponse } from 'next/server';
import { getZedonkConfigFromEnv } from '@/lib/b2b/integrations/archive/zedonk-client';
import { zedonkGetBrands } from '@/lib/b2b/integrations/archive/zedonk-client';

export async function GET() {
  try {
    const config = getZedonkConfigFromEnv();
    const brands = await zedonkGetBrands(config);
    return NextResponse.json(brands);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
