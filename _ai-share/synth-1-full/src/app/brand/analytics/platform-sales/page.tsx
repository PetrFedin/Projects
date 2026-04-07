'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Store, Tag, Download, ArrowLeft, TrendingUp, ShoppingCart, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAnalyticsLinks } from '@/lib/data/entity-links';
import { cn } from '@/lib/utils';

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
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.analyticsBi}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> Статистика: Маркетрум и Аутлет
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Полная статистика продаж на платформе — выручка, заказы, единицы, топ товаров по каналу.</p>
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

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-indigo-100">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2"><Store className="h-5 w-5 text-indigo-600" /> Маркетрум</CardTitle>
                <CardDescription>Продажи в маркетруме платформы (полная цена, новые коллекции)</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild><Link href={ROUTES.marketroom}>Открыть Маркетрум</Link></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Выручка</p>
                <p className="text-xl font-black text-indigo-700">{MOCK_MARKETROOM.revenue}</p>
                <p className={cn("text-xs font-medium", MOCK_MARKETROOM.revenueChange >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {MOCK_MARKETROOM.revenueChange >= 0 ? '+' : ''}{MOCK_MARKETROOM.revenueChange}% к пред. периоду
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Заказы</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.orders}</p>
                <p className="text-xs text-slate-500">+{MOCK_MARKETROOM.ordersChange} заказов</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Единиц</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.units}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Средний чек</p>
                <p className="text-xl font-black">{MOCK_MARKETROOM.avgCheck}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Топ товаров (Маркетрум)</p>
              <ul className="space-y-2">
                {MOCK_MARKETROOM.topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="font-semibold shrink-0">{p.revenue} · {p.units} шт</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Tag className="h-5 w-5 text-amber-600" /> Аутлет</CardTitle>
            <CardDescription>Уценённые позиции, ликвидация остатков на платформе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Выручка</p>
                <p className="text-xl font-black text-amber-700">{MOCK_OUTLET.revenue}</p>
                <p className={cn("text-xs font-medium", MOCK_OUTLET.revenueChange >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {MOCK_OUTLET.revenueChange >= 0 ? '+' : ''}{MOCK_OUTLET.revenueChange}% к пред. периоду
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Заказы</p>
                <p className="text-xl font-black">{MOCK_OUTLET.orders}</p>
                <p className="text-xs text-slate-500">+{MOCK_OUTLET.ordersChange} заказов</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Единиц</p>
                <p className="text-xl font-black">{MOCK_OUTLET.units}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Средний чек</p>
                <p className="text-xl font-black">{MOCK_OUTLET.avgCheck}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Топ товаров (Аутлет)</p>
              <ul className="space-y-2">
                {MOCK_OUTLET.topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="font-semibold shrink-0">{p.revenue} · {p.units} шт</span>
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
              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center"><Store className="h-6 w-6 text-indigo-600" /></div>
              <div>
                <p className="text-xs text-slate-500">Маркетрум</p>
                <p className="text-lg font-black">{MOCK_MARKETROOM.revenue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center"><Tag className="h-6 w-6 text-amber-600" /></div>
              <div>
                <p className="text-xs text-slate-500">Аутлет</p>
                <p className="text-lg font-black">{MOCK_OUTLET.revenue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <p className="text-xs text-slate-500">Итого платформа</p>
              <p className="text-xl font-black text-indigo-700">500 000 ₽</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.marketroom}>Маркетрум (каталог)</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsUnified}>Сводная аналитика</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.analyticsExternalSales}>Внешние продажи</Link></Button>
      </div>
      <RelatedModulesBlock links={getAnalyticsLinks()} title="BI, 360°, внешние продажи" />
    </div>
  );
}
