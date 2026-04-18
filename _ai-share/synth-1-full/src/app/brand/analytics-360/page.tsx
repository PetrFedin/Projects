'use client';

import { SkuAnalytics } from '@/components/brand/sku-analytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Globe,
  Target,
  ArrowRight,
  Users,
  ShieldCheck,
  ArrowUpRight,
  PieChart,
  BrainCircuit,
  Layers,
  Zap,
  BarChart3,
  Activity,
  Landmark,
  ChevronRight,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Map,
  Monitor,
  Timer,
  Clock,
  Waves,
  Calendar,
  Rocket,
  Factory,
  DollarSign,
  Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { isDemoBrandName } from '@/lib/data/demo-platform-brands';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageHeader } from '@/components/design-system/registry-page-header';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIState } from '@/providers/ui-state';
import { WidgetDetailSheet, WidgetType } from '@/components/brand/widget-detail-sheet';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from '@/components/ui/tooltip';

const AnalyticsBiContent = dynamic(
  () => import('@/app/brand/analytics-bi/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ExternalSalesContent = dynamic(
  () => import('@/app/brand/analytics/external-sales/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const UnifiedAnalyticsContent = dynamic(
  () => import('@/app/brand/analytics/unified/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

export default function Analytics360Page() {
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

  const [allBrandProducts, setAllBrandProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tab, setTab] = useState('analytics-360');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const allProducts: Product[] = await response.json();
          const filtered = allProducts.filter((p) => isDemoBrandName(p.brand));
          setAllBrandProducts(filtered.length > 0 ? filtered : allProducts.slice(0, 10));
        } else {
          const { default: fallback } = await import('@/lib/products');
          const arr = fallback as Product[];
          const filtered = arr.filter((p) => isDemoBrandName(p.brand));
          setAllBrandProducts(filtered.length > 0 ? filtered : arr.slice(0, 10));
        }
      } catch {
        try {
          const { default: fallback } = await import('@/lib/products');
          const arr = fallback as Product[];
          setAllBrandProducts(arr.slice(0, 10));
        } catch (_) {}
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <header>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="mt-2 h-5 w-2/3" />
        </header>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className={cn(registryFeedLayout.pageShell, 'space-y-6 duration-700 animate-in fade-in')}>
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-full shadow-inner')}>
          <TabsTrigger
            value="analytics-360"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5'
            )}
          >
            <BrainCircuit className="h-3 w-3 shrink-0" /> Аналитика 360
          </TabsTrigger>
          <TabsTrigger
            value="bi"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5'
            )}
          >
            <BarChart3 className="h-3 w-3 shrink-0" /> Расширенная
          </TabsTrigger>
          <TabsTrigger
            value="external-sales"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5'
            )}
          >
            <TrendingUp className="h-3 w-3 shrink-0" /> Внешние продажи
          </TabsTrigger>
          <TabsTrigger
            value="unified"
            className={cn(
              cabinetSurface.tabsTrigger,
              'data-[state=active]:text-accent-primary h-7 gap-1.5'
            )}
          >
            <Layers className="h-3 w-3 shrink-0" /> Сводная
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics-360" className="mt-0 space-y-6">
          <RegistryPageHeader
            eyebrow={
              <div className="text-text-muted flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <Link
                  href={ROUTES.brand.organizationOverview}
                  className="hover:text-accent-primary"
                >
                  Организация
                </Link>
                <ChevronRight className="h-3 w-3 opacity-60" />
                <span className="text-text-secondary">Центр управления</span>
                <ChevronRight className="h-3 w-3 opacity-60" />
                <span className="text-accent-primary">Аналитика 360</span>
              </div>
            }
            title="Аналитика 360"
            leadPlain={
              <>
                Сквозные <AcronymWithTooltip abbr="KPI" />, каналы и коллекции в одной плоскости —
                демо-данные до подключения BI.
              </>
            }
            actions={
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Badge className="bg-text-primary h-6 w-fit shrink-0 border-none px-3 text-[10px] font-black uppercase text-white shadow-md">
                  <BrainCircuit className="fill-accent-primary text-accent-primary mr-2 h-3.5 w-3.5" />{' '}
                  ESI
                </Badge>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="border-border-default bg-bg-surface2 flex items-center gap-1 rounded-xl border p-1 shadow-inner">
                    <select
                      value={filterChannel}
                      onChange={(e) =>
                        setFilterChannel(e.target.value as 'all' | 'b2b' | 'b2c' | 'marketplace')
                      }
                      className="text-text-secondary h-8 max-w-[130px] cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
                    >
                      <option value="all">Все каналы</option>
                      <option value="b2b">B2B Опт</option>
                      <option value="b2c">B2C Омни</option>
                      <option value="marketplace">Маркетрум</option>
                    </select>
                    <select
                      value={filterRegion}
                      onChange={(e) =>
                        setFilterRegion(e.target.value as 'all' | 'ru' | 'kz' | 'by')
                      }
                      className="text-text-secondary h-8 max-w-[120px] cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
                    >
                      <option value="all">Все регионы</option>
                      <option value="ru">Россия</option>
                      <option value="kz">Казахстан</option>
                      <option value="by">Беларусь</option>
                    </select>
                    <select
                      value={filterCollection}
                      onChange={(e) => setFilterCollection(e.target.value)}
                      className="text-text-secondary h-8 max-w-[130px] cursor-pointer rounded-lg border-none bg-white px-2 text-[10px] font-bold uppercase shadow-sm outline-none"
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
                    <Download className="text-text-muted mr-1.5 h-3.5 w-3.5" /> Экспорт
                  </Button>
                </div>
              </div>
            }
          />

          {/* SECTION 1: Стратегические KPI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="bg-accent-primary h-1 w-6 rounded-full" />
              <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                Стратегические показатели
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <TooltipProvider>
                {[
                  {
                    type: 'market_demand' as WidgetType,
                    label: 'Доля рынка',
                    value: '8.4%',
                    change: '+1.2%',
                    icon: Globe,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    section: 'Рынок',
                    href: '/brand/showroom',
                    desc: 'Процент присутствия бренда в Middle-Luxury.',
                  },
                  {
                    type: 'finance_roi' as WidgetType,
                    label: 'Окупаемость (ROI)',
                    value: '320%',
                    change: 'Оптимум',
                    icon: Landmark,
                    color: 'text-accent-primary',
                    bg: 'bg-accent-primary/10',
                    section: 'Финансы',
                    href: '/brand/finance',
                    desc: 'Возврат на инвестиции.',
                  },
                  {
                    type: 'trend_prediction' as WidgetType,
                    label: 'Индекс инноваций',
                    value: '72%',
                    change: '+8%',
                    icon: Zap,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    section: 'R&D',
                    href: '/brand/ai-tools',
                    desc: 'Уровень внедрения технологических решений.',
                  },
                  {
                    type: 'fill_rate' as WidgetType,
                    label: 'Оборачиваемость',
                    value: '4.2x',
                    change: '+0.5',
                    icon: Activity,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    section: 'Сток',
                    href: '/brand/inventory',
                    desc: 'Inventory Turnover: Скорость реализации запасов за период.',
                  },
                ].map((stat, i) => (
                  <UITooltip key={i}>
                    <UITooltipTrigger asChild>
                      <Card
                        className="border-border-subtle hover:border-accent-primary/30 group cursor-pointer overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                        onClick={() => setSelectedWidget(stat.type)}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex flex-col gap-1.5">
                            <Badge
                              variant="outline"
                              className="bg-bg-surface2 text-text-secondary border-border-subtle group-hover:text-accent-primary h-4 w-fit px-1.5 text-[8px] font-bold uppercase group-hover:bg-white"
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
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              className={cn(
                                'bg-bg-surface2 text-text-secondary h-4.5 border-none px-1.5 text-[9px] font-bold uppercase',
                                stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : ''
                              )}
                            >
                              {stat.change}
                            </Badge>
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg opacity-0 shadow-sm transition-all hover:text-white group-hover:opacity-100"
                            >
                              <Link href={stat.href}>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <p className="text-text-primary text-base font-bold tracking-tight">
                            {stat.value}
                          </p>
                        </div>
                      </Card>
                    </UITooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-text-primary rounded-lg border-none p-2 text-[10px] text-white shadow-xl"
                    >
                      <p>{stat.desc}</p>
                    </TooltipContent>
                  </UITooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* SECTION 2: Финансовая и рыночная аналитика */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="h-1 w-6 rounded-full bg-emerald-600" />
              <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                Финансовая и рыночная аналитика
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Ликвидность & P&L */}
              <Card className="border-accent-primary/20 bg-accent-primary group relative overflow-hidden rounded-xl border p-4 text-white shadow-md">
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                  <Landmark className="h-20 w-24" />
                </div>
                <div className="mb-6 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="h-4.5 border-white/30 px-2 text-[8px] font-bold uppercase text-white"
                  >
                    Финансы
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Link href={ROUTES.brand.finance}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-accent-primary/40 mb-1 text-[10px] font-bold uppercase tracking-widest">
                      Ликвидность
                    </p>
                    <p className="text-base font-bold tracking-tight text-white">2.4 Ratio</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-accent-primary/30 text-[11px] font-medium leading-tight">
                      Запас кэша: 18 дней. Требуются поступления от B2B.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Конкурентный Срез */}
              <Card className="border-text-primary/30 bg-text-primary group relative overflow-hidden rounded-xl border p-4 text-white shadow-lg">
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                  <Target className="h-20 w-24" />
                </div>
                <div className="mb-6 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="text-accent-primary h-4.5 border-white/30 px-2 text-[8px] font-bold uppercase"
                  >
                    Рынок
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Link href={ROUTES.brand.showroom}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Syntha Lab', val: 58, color: 'bg-accent-primary' },
                    { label: 'Nordic Wool', val: 42, color: 'bg-emerald-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>{item.label}</span>
                        <span className="text-white/60">{item.val}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            item.color
                          )}
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Радар трендов */}
              <Card className="border-border-subtle hover:border-accent-primary/20 group overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all">
                <div className="mb-6 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="border-accent-primary/20 text-accent-primary bg-accent-primary/10 h-4.5 px-2 text-[8px] font-bold uppercase"
                  >
                    Тренды
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-8 w-8 rounded-lg shadow-sm transition-all hover:text-white"
                  >
                    <Link href={ROUTES.brand.aiTools}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2.5">
                  {[
                    {
                      cat: 'Верхняя одежда',
                      trend: '+22%',
                      icon: TrendingUp,
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50',
                    },
                    {
                      cat: 'Аксессуары',
                      trend: '+18%',
                      icon: TrendingUp,
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50',
                    },
                    {
                      cat: 'Базовые вещи',
                      trend: '-8%',
                      icon: TrendingDown,
                      color: 'text-rose-600',
                      bg: 'bg-rose-50',
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface2 hover:bg-bg-surface2 flex cursor-default items-center justify-between rounded-lg p-2.5 transition-colors"
                    >
                      <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
                        {t.cat}
                      </p>
                      <div
                        className={cn('flex items-center gap-1.5 rounded-full px-2 py-0.5', t.bg)}
                      >
                        <t.icon className={cn('h-3 w-3', t.color)} />
                        <span className={cn('text-[10px] font-bold', t.color)}>{t.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* SECTION 3: Операционная и ассортиментная аналитика */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="h-1 w-6 rounded-full bg-blue-600" />
              <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                Операционная и ассортиментная аналитика
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {/* География Спроса */}
              <Card className="border-border-subtle group overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all hover:border-blue-100">
                <div className="mb-4 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="border-border-subtle text-text-secondary bg-bg-surface2 h-4.5 px-2 text-[8px] font-bold uppercase"
                  >
                    Регионы
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                  >
                    <Link href={ROUTES.brand.showroom}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-text-primary text-base font-bold tracking-tight">45%</p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
                        Москва / РФ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary text-base font-bold tracking-tight">22%</p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-wider">
                        СНГ
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Лидерборд продаж */}
              <Card className="border-border-subtle hover:border-accent-primary/20 group overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all">
                <div className="mb-4 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="border-border-subtle text-text-secondary bg-bg-surface2 h-4.5 px-2 text-[8px] font-bold uppercase"
                  >
                    Эффективность
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                  >
                    <Link href={ROUTES.brand.dashboard}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: 'Анна Б.', sales: '110M', target: 92 },
                    { name: 'Марк В.', sales: '78M', target: 78 },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface2/80 hover:bg-bg-surface2 flex items-center justify-between rounded-lg p-2 transition-colors"
                    >
                      <span className="text-text-secondary text-[10px] font-bold uppercase">
                        {m.name}
                      </span>
                      <span className="text-text-primary text-[11px] font-bold">{m.sales} ₽</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* B2C Омни Импульс */}
              <Card className="border-border-subtle group overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all hover:border-rose-100">
                <div className="mb-4 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="h-4.5 border-rose-100 bg-rose-50 px-2 text-[8px] font-bold uppercase text-rose-600"
                  >
                    Омни-канал
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg shadow-sm transition-all hover:text-white"
                  >
                    <Link href={ROUTES.brand.customerIntelligence}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                    Розничный спрос (Всего)
                  </p>
                  <p className="text-text-primary text-base font-bold tracking-tight">84.2M ₽</p>
                  <Badge className="h-4.5 mt-2 border-none bg-emerald-50 px-2 text-[8px] font-bold uppercase text-emerald-600">
                    Omni Active
                  </Badge>
                </div>
              </Card>

              {/* ESG Рейтинг */}
              <Card className="border-border-subtle bg-bg-surface2 group overflow-hidden rounded-xl border p-3 shadow-sm transition-all hover:bg-white">
                <div className="mb-4 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="h-4.5 border-emerald-100 bg-emerald-50 px-2 text-[8px] font-bold uppercase text-emerald-600"
                  >
                    Устойчивость
                  </Badge>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-text-muted hover:bg-text-primary/90 h-7 w-7 rounded-lg bg-white shadow-sm transition-all hover:text-white"
                  >
                    <Link href={ROUTES.brand.esg}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">
                    <span className="text-sm font-bold tracking-tight text-emerald-600">A+</span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-text-primary text-[10px] font-bold uppercase">Лидер</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                      Топ 5%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Matrix View at bottom */}
          <div className="border-border-subtle space-y-4 border-t pt-8">
            <div className="flex items-center gap-2 px-1">
              <div className="bg-text-primary h-1 w-6 rounded-full" />
              <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                Срез эффективности ассортимента
              </h2>
            </div>
            <div className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
              <SkuAnalytics brandProducts={allBrandProducts} />
            </div>
          </div>

          <WidgetDetailSheet
            isOpen={!!selectedWidget}
            onOpenChange={(open) => !open && setSelectedWidget(null)}
            widgetType={selectedWidget}
            period={period}
          />
        </TabsContent>

        <TabsContent value="bi" className="mt-0">
          {tab === 'bi' && <AnalyticsBiContent />}
        </TabsContent>

        <TabsContent value="external-sales" className="mt-0">
          {tab === 'external-sales' && <ExternalSalesContent />}
        </TabsContent>

        <TabsContent value="unified" className="mt-0">
          {tab === 'unified' && <UnifiedAnalyticsContent />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
