/**
 * GET brand B2B analytics — orders count, ₽ total, top SKUs (Wave 22).
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2B2bOrderAnalytics } from '@/lib/production/workshop2-b2b-wave22-parity';
import { listWorkshop2B2bOrdersForCollection } from '@/lib/server/workshop2-b2b-orders-repository';

export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  if (!collectionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Параметр collectionId обязателен.' },
      { status: 400 }
    );
  }

  const orders = await listWorkshop2B2bOrdersForCollection(collectionId);
  const analytics = buildWorkshop2B2bOrderAnalytics({ collectionId, orders });

  return NextResponse.json({
    ok: true,
    analytics,
    messageRu: `B2B аналитика: ${analytics.ordersCount} заказов · ${analytics.totalRub.toLocaleString('ru-RU')} ₽.`,
  });
}
