/**
 * POST /api/b2b/fashion-cloud/catalog-sync — синхрон каталога с options и media (фото, видео, 3D).
 * Body: { products: FashionCloudProduct[] } (каждый продукт может содержать options[], media[]).
 */

import { NextResponse } from 'next/server';
import { fashionCloudSyncProducts } from '@/lib/b2b/integrations/archive/fashion-cloud-client';
import type { FashionCloudProduct } from '@/lib/b2b/integrations/archive/fashion-cloud-client';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { products?: FashionCloudProduct[] };
    const products = body?.products;
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { success: false, error: 'Body must include products array' },
        { status: 400 }
      );
    }
    const result = await fashionCloudSyncProducts(products, null);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Catalog sync failed' },
      { status: 500 }
    );
  }
}
