'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

/** ASOS: маржа и отчётность по брендам/категориям для ритейла (B2B заказы). */
const MOCK_BY_BRAND = [
  { brand: 'Syntha Lab', revenue: 2450000, cost: 1420000, margin: 42, turnover: 2.8 },
  { brand: 'Nordic Wool', revenue: 1800000, cost: 1080000, margin: 40, turnover: 2.4 },
];
const MOCK_BY_CATEGORY = [
  { category: 'Верхняя одежда', revenue: 2100000, margin: 44 },
  { category: 'Трикотаж', revenue: 1580000, margin: 39 },
  { category: 'Брюки', revenue: 1490000, margin: 41 },
];

export default function MarginReportPage() {
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
            <DollarSign className="h-6 w-6" /> Маржа по брендам
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            ASOS: маржа и оборачиваемость по брендам/категориям для ритейла.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader lead="Маржа и оборачиваемость по брендам и категориям для ритейла (ASOS-style)." />
      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>По брендам</CardTitle>
          <CardDescription>Выручка, себестоимость, маржа %, оборачиваемость</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_BY_BRAND.map((r) => (
              <li
                key={r.brand}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <div>
                  <p className="font-medium">{r.brand}</p>
                  <p className="text-xs text-slate-500">
=======
                className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{r.brand}</p>
                  <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {r.revenue.toLocaleString('ru-RU')} ₽ выручка · себестоимость{' '}
                    {r.cost.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{r.margin}% маржа</p>
                  <p className="text-text-secondary text-xs">{r.turnover} оборота</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>По категориям</CardTitle>
          <CardDescription>Выручка и маржа по категориям</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_BY_CATEGORY.map((c) => (
              <li
                key={c.category}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
=======
                className="border-border-subtle flex items-center justify-between rounded-lg border p-3"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <span className="font-medium">{c.category}</span>
                <div className="text-right">
                  <span className="font-semibold">{c.revenue.toLocaleString('ru-RU')} ₽</span>
                  <span className="ml-2 text-emerald-600">{c.margin}%</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bMarginAnalysis}>Анализ маржи</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Заказы</Link>
        </Button>
      </div>
=======
      <div className="border-border-subtle mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-margin-report-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-margin-report-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Заказы</Link>
        </Button>
      </div>
>>>>>>> recover/cabinet-wip-from-stash
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, аналитика заказов, fulfillment"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
