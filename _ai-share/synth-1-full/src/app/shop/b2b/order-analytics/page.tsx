'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** NuOrder: аналитика по заказам — топ стилей, тренды по категориям, сравнение с прошлым сезоном. */
const MOCK_TOP_STYLES = [
  {
    sku: 'CTP-26-001',
    name: 'Graphene Parka',
    category: 'Верхняя одежда',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    units: 420,
    change: '+18%',
  },
  {
    sku: 'CTP-26-002',
    name: 'Merino Sweater',
    category: 'Трикотаж',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    units: 380,
    change: '+5%',
  },
  {
    sku: 'CTP-26-003',
    name: 'Tech Trousers',
    category: 'Брюки',
<<<<<<< HEAD
    brand: 'Syntha',
=======
    brand: 'Syntha Lab',
>>>>>>> recover/cabinet-wip-from-stash
    units: 290,
    change: '-2%',
  },
  {
<<<<<<< HEAD
    sku: 'APC-DJ-01',
    name: 'Classic Denim',
    category: 'Деним',
    brand: 'A.P.C.',
    units: 210,
    change: '+12%',
  },
  {
    sku: 'ACNE-BAG-1',
    name: 'Scarf Wool',
    category: 'Аксессуары',
    brand: 'Acne Studios',
=======
    sku: 'NW-K001-BLK',
    name: 'Кашемировый лонгслив',
    category: 'Трикотаж',
    brand: 'Nordic Wool',
    units: 310,
    change: '+12%',
  },
  {
    sku: 'NW-SCF-02',
    name: 'Шерстяной платок',
    category: 'Аксессуары',
    brand: 'Nordic Wool',
>>>>>>> recover/cabinet-wip-from-stash
    units: 180,
    change: '-5%',
  },
];
const MOCK_TRENDS = [
  { category: 'Верхняя одежда', thisSeason: 1200, lastSeason: 980, change: '+22%' },
  { category: 'Трикотаж', thisSeason: 890, lastSeason: 910, change: '-2%' },
  { category: 'Брюки', thisSeason: 650, lastSeason: 520, change: '+25%' },
];
/** Заказы по месяцам (NuOrder-style дашборд) */
const MOCK_ORDERS_BY_MONTH = [
  { month: 'Сен 25', orders: 8, amount: 2.1 },
  { month: 'Окт 25', orders: 12, amount: 3.4 },
  { month: 'Ноя 25', orders: 10, amount: 2.8 },
  { month: 'Дек 25', orders: 15, amount: 4.2 },
  { month: 'Янв 26', orders: 11, amount: 3.1 },
  { month: 'Фев 26', orders: 14, amount: 3.9 },
  { month: 'Мар 26', orders: 9, amount: 2.5 },
];
const BRANDS = ['Все бренды', 'Syntha Lab', 'Nordic Wool'];

export default function OrderAnalyticsPage() {
  const [brandFilter, setBrandFilter] = useState('Все бренды');
  const maxOrders = Math.max(...MOCK_ORDERS_BY_MONTH.map((m) => m.orders));
  const filteredStyles =
    brandFilter === 'Все бренды'
      ? MOCK_TOP_STYLES
      : MOCK_TOP_STYLES.filter((s) => s.brand === brandFilter);

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
            <BarChart2 className="h-6 w-6" /> Аналитика по заказам
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            NuOrder: топ стилей, тренды по категориям, заказы по месяцам.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Бренд</label>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader
        lead="NuOrder: топ стилей, тренды по категориям, заказы по месяцам."
        trailing={
          <div>
            <label className="text-text-secondary mb-1 block text-xs">Бренд</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="border-border-default rounded-lg border px-3 py-2 text-sm"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Заказы по месяцам</CardTitle>
          <CardDescription>
            Количество заказов и сумма (млн ₽) — тренд для планирования
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-end gap-2">
            {MOCK_ORDERS_BY_MONTH.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="flex h-24 w-full flex-col justify-end"
                  title={`${m.orders} заказов, ${m.amount} млн ₽`}
                >
                  <div
<<<<<<< HEAD
                    className="rounded-t bg-indigo-500 text-center text-[10px] text-white"
=======
                    className="bg-accent-primary rounded-t text-center text-[10px] text-white"
>>>>>>> recover/cabinet-wip-from-stash
                    style={{
                      height: `${(m.orders / maxOrders) * 100}%`,
                      minHeight: m.orders ? '8px' : 0,
                    }}
                  >
                    {m.orders}
                  </div>
                </div>
                <span className="text-text-secondary text-[10px] font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Топ стилей (текущий сезон)</CardTitle>
          <CardDescription>
            По объёму заказов {brandFilter !== 'Все бренды' ? `· ${brandFilter}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {filteredStyles.map((s, i) => (
              <li
                key={s.sku}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono text-slate-400">{i + 1}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">
=======
                className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-muted w-6 font-mono">{i + 1}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                      {s.sku} · {s.category} · {s.brand}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{s.units} ед.</p>
                  <p
<<<<<<< HEAD
                    className={`text-xs ${s.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}
=======
                    className={`text-xs ${s.change.startsWith('+') ? 'text-emerald-600' : 'text-text-secondary'}`}
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    {s.change} к прошлому сезону
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Тренды по категориям</CardTitle>
          <CardDescription>Сравнение с прошлым сезоном</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_TRENDS.map((t) => (
              <li
                key={t.category}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <span className="font-medium">{t.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
=======
                className="border-border-subtle flex items-center justify-between rounded-lg border p-3"
              >
                <span className="font-medium">{t.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
                    {t.lastSeason} → {t.thisSeason} ед.
                  </span>
                  <span
                    className={
<<<<<<< HEAD
                      t.change.startsWith('+') ? 'font-medium text-emerald-600' : 'text-slate-500'
=======
                      t.change.startsWith('+')
                        ? 'font-medium text-emerald-600'
                        : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                    }
                  >
                    {t.change}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bAnalytics}>B2B Аналитика</Link>
        </Button>
      </div>
=======
      <div className="border-border-subtle mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-order-analytics-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-order-analytics-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bAnalytics}>Аналитика закупок (B2B)</Link>
        </Button>
      </div>
>>>>>>> recover/cabinet-wip-from-stash
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, матрица, маржа, fulfillment"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
