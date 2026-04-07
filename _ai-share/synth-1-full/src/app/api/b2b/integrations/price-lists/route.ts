/**
 * GET /api/b2b/integrations/price-lists — прайс-листы для заказа (SparkLayer при наличии). Для магазинов и дистрибуторов.
 */

import { NextResponse } from 'next/server';
import { getPriceListsForOrder } from '@/lib/b2b/integrations/b2b-integration-service';

export async function GET() {
  const lists = await getPriceListsForOrder();
  return NextResponse.json(lists);
}
