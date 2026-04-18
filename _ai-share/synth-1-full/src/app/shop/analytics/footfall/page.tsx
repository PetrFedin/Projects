'use client';

<<<<<<< HEAD
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RegistryPageShell } from '@/components/design-system';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Users,
  Map,
  Clock,
  TrendingUp,
  ChevronRight,
  Zap,
<<<<<<< HEAD
  Calendar as CalendarIcon,
  BarChart3,
=======
>>>>>>> recover/cabinet-wip-from-stash
  Activity,
  Eye,
  Camera,
  Layers,
  MousePointer2,
} from 'lucide-react';
import {
  MOCK_FOOTFALL_STATS,
  MOCK_HOURLY_TRAFFIC,
  MOCK_ZONE_TRAFFIC,
} from '@/lib/logic/footfall-utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
<<<<<<< HEAD
  BarChart,
  Bar,
  Cell,
=======
>>>>>>> recover/cabinet-wip-from-stash
} from 'recharts';

export default function FootfallAnalysisPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Link href="/shop" className="transition-colors hover:text-indigo-600">
=======
    <RegistryPageShell className="max-w-6xl space-y-6 duration-700 animate-in fade-in">
      <ShopAnalyticsSegmentErpStrip />
      <header className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="text-text-muted flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
            <Link href={ROUTES.shop.home} className="hover:text-accent-primary transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
              Магазин
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-primary">AI Footfall Analytics</span>
          </div>
<<<<<<< HEAD
          <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900">
            Анализ Трафика & Heatmaps
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
=======
          <h1 className="text-text-primary text-sm font-bold uppercase tracking-tight">
            Анализ Трафика & Heatmaps
          </h1>
          <p className="text-text-secondary text-[13px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Интеллектуальный мониторинг поведения покупателей в торговом зале.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="flex h-8 items-center gap-2 rounded-lg border-none bg-emerald-50 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 shadow-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live: 42
            Visitors
          </Badge>
<<<<<<< HEAD
          <Button className="h-8 rounded-lg bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-indigo-600">
=======
          <Button className="bg-text-primary hover:bg-accent-primary h-8 rounded-lg px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all">
>>>>>>> recover/cabinet-wip-from-stash
            Экспорт Отчета
          </Button>
        </div>
      </header>

      {/* High Level Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Всего визитов',
            value: MOCK_FOOTFALL_STATS.totalVisits,
            sub: '+12.4%',
            trend: 'up',
            icon: Users,
<<<<<<< HEAD
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
=======
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
          },
          {
            label: 'Среднее время',
            value: `${MOCK_FOOTFALL_STATS.avgDwellTime} мин`,
            sub: '+2.1 мин',
            trend: 'up',
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Пик активности',
            value: MOCK_FOOTFALL_STATS.peakHour,
            sub: '18:00',
            trend: 'up',
            icon: Zap,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
          },
          {
            label: 'Конверсия зала',
            value: `${MOCK_FOOTFALL_STATS.conversionToSale}%`,
            sub: '-0.5%',
            trend: 'down',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
        ].map((stat, i) => (
          <Card
            key={i}
<<<<<<< HEAD
            className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200"
=======
            className="border-border-subtle hover:border-accent-primary/30 group rounded-xl border bg-white p-4 shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
<<<<<<< HEAD
                  'flex h-10 w-10 items-center justify-center rounded-lg border border-slate-50 shadow-sm transition-transform group-hover:scale-105',
=======
                  'border-border-subtle flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-transform group-hover:scale-105',
>>>>>>> recover/cabinet-wip-from-stash
                  stat.bg,
                  stat.color
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
<<<<<<< HEAD
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <h4 className="text-base font-bold tracking-tight text-slate-900">{stat.value}</h4>
=======
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <h4 className="text-text-primary text-base font-bold tracking-tight">
                  {stat.value}
                </h4>
>>>>>>> recover/cabinet-wip-from-stash
                <p
                  className={cn(
                    'mt-0.5 inline-block rounded px-1 text-[9px] font-bold',
                    stat.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  )}
                >
                  {stat.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Main Heatmap Visualization (Mock) */}
        <div className="space-y-6 lg:col-span-2">
<<<<<<< HEAD
          <Card className="group/card relative flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200">
            <div className="absolute right-0 top-0 p-4 opacity-[0.03] transition-opacity duration-700 group-hover/card:opacity-[0.05]">
              <Map className="h-48 w-48" />
            </div>
            <CardHeader className="relative z-10 border-b border-slate-50 bg-slate-50/30 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    Карта Популярности
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium text-slate-400">
                    Визуализация трафика по зонам магазина.
                  </CardDescription>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 shadow-inner">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-md bg-white px-3 text-[10px] font-bold uppercase text-indigo-600 shadow-sm hover:bg-white"
=======
          <Card className="border-border-subtle group/card hover:border-accent-primary/30 relative flex min-h-[500px] flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-[0.03] transition-opacity duration-700 group-hover/card:opacity-[0.05]">
              <Map className="h-48 w-48" />
            </div>
            <CardHeader className="border-border-subtle bg-bg-surface2/30 relative z-10 border-b p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-text-primary text-sm font-bold uppercase tracking-wider">
                    Карта Популярности
                  </CardTitle>
                  <CardDescription className="text-text-muted text-[11px] font-medium">
                    Визуализация трафика по зонам магазина.
                  </CardDescription>
                </div>
                <div className="bg-bg-surface2 border-border-default flex rounded-lg border p-1 shadow-inner">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent-primary h-7 rounded-md bg-white px-3 text-[10px] font-bold uppercase shadow-sm hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Heatmap
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
<<<<<<< HEAD
                    className="h-7 rounded-md px-3 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/50 hover:text-slate-600"
=======
                    className="text-text-muted hover:text-text-secondary h-7 rounded-md px-3 text-[10px] font-bold uppercase hover:bg-white/50"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Zones
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 p-4">
              {/* Heatmap Placeholder */}
<<<<<<< HEAD
              <div className="group relative flex h-full min-h-[350px] w-full cursor-crosshair items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
=======
              <div className="bg-bg-surface2 border-border-default group relative flex h-full min-h-[350px] w-full cursor-crosshair items-center justify-center overflow-hidden rounded-xl border shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm grayscale"
                  alt="Store Layout"
                />
                {/* Simulated Heatmap Overlay */}
<<<<<<< HEAD
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-transparent" />

                {/* Hotspots */}
                <div className="absolute left-1/3 top-1/4 h-32 w-32 animate-pulse rounded-full bg-rose-500/30 blur-[40px]" />
                <div className="absolute bottom-1/3 right-1/4 h-40 w-40 animate-pulse rounded-full bg-indigo-500/20 blur-[60px] delay-700" />
=======
                <div className="from-accent-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-rose-500/5 to-transparent" />

                {/* Hotspots */}
                <div className="absolute left-1/3 top-1/4 h-32 w-32 animate-pulse rounded-full bg-rose-500/30 blur-[40px]" />
                <div className="bg-accent-primary/20 absolute bottom-1/3 right-1/4 h-40 w-40 animate-pulse rounded-full blur-[60px] delay-700" />
>>>>>>> recover/cabinet-wip-from-stash
                <div className="absolute right-1/2 top-1/2 h-24 w-24 animate-pulse rounded-full bg-amber-500/10 blur-[30px] delay-300" />

                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white bg-white/80 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
<<<<<<< HEAD
                    <MousePointer2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                      Interactive View
                    </p>
                    <p className="text-sm font-bold tracking-tight text-slate-900">
=======
                    <MousePointer2 className="text-accent-primary h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-accent-primary text-[10px] font-bold uppercase tracking-widest">
                      Interactive View
                    </p>
                    <p className="text-text-primary text-sm font-bold tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      Нажмите для анализа зоны
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white bg-white/90 p-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
<<<<<<< HEAD
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
=======
                      <span className="text-text-secondary text-[9px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        High
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
=======
                      <div className="bg-accent-primary h-2 w-2 rounded-full" />
                      <span className="text-text-secondary text-[9px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        Medium
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
=======
                      <div className="bg-border-default h-2 w-2 rounded-full" />
                      <span className="text-text-secondary text-[9px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        Low
                      </span>
                    </div>
                  </div>
                  <div className="text-text-muted flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase tabular-nums tracking-wider">
                      7 Active Nodes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Traffic Chart */}
<<<<<<< HEAD
          <Card className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Почасовой Трафик
                </h4>
                <p className="text-[11px] font-medium text-slate-400">
=======
          <Card className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-text-primary text-sm font-bold uppercase tracking-wider">
                  Почасовой Трафик
                </h4>
                <p className="text-text-muted text-[11px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                  Сравнение текущей и предыдущей недели.
                </p>
              </div>
              <div className="flex items-center gap-3">
<<<<<<< HEAD
                <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600">
                    Сегодня
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
=======
                <div className="bg-accent-primary/10 flex items-center gap-1.5 rounded-md px-2 py-1">
                  <div className="bg-accent-primary h-1.5 w-1.5 rounded-full" />
                  <span className="text-accent-primary text-[9px] font-bold uppercase tracking-wider">
                    Сегодня
                  </span>
                </div>
                <div className="bg-bg-surface2 flex items-center gap-1.5 rounded-md px-2 py-1">
                  <div className="bg-border-default h-1.5 w-1.5 rounded-full" />
                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                    Прошл. Неделя
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HOURLY_TRAFFIC}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '10px',
                    }}
                    itemStyle={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                  <Area
                    type="monotone"
                    dataKey="prevCount"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Zone Insights */}
        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Эффективность Зон
              </CardTitle>
              <CardDescription className="text-[11px] font-medium leading-relaxed text-slate-400">
=======
          <Card className="border-border-subtle hover:border-accent-primary/30 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
              <CardTitle className="text-text-primary text-sm font-bold uppercase tracking-wider">
                Эффективность Зон
              </CardTitle>
              <CardDescription className="text-text-muted text-[11px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                Метрики вовлеченности по отделам.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-4">
              {MOCK_ZONE_TRAFFIC.map((zone) => (
                <div key={zone.id} className="group cursor-pointer">
                  <div className="mb-2 flex items-end justify-between">
                    <div className="space-y-0.5">
<<<<<<< HEAD
                      <p className="text-[11px] font-bold uppercase text-slate-900 transition-colors group-hover:text-indigo-600">
                        {zone.name}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
=======
                      <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase transition-colors">
                        {zone.name}
                      </p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        {zone.dwellTime} мин • {zone.count} визитов
                      </p>
                    </div>
                    <div className="text-right">
<<<<<<< HEAD
                      <p className="text-[12px] font-bold text-slate-900">{zone.conversionRate}%</p>
                      <p className="text-[8px] font-bold uppercase text-slate-400">Conv.</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
=======
                      <p className="text-text-primary text-[12px] font-bold">
                        {zone.conversionRate}%
                      </p>
                      <p className="text-text-muted text-[8px] font-bold uppercase">Conv.</p>
                    </div>
                  </div>
                  <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                    <div
                      className={cn(
                        'h-full transition-all duration-1000 group-hover:opacity-80',
                        zone.conversionRate > 50
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : zone.conversionRate > 20
<<<<<<< HEAD
                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]'
=======
                            ? 'bg-accent-primary shadow-[0_0_8px_rgba(79,70,229,0.4)]'
>>>>>>> recover/cabinet-wip-from-stash
                            : 'bg-amber-500'
                      )}
                      style={{ width: `${zone.conversionRate}%` }}
                    />
                  </div>
                </div>
              ))}

<<<<<<< HEAD
              <div className="border-t border-slate-50 pt-4">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3.5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-indigo-600" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                      AI Insight
                    </p>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed text-indigo-900/70">
                    Зона <span className="font-bold text-indigo-900">"Аксессуары"</span> имеет
=======
              <div className="border-border-subtle border-t pt-4">
                <div className="bg-accent-primary/10 border-accent-primary/20 rounded-xl border p-3.5 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Layers className="text-accent-primary h-3.5 w-3.5" />
                    <p className="text-accent-primary text-[10px] font-bold uppercase tracking-wider">
                      AI Insight
                    </p>
                  </div>
                  <p className="text-accent-primary/70 text-[11px] font-medium leading-relaxed">
                    Зона <span className="text-accent-primary font-bold">"Аксессуары"</span> имеет
>>>>>>> recover/cabinet-wip-from-stash
                    высокую конверсию. Рекомендуем промо-дисплеи.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <Card className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200">
            <h4 className="mb-5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
=======
          <Card className="border-border-subtle hover:border-accent-primary/30 rounded-xl border bg-white p-4 shadow-sm transition-all">
            <h4 className="text-text-muted mb-5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
              <Eye className="h-3.5 w-3.5" /> Анализ Входящего Потока
            </h4>
            <div className="space-y-4">
              {[
                {
                  label: 'Мужчины',
                  val: 45,
                  icon: Users,
<<<<<<< HEAD
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50',
=======
                  color: 'text-accent-primary',
                  bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
                },
                {
                  label: 'Женщины',
                  val: 55,
                  icon: Users,
                  color: 'text-rose-600',
                  bg: 'bg-rose-50',
                },
                {
                  label: '25-34 года',
                  val: 38,
                  icon: Activity,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                },
                {
                  label: '35-44 года',
                  val: 24,
                  icon: Activity,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
              ].map((item, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:bg-white hover:shadow-sm"
=======
                  className="bg-bg-surface2/80 border-border-subtle group flex items-center justify-between rounded-lg border p-2.5 transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
<<<<<<< HEAD
                        'flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition-all group-hover:border-slate-100',
=======
                        'group-hover:border-border-subtle flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition-all',
>>>>>>> recover/cabinet-wip-from-stash
                        item.bg,
                        item.color
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
<<<<<<< HEAD
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold tabular-nums text-slate-900">
=======
                    <span className="text-text-primary text-[10px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-text-primary text-[13px] font-bold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                    {item.val}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="border-border-subtle mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-footfall-retail-analytics-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bAnalytics} data-testid="shop-footfall-b2b-link">
            Аналитика закупок (B2B)
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.b2bMarginAnalysis} data-testid="shop-footfall-margin-hub-link">
            Хаб маржи (B2B)
          </Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}
