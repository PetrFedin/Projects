import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Заглушка webhook Adobe Illustrator Sync (no-op 202).
 * Реальная синхронизация .ai → скетчи — в roadmap; см. /brand/integrations/erp-plm.
 */
export async function POST(req: NextRequest) {
  await req.json().catch(() => ({}));
  return NextResponse.json(
    {
      ok: true,
      accepted: true,
      message: 'Webhook принят. Полная синхронизация Illustrator — в roadmap.',
    },
    { status: 202 }
  );
}
