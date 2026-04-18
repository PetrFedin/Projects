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
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

import { WidgetDetailSheet, WidgetType } from '@/components/brand/widget-detail-sheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fmtMoney } from '@/lib/format';
import { EXCHANGE_RATES } from '@/lib/constants';
import Link from 'next/link';
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
      href: '/brand/finance',
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
      href: '/brand/inventory',
      desc: 'Процент укомплектованных и отгруженных заказов.',
    },
    {
      type: 'pipeline' as WidgetType,
      label: 'Активные заказы',
      value: getKpi('total_orders', 842),
      change: '+15',
      icon: Package,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      section: 'Склад',
      href: '/brand/b2b-orders',
      desc: 'Количество заказов в обработке на текущий момент.',
    },
    {
      type: 'retailers' as WidgetType,
      label: 'Партнеры (B2B)',
      value: getKpi('active_showrooms', 128),
      change: '+5',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      section: 'Сеть',
      href: '/brand/retailers',
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
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* Breadcrumb Navigation - Refined for premium visibility */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <Link
          href="/brand"
          className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
        >
          <Building className="h-3 w-3" />
          ORGANIZATION
        </Link>
        <ChevronRight className="h-2 w-2 opacity-50" />
        <span className="text-slate-300">OPERATIONAL INTELLIGENCE</span>
      </div>

      {/* Control Panel: Strategic Tools - Pattern: [Title] [Filters] [Actions] */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
              Strategic Pulse
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> LIVE STREAM
            </Badge>
          </div>
          <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
            Context: <span className="text-indigo-600">Omni-Channel Aggregation</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Strategic Filters - Compact Row Layout */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
            >
              <option value="all">Global Channels</option>
              <option value="b2b">B2B Wholesale</option>
              <option value="b2c">B2C Omni</option>
              <option value="marketplace">Marketroom</option>
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value as any)}
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
            >
              <option value="all">Geo Clusters</option>
              <option value="ru">Russian Fed.</option>
              <option value="kz">Kazakhstan</option>
              <option value="by">Belarus</option>
            </select>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value as any)}
              className="h-7 cursor-pointer rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm outline-none transition-all hover:bg-slate-50"
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

          <div className="mx-0.5 h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEquivalents(!showEquivalents)}
              className={cn(
                'h-7 rounded-lg border-slate-200 px-3 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all',
                showEquivalents
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-900'
              )}
            >
              {showEquivalents ? 'CURRENCY: RUB' : 'UNIFY: RUB / $/€'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/brand/b2b-orders')}
              className="h-7 rounded-lg border border-indigo-500 bg-indigo-600 px-4 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
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
            <div className="h-3 w-[2px] rounded-full bg-indigo-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Core Performance Entities
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            Real-time Attribution
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <TooltipProvider>
            {mainKpis.map((stat, i) => (
              <UITooltip key={i}>
                <UITooltipTrigger asChild>
                  <Card
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md"
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
                          className="h-3.5 w-fit border-slate-100 bg-slate-50/50 px-1.5 text-[7px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600"
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
                          className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 opacity-0 shadow-sm transition-all hover:bg-slate-900 hover:text-white group-hover:opacity-100"
                        >
                          <Link href={stat.href}>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {stat.label}
                    </p>
                    <div className="flex flex-col justify-between">
                      <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
                        {typeof stat.value === 'number'
                          ? stat.type === 'retailers'
                            ? formatVal(stat.value, 'unit')
                            : formatVal(stat.value, 'short')
                          : stat.value}
                      </p>
                      {showEquivalents && typeof stat.value === 'number' && (
                        <p className="mt-2 border-t border-slate-50 pt-1.5 text-[8px] font-bold uppercase tabular-nums tracking-widest text-slate-400 opacity-70">
                          ≈ {getEquiv(stat.value)}
                        </p>
                      )}
                    </div>
                  </Card>
                </UITooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="z-[100] max-w-[180px] rounded-lg border-none bg-slate-900 p-2.5 text-[9px] font-bold uppercase tracking-widest text-white shadow-2xl"
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Channel Efficiency Matrix
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            Network Performance
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'B2B Wholesale',
              val: 288000000,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
              border: 'border-indigo-100',
              icon: Briefcase,
              change: '+18%',
              sub: 'Active Orders: 842',
            },
            {
              label: 'B2C Omni-Channel',
              val: 84200000,
              color: 'text-pink-600',
              bg: 'bg-pink-50',
              border: 'border-pink-100',
              icon: Rocket,
              change: '+24%',
              sub: 'Direct Fulfillment',
            },
            {
              label: 'Marketroom Node',
              val: 12800000,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              border: 'border-purple-100',
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
              className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-emerald-100"
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
                  className="h-4 rounded-md border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold tracking-widest text-slate-400"
                >
                  {c.change}
                </Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  {c.label}
                </p>
                <p className="text-sm font-bold uppercase leading-none tracking-tighter text-slate-900">
                  {formatVal(c.val, 'short')}
                </p>
                <p className="mt-1.5 text-[8px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400 opacity-60">
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
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
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-rose-600 bg-white shadow-sm transition-all hover:border-rose-200">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 shadow-inner transition-transform group-hover:scale-105">
                    <Factory className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    Manufacturing Node
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                >
                  <Link href="/brand/production">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Factory Latency Detected
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
                  Risk: Delivery slippage for key accounts (TSUM).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-4.5 rounded-md border border-rose-100 bg-rose-50 px-1.5 text-[8px] font-bold uppercase tracking-tight text-rose-600 shadow-sm">
                  -5 Days Drift
                </Badge>
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                <span className="animate-pulse text-[9px] font-bold uppercase tracking-widest text-rose-500">
                  Severity: High
                </span>
              </div>
            </div>
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-rose-200 hover:text-rose-600"
              >
                Escalate
              </Button>
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-slate-900"
              >
                Calibration
              </Button>
            </div>
          </Card>

          {/* Inventory Alert */}
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-amber-500 bg-white shadow-sm transition-all hover:border-amber-200">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-amber-100 bg-amber-50 p-1.5 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
                    <Package className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    Inventory Cluster
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
                >
                  <Link href="/brand/inventory">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Liquidity Risk: Low Velocity
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
                  SKU #4821: 12% Sell-thru @ 60 days. Stagnation alert.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-4.5 rounded-md border border-amber-100 bg-amber-50 px-1.5 text-[8px] font-bold uppercase tracking-tight text-amber-600 shadow-sm">
                  82% Risk Index
                </Badge>
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">
                  Optimization: Required
                </span>
              </div>
            </div>
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:border-amber-200 hover:text-amber-600"
              >
                Markdown
              </Button>
              <Button
                variant="outline"
                className="flex h-6 flex-1 items-center justify-center gap-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-indigo-600"
              >
                <Sparkles className="h-2.5 w-2.5" /> AI Strategy
              </Button>
            </div>
          </Card>

          {/* Cash Flow Alert */}
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border-y border-l-4 border-r border-slate-100 border-l-slate-900 bg-white shadow-sm transition-all hover:border-slate-200">
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-1.5 text-slate-900 shadow-inner transition-transform group-hover:scale-105">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    Financial Pipeline
                  </span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/finance">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase leading-none tracking-tight text-slate-900">
                  Capital Flux: Liquidity Gap
                </h3>
                <p className="text-[10px] font-medium uppercase italic leading-snug tracking-tight text-slate-500 opacity-80">
                  Predictive shortfall detected in T+18 days cycle.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-4.5 rounded-md border-none bg-slate-900 px-1.5 text-[8px] font-bold uppercase tracking-tight text-white shadow-sm">
                  18 Day Window
                </Badge>
                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  P&L Status: Warning
                </span>
              </div>
            </div>
            <div className="flex gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-indigo-600"
              >
                Factoring
              </Button>
              <Button
                variant="outline"
                className="h-6 flex-1 rounded-lg border-slate-200 bg-white text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:text-slate-900"
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
          <div className="h-1 w-5 rounded-full bg-indigo-600" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Операционная эффективность
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Воронка Pipeline */}
          <Card className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-1.5 text-indigo-600 shadow-inner transition-transform group-hover:scale-105">
                    <Waves className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
                    Воронка выручки
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/analytics-360">
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
                    color: 'bg-indigo-500',
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
                      <span className="text-slate-400">{item.label}</span>
                      <span className="leading-none text-slate-900">
                        {formatVal(item.value, 'short')}
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
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
                        : 'border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover/item:text-indigo-600">
                        {d.t}
                      </p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
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
                                : 'text-slate-400'
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
          <Card className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-indigo-100 bg-indigo-600 text-white shadow-xl shadow-indigo-100/30 transition-all hover:shadow-2xl">
            <div className="absolute right-0 top-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Monitor className="h-12 w-12" />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
                    <Monitor className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase leading-none tracking-widest text-indigo-100">
                    Шоурум онлайн
                  </CardTitle>
                </div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4 p-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-200">
                    Байеры онлайн
                  </p>
                  <p className="text-sm font-bold leading-none tracking-tighter text-white">12</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-200">
                    В корзине
                  </p>
                  <p className="text-sm font-bold uppercase leading-none tracking-tighter text-white">
                    8.2M ₽
                  </p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3">
                <Button className="h-7 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-indigo-600 shadow-lg transition-all hover:bg-indigo-50">
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Production Node & Predictive AI
            </h2>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">
            Forward Intelligence
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Factory Pulse Monitoring */}
          <Card className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                    <Factory className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
                    Manufacturing Pulse
                  </CardTitle>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/production">
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
          <Card className="group flex flex-col justify-between overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm transition-all hover:border-indigo-200">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-indigo-600">
                    Neural Demand Forecast
                  </h3>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/brand/analytics-360">
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
                          ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]'
                          : 'bg-indigo-100'
                      )}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-indigo-100/50 bg-indigo-50/50 p-2.5 transition-colors group-hover:bg-indigo-50">
                <p className="text-[9px] font-bold uppercase italic leading-snug tracking-widest text-indigo-700">
                  AI Synthesis: Demand peak projected in T+14 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Global Distribution Summary */}
          <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200/20 transition-all hover:bg-slate-800">
            <div className="absolute right-0 top-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Rocket className="h-12 w-12" />
            </div>
            <CardHeader className="border-b border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="rounded-lg border border-indigo-500 bg-indigo-600 p-1.5 text-white shadow-lg transition-transform group-hover:scale-105">
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
                  className="relative z-10 h-6 w-6 rounded-md bg-white/10 text-white shadow-sm transition-all hover:bg-white hover:text-slate-900"
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
    </div>
  );
}
