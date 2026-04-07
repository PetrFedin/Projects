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
    <div className="container max-w-5xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-tight">Каталог</h1>
        <p className="text-slate-500 text-sm mt-1">Несколько брендов, единый поиск и фильтр по бренду.</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Поиск по каталогу</CardTitle>
          <CardDescription>Единый поиск по всем брендам. Укажите бренд для фильтрации.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Поиск..."
              className="max-w-xs"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm min-w-[160px]"
            >
              <option value="">Все бренды</option>
              {brands.slice(0, 8).map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            <Button onClick={handleSearch}>Искать</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-3 flex items-center gap-2 text-slate-600">
        <LayoutGrid className="h-4 w-4" />
        <span className="text-sm font-medium">По бренду</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {brands.slice(0, 8).map((b) => (
          <Link key={b.id} href={`/search?brand=${encodeURIComponent(b.name)}`}>
            <Card className="h-full hover:border-slate-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 mb-2 flex items-center justify-center text-lg font-bold text-slate-600">
                  {b.name.slice(0, 2)}
                </div>
                <p className="font-medium text-sm">{b.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Каталог</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" asChild><Link href="/search">Открыть полный поиск</Link></Button>
      </div>
    </div>
  );
}
