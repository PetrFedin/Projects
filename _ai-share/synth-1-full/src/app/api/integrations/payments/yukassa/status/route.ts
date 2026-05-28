/**
 * GET /api/integrations/payments/yukassa/status — stub probe ЮKassa (not_connected без ключей).
 */
import { NextResponse } from 'next/server';
import { probeWorkshop2Yukassa } from '@/lib/production/workshop2-yukassa-stub';

export async function GET() {
  const probe = probeWorkshop2Yukassa();
  return NextResponse.json({
    ok: true,
    provider: 'yukassa',
    status: probe.status,
    shopIdConfigured: probe.shopIdConfigured,
    secretConfigured: probe.secretConfigured,
    messageRu: probe.messageRu,
  });
}
