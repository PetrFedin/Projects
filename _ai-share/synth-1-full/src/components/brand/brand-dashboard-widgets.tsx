'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Building,
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  Sparkles,
  Zap,
  Target,
  Activity,
  Monitor,
  Star,
  BarChart3,
  Landmark,
  Timer,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Boxes,
  Waves,
  Calendar,
  AlertTriangle,
  Rocket,
  Globe,
  Factory,
  DollarSign,
  Briefcase,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
=======
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

import { WidgetDetailSheet, WidgetType } from '@/components/brand/widget-detail-sheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fmtMoney } from '@/lib/format';
import { EXCHANGE_RATES } from '@/lib/constants';
import Link from 'next/link';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import { useUIState } from '@/providers/ui-state';
import { getDefaultUpcomingDeadlines } from '@/lib/data/calendar-events';
import { fastApiService } from '@/lib/fastapi-service';

import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip';

const MOCK_BRAND_HEALTH = [
  { label: 'Операции', value: 94, status: 'stable' },
  { label: 'Лояльность', value: 88, status: 'up' },
  { label: 'Маржа', value: 42, status: 'stable' },
  { label: 'Сток', value: 65, status: 'down' },
];

interface BrandDashboardWidgetsProps {
  period?: 'week' | 'month' | 'year';
}

// v2 - fixed hydration
export function BrandDashboardWidgets() {
  const router = useRouter();
  const {
    dashboardPeriod,
    businessMode,
    filterChannel,
    setFilterChannel,
    filterRegion,
    setFilterRegion,
    filterCollection,
    setFilterCollection,
  } = useUIState();
  const period = dashboardPeriod;
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [showEquivalents, setShowEquivalents] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [serverKpis, setServerKpis] = useState<any>(null);

  const btnStyle = 'rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all h-8';
  const subBtnStyle =
    'rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-7 px-3';

  useEffect(() => {
    setIsMounted(true);
    const fetchKpis = async () => {
      try {
        const response = await fastApiService.getDashboardKpis();
        if (response.data && response.data.kpis) {
          setServerKpis(response.data.kpis);
        }
      } catch (err) {
        console.warn('Failed to fetch real-time KPIs for widgets:', err);
      }
    };
    fetchKpis();
  }, [dashboardPeriod]);

  // Множитель для данных в зависимости от периода
  const periodMultiplier = period === 'week' ? 0.25 : period === 'year' ? 12 : 1;

  // Helper to get server value or fallback
  const getKpi = (key: string, fallback: any) => {
    if (serverKpis && serverKpis[key] !== undefined) {
      return serverKpis[key];
    }
    return fallback;
  };

  const mainKpis = [
    {
      type: 'gmv' as WidgetType,
      label: 'Выручка (GMV)',
      value: getKpi('revenue', 388000000),
      change: '+24%',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      section: 'Финансы',
<<<<<<< HEAD
      href: '/brand/finance',
=======
      href: ROUTES.brand.finance,
>>>>>>> recover/cabinet-wip-from-stash
      desc: 'Gross Merchandise Volume: Общий объем продаж всех товаров.',
    },
    {
      type: 'fill_rate' as WidgetType,
      label: 'Исполнение (Fill Rate)',
      value: getKpi('operations', 94.2) + '%',
      change: '+2.1%',
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      section: 'Операции',
<<<<<<< HEAD
      href: '/brand/inventory',
=======
      href: ROUTES.brand.inventory,
>>>>>>> recover/cabinet-wip-from-stash
      desc: 'Процент укомплектованных и отгруженных заказов.',
    },
    {
      type: 'pipeline' as WidgetType,
      label: 'Активные заказы',
      value: getKpi('total_orders', 842),
      change: '+15',
      icon: Package,
<<<<<<< HEAD
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      section: 'Склад',
      href: '/brand/b2b-orders',
=======
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/10',
      section: 'Склад',
      href: ROUTES.brand.b2bOrders,
>>>>>>> recover/cabinet-wip-from-stash
      desc: 'Количество заказов в обработке на текущий момент.',
    },
    {
      type: 'retailers' as WidgetType,
      label: 'Партнеры (B2B)',
      value: getKpi('active_showrooms', 128),
      change: '+5',
      icon: Users,
<<<<<<< HEAD
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      section: 'Сеть',
      href: '/brand/retailers',
=======
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/10',
      section: 'Сеть',
      href: ROUTES.brand.retailers,
>>>>>>> recover/cabinet-wip-from-stash
      desc: 'Активные оптовые покупатели текущего сезона.',
    },
  ];

  const formatVal = (valInRub: number, type: 'money' | 'short' | 'unit' = 'money') => {
    const scaledVal = valInRub * periodMultiplier;
    if (type === 'unit') {
      return Math.floor(scaledVal).toLocaleString('ru-RU');
    }
    if (type === 'short') {
      if (scaledVal >= 1000000) {
        const m = scaledVal / 1000000;
        return `${m.toFixed(1)}M ₽`;
      }
      return `${(scaledVal / 1000).toFixed(0)}K ₽`;
    }
    return fmtMoney(scaledVal);
  };

  const getEquiv = (valInRub: number) => {
    const scaledVal = valInRub * periodMultiplier;
    const usd = (scaledVal / EXCHANGE_RATES.USD).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    const eur = (scaledVal / EXCHANGE_RATES.EUR).toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
    return `${usd} / ${eur}`;
  };

  const healthStats = [
    { label: 'Операции', value: getKpi('operations', 94), status: 'stable' },
    { label: 'Лояльность', value: 88, status: 'up' },
    { label: 'Маржа', value: getKpi('margin', 42), status: 'stable' },
    { label: 'Сток', value: getKpi('stock_health', 65), status: 'down' },
  ];

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* Breadcrumb Navigation - Refined for premium visibility */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <Link
          href="/brand"
          className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
=======
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
      {/* Breadcrumb Navigation - Refined for premium visibility */}
      <div className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Link
          href={ROUTES.brand.home}
          className="hover:text-accent-primary flex items-center gap-1.5 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <Building className="h-3 w-3" />
          ORGANIZATION
        </Link>
        <ChevronRight className="h-2 w-2 opacity-50" />
<<<<<<< HEAD
        <span className="text-slate-300">OPERATIONAL INTELLIGENCE</span>
      </div>

      {/* Control Panel: Strategic Tools - Pattern: [Title] [Filters] [Actions] */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
        <span className="text-text-muted">OPERATIONAL INTELLIGENCE</span>
      </div>

      {/* Control Panel: Strategic Tools - Pattern: [Title] [Filters] [Actions] */}
      <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              Strategic Pulse
            </h1>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> LIVE STREAM
            </Badge>
          </div>
          <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
            Context: <span className="text-indigo-600">Omni-Channel Aggregation</span>
=======
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <span className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" /> LIVE
              STREAM
            </Badge>
          </div>
          <p className="text-text-muted text-[10px] font-bold uppercase leading-none tracking-widest">
            Context: <span className="text-accent-primary">Omni-Channel Aggregation</span>
>>>>>>> recover/cabinet-wip-from-stash
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Strategic Filters - Compact Row Layout */}
<<<<<<< HEAD
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
=======
          {/* cabinetSurface v1 */}
          <div
            className={cn(
              cabinetSurface.groupTabList,
              'h-auto min-h-10 flex-wrap items-center gap-1'
            )}
          >
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="text-text-secondary hover:bg-bg-surface2 h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase shadow-sm outline-none transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <option value="all">Global Channels</option>
              <option value="b2b">B2B Wholesale</option>
              <option value="b2c">B2C Omni</option>
              <option value="marketplace">Marketroom</option>
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value as any)}
<<<<<<< HEAD
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
=======
              className="text-text-secondary hover:bg-bg-surface2 h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase shadow-sm outline-none transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <option value="all">Geo Clusters</option>
              <option value="ru">Russian Fed.</option>
              <option value="kz">Kazakhstan</option>
              <option value="by">Belarus</option>
            </select>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value as any)}
<<<<<<< HEAD
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
=======
              className="text-text-secondary hover:bg-bg-surface2 h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase shadow-sm outline-none transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <option value="all">Lifecycle Cycle</option>
              <optgroup label="FW26">
                <option value="fw26-pre">FW26 Pre-Season</option>
                <option value="fw26-main">FW26 Main-Season</option>
              </optgroup>
              <option value="ss25-main">SS25 Main-Season</option>
              <option value="outlet">Clearance / Outlet</option>
            </select>
          </div>

<<<<<<< HEAD
          <div className="mx-0.5 h-5 w-px bg-slate-200" />
=======
          <div className="bg-border-subtle mx-0.5 h-5 w-px" />
>>>>>>> recover/cabinet-wip-from-stash

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEquivalents(!showEquivalents)}
              className={cn(
<<<<<<< HEAD
                'h-7 rounded-lg border-slate-200 px-3 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all',
                showEquivalents
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-900'
=======
                'border-border-default h-7 rounded-lg px-3 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all',
                showEquivalents
                  ? 'bg-text-primary border-text-primary text-white'
                  : 'text-text-secondary hover:text-text-primary bg-white'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              {showEquivalents ? 'CURRENCY: RUB' : 'UNIFY: RUB / $/€'}
            </Button>
            <Button
              variant="default"
              size="sm"
<<<<<<< HEAD
              onClick={() => router.push('/brand/b2b-orders')}
              className="h-7 rounded-lg border border-indigo-500 bg-indigo-600 px-4 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
=======
              onClick={() => router.push(ROUTES.brand.b2bOrders)}
              className="bg-accent-primary shadow-accent-primary/10 hover:bg-accent-primary border-accent-primary h-7 rounded-lg border px-4 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Initialize Order
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Key Performance Entities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className="h-3 w-[2px] rounded-full bg-indigo-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Core Performance Entities
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
=======
            <div className="bg-accent-primary h-3 w-[2px] rounded-full" />
            <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
              Core Performance Entities
            </h2>
          </div>
          <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Real-time Attribution
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <TooltipProvider>
            {mainKpis.map((stat, i) => (
              <UITooltip key={i}>
                <UITooltipTrigger asChild>
                  <Card
<<<<<<< HEAD
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md"
=======
                    className="border-border-subtle hover:border-accent-primary/20 group relative cursor-pointer overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
                    onClick={(e) => {
                      if (
                        (e.target as HTMLElement).closest('button') ||
                        (e.target as HTMLElement).closest('a')
                      )
                        return;
                      setSelectedWidget(stat.type);
                    }}
                  >
                    <div className="mb-2.5 flex items-start justify-between">
                      <div className="flex flex-col gap-1.5">
                        <Badge
                          variant="outline"
<<<<<<< HEAD
                          className="h-3.5 w-fit border-slate-100 bg-slate-50/50 px-1.5 text-[7px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600"
=======
                          className="bg-bg-surface2/80 text-text-muted border-border-subtle group-hover:bg-accent-primary/10 group-hover:text-accent-primary group-hover:border-accent-primary/20 h-3.5 w-fit px-1.5 text-[7px] font-bold uppercase leading-none tracking-[0.15em] transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {stat.section}
                        </Badge>
                        <div
                          className={cn(
                            'rounded-lg border border-transparent p-1.5 shadow-inner transition-all',
                            stat.bg,
                            'group-hover:scale-105 group-hover:border-white'
                          )}
                        >
                          <stat.icon className={cn('h-3.5 w-3.5', stat.color)} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge className="h-4 rounded-md border border-emerald-100 bg-emerald-50 px-1.5 text-[9px] font-bold uppercase tracking-tight text-emerald-600 shadow-sm">
                          {stat.change}
                        </Badge>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
<<<<<<< HEAD
                          className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 opacity-0 shadow-sm transition-all hover:bg-slate-900 hover:text-white group-hover:opacity-100"
=======
                          className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-6 w-6 rounded-md opacity-0 shadow-sm transition-all hover:text-white group-hover:opacity-100"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <Link href={stat.href}>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
<<<<<<< HEAD
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {stat.label}
                    </p>
                    <div className="flex flex-col justify-between">
                      <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
                    <p className="text-text-muted mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em]">
                      {stat.label}
                    </p>
                    <div className="flex flex-col justify-between">
                      <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                        {typeof stat.value === 'number'
                          ? stat.type === 'retailers'
                            ? formatVal(stat.value, 'unit')
                            : formatVal(stat.value, 'short')
                          : stat.value}
                      </p>
                      {showEquivalents && typeof stat.value === 'number' && (
<<<<<<< HEAD
                        <p className="mt-2 border-t border-slate-50 pt-1.5 text-[8px] font-bold uppercase tabular-nums tracking-widest text-slate-400 opacity-70">
=======
                        <p className="text-text-muted border-border-subtle mt-2 border-t pt-1.5 text-[8px] font-bold uppercase tabular-nums tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                          ≈ {getEquiv(stat.value)}
                        </p>
                      )}
                    </div>
                  </Card>
                </UITooltipTrigger>
                <TooltipContent
                  side="bottom"
<<<<<<< HEAD
                  className="z-[100] max-w-[180px] rounded-lg border-none bg-slate-900 p-2.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-2xl"
=======
                  className="bg-text-primary z-[100] max-w-[180px] rounded-lg border-none p-2.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-2xl"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <p className="leading-relaxed opacity-80">{stat.desc}</p>
                </TooltipContent>
              </UITooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* SECTION 2: Global Channel Distribution */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-[2px] rounded-full bg-emerald-500" />
<<<<<<< HEAD
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Channel Efficiency Matrix
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
=======
            <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
              Channel Efficiency Matrix
            </h2>
          </div>
          <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Network Performance
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'B2B Wholesale',
              val: 288000000,
<<<<<<< HEAD
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
              border: 'border-indigo-100',
=======
              color: 'text-accent-primary',
              bg: 'bg-accent-primary/10',
              border: 'border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
              icon: Briefcase,
              change: '+18%',
              sub: 'Active Orders: 842',
            },
            {
              label: 'B2C Omni-Channel',
              val: 84200000,
<<<<<<< HEAD
              color: 'text-pink-600',
              bg: 'bg-pink-50',
              border: 'border-pink-100',
=======
              color: 'text-accent-primary',
              bg: 'bg-accent-primary/10',
              border: 'border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
              icon: Rocket,
              change: '+24%',
              sub: 'Direct Fulfillment',
            },
            {
              label: 'Marketroom Node',
              val: 12800000,
<<<<<<< HEAD
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              border: 'border-purple-100',
=======
              color: 'text-accent-primary',
              bg: 'bg-accent-primary/10',
              border: 'border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
              icon: Monitor,
              change: '+42%',
              sub: '240 Integrated SKUs',
            },
            {
              label: 'Inventory Clearance',
              val: 5600000,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-100',
              icon: Tag,
              change: '-12%',
              sub: '180 SKU Residual',
            },
          ].map((c, i) => (
            <Card
              key={i}
<<<<<<< HEAD
              className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-emerald-100"
=======
              className="border-border-subtle group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all hover:border-emerald-100"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={cn(
                    'rounded-lg border p-1.5 shadow-inner transition-all',
                    c.bg,
                    c.border,
                    'transition-all group-hover:scale-105 group-hover:bg-white'
                  )}
                >
                  <c.icon className={cn('h-3.5 w-3.5', c.color)} />
                </div>
                <Badge
                  variant="outline"
<<<<<<< HEAD
                  className="h-4 rounded-md border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold tracking-widest text-slate-400"
=======
                  className="bg-bg-surface2 text-text-muted border-border-subtle h-4 rounded-md px-1.5 text-[8px] font-bold tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {c.change}
                </Badge>
              </div>
              <div className="space-y-0.5">
<<<<<<< HEAD
                <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  {c.label}
                </p>
                <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
                  {formatVal(c.val, 'short')}
                </p>
                <p className="mt-1.5 text-[8px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 opacity-60">
=======
                <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-widest">
                  {c.label}
                </p>
                <p className="text-text-primary text-sm font-bold uppercase leading-none tracking-tighter">
                  {formatVal(c.val, 'short')}
                </p>
                <p className="text-text-muted mt-1.5 text-[8px] font-bold uppercase leading-none tracking-[0.15em] opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                  {c.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 3: Critical System Anomalies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-[2px] rounded-full bg-rose-500" />
<<<<<<< HEAD
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
            <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
              Critical System Anomalies
            </h2>
          </div>
          <Badge
            variant="outline"
            className="h-4 animate-pulse border-rose-100 bg-rose-50/50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-rose-600"
          >
            3 Detected
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Manufacturing Alert */}
<<<<<<< HEAD
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-rose-600 bg-white shadow-sm transition-all hover:border-rose-200">
=======
          <Card className="border-border-subtle group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-l-rose-600 bg-white shadow-sm transition-all hover:border-rose-200">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 shadow-inner transition-transform group-hover:scale-105">
                    <Factory className="h-3.5 w-3.5" />
                  </div>
<<<<<<< HEAD
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                  <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Manufacturing Node
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Link href="/brand/production">
=======
                  className="bg-bg-surface2 text-text-muted h-6 w-6 rounded-md shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Link href={ROUTES.brand.production}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
<<<<<<< HEAD
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Factory Latency Detected
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
=======
                <h3 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                  Factory Latency Detected
                </h3>
                <p className="text-text-secondary text-[10px] font-medium uppercase italic leading-snug tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                  Risk: Delivery slippage for key accounts (TSUM).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-4.5 rounded-md border border-rose-100 bg-rose-50 px-1.5 text-[8px] font-bold uppercase tracking-tight text-rose-600 shadow-sm">
                  -5 Days Drift
                </Badge>
<<<<<<< HEAD
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
=======
                <div className="bg-border-subtle h-0.5 w-0.5 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                <span className="animate-pulse text-[9px] font-bold uppercase tracking-widest text-rose-500">
                  Severity: High
                </span>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-rose-200 hover:text-rose-600"
=======
            <div className="bg-bg-surface2 border-border-subtle flex gap-1.5 border-t px-4 py-2.5">
              <Button
                variant="outline"
                className="border-border-default text-text-secondary h-6 flex-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-rose-200 hover:text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Escalate
              </Button>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-slate-900"
=======
                className="border-border-default text-text-secondary hover:text-text-primary h-6 flex-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Calibration
              </Button>
            </div>
          </Card>

          {/* Inventory Alert */}
<<<<<<< HEAD
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-amber-500 bg-white shadow-sm transition-all hover:border-amber-200">
=======
          <Card className="border-border-subtle group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-l-amber-500 bg-white shadow-sm transition-all hover:border-amber-200">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-amber-100 bg-amber-50 p-1.5 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
                    <Package className="h-3.5 w-3.5" />
                  </div>
<<<<<<< HEAD
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                  <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Inventory Cluster
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
                >
                  <Link href="/brand/inventory">
=======
                  className="bg-bg-surface2 text-text-muted h-6 w-6 rounded-md shadow-sm transition-all hover:bg-amber-600 hover:text-white"
                >
                  <Link href={ROUTES.brand.inventory}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
<<<<<<< HEAD
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Liquidity Risk: Low Velocity
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
=======
                <h3 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                  Liquidity Risk: Low Velocity
                </h3>
                <p className="text-text-secondary text-[10px] font-medium uppercase italic leading-snug tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                  SKU #4821: 12% Sell-thru @ 60 days. Stagnation alert.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-4.5 rounded-md border border-amber-100 bg-amber-50 px-1.5 text-[8px] font-bold uppercase tracking-tight text-amber-600 shadow-sm">
                  82% Risk Index
                </Badge>
<<<<<<< HEAD
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
=======
                <div className="bg-border-subtle h-0.5 w-0.5 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">
                  Optimization: Required
                </span>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-amber-200 hover:text-amber-600"
=======
            <div className="bg-bg-surface2 border-border-subtle flex gap-1.5 border-t px-4 py-2.5">
              <Button
                variant="outline"
                className="border-border-default text-text-secondary h-6 flex-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all hover:border-amber-200 hover:text-amber-600"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Markdown
              </Button>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="flex h-6 flex-1 items-center justify-center gap-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-indigo-600"
=======
                className="border-border-default text-text-secondary hover:text-accent-primary flex h-6 flex-1 items-center justify-center gap-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Sparkles className="h-2.5 w-2.5" /> AI Strategy
              </Button>
            </div>
          </Card>

          {/* Cash Flow Alert */}
<<<<<<< HEAD
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-slate-900 bg-white shadow-sm transition-all hover:border-slate-200">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-1.5 text-slate-900 shadow-inner transition-transform group-hover:scale-105">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
          <Card className="border-l-text-primary border-border-subtle hover:border-border-default group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r bg-white shadow-sm transition-all">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-bg-surface2 text-text-primary border-border-default rounded-lg border p-1.5 shadow-inner transition-transform group-hover:scale-105">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Financial Pipeline
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/finance">
=======
                  className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-6 w-6 rounded-md shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.finance}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
<<<<<<< HEAD
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Capital Flux: Liquidity Gap
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
=======
                <h3 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                  Capital Flux: Liquidity Gap
                </h3>
                <p className="text-text-secondary text-[10px] font-medium uppercase italic leading-snug tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                  Predictive shortfall detected in T+18 days cycle.
                </p>
              </div>
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <Badge className="h-4.5 rounded-md border-none bg-slate-900 px-1.5 text-[8px] font-bold uppercase tracking-tight text-white shadow-sm">
                  18 Day Window
                </Badge>
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                <Badge className="bg-text-primary h-4.5 rounded-md border-none px-1.5 text-[8px] font-bold uppercase tracking-tight text-white shadow-sm">
                  18 Day Window
                </Badge>
                <div className="bg-border-subtle h-0.5 w-0.5 rounded-full" />
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  P&L Status: Warning
                </span>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-indigo-600"
=======
            <div className="bg-bg-surface2 border-border-subtle flex gap-1.5 border-t px-4 py-2.5">
              <Button
                variant="outline"
                className="border-border-default text-text-secondary hover:text-accent-primary h-6 flex-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Factoring
              </Button>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-slate-900"
=======
                className="border-border-default text-text-secondary hover:text-text-primary h-6 flex-1 rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Ledger Details
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 4: Операционная эффективность */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
<<<<<<< HEAD
          <div className="h-1 w-5 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
          <div className="bg-accent-primary h-1 w-5 rounded-full" />
          <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Операционная эффективность
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Воронка Pipeline */}
<<<<<<< HEAD
          <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
                    <Waves className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-1.5 shadow-inner transition-transform group-hover:scale-105">
                    <Waves className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-text-secondary group-hover:text-accent-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Воронка выручки
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/analytics-360">
=======
                  className="border-border-default text-text-muted hover:bg-text-primary/90 h-6 w-6 rounded-md border bg-white shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.analytics360}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-3.5">
              <div className="space-y-2.5">
                {[
                  { label: 'Черновики', value: 78500000, progress: 40, color: 'bg-amber-500' },
                  {
                    label: 'На согласовании',
                    value: 110900000,
                    progress: 60,
<<<<<<< HEAD
                    color: 'bg-indigo-500',
=======
                    color: 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                  },
                  {
                    label: 'Подтверждено',
                    value: 194000000,
                    progress: 90,
                    color: 'bg-emerald-500',
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
<<<<<<< HEAD
                      <span className="text-slate-400">{item.label}</span>
                      <span className="leading-none text-slate-900">
                        {formatVal(item.value, 'short')}
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
=======
                      <span className="text-text-muted">{item.label}</span>
                      <span className="text-text-primary leading-none">
                        {formatVal(item.value, 'short')}
                      </span>
                    </div>
                    <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                      <div
                        className={cn('h-full transition-all duration-1000', item.color)}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategic Planner — ближайшие дедлайны */}
<<<<<<< HEAD
          <Link href="/brand/calendar">
            <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
                      Strategic Planner
                    </CardTitle>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
=======
          <Link href={ROUTES.brand.calendar}>
            <Card className="border-border-subtle hover:border-accent-primary/20 group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 rounded-lg border p-1.5 shadow-inner transition-transform group-hover:scale-105">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <CardTitle className="text-text-secondary group-hover:text-accent-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
                      Strategic Planner
                    </CardTitle>
                  </div>
                  <ArrowUpRight className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 p-3.5">
                {getDefaultUpcomingDeadlines({ limit: 4 }).map((d, i) => (
                  <div
                    key={i}
                    className={cn(
                      'group/item flex items-center justify-between rounded-lg border p-2 transition-all',
                      d.isOverdue
                        ? 'border-rose-100 bg-rose-50/50'
<<<<<<< HEAD
                        : 'border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover/item:text-indigo-600">
                        {d.t}
                      </p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                        : 'bg-bg-surface2/80 border-border-subtle hover:bg-accent-primary/10'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-text-primary group-hover/item:text-accent-primary truncate text-[9px] font-bold uppercase leading-none tracking-tight transition-colors">
                        {d.t}
                      </p>
                      <p className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        {[d.role, d.partner].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    <div className="ml-2 shrink-0 text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-4.5 rounded-md px-1.5 text-[8px] font-bold uppercase tracking-tight shadow-sm',
                          d.color
                        )}
                      >
                        {d.d}
                      </Badge>
                      {d.daysUntil !== undefined && (
                        <p
                          className={cn(
                            'mt-0.5 text-[7px] font-bold tabular-nums',
                            d.isOverdue
                              ? 'text-rose-600'
                              : d.daysUntil <= 3
                                ? 'text-amber-600'
<<<<<<< HEAD
                                : 'text-slate-400'
=======
                                : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {d.isOverdue
                            ? `−${Math.abs(d.daysUntil)}`
                            : d.daysUntil === 0
                              ? 'сегодня'
                              : d.daysUntil === 1
                                ? 'завтра'
                                : `${d.daysUntil} дн`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Link>

          {/* Showroom Live Activity */}
<<<<<<< HEAD
          <Card className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-indigo-100 bg-indigo-600 text-white shadow-xl shadow-indigo-100/30 transition-all hover:shadow-2xl">
=======
          <Card className="border-accent-primary/20 shadow-accent-primary/10 bg-accent-primary group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border text-white shadow-xl transition-all hover:shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Monitor className="h-12 w-12" />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
                    <Monitor className="h-3.5 w-3.5" />
                  </div>
<<<<<<< HEAD
                  <CardTitle className="text-[10px] font-bold uppercase leading-none tracking-widest text-indigo-100">
=======
                  <CardTitle className="text-accent-primary/30 text-[10px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Шоурум онлайн
                  </CardTitle>
                </div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4 p-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
<<<<<<< HEAD
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-200">
=======
                  <p className="text-accent-primary/40 text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Байеры онлайн
                  </p>
                  <p className="text-sm font-bold leading-none tracking-tighter text-white">12</p>
                </div>
                <div className="space-y-0.5 text-right">
<<<<<<< HEAD
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-200">
=======
                  <p className="text-accent-primary/40 text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    В корзине
                  </p>
                  <p className="text-sm font-bold uppercase leading-none tracking-tighter text-white">
                    8.2M ₽
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3">
<<<<<<< HEAD
                <Button className="h-7 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-indigo-600 shadow-lg transition-all hover:bg-indigo-50">
=======
                <Button className="text-accent-primary hover:bg-accent-primary/10 h-7 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                  Управление
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 5: Production Node & Predictive AI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-[2px] rounded-full bg-emerald-500" />
<<<<<<< HEAD
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Production Node & Predictive AI
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
=======
            <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
              Production Node & Predictive AI
            </h2>
          </div>
          <span className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Forward Intelligence
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Factory Pulse Monitoring */}
<<<<<<< HEAD
          <Card className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 group flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-3.5">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                    <Factory className="h-3.5 w-3.5" />
                  </div>
<<<<<<< HEAD
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
=======
                  <CardTitle className="text-text-secondary group-hover:text-accent-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Manufacturing Pulse
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/production">
=======
                  className="border-border-default text-text-muted hover:bg-text-primary/90 h-6 w-6 rounded-md border bg-white shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.production}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-3.5">
              {[
                {
                  factory: 'Eastern Node (RU)',
                  order: 'FW26 Core Expansion',
                  progress: 68,
                  color: 'bg-rose-500',
                },
                {
                  factory: 'Nordic Fabric (FI)',
                  order: 'Outerwear Series',
                  progress: 85,
                  color: 'bg-emerald-500',
                },
              ].map((f, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group/item space-y-1.5 rounded-xl border border-slate-100/50 bg-slate-50/50 p-2.5 transition-all hover:border-indigo-100 hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-[9px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover/item:text-indigo-600">
                      {f.factory}
                    </p>
                    <span className="text-[9px] font-bold tabular-nums leading-none tracking-widest text-slate-400">
                      {f.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
=======
                  className="bg-bg-surface2/80 border-border-subtle/50 hover:border-accent-primary/20 group/item space-y-1.5 rounded-xl border p-2.5 transition-all hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-text-primary group-hover/item:text-accent-primary text-[9px] font-bold uppercase leading-none tracking-tight transition-colors">
                      {f.factory}
                    </p>
                    <span className="text-text-muted text-[9px] font-bold tabular-nums leading-none tracking-widest">
                      {f.progress}%
                    </span>
                  </div>
                  <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                    <div
                      className={cn('h-full transition-all duration-1000', f.color)}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Demand Forecast AI */}
<<<<<<< HEAD
          <Card className="group flex flex-col justify-between overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm transition-all hover:border-indigo-200">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
=======
          <Card className="border-accent-primary/20 hover:border-accent-primary/30 group flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-accent-primary border-accent-primary rounded-lg border p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-text-secondary group-hover:text-accent-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    Neural Demand Forecast
                  </h3>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/analytics-360">
=======
                  className="border-border-default text-text-muted hover:bg-text-primary/90 h-6 w-6 rounded-md border bg-white shadow-sm transition-all hover:text-white"
                >
                  <Link href={ROUTES.brand.analytics360}>
>>>>>>> recover/cabinet-wip-from-stash
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-3.5">
              <div className="flex h-12 items-end gap-1 px-1">
                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={cn(
                        'w-full rounded-t-sm transition-all duration-500',
                        i === 5
<<<<<<< HEAD
                          ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]'
                          : 'bg-indigo-100'
=======
                          ? 'bg-accent-primary shadow-[0_0_8px_rgba(79,70,229,0.3)]'
                          : 'bg-accent-primary/15'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
<<<<<<< HEAD
              <div className="rounded-lg border border-indigo-100/50 bg-indigo-50/50 p-2.5 transition-colors group-hover:bg-indigo-50">
                <p className="text-[9px] font-bold uppercase italic leading-snug tracking-widest text-indigo-700">
=======
              <div className="bg-accent-primary/10 border-accent-primary/20 group-hover:bg-accent-primary/10 rounded-lg border p-2.5 transition-colors">
                <p className="text-accent-primary text-[9px] font-bold uppercase italic leading-snug tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  AI Synthesis: Demand peak projected in T+14 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Global Distribution Summary */}
<<<<<<< HEAD
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200/20 transition-all hover:bg-slate-800">
=======
          <Card className="border-text-primary shadow-md/20 bg-text-primary hover:bg-text-primary/90 group relative flex flex-col justify-between overflow-hidden rounded-xl border text-white shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Rocket className="h-12 w-12" />
            </div>
            <CardHeader className="border-b border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="relative z-10 flex items-center gap-2.5">
<<<<<<< HEAD
                  <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
=======
                  <div className="bg-accent-primary border-accent-primary rounded-lg border p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
>>>>>>> recover/cabinet-wip-from-stash
                    <Rocket className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase leading-none tracking-widest text-white">
                    Marketroom Aggregate
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="relative z-10 h-6 w-6 rounded-md bg-white/10 text-white shadow-sm transition-all hover:bg-white hover:text-slate-900"
=======
                  className="hover:text-text-primary relative z-10 h-6 w-6 rounded-md bg-white/10 text-white shadow-sm transition-all hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <Link href="/outlet">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3.5 p-4">
              <div className="space-y-3.5">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-white/40 opacity-80">
                      Seasonal Yield
                    </p>
                    <p className="text-base font-bold uppercase leading-none tracking-tighter text-white">
                      12.8M ₽
                    </p>
                  </div>
                  <Badge className="h-4 rounded-md border-none bg-emerald-500 px-1.5 text-[8px] font-bold tracking-widest text-white shadow-lg shadow-emerald-500/20">
                    +24% Flux
                  </Badge>
                </div>
                <div className="flex items-end justify-between border-t border-white/5 pt-3">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-white/40 opacity-80">
                      Residual Assets
                    </p>
                    <p className="text-sm font-bold uppercase leading-none tracking-tighter text-white/90">
                      5.6M ₽
                    </p>
                  </div>
                  <Badge className="h-4 rounded-md border-none bg-white/10 px-1.5 text-[8px] font-bold uppercase tracking-widest text-white">
                    Clearance
                  </Badge>
                </div>
              </div>
              <div className="border-t border-white/5 pt-2">
                <p className="text-[9px] font-bold uppercase italic leading-none tracking-widest text-white/30">
                  Global Outlet: 180 SKU nodes active
                </p>
              </div>
            </CardContent>
          </Card>
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
