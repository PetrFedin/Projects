'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Map,
  Clock,
  TrendingUp,
  ChevronRight,
  Zap,
  Calendar as CalendarIcon,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export default function FootfallAnalysisPage() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Link href="/shop" className="transition-colors hover:text-indigo-600">
              Магазин
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-600">AI Footfall Analytics</span>
          </div>
          <h1 className="text-sm font-bold uppercase tracking-tight text-slate-900">
            Анализ Трафика & Heatmaps
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
            Интеллектуальный мониторинг поведения покупателей в торговом зале.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="flex h-8 items-center gap-2 rounded-lg border-none bg-emerald-50 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 shadow-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live: 42
            Visitors
          </Badge>
          <Button className="h-8 rounded-lg bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-indigo-600">
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
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
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
            className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg border border-slate-50 shadow-sm transition-transform group-hover:scale-105',
                  stat.bg,
                  stat.color
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <h4 className="text-base font-bold tracking-tight text-slate-900">{stat.value}</h4>
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
                  >
                    Heatmap
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-md px-3 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/50 hover:text-slate-600"
                  >
                    Zones
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 p-4">
              {/* Heatmap Placeholder */}
              <div className="group relative flex h-full min-h-[350px] w-full cursor-crosshair items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm grayscale"
                  alt="Store Layout"
                />
                {/* Simulated Heatmap Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-transparent" />

                {/* Hotspots */}
                <div className="absolute left-1/3 top-1/4 h-32 w-32 animate-pulse rounded-full bg-rose-500/30 blur-[40px]" />
                <div className="absolute bottom-1/3 right-1/4 h-40 w-40 animate-pulse rounded-full bg-indigo-500/20 blur-[60px] delay-700" />
                <div className="absolute right-1/2 top-1/2 h-24 w-24 animate-pulse rounded-full bg-amber-500/10 blur-[30px] delay-300" />

                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white bg-white/80 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
                    <MousePointer2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                      Interactive View
                    </p>
                    <p className="text-sm font-bold tracking-tight text-slate-900">
                      Нажмите для анализа зоны
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white bg-white/90 p-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        High
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Medium
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        Low
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
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
          <Card className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Почасовой Трафик
                </h4>
                <p className="text-[11px] font-medium text-slate-400">
                  Сравнение текущей и предыдущей недели.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600">
                    Сегодня
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
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
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Эффективность Зон
              </CardTitle>
              <CardDescription className="text-[11px] font-medium leading-relaxed text-slate-400">
                Метрики вовлеченности по отделам.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-4">
              {MOCK_ZONE_TRAFFIC.map((zone) => (
                <div key={zone.id} className="group cursor-pointer">
                  <div className="mb-2 flex items-end justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold uppercase text-slate-900 transition-colors group-hover:text-indigo-600">
                        {zone.name}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {zone.dwellTime} мин • {zone.count} визитов
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-slate-900">{zone.conversionRate}%</p>
                      <p className="text-[8px] font-bold uppercase text-slate-400">Conv.</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div
                      className={cn(
                        'h-full transition-all duration-1000 group-hover:opacity-80',
                        zone.conversionRate > 50
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : zone.conversionRate > 20
                            ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]'
                            : 'bg-amber-500'
                      )}
                      style={{ width: `${zone.conversionRate}%` }}
                    />
                  </div>
                </div>
              ))}

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
                    высокую конверсию. Рекомендуем промо-дисплеи.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200">
            <h4 className="mb-5 flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Eye className="h-3.5 w-3.5" /> Анализ Входящего Потока
            </h4>
            <div className="space-y-4">
              {[
                {
                  label: 'Мужчины',
                  val: 45,
                  icon: Users,
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50',
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
                  className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition-all group-hover:border-slate-100',
                        item.bg,
                        item.color
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold tabular-nums text-slate-900">
                    {item.val}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
