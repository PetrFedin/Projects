'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, Search, Filter } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { brands } from '@/lib/placeholder-data';

/** ASOS-style: мультибрендовый лендинг + фильтр по бренду, единый поиск. */
export default function ClientCatalogPage() {
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [searchQ, setSearchQ] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQ) params.set('q', searchQ);
    if (brandFilter) params.set('brand', brandFilter);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Каталог</h1>
<<<<<<< HEAD
        <p className="mt-1 text-sm text-slate-500">
=======
        <p className="text-text-secondary mt-1 text-sm">
>>>>>>> recover/cabinet-wip-from-stash
          Несколько брендов, единый поиск и фильтр по бренду.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" /> Поиск по каталогу
          </CardTitle>
          <CardDescription>
            Единый поиск по всем брендам. Укажите бренд для фильтрации.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Поиск..."
              className="max-w-xs"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
<<<<<<< HEAD
              className="min-w-[160px] rounded-lg border border-slate-200 px-3 py-2 text-sm"
=======
              className="border-border-default min-w-[160px] rounded-lg border px-3 py-2 text-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <option value="">Все бренды</option>
              {brands.slice(0, 8).map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <Button onClick={handleSearch}>Искать</Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-text-secondary mb-3 flex items-center gap-2">
        <LayoutGrid className="h-4 w-4" />
        <span className="text-sm font-medium">По бренду</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {brands.slice(0, 8).map((b) => (
          <Link key={b.id} href={`/search?brand=${encodeURIComponent(b.name)}`}>
<<<<<<< HEAD
            <Card className="h-full cursor-pointer transition-colors hover:border-slate-300">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600">
                  {b.name.slice(0, 2)}
                </div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">Каталог</p>
=======
            <Card className="hover:border-border-default h-full cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="bg-bg-surface2 text-text-secondary mb-2 flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold">
                  {b.name.slice(0, 2)}
                </div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-text-muted mt-0.5 text-xs">Каталог</p>
>>>>>>> recover/cabinet-wip-from-stash
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/search">Открыть полный поиск</Link>
        </Button>
      </div>
    </div>
  );
}
