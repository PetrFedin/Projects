'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeft, Package, BarChart2, RefreshCcw } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** Zalando ZEOS: единый фулфилмент по каналам, Replenishment Engine, портал аналитики (zDirect-style). */
const MOCK_CHANNELS = [
  { id: 'zeos', name: 'ZEOS', orders: 1240, units: 18200, share: 62 },
  { id: 'own', name: 'Свой склад', orders: 580, units: 7200, share: 28 },
  { id: 'marketplace', name: 'Маркетплейс', orders: 190, units: 2100, share: 10 },
];
const MOCK_REPLENISH = [
  {
    sku: 'CTP-26-001',
    name: 'Graphene Parka',
    suggestQty: 80,
    window: 'Drop 2',
    reason: 'Продажи +45%',
  },
  {
    sku: 'CTP-26-002',
    name: 'Merino Sweater',
    suggestQty: 120,
    window: 'Drop 2',
    reason: 'Низкий остаток',
  },
];

export default function FulfillmentDashboardPage() {
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
            <Truck className="h-6 w-6" /> Fulfillment Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Zalando ZEOS: один склад/интеграция для маркетплейса и B2B, объёмы, конверсия.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Каналы исполнения</CardTitle>
          <CardDescription>Объёмы по fulfillmentChannel (zeos / own / marketplace)</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_CHANNELS.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      {c.orders} заказов · {c.units.toLocaleString('ru-RU')} ед.
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{c.share}%</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5" /> Replenishment Engine (AI)
          </CardTitle>
          <CardDescription>
            Рекомендации: что докупить, в каком объёме, по каким окнам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_REPLENISH.map((r) => (
              <li
                key={r.sku}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    {r.reason} · Окно: {r.window}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">+{r.suggestQty} ед.</p>
                  <Button variant="outline" size="sm" className="mt-1">
                    В заказ
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" /> Портал аналитики (zDirect-style)
          </CardTitle>
          <CardDescription>Конверсия, возвраты, бенчмарки по сегменту</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-slate-500">Конверсия заказов</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-bold">4.2%</p>
              <p className="text-xs text-slate-500">Возвраты</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-bold">1.8 дн.</p>
              <p className="text-xs text-slate-500">Среднее время доставки</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-bold">Top 15%</p>
              <p className="text-xs text-slate-500">Бенчмарк сегмента</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bReplenishment}>Автопополнение</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Заказы</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, аналитика, маржа"
        className="mt-6"
      />
    </div>
  );
}
