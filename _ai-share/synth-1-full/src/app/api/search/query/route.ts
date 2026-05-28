import { NextRequest, NextResponse } from 'next/server';
import { repo } from '@/lib/repo';
import { SearchQueryParams } from '@/lib/repo/searchRepo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params: SearchQueryParams = {
    q: searchParams.get('q') ?? '',
    brand: searchParams.get('brand') ?? undefined,
    category: (searchParams.get('category') as any) ?? undefined,
    gender: searchParams.get('gender') ?? undefined,
    sort: (searchParams.get('sort') as any) ?? 'relevance',
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
  };

  const data = await repo.search.query(params);
  return NextResponse.json(data);
}
