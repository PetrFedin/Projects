/**
 * GET /api/b2b/nuorder/company-codes — коды компаний NuOrder (OAuth 1.0 из env).
 * GitHub: jacobsvante/nuorder. Для выбора компании при экспорте заказа.
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerGetCompanyCodes } from '@/lib/b2b/integrations/archive/nuorder-server';

export async function GET() {
  const config = getNuOrderConfigFromEnv();
  if (!config) {
    return NextResponse.json({ error: 'NuOrder not configured', codes: [] }, { status: 200 });
  }
  try {
    const codes = await nuorderServerGetCompanyCodes(config);
    return NextResponse.json({ codes });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch company codes', codes: [] },
      { status: 500 }
    );
  }
}
