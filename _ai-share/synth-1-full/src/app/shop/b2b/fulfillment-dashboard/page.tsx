'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, BarChart2, RefreshCcw } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getFulfillmentDashboardCrossRoleLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

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
<<<<<<< HEAD
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
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader lead="Каналы исполнения и пополнение (ZEOS / zDirect). Ниже — связки с заказами бренда, производством и трекингом." />
      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

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
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
=======
                className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div className="flex items-center gap-3">
                  <Package className="text-text-muted h-5 w-5" />
                  <div>
                    <p className="font-medium">{c.name}</p>
<<<<<<< HEAD
                    <p className="text-xs text-slate-500">
=======
                    <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-slate-500">
=======
                className="border-border-subtle flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {r.reason} · Окно: {r.window}
                  </p>
                </div>
                <div className="text-right">
<<<<<<< HEAD
                  <p className="font-semibold text-indigo-600">+{r.suggestQty} ед.</p>
=======
                  <p className="text-accent-primary font-semibold">+{r.suggestQty} ед.</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <div className="rounded-lg bg-slate-50 p-3">
=======
            <div className="bg-bg-surface2 rounded-lg p-3">
>>>>>>> recover/cabinet-wip-from-stash
              <p className="text-2xl font-bold">94%</p>
              <p className="text-text-secondary text-xs">Конверсия заказов</p>
            </div>
<<<<<<< HEAD
            <div className="rounded-lg bg-slate-50 p-3">
=======
            <div className="bg-bg-surface2 rounded-lg p-3">
>>>>>>> recover/cabinet-wip-from-stash
              <p className="text-2xl font-bold">4.2%</p>
              <p className="text-text-secondary text-xs">Возвраты</p>
            </div>
<<<<<<< HEAD
            <div className="rounded-lg bg-slate-50 p-3">
=======
            <div className="bg-bg-surface2 rounded-lg p-3">
>>>>>>> recover/cabinet-wip-from-stash
              <p className="text-2xl font-bold">1.8 дн.</p>
              <p className="text-text-secondary text-xs">Среднее время доставки</p>
            </div>
<<<<<<< HEAD
            <div className="rounded-lg bg-slate-50 p-3">
=======
            <div className="bg-bg-surface2 rounded-lg p-3">
>>>>>>> recover/cabinet-wip-from-stash
              <p className="text-2xl font-bold">Top 15%</p>
              <p className="text-text-secondary text-xs">Бенчмарк сегмента</p>
            </div>
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
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
=======
      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analytics}
            data-testid="shop-b2b-fulfillment-dashboard-retail-link"
          >
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-fulfillment-dashboard-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bReplenishment}>Автопополнение</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Заказы B2B</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bTracking}>Трекинг</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.b2bOrders}>Исполнение (бренд)</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getFulfillmentDashboardCrossRoleLinks()}
        title="Бренд, factory и ритейл"
        className="mt-6"
      />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
