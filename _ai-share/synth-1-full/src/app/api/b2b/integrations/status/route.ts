/**
 * GET /api/b2b/integrations/status — статус B2B-интеграций (JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk).
 * Для настроек и виджетов. Не раскрывает секреты.
 */

import { NextResponse } from 'next/server';
import { getB2BIntegrationStatus } from '@/lib/b2b/integrations/b2b-integration-service';

export async function GET() {
  const status = getB2BIntegrationStatus();
  return NextResponse.json(status);
}
