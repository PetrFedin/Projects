'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowDownRight, ArrowUpRight, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fastApiService } from '@/lib/fastapi-service';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { BRAND_SIDEBAR_W } from '@/lib/ui/cabinet-surface';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const BRAND_HUB_BUSINESS_MODE = 'b2b' as const;

type KpiItem = {
  scope: 'shared' | 'b2b' | 'b2c';
  label: string;
  val: number | string;
  unit: string;
  trend: number;
  color: (v: number) => string;
  desc: string;
  controlledIn: string;
  factors: string;
  href: string;
  roles: string[];
  sparkline: number[];
  trendText: string;
};

function buildBrandHubKpiData(serverKpis: Record<string, number> | null): KpiItem[] {
  const p = 'month' as 'week' | 'month' | 'year';
  const mode = BRAND_HUB_BUSINESS_MODE;
  const all: KpiItem[] = [
    {
      scope: 'shared',
      label: 'Выручка',
      val: serverKpis?.revenue
        ? (serverKpis.revenue / 1000000).toFixed(1)
        : p === 'week'
          ? 12.4
          : p === 'month'
            ? 48.2
            : 542.8,
      unit: 'млн ₽',
      trend: p === 'week' ? +4.2 : p === 'month' ? +8.4 : +12.5,
      color: () => 'text-accent-primary',
      desc: 'Общий объем продаж (GMV) по всем каналам.',
      controlledIn: 'Финансы, Продажи, Дашборд',
      factors: 'Объем заказов, Средний чек, Конверсия',
      href: '/brand/finance',
      roles: ['CEO', 'CFO', 'CMO', 'CDO'],
      sparkline: [45, 52, 48, 61, 55, 67, 72, 84],
      trendText: 'Рост',
    },
    {
      scope: 'shared',
      label: 'Прибыль',
      val: serverKpis?.profit
        ? (serverKpis.profit / 1000000).toFixed(1)
        : p === 'week'
          ? 3.1
          : p === 'month'
            ? 12.4
            : 142.1,
      unit: 'млн ₽',
      trend: p === 'week' ? +2.1 : p === 'month' ? +4.8 : +9.2,
      color: () => 'text-emerald-600',
      desc: 'Чистая прибыль (Net Profit): Доход после вычета всех операционных и маркетинговых затрат.',
      controlledIn: 'Финансы, P&L, Налоги',
      factors: 'Маржинальность, Оперзатраты, CAC',
      href: '/brand/finance',
      roles: ['CFO', 'CEO', 'COO'],
      sparkline: [30, 35, 32, 40, 38, 45, 48, 52],
      trendText: 'Стабильно',
    },
    {
      scope: 'shared',
      label: 'Операции',
      val: serverKpis?.operations || (p === 'week' ? 92 : p === 'month' ? 94 : 96),
      unit: '%',
      trend: p === 'week' ? -1.2 : p === 'month' ? +2.1 : +4.5,
      color: (v: number) =>
        v > 90 ? 'text-emerald-500' : v > 80 ? 'text-amber-500' : 'text-rose-500',
      desc: 'Эффективность операций: производство, логистика, Fill Rate.',
      controlledIn: 'Производство, VMI, Дашборд',
      factors: 'Автоматизация, Скорость отгрузок, Доступность сырья',
      href: '/brand/production',
      roles: ['COO', 'CEO', 'CTO', 'CDO'],
      sparkline: [65, 59, 80, 81, 56, 55, 40, 94],
      trendText: 'Восстановление',
    },
    {
      scope: 'shared',
      label: 'Маржа',
      val: serverKpis?.margin || (p === 'week' ? 38 : p === 'month' ? 42 : 45),
      unit: '%',
      trend: p === 'week' ? -0.5 : p === 'month' ? +1.4 : +3.2,
      color: (v: number) =>
        v > 40 ? 'text-emerald-500' : v > 35 ? 'text-amber-500' : 'text-rose-500',
      desc: 'Валовая маржа: доходность по всем каналам после себестоимости.',
      controlledIn: 'Финансы, Продажи, PIM',
      factors: 'Себестоимость, Маркетинг, Глубина скидок',
      href: '/brand/finance',
      roles: ['CFO', 'CEO', 'CSO', 'CMO'],
      sparkline: [28, 48, 40, 19, 86, 27, 90, 42],
      trendText: 'Стабильно',
    },
    {
      scope: 'shared',
      label: 'Сток',
      val: serverKpis?.stock_health || (p === 'week' ? 82 : p === 'month' ? 88 : 91),
      unit: '%',
      trend: p === 'week' ? -2.1 : p === 'month' ? +0.8 : +2.4,
      color: (v: number) =>
        v > 85 ? 'text-emerald-500' : v > 75 ? 'text-amber-500' : 'text-rose-500',
      desc: 'Здоровье стока: оборачиваемость, минимизация неликвида.',
      controlledIn: 'Продукты, Производство, Заказы',
      factors: 'Оборачиваемость, Прогноз спроса, Остатки',
      href: '/brand/inventory',
      roles: ['COO', 'CEO', 'CFO'],
      sparkline: [40, 44, 48, 50, 52, 54, 56, 88],
      trendText: 'Оптимизация',
    },
    {
      scope: 'shared',
      label: 'ESG',
      val: serverKpis?.esg_score || 'A+',
      unit: '',
      trend: p === 'week' ? +0.1 : p === 'month' ? +0.2 : +0.5,
      color: () => 'text-emerald-600',
      desc: 'Рейтинг устойчивости: экология и этика цепочки поставок.',
      controlledIn: 'Устойчивость, Производство, Команда',
      factors: 'Эко-сырье, Условия труда, Соцпроекты',
      href: '/brand/esg',
      roles: ['CEO', 'CSO', 'CHRO'],
      sparkline: [90, 91, 92, 92, 93, 93, 94, 95],
      trendText: 'Лидерство',
    },
    {
      scope: 'b2b',
      label: 'B2B Выручка',
      val: p === 'week' ? 4.8 : p === 'month' ? 18.2 : 218.4,
      unit: 'млн ₽',
      trend: p === 'week' ? +6.1 : p === 'month' ? +9.2 : +11.3,
      color: () => 'text-accent-primary',
      desc: 'Выручка по оптовым каналам (B2B заказы, ритейлеры).',
      controlledIn: 'Заказы, Ритейлеры, Лайншиты',
      factors: 'Заказы опт, Средний чек B2B',
      href: '/brand/b2b-orders',
      roles: ['CEO', 'CFO', 'CMO'],
      sparkline: [40, 45, 42, 55, 58, 62, 68, 72],
      trendText: 'Рост',
    },
    {
      scope: 'b2b',
      label: 'PO в работе',
      val: 4,
      unit: '',
      trend: 0,
      color: () => 'text-text-primary',
      desc: 'Purchase Orders в статусе производства.',
      controlledIn: 'Производство, B2B',
      factors: 'Загрузка линий, Сроки',
      href: '/brand/production',
      roles: ['COO', 'CEO'],
      sparkline: [70, 75, 72, 78, 80, 82, 85, 88],
      trendText: '—',
    },
  ];
  return all.filter((m) => m.scope === 'shared' || m.scope === mode);
}

/** KPI-тикер шапки бренд-центра — только клиент (Radix Tooltip ломает SSR/hydration). */
export function BrandHubKpiStrip() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [serverKpis, setServerKpis] = useState<Record<string, number> | null>(null);
  const [currentKpiIndex, setCurrentKpiIndex] = useState(0);

  useEffect(() => {
    if (!USE_FASTAPI || authLoading) return;
    void (async () => {
      try {
        const response = await fastApiService.getDashboardKpis();
        if (response.data?.kpis) {
          setServerKpis(response.data.kpis as Record<string, number>);
        }
      } catch (err) {
        console.warn('Failed to fetch real-time KPIs from FastAPI:', err);
      }
    })();
  }, [authLoading]);

  const kpiData = useMemo(() => buildBrandHubKpiData(serverKpis), [serverKpis]);
  const activeKpiIndex =
    kpiData.length > 0 ? ((currentKpiIndex % kpiData.length) + kpiData.length) % kpiData.length : 0;
  const activeKpi = kpiData[activeKpiIndex];

  useEffect(() => {
    if (kpiData.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentKpiIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [kpiData.length]);

  return (
    <div className="border-border-subtle mr-0.5 hidden min-w-0 max-w-full items-center gap-2 border-r pr-2 2xl:flex">
      <p className="text-text-secondary flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-widest">
        <Activity className="text-accent-primary h-3 w-3 shrink-0" /> Центр live-аналитики
      </p>
      <div className="bg-border-subtle h-6 w-px shrink-0" aria-hidden />
      <div
        className={cn(
          'relative flex h-7 w-[min(100%,200px)] min-w-0 items-center overflow-hidden sm:w-[min(100%,220px)]',
          BRAND_SIDEBAR_W
        )}
      >
        {activeKpi ? (
          <button
            type="button"
            title={activeKpi.desc}
            onClick={() => router.push(activeKpi.href)}
            className="group/kpi border-border-subtle bg-bg-surface hover:border-accent-primary/30 flex h-7 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2 py-1 text-[10px] font-black uppercase shadow-sm transition-all hover:shadow-md"
          >
            <span className="text-text-muted group-hover/kpi:text-accent-primary truncate transition-colors">
              {activeKpi.label}
            </span>
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  'text-xs tabular-nums',
                  activeKpi.color(typeof activeKpi.val === 'number' ? activeKpi.val : 100)
                )}
              >
                {typeof activeKpi.val === 'number'
                  ? `${activeKpi.val}${activeKpi.unit}`
                  : activeKpi.val}
              </span>
              <div
                className={cn(
                  'flex items-center text-[8px]',
                  activeKpi.trend > 0 ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {activeKpi.trend > 0 ? (
                  <ArrowUpRight className="mr-0.5 h-2 w-2" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-2 w-2" />
                )}
                {Math.abs(activeKpi.trend)}%
              </div>
            </div>
          </button>
        ) : (
          <div
            className="border-border-subtle bg-bg-surface2 h-7 w-full min-w-0 animate-pulse rounded-lg border"
            aria-hidden
          />
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:bg-accent-primary/10 hover:text-accent-primary h-7 w-7 shrink-0 rounded-lg transition-all"
          >
            <ListFilter className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-border-subtle bg-bg-surface z-[100] w-64 rounded-2xl border p-2 shadow-2xl"
        >
          <p className="border-border-subtle text-text-muted mb-1 border-b px-3 py-2 text-[8px] font-black uppercase tracking-widest">
            Все показатели
          </p>
          {kpiData.map((m, i) => (
            <DropdownMenuItem
              key={m.label}
              title={m.desc}
              onClick={() => {
                setCurrentKpiIndex(i);
                router.push(m.href);
              }}
              className="hover:bg-bg-surface2 group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    activeKpiIndex === i ? 'bg-accent-primary' : 'bg-border-subtle'
                  )}
                />
                <span className="text-text-primary group-hover:text-accent-primary text-[10px] font-black uppercase tracking-widest transition-colors">
                  {m.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[10px] font-black',
                    m.color(typeof m.val === 'number' ? m.val : 100)
                  )}
                >
                  {typeof m.val === 'number' ? `${m.val}${m.unit}` : m.val}
                </span>
                <div
                  className={cn(
                    'flex items-center text-[7px] font-bold',
                    m.trend > 0 ? 'text-emerald-500' : 'text-rose-500'
                  )}
                >
                  {m.trend > 0 ? '↑' : '↓'}
                  {Math.abs(m.trend)}%
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
