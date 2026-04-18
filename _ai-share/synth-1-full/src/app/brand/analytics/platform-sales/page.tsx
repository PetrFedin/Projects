'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
<<<<<<< HEAD
import {
  BarChart3,
  Store,
  Tag,
  Download,
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Package,
} from 'lucide-react';
=======
import { Store, Tag, ArrowLeft } from 'lucide-react';
>>>>>>> recover/cabinet-wip-from-stash
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { cn } from '@/lib/utils';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

/** Полная статистика продаж в Маркетруме и Аутлете платформы. */
const MOCK_MARKETROOM = {
  revenue: '380 000 ₽',
  revenueChange: 12.4,
  orders: 156,
  ordersChange: 8,
  units: 412,
  avgCheck: '2 436 ₽',
  topProducts: [
    { name: 'Куртка CTP-26-001', revenue: '48 200 ₽', units: 18 },
    { name: 'Брюки CTP-26-012', revenue: '42 100 ₽', units: 22 },
    { name: 'Свитшот CTP-26-005', revenue: '38 900 ₽', units: 28 },
  ],
};

const MOCK_OUTLET = {
  revenue: '120 000 ₽',
  revenueChange: -5.2,
  orders: 89,
  ordersChange: 2,
  units: 198,
  avgCheck: '1 348 ₽',
  topProducts: [
    { name: 'SS25 Остатки — Свитшот', revenue: '22 400 ₽', units: 32 },
    { name: 'SS25 Остатки — Брюки', revenue: '18 900 ₽', units: 21 },
    { name: 'Аксессуары уценка', revenue: '15 200 ₽', units: 44 },
  ],
};

export default function PlatformSalesPage() {
  const [period, setPeriod] = useState('30d');

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.analyticsBi}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <BarChart3 className="h-6 w-6" /> Статистика: Маркетрум и Аутлет
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Полная статистика продаж на платформе — выручка, заказы, единицы, топ товаров по каналу.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">За 7 дней</SelectItem>
            <SelectItem value="30d">За 30 дней</SelectItem>
            <SelectItem value="90d">За 90 дней</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-indigo-100">
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Статистика: Маркетрум и Аутлет"
        leadPlain="Полная статистика продаж на платформе — выручка, заказы, единицы, топ товаров по каналу."
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.analyticsBi} aria-label="Назад к BI">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">За 7 дней</SelectItem>
              <SelectItem value="30d">За 30 дней</SelectItem>
              <SelectItem value="90d">За 90 дней</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-accent-primary/20">
>>>>>>> recover/cabinet-wip-from-stash
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
<<<<<<< HEAD
                  <Store className="h-5 w-5 text-indigo-600" /> Маркетрум
=======
                  <Store className="text-accent-primary h-5 w-5" /> Маркетрум
>>>>>>> recover/cabinet-wip-from-stash
                </CardTitle>
                <CardDescription>
                  Продажи в маркетруме платформы (полная цена, новые коллекции)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.marketroom}>Открыть Маркетрум</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">Выручка</p>
                <p className="text-xl font-black text-indigo-700">{MOCK_MARKETROOM.revenue}</p>
=======
                <p className="text-text-secondary text-xs">Выручка</p>
                <p className="text-accent-primary text-xl font-black">{MOCK_MARKETROOM.revenue}</p>
>>>>>>> recover/cabinet-wip-from-stash
                <p
                  className={cn(
                    'text-xs font-medium',
                    MOCK_MARKETROOM.revenueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  )}
                >
                  {MOCK_MARKETROOM.revenueChange >= 0 ? '+' : ''}
                  {MOCK_MARKETROOM.revenueChange}% к пред. периоду
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Заказы</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.orders}</p>
                <p className="text-text-secondary text-xs">
                  +{MOCK_MARKETROOM.ordersChange} заказов
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Единиц</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.units}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Средний чек</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.avgCheck}</p>
              </div>
            </div>
            <div>
<<<<<<< HEAD
              <p className="mb-2 text-xs font-medium text-slate-600">Топ товаров (Маркетрум)</p>
=======
              <p className="text-text-secondary mb-2 text-xs font-medium">
                Топ товаров (Маркетрум)
              </p>
>>>>>>> recover/cabinet-wip-from-stash
              <ul className="space-y-2">
                {MOCK_MARKETROOM.topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="shrink-0 font-semibold">
                      {p.revenue} · {p.units} шт
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-5 w-5 text-amber-600" /> Аутлет
            </CardTitle>
            <CardDescription>Уценённые позиции, ликвидация остатков на платформе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary text-xs">Выручка</p>
                <p className="text-xl font-black text-amber-700">{MOCK_OUTLET.revenue}</p>
                <p
                  className={cn(
                    'text-xs font-medium',
                    MOCK_OUTLET.revenueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  )}
                >
                  {MOCK_OUTLET.revenueChange >= 0 ? '+' : ''}
                  {MOCK_OUTLET.revenueChange}% к пред. периоду
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Заказы</p>
                <p className="text-xl font-black">{MOCK_OUTLET.orders}</p>
                <p className="text-text-secondary text-xs">+{MOCK_OUTLET.ordersChange} заказов</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Единиц</p>
                <p className="text-xl font-black">{MOCK_OUTLET.units}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Средний чек</p>
                <p className="text-xl font-black">{MOCK_OUTLET.avgCheck}</p>
              </div>
            </div>
            <div>
<<<<<<< HEAD
              <p className="mb-2 text-xs font-medium text-slate-600">Топ товаров (Аутлет)</p>
=======
              <p className="text-text-secondary mb-2 text-xs font-medium">Топ товаров (Аутлет)</p>
>>>>>>> recover/cabinet-wip-from-stash
              <ul className="space-y-2">
                {MOCK_OUTLET.topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="shrink-0 font-semibold">
                      {p.revenue} · {p.units} шт
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Сводка по платформе</CardTitle>
          <CardDescription>Общая выручка Маркетрум + Аутлет за выбранный период</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <Store className="h-6 w-6 text-indigo-600" />
=======
              <div className="bg-accent-primary/15 flex h-12 w-12 items-center justify-center rounded-xl">
                <Store className="text-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div>
                <p className="text-text-secondary text-xs">Маркетрум</p>
                <p className="text-lg font-black">{MOCK_MARKETROOM.revenue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Tag className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-text-secondary text-xs">Аутлет</p>
                <p className="text-lg font-black">{MOCK_OUTLET.revenue}</p>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <p className="text-xs text-slate-500">Итого платформа</p>
              <p className="text-xl font-black text-indigo-700">500 000 ₽</p>
=======
            <div className="border-border-default flex items-center gap-3 border-l pl-4">
              <p className="text-text-secondary text-xs">Итого платформа</p>
              <p className="text-accent-primary text-xl font-black">500 000 ₽</p>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.marketroom}>Маркетрум (каталог)</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.analyticsUnified}>Сводная аналитика</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.analyticsExternalSales}>Внешние продажи</Link>
        </Button>
      </div>
      <RelatedModulesBlock links={getAnalyticsLinks()} title="BI, 360°, внешние продажи" />
    </RegistryPageShell>
  );
}
