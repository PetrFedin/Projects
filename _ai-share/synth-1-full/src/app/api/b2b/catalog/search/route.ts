import { NextRequest, NextResponse } from 'next/server';

/** B2B catalog full-text search — collections, SKU, categories */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const collection = searchParams.get('collection') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const brand = searchParams.get('brand') ?? undefined;
  const sort = searchParams.get('sort') ?? 'relevance';

  const MOCK = [
    {
      id: 'TP-9921',
      name: 'Платье Midnight',
      collection: 'SS26',
      price: '4,500 ₽',
      moq: 30,
      brand: 'Syntha',
    },
    {
      id: 'TP-9922',
      name: 'Топ White Silk',
      collection: 'SS26',
      price: '2,100 ₽',
      moq: 20,
      brand: 'Syntha',
    },
    {
      id: 'TP-8812',
      name: 'Худи Eco-Life',
      collection: 'DROP-UZ',
      price: '2,800 ₽',
      moq: 50,
      brand: 'Syntha',
    },
  ];

  let items = MOCK;
  const ql = q.trim().toLowerCase();
  if (ql) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(ql) ||
        p.id.toLowerCase().includes(ql) ||
        p.collection.toLowerCase().includes(ql) ||
        (p.brand && p.brand.toLowerCase().includes(ql))
    );
  }
  if (collection) items = items.filter((p) => p.collection === collection);
  if (brand) items = items.filter((p) => p.brand === brand);

  return NextResponse.json({
    items,
    total: items.length,
    facets: { collections: ['SS26', 'DROP-UZ'], brands: ['Syntha'] },
  });
}
