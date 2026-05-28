/**
 * GET /api/brand/b2b/orders — список W2 B2B заказов по collectionId (Wave 24).
 */
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2B2bOrdersForCollection } from '@/lib/server/workshop2-b2b-orders-repository';
import { workshop2B2bOrderContextId } from '@/lib/production/workshop2-b2b-order-lifecycle';

export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? 'SS27';
  const orders = await listWorkshop2B2bOrdersForCollection(collectionId);

  return NextResponse.json({
    ok: true,
    collectionId,
    orders: orders.map((o) => ({
      ...o,
      w2Href:
        o.collectionId && o.articleId
          ? `/brand/production/workshop2/${encodeURIComponent(o.collectionId)}/${encodeURIComponent(o.articleId)}`
          : null,
      chatHref: `/brand/messages?contextType=b2b_order&contextId=${encodeURIComponent(workshop2B2bOrderContextId(o.id))}`,
    })),
    messageRu: `${orders.length} заказ(ов) по коллекции ${collectionId}.`,
  });
}
