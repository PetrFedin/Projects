/**
 * GET /api/b2b/sparklayer/products — список продуктов (SparkLayer Core API).
 * Query: limit, offset.
 */

import { NextResponse } from 'next/server';
import { sparkLayerGetProducts } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;
    const products = await sparkLayerGetProducts({ limit, offset });
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
