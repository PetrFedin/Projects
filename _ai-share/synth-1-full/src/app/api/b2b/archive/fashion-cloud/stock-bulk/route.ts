/**
 * POST /api/b2b/fashion-cloud/stock-bulk — массовая выгрузка остатков (stock bulk upsert).
 * Body: { stock: FashionCloudStockBulkItem[] }.
 */

import { NextResponse } from 'next/server';
import { fashionCloudBulkUpsertStock } from '@/lib/b2b/integrations/archive/fashion-cloud-client';
import type { FashionCloudStockBulkItem } from '@/lib/b2b/integrations/archive/fashion-cloud-client';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { stock?: FashionCloudStockBulkItem[] };
    const stock = body?.stock;
    if (!stock || !Array.isArray(stock)) {
      return NextResponse.json(
        { success: false, error: 'Body must include stock array' },
        { status: 400 }
      );
    }
    const result = await fashionCloudBulkUpsertStock(stock, null);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Stock bulk upsert failed' },
      { status: 500 }
    );
  }
}
