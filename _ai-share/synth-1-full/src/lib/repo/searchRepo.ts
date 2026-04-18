import { PRODUCTS, Product } from '@/data/products.mock';

export type SearchSuggestItem = {
  type: 'product' | 'brand' | 'category' | 'query';
  label: string;
  payload?: any;
};

export type SearchQueryParams = {
  q: string;
  brand?: string;
  category?: Product['category'];
  gender?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'relevance' | 'price_asc' | 'price_desc';
};

export type SearchResult = {
  items: Product[];
  total: number;
  facets: {
    brands: { value: string; count: number }[];
    categories: { value: Product['category']; count: number }[];
  };
};

export interface SearchRepo {
  suggest(q: string): Promise<SearchSuggestItem[]>;
  query(params: SearchQueryParams): Promise<SearchResult>;
}

export class MockSearchRepo implements SearchRepo {
  async suggest(q: string): Promise<SearchSuggestItem[]> {
    const query = (q ?? '').trim().toLowerCase();
    if (!query) return [];

    const matchedProducts = PRODUCTS.filter((p) =>
      `${p.title} ${p.brand} ${p.tags.join(' ')}`.toLowerCase().includes(query)
    )
      .slice(0, 6)
      .map((p) => ({ type: 'product' as const, label: `${p.title}`, payload: { slug: p.slug } }));

    const brandSet = new Map<string, number>();
    for (const p of PRODUCTS) {
      if (p.brand.toLowerCase().includes(query))
        brandSet.set(p.brand, (brandSet.get(p.brand) ?? 0) + 1);
    }

    const matchedBrands = Array.from(brandSet.entries())
      .slice(0, 5)
      .map(([b, count]) => ({
        type: 'brand' as const,
        label: `${b} (${count})`,
        payload: { brand: b },
      }));

    const categories = ['Outerwear', 'Tops', 'Bottoms', 'Shoes', 'Accessories'] as const;
    const matchedCats = categories
      .filter((c) => c.toLowerCase().includes(query))
      .map((c) => ({ type: 'category' as const, label: c, payload: { category: c } }));

    const queryItem: SearchSuggestItem = { type: 'query', label: `Искать: “${q}”`, payload: { q } };

    return [queryItem, ...matchedBrands, ...matchedCats, ...matchedProducts].slice(0, 10);
  }

  async query(params: SearchQueryParams): Promise<SearchResult> {
    const q = (params.q ?? '').trim().toLowerCase();

    let items = PRODUCTS.filter((p) => {
      const hay =
        `${p.title} ${p.brand} ${p.category} ${p.color} ${p.tags.join(' ')}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (params.brand && p.brand !== params.brand) return false;
      if (params.category && p.category !== params.category) return false;
      if (params.gender && (p as any).gender !== params.gender && (p as any).gender !== 'unisex') {
        // Specific logic for global filters
        if (
          params.gender === 'women' &&
          (p as any).gender !== 'women' &&
          (p as any).gender !== 'unisex'
        )
          return false;
        if (
          params.gender === 'men' &&
          (p as any).gender !== 'men' &&
          (p as any).gender !== 'unisex'
        )
          return false;
<<<<<<< HEAD
        if (params.gender === 'kids' && (p as any).gender !== 'kids' && p.category !== 'Детям')
          return false;
        if (params.gender === 'beauty' && p.category !== 'Beauty' && p.category !== 'Красота')
          return false;
        if (params.gender === 'home' && p.category !== 'Home' && p.category !== 'Дом') return false;
=======
        const cat = p.category as string;
        if (params.gender === 'kids' && (p as any).gender !== 'kids' && cat !== 'Детям')
          return false;
        if (params.gender === 'beauty' && cat !== 'Beauty' && cat !== 'Красота') return false;
        if (params.gender === 'home' && cat !== 'Home' && cat !== 'Дом') return false;
>>>>>>> recover/cabinet-wip-from-stash
      }
      if (typeof params.priceMin === 'number' && p.price < params.priceMin) return false;
      if (typeof params.priceMax === 'number' && p.price > params.priceMax) return false;
      return true;
    });

    // sort
    if (params.sort === 'price_asc') items = items.slice().sort((a, b) => a.price - b.price);
    if (params.sort === 'price_desc') items = items.slice().sort((a, b) => b.price - a.price);

    const facets = buildFacets(items);

    return { items, total: items.length, facets };
  }
}

function buildFacets(items: Product[]) {
  const brandMap = new Map<string, number>();
  const catMap = new Map<Product['category'], number>();

  for (const p of items) {
    brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1);
    catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1);
  }

  return {
    brands: Array.from(brandMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count })),
    categories: Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count })),
  };
}
