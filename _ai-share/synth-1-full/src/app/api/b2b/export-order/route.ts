/**
 * POST /api/b2b/export-order — экспорт заказа.
 * NuOrder/JOOR — в archive. Для РФ: платформа, маркетплейсы (WB, Ozon).
 */

import { NextResponse } from 'next/server';
import { exportOrderToProvider } from '@/lib/b2b/integrations/b2b-integration-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = body?.provider as string;
    const payload = body?.payload;
    if (!payload || (provider !== 'platform' && provider !== 'nuorder' && provider !== 'joor')) {
      return NextResponse.json(
        { success: false, error: 'provider: platform (nuorder/joor в archive). payload required.' },
        { status: 400 }
      );
    }
    if (provider === 'nuorder' || provider === 'joor') {
      return NextResponse.json(
        { success: false, error: 'JOOR/NuOrder в archive. Используйте platform или маркетплейсы РФ.' },
        { status: 400 }
      );
    }
    const result = await exportOrderToProvider('platform', payload);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Export failed' },
      { status: 500 }
    );
  }
}
