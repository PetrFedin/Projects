'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/stat-card';
import { DistributorSalesChart, RecentB2BOrders } from '@/components/distributor';
import {
  TrendingUp,
  MapPin,
  Handshake,
  DollarSign,
  BarChart3,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

type Period = 'week' | 'month' | 'year';

const periodStats: Record<
  Period,
  { revenue: string; revenueChange: string; avgOrder: string; topRegion: string; retailers: string }
> = {
  week: {
    revenue: '3,500,000 ₽',
    revenueChange: '+7.1% к прошлой неделе',
    avgOrder: '41,176 ₽',
    topRegion: 'Москва — 42%',
    retailers: '28 активных',
  },
  month: {
    revenue: '15,200,000 ₽',
    revenueChange: '+15% к прошлому месяцу',
    avgOrder: '36,893 ₽',
    topRegion: 'Москва — 38%',
    retailers: '128 активных',
  },
  year: {
    revenue: '180,500,000 ₽',
    revenueChange: '+60% к прошлому году',
    avgOrder: '37,216 ₽',
    topRegion: 'ЦФО — 45%',
    retailers: '128 в сети',
  },
};

const topRegions = [
  { name: 'Москва', share: 38, revenue: '5,776,000 ₽', growth: '+12%' },
  { name: 'Санкт-Петербург', share: 22, revenue: '3,344,000 ₽', growth: '+8%' },
  { name: 'Краснодар', share: 11, revenue: '1,672,000 ₽', growth: '+18%' },
  { name: 'Екатеринбург', share: 9, revenue: '1,368,000 ₽', growth: '+5%' },
  { name: 'Казань', share: 6, revenue: '912,000 ₽', growth: '+22%' },
];

const topRetailersByVolume = [
  { name: 'ЦУМ', volume: '2,400,000 ₽', orders: 14 },
  { name: 'Podium', volume: '1,850,000 ₽', orders: 22 },
  { name: 'KM20', volume: '1,500,000 ₽', orders: 8 },
  { name: 'Leform', volume: '980,000 ₽', orders: 12 },
  { name: 'Boutique No.7', volume: '720,000 ₽', orders: 9 },
];

export default function DistributorAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const stats = periodStats[period];

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
            <TrendingUp className="h-6 w-6 text-indigo-600" /> Аналитика дистрибуции
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Региональный спрос, топ ритейлеров, динамика заказов и выручки.
          </p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="bg-slate-100/80">
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Выручка (B2B)"
          value={stats.revenue}
          description={stats.revenueChange}
          icon={DollarSign}
        />
        <StatCard
          title="Средний чек заказа"
          value={stats.avgOrder}
          description="по выбранному периоду"
          icon={ShoppingCart}
        />
        <StatCard
          title="Топ регион"
          value={stats.topRegion}
          description="доля от выручки"
          icon={MapPin}
        />
        <StatCard
          title="Активных ритейлеров"
          value={stats.retailers}
          description="с заказами в периоде"
          icon={Handshake}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DistributorSalesChart />
        </div>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-indigo-600" /> Топ ритейлеров по объёму
            </CardTitle>
            <CardDescription>За выбранный период</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRetailersByVolume.map((r, i) => (
              <div
                key={r.name}
                className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-[10px] font-bold text-slate-400">{i + 1}</span>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{r.volume}</p>
                  <p className="text-[10px] text-slate-500">{r.orders} заказов</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-600" /> Выручка по регионам
            </CardTitle>
            <CardDescription>Доля и рост к прошлому периоду</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topRegions.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${r.share}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums">{r.revenue}</p>
                    <p className="text-[10px] font-medium text-emerald-600">{r.growth}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm">Недавние заказы</CardTitle>
              <CardDescription>Последние B2B-заказы от ритейлеров</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[10px]" asChild>
              <Link href="/distributor/orders" className="gap-1">
                Все заказы <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentB2BOrders />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/distributor">Обзор</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/distributor/orders">Заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/distributor/retailers">Ритейлеры</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/distributor/commissions">Комиссии</Link>
        </Button>
      </div>
    </div>
  );
}
