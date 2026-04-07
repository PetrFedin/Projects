/**
 * POST /api/b2b/joor/sync-styles — синхрон стилей/продуктов в JOOR (v4 bulk).
 * Body: JoorSyncStylesPayload (styles, drop_style_ids?).
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorSyncStyles } from '@/lib/b2b/integrations/archive/joor-styles-customers';
import type { JoorSyncStylesPayload } from '@/lib/b2b/integrations/archive/joor-styles-customers';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JoorSyncStylesPayload;
    if (!body?.styles || !Array.isArray(body.styles)) {
      return NextResponse.json(
        { success: false, error: 'Body must include styles array' },
        { status: 400 }
      );
    }
    const config = getJoorConfigFromEnv();
    const result = await joorSyncStyles(body, config);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Styles sync failed' },
      { status: 500 }
    );
  }
}
