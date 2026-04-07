/**
 * GET /api/b2b/fashion-cloud/draft-orders — импорт черновиков заказов из Fashion Cloud.
 * Query: brandId.
 */

import { NextResponse } from 'next/server';
import { fashionCloudGetDraftOrders } from '@/lib/b2b/integrations/archive/fashion-cloud-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') ?? undefined;
    const drafts = await fashionCloudGetDraftOrders(brandId, null);
    return NextResponse.json(drafts);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch draft orders' },
      { status: 500 }
    );
  }
}
