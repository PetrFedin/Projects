'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { AiVoiceAssistant } from '@/components/admin/voice-assistant';
import { GlobalPulse } from '@/components/global/global-pulse';
import { cn } from '@/lib/utils';
import { BRAND_SIDEBAR_W, cabinetSidebarLayout } from '@/lib/ui/cabinet-surface';
import {
  brandNavGroups,
  allBrandNavLinks,
  getBrandSectionMeta,
  getPrimaryNavGroups,
  getSecondaryNavItems,
} from '@/lib/data/brand-navigation';
import { canSeeNavGroup } from '@/lib/data/profile-page-features';
import { useRbac } from '@/hooks/useRbac';
import { Store, Activity, FileText, Briefcase, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fastApiService } from '@/lib/fastapi-service';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { useBrandCenter } from '@/providers/brand-center-state';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  LayoutGrid,
  ChevronUp,
  ListFilter,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';
import { BrandSidebar } from '@/components/brand/BrandSidebar';
import { SidebarOrgHeader } from '@/components/brand/SidebarOrgHeader';
import { SidebarWidget } from '@/components/brand/SidebarWidget';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { BrandSectionActionsProvider } from '@/providers/brand-section-actions';
import { BrandSectionHeaderBlock } from '@/components/brand/BrandSectionHeaderBlock';
import { ProductionDataBootstrap } from '@/providers/production-data-bootstrap';
import { StageContextBar } from '@/components/brand/production/StageContextBar';
import { PageContainer } from '@/components/design-system';
import {
  CabinetHubMain,
  CabinetHubSectionBar,
  CabinetHubTitleRow,
} from '@/components/layout/cabinet-hub-chrome';
import { cabinetRoleLabelRu } from '@/lib/ui/cabinet-role-labels';

export const navGroups = brandNavGroups;
export const allNavLinks = allBrandNavLinks;

// Global Hub Navigation — только если API вернул валидный массив {path, title}
function GlobalHubNav({ navigation }: { navigation: any[] }) {
  const pathname = usePathname();
  const valid =
    Array.isArray(navigation) &&
    navigation.every(
      (item) => item && typeof item.path === 'string' && typeof item.title === 'string'
    );
  if (!valid || navigation.length === 0) return null;

  return (
    <div className="border-border-subtle bg-bg-surface scrollbar-hide flex w-full flex-nowrap items-center gap-4 overflow-x-auto border-b px-4 py-2 sm:px-6 lg:px-8">
      {navigation.map((item, idx) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={`${item.path}-${idx}`}
            href={item.path}
            className={cn(
              'shrink-0 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.2em] transition-all',
              isActive ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

function BrandLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addRecent } = useBrandCenter();
  const { profile } = useAuth();

  const getCurrentTab = () => {
    const safePathname = pathname || '/';
    const linksWithHref = allNavLinks.filter(
      (l): l is typeof l & { href: string } => typeof l?.href === 'string'
    );
    const sortedLinks = [...linksWithHref].sort(
      (a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0)
    );
    const currentBase = sortedLinks.find((link) => {
      const normalizedPath = safePathname.replace(/\/$/, '') || '/';
      const normalizedLink = (link.href ?? '').replace(/\/$/, '') || '/';

      if (normalizedLink === '/brand') {
        return normalizedPath === '/brand';
      }
      return normalizedPath === normalizedLink || normalizedPath.startsWith(normalizedLink + '/');
    });
    return currentBase?.value || 'dashboard';
  };

  const activeTab = getCurrentTab();
  const activeLinkForRecent = allNavLinks.find((l) => l.value === activeTab);
  const hubBreadcrumbLeaf =
    (pathname || '').replace(/\/$/, '') === '/brand'
      ? 'Профиль'
      : activeLinkForRecent?.label || 'Раздел';
  React.useEffect(() => {
    if (pathname && pathname.startsWith('/brand') && activeLinkForRecent && pathname !== '/brand') {
      addRecent({
        href: pathname,
        label: activeLinkForRecent.label,
        group: activeLinkForRecent.description,
      });
    }
  }, [pathname, activeTab, addRecent]);
  const { businessMode, setBusinessMode } = useUIState();
  const { loading: authLoading } = useAuth();
  const [serverKpis, setServerKpis] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const [showEscapeBtn, setShowEscapeBtn] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Аварийный выход: показываем контент через 300ms, кнопка через 1s. sessionStorage — только на клиенте после mount.
  React.useEffect(() => {
    if (!mounted) return;
    const fromStorage = sessionStorage.getItem('brand-center-loaded') === '1';
    if (fromStorage) setForceShow(true);
    const t1 = window.setTimeout(() => {
      setForceShow(true);
      sessionStorage.setItem('brand-center-loaded', '1');
    }, 300);
    const t2 = window.setTimeout(() => setShowEscapeBtn(true), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted]);

  React.useEffect(() => {
    if (!USE_FASTAPI || authLoading) return;
    const fetchKpis = async () => {
      try {
        const response = await fastApiService.getDashboardKpis();
        if (response.data && response.data.kpis) {
          setServerKpis(response.data.kpis);
        }
      } catch (err) {
        console.warn('Failed to fetch real-time KPIs from FastAPI:', err);
      }
    };
    fetchKpis();
  }, [authLoading]);

  // Dynamic KPI data — разведены по B2B/B2C. Общие (shared) — одинаковы в обоих режимах.
  const getKpiData = () => {
    /** Дефолтный горизонт; union нужен для веток week/month/year без сужения до literal `'month'`. */
    const p = 'month' as 'week' | 'month' | 'year';
    const mode = businessMode;
    const all: Array<{
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
    }> = [
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
        color: (v: number) => 'text-accent-primary',
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
        color: (v: number) => 'text-emerald-600',
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
        color: (v: number) => 'text-accent-primary',
        desc: 'Выручка по оптовым каналам (B2B заказы, ритейлеры).',
        controlledIn: 'B2B Заказы, Ритейлеры, Лайншиты',
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
      {
        scope: 'b2c',
        label: 'B2C Выручка',
        val: p === 'week' ? 7.6 : p === 'month' ? 30.0 : 324.4,
        unit: 'млн ₽',
        trend: p === 'week' ? +3.2 : p === 'month' ? +7.8 : +13.1,
        color: (v: number) => 'text-rose-600',
        desc: 'Выручка по розничным каналам (сайт, Маркетрум, маркетплейсы).',
        controlledIn: 'Продажи, CRM, Маркетинг',
        factors: 'Трафик, Конверсия, AOV',
        href: '/brand/customers',
        roles: ['CEO', 'CMO', 'CDO'],
        sparkline: [50, 55, 52, 58, 60, 65, 70, 75],
        trendText: 'Рост',
      },
      {
        scope: 'b2c',
        label: 'Конверсия',
        val: 2.4,
        unit: '%',
        trend: +0.3,
        color: (v: number) => (v > 2 ? 'text-emerald-500' : 'text-amber-500'),
        desc: 'Конверсия визитов в заказы (розница).',
        controlledIn: 'Маркетинг, Продукт',
        factors: 'UX, Цены, Промо',
        href: '/brand/customer-intelligence',
        roles: ['CMO', 'CDO'],
        sparkline: [1.8, 2.0, 1.9, 2.1, 2.2, 2.3, 2.4, 2.4],
        trendText: 'Рост',
      },
      {
        scope: 'b2c',
        label: 'Новые клиенты',
        val: 88,
        unit: '',
        trend: +12,
        color: () => 'text-accent-primary',
        desc: 'Новые регистрации и первый заказ за период.',
        controlledIn: 'CRM, Маркетинг',
        factors: 'Каналы привлечения',
        href: '/brand/customers',
        roles: ['CMO', 'CDO'],
        sparkline: [60, 65, 70, 72, 75, 78, 82, 88],
        trendText: 'Рост',
      },
    ];
    return all.filter((m) => m.scope === 'shared' || m.scope === mode);
  };

  const kpiData = getKpiData();

  const [currentKpiIndex, setCurrentKpiIndex] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setCurrentKpiIndex((prev) => (kpiData.length ? Math.min(prev, kpiData.length - 1) : 0));
  }, [businessMode, kpiData.length]);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentKpiIndex((prev) => (prev + 1) % Math.max(1, kpiData.length));
    }, 5000);
    return () => clearInterval(timer);
  }, [kpiData.length]);

  const { role, can } = useRbac();
  const filteredFull = navGroups
    .filter(
      (group) =>
        (group as { scope?: string }).scope === 'shared' ||
        (group as { scope?: string }).scope === businessMode
    )
    .filter((group) => canSeeNavGroup(role, group.id, can));
  const filteredNavGroups = getPrimaryNavGroups(filteredFull, () => true);
  const secondaryNavItems = getSecondaryNavItems(filteredFull, () => true);

  // Не показывать loading при SSR/гидрации — иначе hydration mismatch. Только после mount.
  const showLoading = USE_FASTAPI && mounted && authLoading && !forceShow;
  if (showLoading) {
    return (
      <div className="bg-bg-surface flex min-h-screen items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-accent-primary text-text-inverse flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl shadow-xl">
            <Store className="h-7 w-7" />
          </div>
          <p className="text-text-secondary text-[11px] font-black uppercase tracking-widest">
            Загрузка бренд-центра...
          </p>
          <div className="bg-bg-surface2 h-1 w-32 overflow-hidden rounded-full">
            <div className="bg-accent-primary h-full w-1/2 animate-pulse rounded-full" />
          </div>
          {showEscapeBtn && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-[10px]"
              onClick={() => {
                setForceShow(true);
                typeof window !== 'undefined' && sessionStorage.setItem('brand-center-loaded', '1');
              }}
            >
              Показать интерфейс
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ProductionDataBootstrap />
      <div className="bg-bg-surface flex min-h-screen w-full pb-12 font-sans">
        {/* Вертикальная панель — desktop */}
        {/* Левая панель: фиксированная ширина на всём кабинете бренда (cabinet layout v1) */}
        <aside
          className={cn(
            'lg:border-border-subtle lg:bg-bg-surface hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:pt-4',
            cabinetSidebarLayout.asideWidthBrand
          )}
        >
          <SidebarOrgHeader />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <BrandSidebar
              groups={filteredNavGroups}
              secondaryItems={secondaryNavItems}
              businessMode={businessMode}
            />
          </div>
          <SidebarWidget />
        </aside>

        {/* Мобильное меню — Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <SidebarOrgHeader />
            </div>
            <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <BrandSidebar
                groups={filteredNavGroups}
                secondaryItems={secondaryNavItems}
                businessMode={businessMode}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
            <SidebarWidget />
          </SheetContent>
        </Sheet>

        {/* Основная область */}
        <div className={cn('min-w-0 flex-1', cabinetSidebarLayout.mainPaddingLeftBrand)}>
          {profile?.navigation && Array.isArray(profile.navigation) && (
            <GlobalHubNav navigation={profile.navigation} />
          )}
          <BrandSectionActionsProvider>
            <CabinetHubMain className="space-y-2 pt-2">
              <CabinetHubTitleRow
                className="border-border-subtle gap-2 border-b pb-2"
                onOpenMobileNav={() => setSidebarOpen(true)}
                hubIcon={Store}
                iconTileClassName="bg-text-primary text-text-inverse shadow-xl shadow-black/15 ring-1 ring-border-subtle"
                title="Бренд-центр"
                badges={
                  <>
                    <Badge className="bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/15 hidden shrink-0 rounded-sm border-none px-2 py-0.5 text-[8px] font-black tracking-widest sm:inline-flex">
                      Центр управления
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-border-subtle text-text-secondary shrink-0 text-[8px] font-bold"
                    >
                      {cabinetRoleLabelRu(role)}
                    </Badge>
                  </>
                }
                trailing={
                  <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
                    {/* Live Intelligence + переключающиеся KPI — одна линия до поиска */}
                    <div className="border-border-subtle mr-0.5 hidden min-w-0 max-w-full items-center gap-2 border-r pr-2 sm:flex">
                      <p className="text-text-secondary flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-widest">
                        <Activity className="text-accent-primary h-3 w-3 shrink-0" /> Центр
                        live-аналитики
                      </p>
                      <div className="bg-border-subtle h-6 w-px shrink-0" aria-hidden />
                      <TooltipProvider>
                        <div
                          className={cn(
                            'relative flex h-7 w-[min(100%,200px)] min-w-0 items-center overflow-hidden sm:w-[min(100%,220px)]',
                            BRAND_SIDEBAR_W
                          )}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentKpiIndex}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              transition={{ duration: 0.5, ease: 'easeInOut' }}
                              className="absolute inset-0 flex items-center"
                            >
                              {(() => {
                                const m = kpiData[currentKpiIndex];
                                return (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        onClick={() => router.push(m.href)}
                                        className="group/kpi border-border-subtle bg-bg-surface hover:border-accent-primary/30 flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2 py-1 text-[10px] font-black uppercase shadow-sm transition-all hover:shadow-md"
                                      >
                                        <span className="text-text-muted group-hover/kpi:text-accent-primary truncate transition-colors">
                                          {m.label}
                                        </span>
                                        <div className="ml-auto flex shrink-0 items-center gap-1.5">
                                          <span
                                            className={cn(
                                              'text-xs tabular-nums',
                                              m.color(typeof m.val === 'number' ? m.val : 100)
                                            )}
                                          >
                                            {typeof m.val === 'number'
                                              ? `${m.val}${m.unit}`
                                              : m.val}
                                          </span>
                                          <div
                                            className={cn(
                                              'flex items-center text-[8px]',
                                              m.trend > 0 ? 'text-emerald-500' : 'text-rose-500'
                                            )}
                                          >
                                            {m.trend > 0 ? (
                                              <ArrowUpRight className="mr-0.5 h-2 w-2" />
                                            ) : (
                                              <ArrowDownRight className="mr-0.5 h-2 w-2" />
                                            )}
                                            {Math.abs(m.trend)}%
                                          </div>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="bottom"
                                      className="bg-text-primary text-text-inverse z-[100] max-w-[240px] space-y-3 rounded-xl border-none p-3 text-[9px] font-medium shadow-xl"
                                    >
                                      <div>
                                        <div className="mb-1 flex items-start justify-between">
                                          <p className="text-accent-primary font-black uppercase tracking-widest">
                                            {m.label} ·{' '}
                                            {typeof m.val === 'number'
                                              ? `${m.val}${m.unit}`
                                              : m.val}
                                          </p>
                                          <Badge
                                            className={cn(
                                              'h-4 border-none text-[6px] font-black',
                                              m.trend > 0
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-rose-500/20 text-rose-400'
                                            )}
                                          >
                                            {m.trend > 0 ? '+' : ''}
                                            {m.trend}% к пред. периоду
                                          </Badge>
                                        </div>
                                        <p className="leading-relaxed opacity-90">{m.desc}</p>
                                      </div>

                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-white/40">
                                          <span>Тренд (4 недели)</span>
                                          <span
                                            className={cn(
                                              m.trend > 0 ? 'text-emerald-400' : 'text-rose-400'
                                            )}
                                          >
                                            {m.trendText}
                                          </span>
                                        </div>
                                        <div className="flex h-8 w-full items-end gap-0.5">
                                          {(m.sparkline || [30, 45, 35, 60, 55, 80, 75, 90]).map(
                                            (h, idx) => (
                                              <div
                                                key={idx}
                                                className={cn(
                                                  'flex-1 rounded-t-[1px] transition-all duration-500',
                                                  idx === 7 ? 'bg-accent-primary' : 'bg-white/10'
                                                )}
                                                style={{ height: `${h}%` }}
                                              />
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div className="space-y-2 border-t border-white/10 pt-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="block text-[7px] font-black uppercase tracking-widest text-white/45">
                                              Контроль:
                                            </span>
                                            <span className="text-accent-primary/90 block text-[8px] leading-tight">
                                              {m.controlledIn}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="block text-[7px] font-black uppercase tracking-widest text-white/45">
                                              Факторы:
                                            </span>
                                            <span className="block text-[8px] leading-tight text-emerald-400">
                                              {m.factors}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 pt-1">
                                          <Button
                                            onClick={() => router.push(m.href)}
                                            variant="ghost"
                                            className="h-6 rounded-lg border border-white/5 bg-white/5 p-0 text-[6px] font-black uppercase hover:bg-white/10"
                                          >
                                            Детали
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            className="h-6 rounded-lg border border-white/5 bg-white/5 p-0 text-[6px] font-black uppercase hover:bg-white/10"
                                          >
                                            Алерт
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            className="h-6 rounded-lg border border-white/5 bg-white/5 p-0 text-[6px] font-black uppercase hover:bg-white/10"
                                          >
                                            Экспорт
                                          </Button>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })()}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </TooltipProvider>

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
                          <TooltipProvider delayDuration={0}>
                            {kpiData.map((m, i) => (
                              <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                  <DropdownMenuItem
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
                                          currentKpiIndex === i
                                            ? 'bg-accent-primary'
                                            : 'bg-border-subtle'
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
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="bg-text-primary text-text-inverse z-[110] max-w-[220px] space-y-2 rounded-xl border-none p-3 text-[9px] font-medium shadow-xl"
                                >
                                  <p className="text-accent-primary font-black uppercase tracking-widest">
                                    {m.label} · детализация
                                  </p>
                                  <p className="leading-relaxed opacity-90">{m.desc}</p>
                                  <div className="flex gap-3 border-t border-white/10 pt-1">
                                    <div>
                                      <span className="block text-[7px] font-black uppercase tracking-widest text-white/45">
                                        Контроль:
                                      </span>
                                      <span className="text-accent-primary/90 text-[8px]">
                                        {m.controlledIn}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-[7px] font-black uppercase tracking-widest text-white/45">
                                        Факторы:
                                      </span>
                                      <span className="text-[8px] text-emerald-400">
                                        {m.factors}
                                      </span>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <SearchBar />
                    {/* Mode Switcher */}
                    <div className="border-border-subtle bg-bg-surface2 flex items-center rounded-md border p-0.5 shadow-inner">
                      <button
                        onClick={() => setBusinessMode('b2b')}
                        className={cn(
                          'flex items-center gap-2 rounded-sm px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300',
                          businessMode === 'b2b'
                            ? 'bg-bg-surface text-accent-primary ring-border-subtle shadow-md ring-1'
                            : 'text-text-muted hover:text-text-secondary'
                        )}
                      >
                        <Briefcase className="size-3.5" /> Режим B2B
                      </button>
                      <button
                        onClick={() => setBusinessMode('b2c')}
                        className={cn(
                          'flex items-center gap-2 rounded-sm px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300',
                          businessMode === 'b2c'
                            ? 'bg-bg-surface ring-border-subtle text-rose-600 shadow-md ring-1'
                            : 'text-text-muted hover:text-text-secondary'
                        )}
                      >
                        <Rocket className="size-3.5" /> Режим B2C
                      </button>
                    </div>
                  </div>
                }
              />

              <CabinetHubSectionBar
                accentClassName="bg-accent-primary"
                breadcrumbItems={['Аккаунт', 'Кабинет бренда', hubBreadcrumbLeaf]}
                sectionTitle={hubBreadcrumbLeaf}
                trailing={
                  <>
                    {profile?.alerts?.map((alert: any, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-accent-primary/20 bg-accent-primary/10 text-accent-primary h-7 animate-pulse px-2 text-[7px] font-black uppercase tracking-widest"
                      >
                        {alert.message}
                      </Badge>
                    ))}
                  </>
                }
              />

              <BrandSectionHeaderBlock />
              <StageContextBar />
              <main className="mt-2 duration-500 animate-in fade-in slide-in-from-bottom-2">
                <PageContainer
                  className={
                    /* cabinet layout v1: контент на полную ширину колонки, компактные боковые отступы */
                    '!mx-0 w-full max-w-none !px-3 !py-4 sm:!px-4 sm:!py-5 lg:!px-5'
                  }
                >
                  <ErrorBoundary>{children}</ErrorBoundary>
                </PageContainer>
              </main>
            </CabinetHubMain>
          </BrandSectionActionsProvider>

          <AiVoiceAssistant />
          <GlobalPulse />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-surface text-text-muted flex min-h-screen items-center justify-center text-xs font-medium uppercase tracking-widest">
          Загрузка…
        </div>
      }
    >
      <BrandLayoutContent>{children}</BrandLayoutContent>
    </Suspense>
  );
}
