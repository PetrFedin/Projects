'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getVisibleLookbooksForPartner } from '@/lib/b2b/lookbook-projects-store';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

const MOCK_PARTNER_ID = 'podium';

export default function B2BOrderByCollectionPage() {
  const projects = getVisibleLookbooksForPartner(MOCK_PARTNER_ID);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <BookOpen className="h-6 w-6" /> Заказ по коллекции
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            JOOR/Colect: выберите коллекцию или лукбук — затем оформите заказ из каталога коллекции.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Коллекции и лукбуки</CardTitle>
          <CardDescription>
            Доступные вам коллекции. Заказ из лукбука в виртуальном шоуруме.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">
              Нет доступных коллекций. Обратитесь к бренду для доступа.
            </p>
          ) : (
            projects.slice(0, 12).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-100/50"
              >
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.brandName} · {p.season ?? '—'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-[10px] font-black uppercase"
                  asChild
                >
                  <Link href={`${ROUTES.shop.b2bShowroom}?project=${encodeURIComponent(p.id)}`}>
                    Заказать <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-3">
        <Button
          asChild
          variant="default"
          className="rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Link href={ROUTES.shop.b2bShowroom}>Виртуальный шоурум</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Link href={ROUTES.shop.b2bLookbooks}>Мои лукбуки</Link>
        </Button>
      </div>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bShowroom, ROUTES.shop.b2bLookbooks, ROUTES.shop.b2bCreateOrder].includes(
            l.href as string
          )
        )}
      />
    </div>
  );
}
