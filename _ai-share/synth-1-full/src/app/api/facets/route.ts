import { NextResponse } from 'next/server';
import { normalizeFilters } from '../../../lib/serverQuery';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const filters = normalizeFilters(raw as any);

  const facets = {
    status: [
      { value: 'active', count: 8421 },
      { value: 'draft', count: 312 },
      { value: 'archived', count: 1280 },
    ],
    category: [
      { value: 'outerwear', count: 1320 },
      { value: 'knitwear', count: 980 },
      { value: 'footwear', count: 740 },
    ],
    brand: [
      { value: 'apc', count: 420 },
      { value: 'stone-island', count: 310 },
      { value: 'kitsune', count: 255 },
    ],
    countryOfOrigin: [
      { value: 'IT', count: 5100 },
      { value: 'PT', count: 1900 },
      { value: 'CN', count: 1200 },
    ],
    productionStage: [
      { value: 'sampling', count: 80 },
      { value: 'production', count: 210 },
      { value: 'qa', count: 55 },
      { value: 'shipping', count: 120 },
    ],
  };

  return NextResponse.json({ facets, debug: { filters } });
}
