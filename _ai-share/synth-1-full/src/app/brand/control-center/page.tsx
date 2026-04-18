'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  BarChart3,
  Users,
  ArrowRight,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Globe,
  ShoppingCart,
  PackageCheck,
  Gift,
  FileEdit,
  Rocket,
  ChevronRight,
  ArrowUpRight,
  Info,
  Building2,
  Truck,
  Box,
  Factory,
  Megaphone,
  DollarSign,
  Gavel,
  MessageSquare,
  FileText,
  GraduationCap,
  Sparkles,
  Share2,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Package,
  Layers,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
import { TokenEconomyWidget } from '@/components/brand/TokenEconomyWidget';
import { MODULE_HUBS } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { useBrandCenter } from '@/providers/brand-center-state';
=======
import { tid } from '@/lib/ui/test-ids';
import { TokenEconomyWidget } from '@/components/brand/TokenEconomyWidget';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { MODULE_HUBS } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { useBrandCenter } from '@/providers/brand-center-state';
import { OrderControlSummaryList } from '@/components/brand/control-center/order-control-summary-list';
import { ArticleControlSummaryList } from '@/components/brand/control-center/article-control-summary-list';
import { CommitmentControlSummaryList } from '@/components/brand/control-center/commitment-control-summary-list';
import { SampleControlSummaryList } from '@/components/brand/control-center/sample-control-summary-list';
import { ControlCenterOperationalStrip } from '@/components/brand/control-center/control-center-operational-strip';
import { PredictiveRiskWidget } from '@/components/brand/control-center/PredictiveRiskWidget';
import { getControlCenterPredictiveRisks } from '@/lib/control/control-aggregator';
import { OperationalPageChrome } from '@/components/design-system/operational-page-chrome';
import { RegistryPageHeader } from '@/components/design-system/registry-page-header';
>>>>>>> recover/cabinet-wip-from-stash

const MODULE_ICONS: Record<string, React.ElementType> = {
  Building2,
  Truck,
  ShieldCheck,
  LayoutDashboard,
  Box,
  ShoppingCart,
  Factory,
  Megaphone,
  BarChart3,
  DollarSign,
  Gavel,
  Globe,
  MessageSquare,
  Users,
  GraduationCap,
  Sparkles,
  Share2,
  TrendingUp,
  Package,
  Layers,
  ShieldAlert,
  Zap,
  FileText,
  Settings,
  Rocket,
};

const NAVIGATION_CARDS = [
  {
    id: 'ops-pulse',
    title: 'Операционный пульс',
    description:
      'Что происходит сейчас? Мониторинг заказов, производства и критических алертов в реальном времени.',
    icon: Activity,
<<<<<<< HEAD
    href: '/brand/dashboard',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'Live Status',
    features: ['Live KPIs', 'Critical Alerts', 'Channel Performance'],
=======
    href: ROUTES.brand.dashboard,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'Живой статус',
    features: ['Живые KPI', 'Критические алерты', 'Эффективность каналов'],
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'analytics-360',
    title: 'Аналитика 360',
    description:
      'Что было и куда мы идем? Стратегическое планирование, анализ рынка и глубокое финансовое прогнозирование.',
    icon: BarChart3,
<<<<<<< HEAD
    href: '/brand/analytics-360',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'Strategy',
    features: ['Market Share', 'ROI/P&L', 'SKU Efficiency'],
=======
    href: ROUTES.brand.analytics360,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'Стратегия',
    features: ['Доля рынка', 'ROI/P&L', 'Эффективность SKU'],
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'customer-intel',
    title: 'Клиентский интеллект',
    description:
      'Кто наши клиенты? Поведенческий анализ, сегментация аудитории и управление жизненным циклом (LTV).',
    icon: Users,
<<<<<<< HEAD
    href: '/brand/customer-intelligence',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: 'Intelligence',
    features: ['RFM Segments', 'Churn Analysis', 'Cohort Retention'],
=======
    href: ROUTES.brand.customerIntelligence,
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    badge: 'Аналитика',
    features: ['RFM-сегменты', 'Анализ оттока', 'Удержание когорт'],
>>>>>>> recover/cabinet-wip-from-stash
  },
];

export default function ControlCenterOverviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgConnections, setSvgConnections] = useState<any[]>([]);
  const { recentPages, favorites, addFavorite, removeFavorite, isFavorite } = useBrandCenter();
  const predictiveRisks = useMemo(() => getControlCenterPredictiveRisks(), []);

  // Логика построения связей
  useEffect(() => {
    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const findRect = (id: string) => {
        const el = container.querySelector(`[data-id="${id}"]`);
        if (!el) return null;
        return el.getBoundingClientRect();
      };

      const connections = [
        { from: 'brand-hero', to: 'ops-pulse', label: 'Entry' },
        { from: 'ops-pulse', to: 'live-widgets', label: 'Live' },
        { from: 'live-widgets', to: 'health-index', label: 'Data Flow' },
        { from: 'analytics-360', to: 'token-economy', label: 'Quota Sync' },
        { from: 'customer-intel', to: 'quick-actions', label: 'Command Bus' },
        { from: 'health-index', to: 'token-economy', label: 'Cost Opt' },
        { from: 'token-economy', to: 'quick-actions', label: 'AI Control' },
        { from: 'modules-grid', to: 'quick-actions', label: 'Nav' },
      ];

      const newSvgConnections = connections
        .map((conn) => {
          const r1 = findRect(conn.from);
          const r2 = findRect(conn.to);
          if (!r1 || !r2) return null;

          const x1 = r1.left + r1.width / 2 - containerRect.left;
          const y1 = r1.top + r1.height / 2 - containerRect.top;
          const x2 = r2.left + r2.width / 2 - containerRect.left;
          const y2 = r2.top + r2.height / 2 - containerRect.top;

          const isHorizontal = Math.abs(y1 - y2) < 50;
          let d;

          if (isHorizontal) {
            // Строго горизонтальная связь
            const midX = (x1 + x2) / 2;
            const startX = x1 < x2 ? r1.right - containerRect.left : r1.left - containerRect.left;
            const endX = x1 < x2 ? r2.left - containerRect.left : r2.right - containerRect.left;
            d = `M ${startX} ${y1} L ${endX} ${y2}`;
            return { d, label: conn.label, midX: (startX + endX) / 2, midY: y1 };
          } else {
            // Вертикальная связь V-H-V
            const startY = y1 < y2 ? r1.bottom - containerRect.top : r1.top - containerRect.top;
            const endY = y1 < y2 ? r2.top - containerRect.top : r2.bottom - containerRect.top;
            const midY = (startY + endY) / 2;
            d = `M ${x1} ${startY} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${endY}`;
            return { d, label: conn.label, midX: x2, midY: midY };
          }
        })
        .filter(Boolean);

      setSvgConnections(newSvgConnections);
    };

    const rafId = requestAnimationFrame(updateLines);
    window.addEventListener('resize', updateLines);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLines);
    };
  }, []);

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen bg-slate-50/30" ref={containerRef}>
      {/* SVG Connection Layer */}
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
        <defs>
          <filter id="glow-connections" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <AnimatePresence>
          {svgConnections.map((line, i) => (
            <g key={i}>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                d={line.d}
                stroke="#6366f1"
                strokeWidth="1"
                fill="none"
                filter="url(#glow-connections)"
              />
              <motion.circle r="1.5" fill="#6366f1">
                <animateMotion dur="4s" repeatCount="indefinite" path={line.d} />
              </motion.circle>
              <foreignObject x={line.midX - 25} y={line.midY - 8} width="50" height="16">
                <div className="flex h-full items-center justify-center">
                  <span className="rounded-full border border-indigo-100 bg-white/80 px-1 py-0.5 text-[5px] font-black uppercase tracking-widest text-indigo-400 backdrop-blur-sm">
                    {line.label}
                  </span>
                </div>
              </foreignObject>
            </g>
          ))}
        </AnimatePresence>
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 pb-20 md:px-0">
        {/* Brand Center Hero — единый вход */}
        <Card
          data-id="brand-hero"
          className="overflow-hidden rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 shadow-sm"
        >
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                    Brand Center
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Единый хаб управления брендом: производство, B2B, аналитика, финансы, команда
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/brand/dashboard" className="gap-2">
                    <Activity className="h-4 w-4" /> Операционный пульс
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/brand/analytics-bi" className="gap-2">
                    <BarChart3 className="h-4 w-4" /> Аналитика
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/brand/production" className="gap-2">
                    <Factory className="h-4 w-4" /> Production
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 py-4 text-[8px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/brand" className="transition-colors hover:text-indigo-600">
            Организация
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">Центр управления</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-indigo-600">Обзор</span>
        </div>

        {/* Control Panel: Hub Tools */}
        <div className="mb-4 flex items-center justify-end gap-3">
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
            >
              <Link href="/brand/settings">Настройки хаба</Link>
            </Button>
            <div className="mx-0.5 h-4 w-px bg-slate-200" />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
            >
              <Link href="/api/export/dashboard?format=csv">Экспорт</Link>
            </Button>
          </div>

          <Button
            asChild
            variant="default"
            size="sm"
            className="h-7 rounded-lg bg-indigo-600 px-4 text-[7px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
          >
            <Link href="/brand/dashboard">Открыть Пульс</Link>
          </Button>
        </div>

        {/* Мини-виджеты: живой статус заказов, задач, дедлайны, алерты */}
        <div
          data-id="live-widgets"
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {[
            {
              label: 'Production',
              msg: '2 сэмпла на проверке',
              severity: 'warning',
              href: '/brand/production',
              icon: Factory,
            },
            {
              label: 'B2B',
              msg: 'ORD-4521 требует подтверждения',
              severity: 'info',
              href: '/brand/b2b-orders/4521',
              icon: Package,
            },
            {
              label: 'Finance',
              msg: 'P&L обновлён',
              severity: 'ok',
              href: '/brand/finance',
              icon: DollarSign,
            },
            {
              label: 'Задачи',
              msg: '3 задачи с дедлайном сегодня',
              severity: 'warning',
              href: '/brand/calendar?layers=tasks',
              icon: CheckCircle2,
            },
            {
              label: 'Календарь',
              msg: 'Презентация SS26 — завтра 14:00',
              severity: 'info',
              href: '/brand/calendar',
              icon: Calendar,
            },
          ].map((a, i) => (
            <Link key={i} href={a.href}>
              <Card
                className={cn(
                  'group rounded-xl border p-3 transition-all hover:shadow-md',
                  a.severity === 'warning' && 'border-amber-200 bg-amber-50/50',
                  a.severity === 'info' && 'border-indigo-200 bg-indigo-50/50',
                  a.severity === 'ok' && 'border-emerald-200 bg-emerald-50/50'
                )}
              >
                <div className="flex items-start gap-2">
                  <a.icon
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0',
                      a.severity === 'warning' && 'text-amber-600',
                      a.severity === 'info' && 'text-indigo-600',
                      a.severity === 'ok' && 'text-emerald-600'
                    )}
                  />
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">{a.label}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-slate-900">{a.msg}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-3 w-3 shrink-0 text-slate-300 group-hover:text-indigo-500" />
=======
    <OperationalPageChrome className="bg-bg-surface2/30">
      <div ref={containerRef} className="relative min-h-0 w-full">
        {/* SVG Connection Layer */}
        <svg className="pointer-events-none absolute inset-0 z-0 size-full min-h-[60vh] overflow-visible">
          <defs>
            <filter id="glow-connections" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <AnimatePresence>
            {svgConnections.map((line, i) => (
              <g key={i}>
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  d={line.d}
                  stroke="#6366f1"
                  strokeWidth="1"
                  fill="none"
                  filter="url(#glow-connections)"
                />
                <motion.circle r="1.5" fill="#6366f1">
                  <animateMotion dur="4s" repeatCount="indefinite" path={line.d} />
                </motion.circle>
                <foreignObject x={line.midX - 25} y={line.midY - 8} width="50" height="16">
                  <div className="flex h-full items-center justify-center">
                    <span className="border-accent-primary/20 text-accent-primary rounded-full border bg-white/80 px-1 py-0.5 text-[5px] font-black uppercase tracking-widest backdrop-blur-sm">
                      {line.label}
                    </span>
                  </div>
                </foreignObject>
              </g>
            ))}
          </AnimatePresence>
        </svg>

        <main
          data-testid={tid.page('control-center')}
          className={cn('relative z-10 mx-auto w-full max-w-none space-y-5 px-4 pb-16 sm:px-6')}
        >
          {/* Бренд-центр — единая точка входа */}
          <Card
            data-id="brand-hero"
            data-testid={tid.header('control-center')}
            className="border-accent-primary/20 from-accent-primary/10 to-bg-surface2 overflow-hidden rounded-2xl border-2 bg-gradient-to-br via-white shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-accent-primary flex size-14 items-center justify-center rounded-2xl text-white shadow-lg">
                    <Building2 className="size-7" />
                  </div>
                  <div>
                    <h2 className="text-text-primary text-lg font-black uppercase tracking-tight">
                      Бренд-центр
                    </h2>
                    <p className="text-text-secondary mt-0.5 text-sm">
                      Единый хаб управления брендом: производство, B2B, аналитика, финансы, команда
                    </p>
                  </div>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="bg-accent-primary hover:bg-accent-primary">
                    <Link href={ROUTES.brand.dashboard} className="gap-2">
                      <Activity className="size-4" /> Операционный пульс
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.brand.analyticsBi} className="gap-2">
                      <BarChart3 className="size-4" /> Аналитика
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.brand.production} className="gap-2">
                      <Factory className="size-4" /> Производство
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

<<<<<<< HEAD
        {/* Персонализация: недавние и избранное */}
        {(recentPages.length > 0 || favorites.length > 0) && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {recentPages.length > 0 && (
              <Card className="rounded-xl border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-500" /> Недавние страницы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recentPages.slice(0, 6).map((p, i) => (
                      <Button
                        key={i}
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px]"
                      >
                        <Link href={p.href}>{p.label}</Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {favorites.length > 0 && (
              <Card className="rounded-xl border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> Избранные модули
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {favorites.slice(0, 6).map((f) => (
                      <div key={f.id} className="flex items-center gap-1">
                        <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                          <Link href={f.href}>{f.label}</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-amber-500"
                          onClick={() => removeFavorite(f.id)}
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
=======
          <RegistryPageHeader
            eyebrow={
              <div className="text-text-secondary flex flex-wrap items-center gap-2 text-xs font-medium">
                <Link
                  href={ROUTES.brand.organizationOverview}
                  className="hover:text-accent-primary"
                >
                  Организация
                </Link>
                <ChevronRight className="size-3 opacity-60" />
                <span className="text-text-secondary">Центр управления</span>
                <ChevronRight className="size-3 opacity-60" />
                <span className="text-accent-primary">Обзор</span>
              </div>
            }
            title="Центр управления"
            leadQuote="Живой статус модулей, заказов и рисков — быстрые переходы в операционные разделы."
            actions={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default text-text-secondary hover:bg-bg-surface2 h-9 rounded-lg bg-white px-3 text-xs font-medium shadow-sm"
                >
                  <Link href={ROUTES.brand.settings}>Настройки хаба</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default text-text-secondary hover:bg-bg-surface2 h-9 rounded-lg bg-white px-3 text-xs font-medium shadow-sm"
                >
                  <Link href="/api/export/dashboard?format=csv">Экспорт</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-accent-primary hover:bg-accent-primary h-9 rounded-lg px-4 text-xs font-medium text-white shadow-md"
                >
                  <Link href={ROUTES.brand.dashboard}>Открыть Пульс</Link>
                </Button>
              </div>
            }
          />

          {/* Мини-виджеты: живой статус заказов, задач, дедлайны, алерты */}
          <div
            data-id="live-widgets"
            className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            {[
              {
                label: 'Производство',
                msg: '2 сэмпла на проверке',
                severity: 'warning',
                href: ROUTES.brand.production,
                icon: Factory,
              },
              {
                label: 'B2B',
                msg: 'ORD-4521 требует подтверждения',
                severity: 'info',
                href: ROUTES.brand.b2bOrder('4521'),
                icon: Package,
              },
              {
                label: 'Финансы',
                msg: 'P&L обновлён',
                severity: 'ok',
                href: ROUTES.brand.finance,
                icon: DollarSign,
              },
              {
                label: 'Задачи',
                msg: '3 задачи с дедлайном сегодня',
                severity: 'warning',
                href: `${ROUTES.brand.calendar}?layers=tasks`,
                icon: CheckCircle2,
              },
              {
                label: 'Календарь',
                msg: 'Презентация SS26 — завтра 14:00',
                severity: 'info',
                href: ROUTES.brand.calendar,
                icon: Calendar,
              },
            ].map((a, i) => (
              <Link key={i} href={a.href}>
                <Card
                  className={cn(
                    'group rounded-xl border p-3 transition-all hover:shadow-md',
                    a.severity === 'warning' && 'border-amber-200 bg-amber-50/50',
                    a.severity === 'info' && 'border-accent-primary/30 bg-accent-primary/10',
                    a.severity === 'ok' && 'border-emerald-200 bg-emerald-50/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <a.icon
                      className={cn(
                        'mt-0.5 size-4 shrink-0',
                        a.severity === 'warning' && 'text-amber-600',
                        a.severity === 'info' && 'text-accent-primary',
                        a.severity === 'ok' && 'text-emerald-600'
                      )}
                    />
                    <div>
                      <p className="text-text-secondary text-xs font-medium">{a.label}</p>
                      <p className="text-text-primary mt-0.5 text-sm font-bold">{a.msg}</p>
                    </div>
                    <ArrowUpRight className="text-text-muted group-hover:text-accent-primary ml-auto size-3 shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
>>>>>>> recover/cabinet-wip-from-stash
          </div>

<<<<<<< HEAD
        {/* Сетка всех модулей — Организация → Коммуникации */}
        <div data-id="modules-grid" className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-slate-900" />
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              Все модули
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {MODULE_HUBS.map((m) => {
              const Icon = MODULE_ICONS[m.icon] ?? Box;
              const fav = isFavorite(m.id);
              return (
                <Card
                  key={m.id}
                  className="group relative h-full rounded-xl border border-slate-100 p-3 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                >
                  <Link href={m.href} className="block">
                    <div className="flex items-start gap-2">
                      <div className="rounded-lg bg-slate-50 p-1.5 transition-colors group-hover:bg-indigo-50">
                        <Icon className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-bold text-slate-900 group-hover:text-indigo-600">
                          {m.label}
                        </p>
                        <p className="line-clamp-2 text-[8px] text-slate-400">{m.desc}</p>
                      </div>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:text-indigo-500 group-hover:opacity-100" />
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fav
                        ? removeFavorite(m.id)
                        : addFavorite({ id: m.id, href: m.href, label: m.label, group: m.desc });
                    }}
                    className={cn(
                      'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-all hover:bg-amber-50 group-hover:opacity-100',
                      fav && 'opacity-100'
                    )}
                  >
                    <Star
                      className={cn(
                        'h-3.5 w-3.5',
                        fav
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-slate-300 hover:text-amber-500'
                      )}
                    />
                  </button>
                </Card>
              );
            })}
          </div>

          {/* Заказы: BOPIS, Gift Registry, Order Approval, Amendments */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-slate-900" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Заказы
              </h2>
=======
          <ControlCenterOperationalStrip />

          <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div data-testid="control-center-grid" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
                  <section data-testid={tid.panel('orders')}>
                    <div data-testid={tid.panelBody('orders')}>
                      <OrderControlSummaryList />
                    </div>
                  </section>
                  <section data-testid={tid.panel('articles')}>
                    <div data-testid={tid.panelBody('articles')}>
                      <ArticleControlSummaryList />
                    </div>
                  </section>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
                  <section data-testid={tid.panel('commitments')}>
                    <div data-testid={tid.panelBody('commitments')}>
                      <CommitmentControlSummaryList />
                    </div>
                  </section>
                  <section data-testid={tid.panel('samples')}>
                    <div data-testid={tid.panelBody('samples')}>
                      <SampleControlSummaryList />
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <PredictiveRiskWidget risks={predictiveRisks} />
              <TokenEconomyWidget />
            </div>
          </div>

          {/* Персонализация: недавние и избранное */}
          {(recentPages.length > 0 || favorites.length > 0) && (
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {recentPages.length > 0 && (
                <Card className="border-border-subtle rounded-xl border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Clock className="text-text-secondary size-4" /> Недавние страницы
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recentPages.slice(0, 6).map((p, i) => (
                        <Button key={i} asChild variant="outline" size="sm" className="h-8 text-xs">
                          <Link href={p.href}>{p.label}</Link>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {favorites.length > 0 && (
                <Card className="border-border-subtle rounded-xl border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Star className="size-4 fill-amber-500 text-amber-500" /> Избранные модули
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {favorites.slice(0, 6).map((f) => (
                        <div key={f.id} className="flex items-center gap-1">
                          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                            <Link href={f.href}>{f.label}</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-amber-500"
                            onClick={() => removeFavorite(f.id)}
                          >
                            <Star className="size-3.5 fill-amber-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Сетка всех модулей — Организация → Коммуникации */}
          <div data-id="modules-grid" className="mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-text-primary h-1 w-8 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Все модули</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {MODULE_HUBS.map((m) => {
                const Icon = MODULE_ICONS[m.icon] ?? Box;
                const fav = isFavorite(m.id);
                return (
                  <Card
                    key={m.id}
                    className="border-border-subtle hover:border-accent-primary/30 group relative h-full rounded-xl border p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    <Link href={m.href} className="block">
                      <div className="flex items-start gap-2">
                        <div className="bg-bg-surface2 group-hover:bg-accent-primary/10 rounded-lg p-1.5 transition-colors">
                          <Icon className="text-text-secondary group-hover:text-accent-primary size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary group-hover:text-accent-primary truncate text-xs font-bold">
                            {m.label}
                          </p>
                          <p className="text-text-secondary line-clamp-2 text-xs">{m.desc}</p>
                        </div>
                        <ArrowUpRight className="text-text-muted group-hover:text-accent-primary size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fav
                          ? removeFavorite(m.id)
                          : addFavorite({ id: m.id, href: m.href, label: m.label, group: m.desc });
                      }}
                      className={cn(
                        'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-all hover:bg-amber-50 group-hover:opacity-100',
                        fav && 'opacity-100'
                      )}
                    >
                      <Star
                        className={cn(
                          'size-3.5',
                          fav
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-text-muted hover:text-amber-500'
                        )}
                      />
                    </button>
                  </Card>
                );
              })}
            </div>

            {/* Заказы: BOPIS, реестр подарков, согласование и изменения */}
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-text-primary h-1 w-8 rounded-full" />
                <h2 className="text-text-primary text-sm font-semibold">Заказы</h2>
              </div>
              <Card className="border-border-subtle rounded-xl border p-4">
                <p className="text-text-secondary mb-3 text-xs">
                  B2B заказы, самовывоз (BOPIS), списки подарков, согласование и заявки на
                  изменение.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.b2bOrders}>{B2B_ORDERS_REGISTRY_LABEL}</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.bopis}>Центр BOPIS</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.giftRegistry}>Реестр подарков</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.orderApprovalWorkflow}>Согласование заказов</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.orderAmendments}>Изменения заказов</Link>
                  </Button>
                </div>
              </Card>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <Card className="rounded-xl border border-slate-100 p-4">
              <p className="mb-3 text-[10px] text-slate-500">
                B2B заказы, самовывоз (BOPIS), списки подарков, согласование и заявки на изменение.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.b2bOrders}>B2B Заказы</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.bopis}>BOPIS Hub</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.giftRegistry}>Gift Registry</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.orderApprovalWorkflow}>Order Approval</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.orderAmendments}>Order Amendments</Link>
                </Button>
              </div>
            </Card>
          </div>

<<<<<<< HEAD
          {/* Маркетрум: Shop-the-Look, AI Trend Radar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-slate-900" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Маркетрум
              </h2>
            </div>
            <Card className="rounded-xl border border-slate-100 p-4">
              <p className="mb-3 text-[10px] text-slate-500">
                Публичный каталог, луки (Shop-the-Look), AI Trend Radar. Импорт контента из
                1С/Excel.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.marketroom}>Маркетрум</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.marketroomShopTheLook}>Shop-the-Look</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.marketroomTrendRadar}>AI Trend Radar</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px]">
                  <Link href={ROUTES.brand.analyticsPlatformSales}>Статистика Маркетрум</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Hero Section Alignment */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-indigo-600" />
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              Hub Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {NAVIGATION_CARDS.map((card, i) => (
              <motion.div
                key={card.href}
                data-id={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={cn(
                        'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
                        card.bg
                      )}
                    >
                      <card.icon className={cn('h-5 w-5', card.color)} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="h-4 border-none bg-slate-50 px-1.5 text-[7px] font-black uppercase tracking-widest text-slate-600">
                        {card.badge}
                      </Badge>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-slate-900 hover:text-white group-hover:opacity-100"
                      >
                        <Link href={card.href}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-1 text-sm font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                        {card.title}
                      </h3>
                      <p className="line-clamp-2 text-[10px] font-medium leading-relaxed text-slate-500">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {card.features.map((f) => (
                        <Badge
                          key={f}
                          variant="outline"
                          className="h-3.5 rounded-md border-slate-100 px-1.5 py-0.5 text-[6px] font-black uppercase text-slate-400"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>

                    <div className="border-t border-slate-50 pt-4">
                      <Button
                        asChild
                        variant="link"
                        className="h-auto p-0 text-[8px] font-black uppercase tracking-widest text-indigo-600 decoration-indigo-600/30 hover:text-indigo-700"
                      >
                        <Link href={card.href} className="flex items-center gap-1.5">
                          Перейти в раздел{' '}
                          <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary Tools Styling */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Brand Health Score Widget Style */}
          <div className="space-y-3" data-id="health-index">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-emerald-600" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Здоровье Бренда
              </h2>
            </div>
            <Card className="h-full rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                    Health Index
                  </h3>
                  <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                    Composite Performance Score
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-indigo-50 bg-indigo-50/30 shadow-inner">
                  <span className="text-sm font-black text-indigo-600">87</span>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Маржинальность', score: 92, color: 'bg-emerald-500' },
                  { label: 'Лояльность клиентов', score: 84, color: 'bg-blue-500' },
                  { label: 'Эффективность стока', score: 76, color: 'bg-amber-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="tabular-nums text-slate-900">{item.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-1000',
                          item.color
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Token Economy Widget */}
          <div className="space-y-3" data-id="token-economy">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-indigo-600" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Экономика Токенов
              </h2>
            </div>
            <TokenEconomyWidget />
          </div>

          {/* Quick Actions Widget Style */}
          <div className="space-y-3" data-id="quick-actions">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-slate-900" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Быстрые действия
              </h2>
            </div>
            <Card className="group relative h-full overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-sm">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                <Zap className="h-32 w-32 text-indigo-400" />
              </div>
              <div className="relative z-10 flex h-full flex-col space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-black uppercase tracking-tight">
                    Intelligence Commands
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    Часто используемые команды хаба.
                  </p>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/b2b-orders">Создать заказ B2B</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/showroom">Открыть шоурум</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/documents">Документы</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/live">Live / Пульс</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/events">События</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/brand/team">Управление командой</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                  >
                    <Link href="/api/export/dashboard?format=csv">Экспорт данных</Link>
                  </Button>
=======
            {/* Маркетрум: Shop-the-Look, AI Trend Radar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-text-primary h-1 w-8 rounded-full" />
                <h2 className="text-text-primary text-sm font-semibold">Маркетрум</h2>
              </div>
              <Card className="border-border-subtle rounded-xl border p-4">
                <p className="text-text-secondary mb-3 text-xs">
                  Публичный каталог, луки (Shop-the-Look), ИИ Trend Radar. Импорт контента из
                  1С/Excel.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.marketroom}>Маркетрум</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.marketroomShopTheLook}>Лук-комплекты</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.marketroomTrendRadar}>ИИ Trend Radar</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={ROUTES.brand.analyticsPlatformSales}>Статистика Маркетрум</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Hero Section Alignment */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-accent-primary h-1 w-8 rounded-full" />
              <h2 className="text-text-primary text-sm font-semibold">Обзор хаба</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {NAVIGATION_CARDS.map((card, i) => (
                <motion.div
                  key={card.href}
                  data-id={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-border-subtle group relative h-full overflow-hidden rounded-xl border border-none bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl">
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={cn(
                          'rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110',
                          card.bg
                        )}
                      >
                        <card.icon className={cn('size-5', card.color)} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-bg-surface2 text-text-secondary h-4 border-none px-1.5 text-[7px] font-black uppercase tracking-widest">
                          {card.badge}
                        </Badge>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="bg-bg-surface2 text-text-muted hover:bg-text-primary/90 size-7 rounded-lg opacity-0 transition-all hover:text-white group-hover:opacity-100"
                        >
                          <Link href={card.href}>
                            <ArrowUpRight className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-text-primary group-hover:text-accent-primary mb-1 text-sm font-black uppercase tracking-tight transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-text-secondary line-clamp-2 text-xs font-medium leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {card.features.map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className="border-border-subtle text-text-muted h-3.5 rounded-md px-1.5 py-0.5 text-[6px] font-black uppercase"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>

                      <div className="border-border-subtle border-t pt-4">
                        <Button
                          asChild
                          variant="link"
                          className="text-accent-primary decoration-accent-primary/30 hover:text-accent-primary h-auto p-0 text-xs font-medium"
                        >
                          <Link href={card.href} className="flex items-center gap-1.5">
                            Перейти в раздел{' '}
                            <ArrowRight className="size-2.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Secondary Tools Styling */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Brand Health Score Widget Style */}
            <div className="space-y-3" data-id="health-index">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-emerald-600" />
                <h2 className="text-text-primary text-sm font-semibold">Здоровье Бренда</h2>
              </div>
              <Card className="border-border-subtle h-full rounded-xl border border-none bg-white p-4 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                      Индекс здоровья
                    </h3>
                    <p className="text-text-muted text-xs font-black uppercase italic tracking-widest">
                      Композитный показатель эффективности
                    </p>
                  </div>
                  <div className="border-accent-primary/15 bg-accent-primary/10 flex size-12 items-center justify-center rounded-full border-4 shadow-inner">
                    <span className="text-accent-primary text-sm font-black">87</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'Маржинальность', score: 92, color: 'bg-emerald-500' },
                    { label: 'Лояльность клиентов', score: 84, color: 'bg-blue-500' },
                    { label: 'Эффективность стока', score: 76, color: 'bg-amber-500' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="text-text-primary tabular-nums">{item.score}/100</span>
                      </div>
                      <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full shadow-inner">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            item.color
                          )}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </Card>
            </div>

            {/* Quick Actions Widget Style */}
            <div className="space-y-3 lg:col-span-2" data-id="quick-actions">
              <div className="flex items-center gap-2">
                <div className="bg-text-primary h-1 w-8 rounded-full" />
                <h2 className="text-text-primary text-sm font-semibold">Быстрые действия</h2>
              </div>
              <Card className="bg-text-primary group relative h-full overflow-hidden rounded-xl border-none p-4 text-white shadow-sm">
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                  <Zap className="text-accent-primary size-32" />
                </div>
                <div className="relative z-10 flex h-full flex-col space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-black uppercase tracking-tight">
                      Команды аналитики
                    </h3>
                    <p className="text-text-muted text-xs font-medium">
                      Часто используемые команды хаба.
                    </p>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.b2bOrders}>Создать заказ B2B</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.showroom}>Открыть шоурум</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.documents}>Документы</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.live}>Live / Пульс</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.events}>События</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href={ROUTES.brand.team}>Управление командой</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 justify-start rounded-2xl border border-white/5 bg-white/5 px-4 text-xs font-medium text-white transition-all hover:bg-white/10"
                    >
                      <Link href="/api/export/dashboard?format=csv">Экспорт данных</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </OperationalPageChrome>
  );
}
