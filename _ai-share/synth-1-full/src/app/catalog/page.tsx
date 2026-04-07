'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Search, MapPin, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { CATALOG_BRANDS, type CatalogBrand } from '@/lib/data/catalog-brands';

export default function CatalogPage() {
  const [searchQ, setSearchQ] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [segmentFilter, setSegmentFilter] = useState<string>('');

  const filteredBrands = useMemo(() => {
    let list = CATALOG_BRANDS;
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (countryFilter) {
      list = list.filter((b) => b.countryOfOrigin.includes(countryFilter));
    }
    if (segmentFilter) {
      list = list.filter((b) => b.segment === segmentFilter);
    }
    return list;
  }, [searchQ, countryFilter, segmentFilter]);

  const segments = useMemo(
    () => [...new Set(CATALOG_BRANDS.map((b) => b.segment))].sort(),
    []
  );
  const countries = useMemo(
    () => [...new Set(CATALOG_BRANDS.flatMap((b) => b.countryOfOrigin.split(' / ')))].sort(),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-6xl mx-auto px-4 py-8 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-900">
            Каталог брендов
          </h1>
          <p className="text-slate-600 mt-1">
            Реальные бренды одежды: масс-маркет, премиум, люкс. Поиск и фильтры.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Поиск по названию, описанию, тегам..."
                  className="pl-9"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm min-w-[180px]"
              >
                <option value="">Все сегменты</option>
                {segments.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm min-w-[160px]"
              >
                <option value="">Все страны</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center gap-2 text-slate-600">
          <LayoutGrid className="h-4 w-4" />
          <span className="text-sm font-medium">
            {filteredBrands.length} бренд{filteredBrands.length === 1 ? '' : filteredBrands.length < 5 ? 'а' : 'ов'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <CatalogBrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>Бренды не найдены. Попробуйте изменить фильтры.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQ('');
                setCountryFilter('');
                setSegmentFilter('');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}

        <div className="mt-8 flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/search">Открыть поиск товаров</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href={ROUTES.client.catalog}>Каталог платформы (Syntha Lab, Nordic Wool)</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function CatalogBrandCard({ brand }: { brand: CatalogBrand }) {
  const priceStr = `${(brand.priceRange[0] / 1000).toFixed(0)}–${(brand.priceRange[1] / 1000).toFixed(0)} тыс ₽`;

  return (
    <Link href={`/search?brand=${encodeURIComponent(brand.name)}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {brand.coverImage ? (
            <Image
              src={brand.coverImage}
              alt={brand.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-300">
              {brand.name.slice(0, 2)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-lg text-white drop-shadow">{brand.name}</h3>
            <p className="text-white/90 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {brand.countryOfOrigin}
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{brand.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="secondary" className="text-[10px]">
              {brand.segment}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {priceStr}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{brand.categories.slice(0, 2).join(', ')}</span>
            <ChevronRight className="h-4 w-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
