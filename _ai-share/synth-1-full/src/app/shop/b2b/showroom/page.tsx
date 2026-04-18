'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RegistryPageShell } from '@/components/design-system';
import { Download, Share2, BookOpen, ShoppingBag, FileText, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
<<<<<<< HEAD
=======
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
>>>>>>> recover/cabinet-wip-from-stash
import {
  getVisibleLookbooksForPartner,
  type LookbookProject,
} from '@/lib/b2b/lookbook-projects-store';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

const MOCK_PARTNER_ID = 'retail_msk_1';

const SEASONS = ['FW26', 'SS26', 'FW25', 'SS25'] as const;

export default function VirtualShowroomPage() {
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [projects, setProjects] = useState<LookbookProject[]>([]);

  const load = useCallback(() => {
    setProjects(getVisibleLookbooksForPartner(MOCK_PARTNER_ID));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const brands = useMemo(() => {
    const set = new Set(projects.map((p) => p.brandName));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (brandFilter && p.brandName !== brandFilter) return false;
      const season = p.season ?? p.name.match(/(FW|SS)\d{2}/)?.[0] ?? '';
      if (seasonFilter && season !== seasonFilter) return false;
      return true;
    });
  }, [projects, brandFilter, seasonFilter]);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <LayoutGrid className="h-6 w-6" /> Виртуальный шоурум
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Просмотр коллекций по бренду и сезону. Скачать лайншит (PDF), поделиться ссылкой, заказ
            из лукбука в один клик.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-5xl space-y-6">
      <ShopB2bContentHeader lead="Просмотр коллекций по бренду и сезону: лайншит (PDF), шаринг, заказ из лукбука в один клик." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Фильтр</CardTitle>
          <CardDescription>Бренд и сезон — карточки коллекций/лукбуков ниже.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <div className="flex flex-wrap items-center gap-2">
<<<<<<< HEAD
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Бренд
            </span>
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
<<<<<<< HEAD
          <div className="hidden h-6 w-px bg-slate-200 sm:block" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="bg-border-subtle hidden h-6 w-px sm:block" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Сезон
            </span>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((p) => {
          const season = p.season ?? p.name.match(/(FW|SS)\d{2}/)?.[0] ?? '';
          const pdfUrl = p.watermarkedPdfUrl ?? p.lookbookUrl;
          return (
            <Card
              key={p.id}
<<<<<<< HEAD
              className="overflow-hidden border-slate-100 transition-colors hover:border-indigo-200"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
=======
              className="border-border-subtle hover:border-accent-primary/30 overflow-hidden transition-colors"
            >
              <div className="bg-bg-surface2 relative aspect-[4/3]">
>>>>>>> recover/cabinet-wip-from-stash
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="text-text-muted h-16 w-16" />
                </div>
                <div className="absolute left-3 top-3 flex gap-2">
<<<<<<< HEAD
                  <Badge className="bg-white/90 text-[9px] font-black uppercase text-slate-800">
=======
                  <Badge className="text-text-primary bg-white/90 text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
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
                <CardTitle className="text-base font-black uppercase tracking-tight">
                  {p.name}
                </CardTitle>
                <CardDescription>
                  До {new Date(p.visibleUntil).toLocaleDateString('ru-RU')} · Лайншит и заказ из
                  лукбука
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Скачать лайншит (PDF)
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link href={`${ROUTES.shop.b2bLookbookShare}?id=${p.id}`}>
                      <Share2 className="mr-1.5 h-3.5 w-3.5" /> Поделиться лайншитом
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
<<<<<<< HEAD
                    className="rounded-lg bg-indigo-600 text-[10px] font-black hover:bg-indigo-700"
                    asChild
                  >
                    <Link href={`/shop/b2b/lookbooks/${p.id}/shoppable`}>
=======
                    className="bg-accent-primary hover:bg-accent-primary rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link href={ROUTES.shop.shoppableLookbook(p.id)}>
>>>>>>> recover/cabinet-wip-from-stash
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Shoppable Lookbook
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link
                      href={`${ROUTES.shop.b2bOrderByCollection}?collection=${p.collectionId ?? p.id}&brand=${encodeURIComponent(p.brandName)}`}
                    >
                      Заказ из лукбука (матрица)
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link
                      href={`${ROUTES.shop.b2bCatalog}?brand=${encodeURIComponent(p.brandName)}`}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> В каталог
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link
                      href={`${ROUTES.shop.b2bMatrix}?brand=${encodeURIComponent(p.brandName)}`}
                    >
                      <ChevronRight className="mr-1.5 h-3.5 w-3.5" /> В матрицу
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
<<<<<<< HEAD
          <p className="text-slate-500">
=======
          <p className="text-text-secondary">
>>>>>>> recover/cabinet-wip-from-stash
            Нет коллекций по выбранному фильтру. Смените бренд или сезон.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => {
              setBrandFilter('');
              setSeasonFilter('');
            }}
          >
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
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Лукбуки, каталог, матрица"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
