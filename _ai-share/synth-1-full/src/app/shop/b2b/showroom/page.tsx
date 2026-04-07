'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutGrid,
  ArrowLeft,
  Download,
  Share2,
  BookOpen,
  ShoppingBag,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getVisibleLookbooksForPartner, type LookbookProject } from '@/lib/b2b/lookbook-projects-store';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

const MOCK_PARTNER_ID = 'podium';

const SEASONS = ['FW26', 'SS26', 'FW25', 'SS25'] as const;

export default function VirtualShowroomPage() {
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [projects, setProjects] = useState<LookbookProject[]>([]);

  const load = useCallback(() => {
    setProjects(getVisibleLookbooksForPartner(MOCK_PARTNER_ID));
  }, []);
  useEffect(() => { load(); }, [load]);

  const brands = useMemo(() => {
    const set = new Set(projects.map((p) => p.brandName));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (brandFilter && p.brandName !== brandFilter) return false;
      const season = p.season ?? (p.name.match(/(FW|SS)\d{2}/)?.[0] ?? '');
      if (seasonFilter && season !== seasonFilter) return false;
      return true;
    });
  }, [projects, brandFilter, seasonFilter]);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-6 w-6" /> Виртуальный шоурум
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Просмотр коллекций по бренду и сезону. Скачать лайншит (PDF), поделиться ссылкой, заказ из лукбука в один клик.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Фильтр</CardTitle>
          <CardDescription>Бренд и сезон — карточки коллекций/лукбуков ниже.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Бренд</span>
            <Button
              variant={brandFilter === '' ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg text-[10px] font-black uppercase"
              onClick={() => setBrandFilter('')}
            >
              Все
            </Button>
            {brands.map((b) => (
              <Button
                key={b}
                variant={brandFilter === b ? 'default' : 'outline'}
                size="sm"
                className="rounded-lg text-[10px] font-black uppercase"
                onClick={() => setBrandFilter(b)}
              >
                {b}
              </Button>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Сезон</span>
            <Button
              variant={seasonFilter === '' ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg text-[10px] font-black uppercase"
              onClick={() => setSeasonFilter('')}
            >
              Все
            </Button>
            {SEASONS.map((s) => (
              <Button
                key={s}
                variant={seasonFilter === s ? 'default' : 'outline'}
                size="sm"
                className="rounded-lg text-[10px] font-black uppercase"
                onClick={() => setSeasonFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => {
          const season = p.season ?? (p.name.match(/(FW|SS)\d{2}/)?.[0] ?? '');
          const pdfUrl = p.watermarkedPdfUrl ?? p.lookbookUrl;
          return (
            <Card key={p.id} className="overflow-hidden border-slate-100 hover:border-indigo-200 transition-colors">
              <div className="aspect-[4/3] bg-slate-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-slate-300" />
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-white/90 text-slate-800 text-[9px] font-black uppercase">
                    {p.brandName}
                  </Badge>
                  {season && (
                    <Badge variant="secondary" className="text-[9px] font-black uppercase">
                      {season}
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-black uppercase tracking-tight">{p.name}</CardTitle>
                <CardDescription>
                  До {new Date(p.visibleUntil).toLocaleDateString('ru-RU')} · Лайншит и заказ из лукбука
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px] font-black" asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Скачать лайншит (PDF)
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px] font-black" asChild>
                    <Link href={`${ROUTES.shop.b2bLookbookShare}?id=${p.id}`}>
                      <Share2 className="h-3.5 w-3.5 mr-1.5" /> Поделиться лайншитом
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-lg text-[10px] font-black bg-indigo-600 hover:bg-indigo-700" asChild>
                    <Link href={`/shop/b2b/lookbooks/${p.id}/shoppable`}>
                      <ShoppingBag className="h-3.5 w-3.5 mr-1.5" /> Shoppable Lookbook
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px] font-black" asChild>
                    <Link href={`${ROUTES.shop.b2bOrderByCollection}?collection=${p.collectionId ?? p.id}&brand=${encodeURIComponent(p.brandName)}`}>
                      Заказ из лукбука (матрица)
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px] font-black" asChild>
                    <Link href={`${ROUTES.shop.b2bCatalog}?brand=${encodeURIComponent(p.brandName)}`}>
                      <FileText className="h-3.5 w-3.5 mr-1.5" /> В каталог
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg text-[10px] font-black" asChild>
                    <Link href={`${ROUTES.shop.b2bMatrix}?brand=${encodeURIComponent(p.brandName)}`}>
                      <ChevronRight className="h-3.5 w-3.5 mr-1.5" /> В матрицу
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-500">Нет коллекций по выбранному фильтру. Смените бренд или сезон.</p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => { setBrandFilter(''); setSeasonFilter(''); }}>
            Сбросить фильтр
          </Button>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bLookbooks}>Все лукбуки</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCatalog}>Каталог</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bMatrix}>Матрица заказа</Link>
        </Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Лукбуки, каталог, матрица" className="mt-6" />
    </div>
  );
}
