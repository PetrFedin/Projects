'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, BarChart3 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAnalyticsLinks } from '@/lib/data/entity-links';

/** Geo-Demand Heatmap: карта спроса по регионам для планирования точек и стока. */
const MOCK_REGIONS = [
  { name: 'Москва', share: 42, demand: 'Высокий' },
  { name: 'СПб', share: 18, demand: 'Высокий' },
  { name: 'Регионы', share: 28, demand: 'Средний' },
  { name: 'Онлайн', share: 12, demand: 'Растущий' },
];

export default function GeoDemandPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.analyticsBi}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <MapPin className="h-6 w-6" /> Geo-Demand Heatmap
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Карта спроса по регионам для планирования открытий новых точек и распределения стока.
          </p>
        </div>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Доля заказов по регионам
          </CardTitle>
          <CardDescription>
            При подключении к данным продаж — интерактивная тепловая карта.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
            <div className="text-center text-slate-500">
              <MapPin className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p className="text-sm font-bold">Интерактивная карта спроса</p>
              <p className="text-[11px]">Москва, СПб, регионы — тепловая карта заказов</p>
              <p className="mt-2 text-[10px] text-slate-400">
                Подключите данные продаж для отображения
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MOCK_REGIONS.map((r, i) => (
              <div key={i} className="rounded-lg border bg-white p-3 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-500">{r.name}</p>
                <p className="text-lg font-black">{r.share}%</p>
                <p className="text-[10px] text-slate-500">{r.demand}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getAnalyticsLinks()} />
    </div>
  );
}
