'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getVisibleLookbooksForPartner, type LookbookProject } from '@/lib/b2b/lookbook-projects-store';
import { BookOpen, ArrowLeft, FileText, ShoppingBag, Download, Share2, LayoutGrid } from 'lucide-react';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** Мок: текущий партнёр (байер). В проде — из сессии. */
const MOCK_PARTNER_ID = 'podium';

export default function ShopLookbooksPage() {
  const [projects, setProjects] = useState<LookbookProject[]>([]);

  const load = useCallback(() => {
    setProjects(getVisibleLookbooksForPartner(MOCK_PARTNER_ID));
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><BookOpen className="h-6 w-6" /> Лукбуки</h1>
          <p className="text-slate-500 text-sm mt-0.5">Colect: лукбуки, доступные вам по правам и до даты. Просмотр PDF с водяным знаком, заказ из лукбука.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Доступные лукбуки</CardTitle>
          <CardDescription>Коллекции как проекты: видимость до указанной даты.</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">Нет доступных лукбуков. Обратитесь к бренду для доступа.</p>
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center"><FileText className="h-6 w-6 text-slate-500" /></div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brandName} · до {new Date(p.visibleUntil).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={p.watermarkedPdfUrl ?? p.lookbookUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5 mr-1" /> Скачать лайншит (PDF)
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`${ROUTES.shop.b2bLookbookShare}?id=${p.id}`}>
                        <Share2 className="h-3.5 w-3.5 mr-1" /> Поделиться лайншитом
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`${ROUTES.shop.b2bOrderByCollection}?collection=${p.collectionId ?? p.id}&brand=${encodeURIComponent(p.brandName)}`}>
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Заказ из лукбука
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
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bShowroom}><LayoutGrid className="h-3.5 w-3.5 mr-1" /> Виртуальный шоурум</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCatalog}>Каталог</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCreateOrder}>Создать заказ</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Каталог, заказы, матрица" className="mt-6" />
    </div>
  );
}
