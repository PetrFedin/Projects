/**
 * GET /api/b2b/integrations/catalog-summary — сводка каталога для производства/поставщиков (Fashion Cloud при наличии).
 */

import { NextResponse } from 'next/server';
import { getCatalogSummaryForProduction } from '@/lib/b2b/integrations/b2b-integration-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId') ?? undefined;
  const summary = await getCatalogSummaryForProduction(brandId);
  return NextResponse.json(summary);
}
