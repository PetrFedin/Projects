'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import {
  getVisibleLookbooksForPartner,
  type LookbookProject,
} from '@/lib/b2b/lookbook-projects-store';
<<<<<<< HEAD
import {
  BookOpen,
  ArrowLeft,
  FileText,
  ShoppingBag,
  Download,
  Share2,
  LayoutGrid,
} from 'lucide-react';
=======
import { FileText, ShoppingBag, Download, Share2, LayoutGrid } from 'lucide-react';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
>>>>>>> recover/cabinet-wip-from-stash
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** Мок: текущий партнёр (байер). В проде — из сессии. */
const MOCK_PARTNER_ID = 'retail_msk_1';

export default function ShopLookbooksPage() {
  const [projects, setProjects] = useState<LookbookProject[]>([]);

  const load = useCallback(() => {
    setProjects(getVisibleLookbooksForPartner(MOCK_PARTNER_ID));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <BookOpen className="h-6 w-6" /> Лукбуки
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Colect: лукбуки, доступные вам по правам и до даты. Просмотр PDF с водяным знаком, заказ
            из лукбука.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Colect: лукбуки по правам и до даты видимости; PDF с водяным знаком, заказ из лукбука." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <CardTitle>Доступные лукбуки</CardTitle>
          <CardDescription>Коллекции как проекты: видимость до указанной даты.</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
<<<<<<< HEAD
            <p className="text-sm text-slate-500">
=======
            <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
              Нет доступных лукбуков. Обратитесь к бренду для доступа.
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li
                  key={p.id}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                      <FileText className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">
=======
                  className="border-border-default flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center rounded-lg">
                      <FileText className="text-text-secondary h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                        {p.brandName} · до {new Date(p.visibleUntil).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={p.watermarkedPdfUrl ?? p.lookbookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-1 h-3.5 w-3.5" /> Скачать лайншит (PDF)
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`${ROUTES.shop.b2bLookbookShare}?id=${p.id}`}>
                        <Share2 className="mr-1 h-3.5 w-3.5" /> Поделиться лайншитом
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link
                        href={`${ROUTES.shop.b2bOrderByCollection}?collection=${p.collectionId ?? p.id}&brand=${encodeURIComponent(p.brandName)}`}
                      >
                        <ShoppingBag className="mr-1 h-3.5 w-3.5" /> Заказ из лукбука
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bShowroom}>
            <LayoutGrid className="mr-1 h-3.5 w-3.5" /> Виртуальный шоурум
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCatalog}>Каталог</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCreateOrder}>Создать заказ</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Каталог, заказы, матрица"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
