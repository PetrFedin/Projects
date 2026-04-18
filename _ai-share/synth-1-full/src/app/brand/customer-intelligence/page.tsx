'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Users,
  UserCheck,
  Zap,
  ArrowUpRight,
  MousePointer2,
  ShoppingBag,
  Heart,
  Scan,
  MapPin,
  BadgeCheck,
  MessageSquare,
  Activity,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  ShieldCheck,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { motion } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { fmtNumber } from '@/lib/format';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WidgetDetailSheet, WidgetType } from '@/components/brand/widget-detail-sheet';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip';

import { CustomerBrandMatrix } from '@/components/brand/customer-brand-matrix';
import FeedbackAnalytics from '@/components/brand/analytics/feedback-analytics';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
export default function CustomerIntelligencePage() {
  const router = useRouter();
  const {
    dashboardPeriod,
    filterChannel,
    setFilterChannel,
    filterRegion,
    setFilterRegion,
    filterCollection,
    setFilterCollection,
  } = useUIState();
  const period = dashboardPeriod;

  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [cohortView, setCohortView] = useState<'month' | 'quarter' | 'year'>('month');

  // Fix hydration error
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatNum = (val: number | string) => {
    if (!isClient) return typeof val === 'number' ? val.toString() : val;
    return typeof val === 'number' ? fmtNumber(val) : val;
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/brand" className="transition-colors hover:text-indigo-600">
          Организация
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Центр управления</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-indigo-600">Клиентский интеллект</span>
      </div>

      {/* Control Panel: Strategic Hub */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Badge className="h-6 border-none bg-slate-900 px-3 text-[10px] font-bold uppercase text-white shadow-md">
            <Users className="mr-2 h-3.5 w-3.5 fill-indigo-400 text-indigo-400" /> CRM Intelligence
          </Badge>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> Анализ
            лояльности
          </p>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase text-slate-600 shadow-sm outline-none"
            >
              <option value="all">Все каналы</option>
              <option value="b2b">B2B Опт</option>
              <option value="b2c">B2C Омни</option>
              <option value="marketplace">Marketroom</option>
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value as any)}
              className="h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase text-slate-600 shadow-sm outline-none"
            >
              <option value="all">Все регионы</option>
              <option value="ru">Россия</option>
              <option value="kz">Казахстан</option>
              <option value="by">Беларусь</option>
            </select>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value as any)}
              className="h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase text-slate-600 shadow-sm outline-none"
            >
              <option value="all">Все коллекции</option>
              <optgroup label="FW26">
                <option value="fw26-pre">FW26 Pre</option>
                <option value="fw26-main">FW26 Main</option>
              </optgroup>
              <option value="outlet">Outlet</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm hover:bg-slate-50"
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* 1. High-Level Customer KPIs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-6 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Ключевые показатели аудитории
          </h2>
        </div>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16 duration-700 animate-in fade-in">
      <RegistryPageHeader
        title="Клиентский интеллект"
        leadPlain={
          <>
            CRM Intelligence: анализ лояльности, фильтры по каналам, регионам и коллекциям. Ключевые{' '}
            <AcronymWithTooltip abbr="KPI" /> и метрики удержания.
          </>
        }
        eyebrow={
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Link href={ROUTES.brand.home} className="hover:text-accent-primary transition-colors">
              Организация
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">Центр управления</span>
            <ChevronRight className="size-3" />
            <span className="text-accent-primary">Клиентский интеллект</span>
          </div>
        }
        actions={
          <div className="flex w-full flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
            <Badge className="bg-text-primary h-6 border-none px-3 text-[10px] font-bold uppercase text-white shadow-md">
              <Users className="fill-accent-primary text-accent-primary mr-2 size-3.5" /> CRM
              аналитика
            </Badge>
            <div
              className={cn(
                cabinetSurface.groupTabList,
                'h-auto min-h-10 flex-wrap items-center gap-1 shadow-inner'
              )}
            >
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value as any)}
                className="text-text-secondary h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
              >
                <option value="all">Все каналы</option>
                <option value="b2b">B2B Опт</option>
                <option value="b2c">B2C Омни</option>
                <option value="marketplace">Маркетрум</option>
              </select>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value as any)}
                className="text-text-secondary h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
              >
                <option value="all">Все регионы</option>
                <option value="ru">Россия</option>
                <option value="kz">Казахстан</option>
                <option value="by">Беларусь</option>
              </select>
              <select
                value={filterCollection}
                onChange={(e) => setFilterCollection(e.target.value as any)}
                className="text-text-secondary h-8 cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
              >
                <option value="all">Все коллекции</option>
                <optgroup label="FW26">
                  <option value="fw26-pre">FW26 Pre</option>
                  <option value="fw26-main">FW26 Main</option>
                </optgroup>
                <option value="outlet">Outlet</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border-default text-text-secondary hover:bg-bg-surface2 h-8 rounded-lg bg-white px-3 text-[10px] font-bold uppercase tracking-wider shadow-sm"
            >
              Экспорт Excel
            </Button>
          </div>
        }
      />

      {/* 1. High-Level Customer KPIs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-accent-primary h-1 w-6 rounded-full" />
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
            Ключевые показатели аудитории
          </h2>
        </div>
>>>>>>> recover/cabinet-wip-from-stash
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <TooltipProvider>
            {[
              {
                type: 'customer_profiles' as WidgetType,
                label: 'Профили (Omni)',
                value: formatNum(12482),
                change: '+12%',
                icon: Users,
<<<<<<< HEAD
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
=======
                color: 'text-accent-primary',
                bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
                section: 'База',
                desc: 'Общее количество уникальных клиентов.',
              },
              {
                type: 'churn_rate' as WidgetType,
                label: 'Удержание (CRR)',
                value: '88.4%',
                change: '+2.4%',
                icon: ShieldCheck,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                section: 'Лояльность',
<<<<<<< HEAD
                desc: 'Customer Retention Rate: Общий показатель лояльности.',
=======
                desc: 'Customer Retention Rate: общий показатель лояльности.',
>>>>>>> recover/cabinet-wip-from-stash
              },
              {
                type: 'returns_rate' as WidgetType,
                label: 'Доля возвратов',
                value: '4.2%',
                change: '-0.8%',
                icon: Activity,
                color: 'text-rose-600',
                bg: 'bg-rose-50',
                section: 'Качество',
                desc: 'Процент возвратов во всех розничных каналах.',
              },
              {
                type: 'clv_analysis' as WidgetType,
                label: 'Ценность (CLV)',
                value: `${formatNum(142000)} ₽`,
                change: '+5.4%',
                icon: TrendingUp,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                section: 'Ценность',
                desc: 'Средний LTV клиента.',
              },
            ].map((stat, i) => (
              <UITooltip key={i}>
                <UITooltipTrigger asChild>
                  <Card
<<<<<<< HEAD
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
=======
                    className="border-border-subtle hover:border-accent-primary/30 group relative cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
                    onClick={() => setSelectedWidget(stat.type)}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <Badge
                          variant="outline"
<<<<<<< HEAD
                          className="h-4 w-fit border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold uppercase text-slate-500 transition-colors group-hover:bg-white group-hover:text-indigo-600"
=======
                          className="bg-bg-surface2 text-text-secondary border-border-subtle group-hover:text-accent-primary h-4 w-fit px-1.5 text-[8px] font-bold uppercase transition-colors group-hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {stat.section}
                        </Badge>
                        <div
                          className={cn(
                            'w-fit rounded-lg p-2 shadow-sm transition-colors',
                            stat.bg,
                            'group-hover:bg-white'
                          )}
                        >
                          <stat.icon className={cn('h-4 w-4', stat.color)} />
                        </div>
                      </div>
                      <Badge
                        className={cn(
<<<<<<< HEAD
                          'h-4.5 border-none bg-slate-50 px-1.5 text-[9px] font-bold uppercase text-slate-600',
=======
                          'bg-bg-surface2 text-text-secondary h-4.5 border-none px-1.5 text-[9px] font-bold uppercase',
>>>>>>> recover/cabinet-wip-from-stash
                          stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : ''
                        )}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
<<<<<<< HEAD
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {stat.label}
                      </p>
                      <p className="text-base font-bold tracking-tight text-slate-900">
=======
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-text-primary text-base font-bold tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {stat.value}
                      </p>
                    </div>
                  </Card>
                </UITooltipTrigger>
                <TooltipContent
                  side="bottom"
<<<<<<< HEAD
                  className="rounded-lg border-none bg-slate-900 p-2 text-[10px] text-white shadow-xl"
=======
                  className="bg-text-primary rounded-lg border-none p-2 text-[10px] text-white shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <p>{stat.desc}</p>
                </TooltipContent>
              </UITooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* 2. Behavioral Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-6 rounded-full bg-emerald-600" />
<<<<<<< HEAD
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
=======
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
            Поведенческий анализ
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Активность байеров */}
<<<<<<< HEAD
          <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 shadow-sm">
                    <Activity className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover:text-slate-900">
=======
          <Card className="border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary rounded-lg p-2 shadow-sm">
                    <Activity className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-text-secondary group-hover:text-text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Активность байеров
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/showroom">
=======
                  className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.showroom}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3 pt-2">
              {[
                { buyer: 'ЦУМ Москва', action: 'Просмотр FW26', time: '2 мин' },
                { buyer: 'Aizel', action: 'Добавил в корзину', time: '8 мин' },
                { buyer: 'TSUM KZ', action: 'Запросил прайс', time: '15 мин' },
              ].map((a, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
                >
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold uppercase text-slate-900">{a.buyer}</p>
                    <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                      {a.action}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">{a.time}</span>
=======
                  className="bg-bg-surface2 border-border-subtle hover:bg-bg-surface2 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-text-primary text-[11px] font-bold uppercase">{a.buyer}</p>
                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                      {a.action}
                    </p>
                  </div>
                  <span className="text-text-muted text-[9px] font-bold uppercase">{a.time}</span>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reorder алерты */}
<<<<<<< HEAD
          <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
=======
          <Card className="border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600 shadow-sm">
                    <Clock className="h-4 w-4" />
                  </div>
<<<<<<< HEAD
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover:text-slate-900">
=======
                  <CardTitle className="text-text-secondary group-hover:text-text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Прогноз сегментов
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/dashboard">
=======
                  className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.dashboard}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 p-3 pt-2">
              {[
                { segment: 'VIP (Loyal)', count: '124 чел.', prob: 92 },
                { segment: 'Lapsed (Risk)', count: '48 чел.', prob: 78 },
                { segment: 'New (B2B)', count: '12 орг.', prob: 85 },
              ].map((r, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
                >
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold uppercase text-slate-900">{r.segment}</p>
                    <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
=======
                  className="bg-bg-surface2 border-border-subtle hover:bg-bg-surface2 flex items-center justify-between rounded-lg border p-2.5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-text-primary text-[11px] font-bold uppercase">{r.segment}</p>
                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {r.count}
                    </p>
                  </div>
                  <Badge className="h-4 rounded bg-amber-500 px-1.5 text-[9px] font-bold text-white shadow-sm">
                    {r.prob}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Клиентский Пульс */}
<<<<<<< HEAD
          <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 shadow-sm">
                    <Users className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover:text-slate-900">
=======
          <Card className="border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/10 text-accent-primary rounded-lg p-2 shadow-sm">
                    <Users className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-text-secondary group-hover:text-text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Клиентский Пульс
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/customers">
=======
                  className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.customers}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-3 pt-2">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
<<<<<<< HEAD
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ценность (CLV)
                  </p>
                  <p className="text-sm font-bold tracking-tight text-slate-900">
=======
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                    Ценность (CLV)
                  </p>
                  <p className="text-text-primary text-sm font-bold tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                    {formatNum(142000)} ₽
                  </p>
                </div>
                <div className="space-y-1 text-right">
<<<<<<< HEAD
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
=======
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                    Отток
                  </p>
                  <p className="text-sm font-bold tracking-tight text-rose-600">4.2%</p>
                </div>
              </div>
<<<<<<< HEAD
              <div className="border-t border-slate-50 pt-2">
                <Badge className="h-5 w-full justify-center border-none bg-indigo-50 px-2 text-[9px] font-bold text-indigo-600 shadow-sm">
=======
              <div className="border-border-subtle border-t pt-2">
                <Badge className="bg-accent-primary/10 text-accent-primary h-5 w-full justify-center border-none px-2 text-[9px] font-bold shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                  +12% рост активности
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Retention & Churn Intelligence */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-6 rounded-full bg-amber-500" />
<<<<<<< HEAD
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
=======
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
            Удержание и риски
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Когортный срез */}
<<<<<<< HEAD
          <Card className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
=======
          <Card className="border-text-primary/30 bg-text-primary group relative overflow-hidden rounded-xl border p-4 text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <Target className="h-12 w-12" />
            </div>
            <div className="mb-6 flex items-start justify-between">
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="h-4.5 border-white/20 bg-white/5 px-2 text-[8px] font-bold uppercase text-indigo-300"
=======
                className="text-accent-primary h-4.5 border-white/20 bg-white/5 px-2 text-[8px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Retention
              </Badge>
              <Button
                asChild
                variant="ghost"
                size="icon"
<<<<<<< HEAD
                className="h-7 w-7 rounded-lg bg-white/10 text-white shadow-sm transition-all hover:bg-white hover:text-slate-900"
              >
                <Link href="/brand/analytics-360">
=======
                className="hover:text-text-primary h-7 w-7 rounded-lg bg-white/10 text-white shadow-sm transition-all hover:bg-white"
              >
                <Link href={ROUTES.brand.analytics360}>
>>>>>>> recover/cabinet-wip-from-stash
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
<<<<<<< HEAD
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
=======
                <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  M1 Retention
                </p>
                <p className="text-base font-bold tracking-tight text-white">75%</p>
              </div>
              <p className="text-[11px] font-medium text-white/50">
                Лучший результат в когорте Мар 2025.
              </p>
            </div>
          </Card>

          {/* Клиенты под риском */}
          <Card className="group relative overflow-hidden rounded-xl border border-amber-400 bg-amber-500 p-4 text-white shadow-lg md:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-white" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider">
                  Алерт удержания (VIP)
                </h3>
              </div>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg bg-white/10 text-white shadow-sm transition-all hover:bg-white hover:text-amber-600"
              >
<<<<<<< HEAD
                <Link href="/brand/customers">
=======
                <Link href={ROUTES.brand.customers}>
>>>>>>> recover/cabinet-wip-from-stash
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                {[
                  { name: 'Мария С.', last: '92д', ltv: '184K' },
                  { name: 'Игорь Д.', last: '107д', ltv: '92K' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm"
                  >
                    <span className="text-[11px] font-bold uppercase">{c.name}</span>
                    <Badge className="h-4.5 rounded border-none bg-rose-500 px-2 text-[10px] font-bold text-white shadow-sm">
                      {c.last}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-3 text-[11px] font-medium leading-relaxed backdrop-blur-sm">
                💡 AI совет: Обновить размерную сетку в категории Брюки на основе фактических
                возвратов.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Strategic Behavioral Matrix */}
<<<<<<< HEAD
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-6 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Матрица Клиентского Опыта
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
=======
      <div className="border-border-subtle space-y-4 border-t pt-8">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-accent-primary h-1 w-6 rounded-full" />
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
            Матрица Клиентского Опыта
          </h2>
        </div>
        <div className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <CustomerBrandMatrix />
        </div>
      </div>

      {/* 5. Customer Feedback Analytics */}
<<<<<<< HEAD
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-6 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Обратная связь и NPS
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
=======
      <div className="border-border-subtle space-y-4 border-t pt-8">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-accent-primary h-1 w-6 rounded-full" />
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
            Обратная связь и NPS
          </h2>
        </div>
        <div className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <FeedbackAnalytics brandId="BRAND-XYZ" />
        </div>
      </div>

      <WidgetDetailSheet
        isOpen={!!selectedWidget}
        onOpenChange={(open) => !open && setSelectedWidget(null)}
        widgetType={selectedWidget}
        period={period}
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
