'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { AiVoiceAssistant } from '@/components/admin/voice-assistant';
import { GlobalPulse } from '@/components/global/global-pulse';
import { cn } from '@/lib/utils';
import { brandNavGroups, allBrandNavLinks, getBrandSectionMeta, getPrimaryNavGroups, getSecondaryNavItems } from '@/lib/data/brand-navigation';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Wallet,
    Percent,
    ArrowUpRight,
    ArrowDownRight,
    Menu,
    Layers,
    LayoutGrid,
    ChevronUp,
    ListFilter
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

export const navGroups = brandNavGroups;
export const allNavLinks = allBrandNavLinks;

// Global Hub Navigation — только если API вернул валидный массив {path, title}
function GlobalHubNav({ navigation }: { navigation: any[] }) {
    const pathname = usePathname();
    const valid = Array.isArray(navigation) && navigation.every(
        (item) => item && typeof item.path === 'string' && typeof item.title === 'string'
    );
    if (!valid || navigation.length === 0) return null;

    return (
        <div className="w-full bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-hide flex items-center gap-4 flex-nowrap">
            {navigation.map((item, idx) => {
                const isActive = pathname === item.path;
                return (
                    <Link 
                        key={`${item.path}-${idx}`}
                        href={item.path}
                        className={cn(
                            "text-[8px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shrink-0",
                            isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-900"
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
      const linksWithHref = allNavLinks.filter((l): l is typeof l & { href: string } => typeof l?.href === 'string');
      const sortedLinks = [...linksWithHref].sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0));
      const currentBase = sortedLinks.find(link => {
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
    const activeLinkForRecent = allNavLinks.find(l => l.value === activeTab);
    React.useEffect(() => {
        if (pathname && pathname.startsWith('/brand') && activeLinkForRecent && pathname !== '/brand') {
            addRecent({ href: pathname, label: activeLinkForRecent.label, group: activeLinkForRecent.description });
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
      return () => { clearTimeout(t1); clearTimeout(t2); };
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
        const p = 'month' as const;
        const mode = businessMode;
        const all: Array<{ scope: 'shared' | 'b2b' | 'b2c'; label: string; val: number | string; unit: string; trend: number; color: (v: number) => string; desc: string; controlledIn: string; factors: string; href: string; roles: string[]; sparkline: number[]; trendText: string }> = [
            { scope: 'shared', label: 'Выручка', val: serverKpis?.revenue ? (serverKpis.revenue / 1000000).toFixed(1) : (p === 'week' ? 12.4 : p === 'month' ? 48.2 : 542.8), unit: 'млн ₽', trend: p === 'week' ? +4.2 : p === 'month' ? +8.4 : +12.5, color: (v: number) => 'text-indigo-600', desc: 'Общий объем продаж (GMV) по всем каналам.', controlledIn: 'Финансы, Продажи, Дашборд', factors: 'Объем заказов, Средний чек, Конверсия', href: '/brand/finance', roles: ['CEO', 'CFO', 'CMO', 'CDO'], sparkline: [45, 52, 48, 61, 55, 67, 72, 84], trendText: 'Рост' },
            { scope: 'shared', label: 'Прибыль', val: serverKpis?.profit ? (serverKpis.profit / 1000000).toFixed(1) : (p === 'week' ? 3.1 : p === 'month' ? 12.4 : 142.1), unit: 'млн ₽', trend: p === 'week' ? +2.1 : p === 'month' ? +4.8 : +9.2, color: (v: number) => 'text-emerald-600', desc: 'Чистая прибыль (Net Profit): Доход после вычета всех операционных и маркетинговых затрат.', controlledIn: 'Финансы, P&L, Налоги', factors: 'Маржинальность, Оперзатраты, CAC', href: '/brand/finance', roles: ['CFO', 'CEO', 'COO'], sparkline: [30, 35, 32, 40, 38, 45, 48, 52], trendText: 'Стабильно' },
            { scope: 'shared', label: 'Операции', val: serverKpis?.operations || (p === 'week' ? 92 : p === 'month' ? 94 : 96), unit: '%', trend: p === 'week' ? -1.2 : p === 'month' ? +2.1 : +4.5, color: (v: number) => v > 90 ? 'text-emerald-500' : v > 80 ? 'text-amber-500' : 'text-rose-500', desc: 'Эффективность операций: производство, логистика, Fill Rate.', controlledIn: 'Производство, VMI, Дашборд', factors: 'Автоматизация, Скорость отгрузок, Доступность сырья', href: '/brand/production', roles: ['COO', 'CEO', 'CTO', 'CDO'], sparkline: [65, 59, 80, 81, 56, 55, 40, 94], trendText: 'Восстановление' },
            { scope: 'shared', label: 'Маржа', val: serverKpis?.margin || (p === 'week' ? 38 : p === 'month' ? 42 : 45), unit: '%', trend: p === 'week' ? -0.5 : p === 'month' ? +1.4 : +3.2, color: (v: number) => v > 40 ? 'text-emerald-500' : v > 35 ? 'text-amber-500' : 'text-rose-500', desc: 'Валовая маржа: доходность по всем каналам после себестоимости.', controlledIn: 'Финансы, Продажи, PIM', factors: 'Себестоимость, Маркетинг, Глубина скидок', href: '/brand/finance', roles: ['CFO', 'CEO', 'CSO', 'CMO'], sparkline: [28, 48, 40, 19, 86, 27, 90, 42], trendText: 'Стабильно' },
            { scope: 'shared', label: 'Сток', val: serverKpis?.stock_health || (p === 'week' ? 82 : p === 'month' ? 88 : 91), unit: '%', trend: p === 'week' ? -2.1 : p === 'month' ? +0.8 : +2.4, color: (v: number) => v > 85 ? 'text-emerald-500' : v > 75 ? 'text-amber-500' : 'text-rose-500', desc: 'Здоровье стока: оборачиваемость, минимизация неликвида.', controlledIn: 'Продукты, Производство, Заказы', factors: 'Оборачиваемость, Прогноз спроса, Остатки', href: '/brand/inventory', roles: ['COO', 'CEO', 'CFO'], sparkline: [40, 44, 48, 50, 52, 54, 56, 88], trendText: 'Оптимизация' },
            { scope: 'shared', label: 'ESG', val: serverKpis?.esg_score || 'A+', unit: '', trend: p === 'week' ? +0.1 : p === 'month' ? +0.2 : +0.5, color: () => 'text-emerald-600', desc: 'Рейтинг устойчивости: экология и этика цепочки поставок.', controlledIn: 'Устойчивость, Производство, Команда', factors: 'Эко-сырье, Условия труда, Соцпроекты', href: '/brand/esg', roles: ['CEO', 'CSO', 'CHRO'], sparkline: [90, 91, 92, 92, 93, 93, 94, 95], trendText: 'Лидерство' },
            { scope: 'b2b', label: 'B2B Выручка', val: p === 'week' ? 4.8 : p === 'month' ? 18.2 : 218.4, unit: 'млн ₽', trend: p === 'week' ? +6.1 : p === 'month' ? +9.2 : +11.3, color: (v: number) => 'text-indigo-600', desc: 'Выручка по оптовым каналам (B2B заказы, ритейлеры).', controlledIn: 'B2B Заказы, Ритейлеры, Лайншиты', factors: 'Заказы опт, Средний чек B2B', href: '/brand/b2b-orders', roles: ['CEO', 'CFO', 'CMO'], sparkline: [40, 45, 42, 55, 58, 62, 68, 72], trendText: 'Рост' },
            { scope: 'b2b', label: 'PO в работе', val: 4, unit: '', trend: 0, color: () => 'text-slate-700', desc: 'Purchase Orders в статусе производства.', controlledIn: 'Производство, B2B', factors: 'Загрузка линий, Сроки', href: '/brand/production', roles: ['COO', 'CEO'], sparkline: [70, 75, 72, 78, 80, 82, 85, 88], trendText: '—' },
            { scope: 'b2c', label: 'B2C Выручка', val: p === 'week' ? 7.6 : p === 'month' ? 30.0 : 324.4, unit: 'млн ₽', trend: p === 'week' ? +3.2 : p === 'month' ? +7.8 : +13.1, color: (v: number) => 'text-rose-600', desc: 'Выручка по розничным каналам (сайт, Маркетрум, маркетплейсы).', controlledIn: 'Продажи, CRM, Маркетинг', factors: 'Трафик, Конверсия, AOV', href: '/brand/customers', roles: ['CEO', 'CMO', 'CDO'], sparkline: [50, 55, 52, 58, 60, 65, 70, 75], trendText: 'Рост' },
            { scope: 'b2c', label: 'Конверсия', val: 2.4, unit: '%', trend: +0.3, color: (v: number) => v > 2 ? 'text-emerald-500' : 'text-amber-500', desc: 'Конверсия визитов в заказы (розница).', controlledIn: 'Маркетинг, Продукт', factors: 'UX, Цены, Промо', href: '/brand/customer-intelligence', roles: ['CMO', 'CDO'], sparkline: [1.8, 2.0, 1.9, 2.1, 2.2, 2.3, 2.4, 2.4], trendText: 'Рост' },
            { scope: 'b2c', label: 'Новые клиенты', val: 88, unit: '', trend: +12, color: () => 'text-indigo-600', desc: 'Новые регистрации и первый заказ за период.', controlledIn: 'CRM, Маркетинг', factors: 'Каналы привлечения', href: '/brand/customers', roles: ['CMO', 'CDO'], sparkline: [60, 65, 70, 72, 75, 78, 82, 88], trendText: 'Рост' },
        ];
        return all.filter(m => m.scope === 'shared' || m.scope === mode);
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
        .filter(group => (group as { scope?: string }).scope === 'shared' || (group as { scope?: string }).scope === businessMode)
        .filter(group => canSeeNavGroup(role, group.id, can));
    const filteredNavGroups = getPrimaryNavGroups(filteredFull, () => true);
    const secondaryNavItems = getSecondaryNavItems(filteredFull, () => true);

    // Не показывать loading при SSR/гидрации — иначе hydration mismatch. Только после mount.
    const showLoading = USE_FASTAPI && mounted && authLoading && !forceShow;
    if (showLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                        <Store className="h-7 w-7" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Загрузка Brand Center...</p>
                    <div className="h-1 w-32 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full w-1/2 bg-indigo-500 rounded-full animate-pulse" />
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
        <div className="flex w-full bg-[#f8fafc] min-h-screen font-sans pb-12">
            {/* Вертикальная панель — desktop */}
            <aside className="hidden lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:z-30 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
                <SidebarOrgHeader />
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                  <BrandSidebar groups={filteredNavGroups} secondaryItems={secondaryNavItems} businessMode={businessMode} />
                </div>
                <SidebarWidget />
            </aside>

            {/* Мобильное меню — Sheet */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-72 p-0 gap-0 flex flex-col">
                    <div className="pt-12 pb-0 shrink-0">
                        <SidebarOrgHeader />
                    </div>
                    <div className="px-3 pb-2 border-b border-slate-100 shrink-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Навигация</p>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <BrandSidebar groups={filteredNavGroups} secondaryItems={secondaryNavItems} businessMode={businessMode} onNavigate={() => setSidebarOpen(false)} />
                    </div>
                    <SidebarWidget />
                </SheetContent>
            </Sheet>

            {/* Основная область */}
            <div className="flex-1 min-w-0 lg:pl-52">
            {profile?.navigation && Array.isArray(profile.navigation) && <GlobalHubNav navigation={profile.navigation} />}
            <BrandSectionActionsProvider>
            <div className="pl-2 pr-4 lg:pl-3 lg:pr-6 pt-4 space-y-2">
                {/* Header: Title Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11 rounded-[4px] shrink-0 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-5 w-5 text-slate-700" />
                            <span className="sr-only">Меню</span>
                        </Button>
                        <div className="h-11 w-11 rounded-[4px] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 ring-1 ring-slate-800 shrink-0">
                            <Store className="h-5.5 w-5.5" />
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <h1 className="text-sm sm:text-base font-black uppercase tracking-tighter leading-none text-slate-900 truncate">Бренд-центр</h1>
                            <Badge className="hidden sm:inline-flex bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-none text-[8px] font-black tracking-widest px-2 py-0.5 rounded-[2px] shrink-0">
                                COMMAND_CENTER
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 min-w-0 flex-wrap justify-end sm:justify-end w-full sm:w-auto">
                        {/* Live Intelligence + переключающиеся KPI — одна линия до поиска */}
                        <div className="hidden sm:flex items-center gap-2 min-w-0 max-w-full pr-2 border-r border-slate-200 mr-0.5">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                <Activity className="h-3 w-3 text-indigo-500 shrink-0" /> Live Intelligence Hub
                            </p>
                            <div className="h-6 w-px bg-slate-200 shrink-0" aria-hidden />
                            <TooltipProvider>
                                <div className="relative h-7 flex items-center overflow-hidden min-w-0 w-[min(100%,200px)] sm:w-[min(100%,220px)] lg:w-56">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentKpiIndex}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="absolute inset-0 flex items-center"
                                        >
                                            {(() => {
                                                const m = kpiData[currentKpiIndex];
                                                return (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                onClick={() => router.push(m.href)}
                                                                className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-sm cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group/kpi w-full min-w-0"
                                                            >
                                                                <span className="text-slate-400 group-hover/kpi:text-indigo-600 transition-colors truncate">{m.label}</span>
                                                                <div className="flex items-center gap-1.5 ml-auto shrink-0">
                                                                    <span className={cn("text-xs tabular-nums", m.color(typeof m.val === 'number' ? m.val : 100))}>
                                                                        {typeof m.val === 'number' ? `${m.val}${m.unit}` : m.val}
                                                                    </span>
                                                                    <div className={cn(
                                                                        "flex items-center text-[8px]",
                                                                        m.trend > 0 ? "text-emerald-500" : "text-rose-500"
                                                                    )}>
                                                                        {m.trend > 0 ? <ArrowUpRight className="h-2 w-2 mr-0.5" /> : <ArrowDownRight className="h-2 w-2 mr-0.5" />}
                                                                        {Math.abs(m.trend)}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[9px] font-medium max-w-[240px] p-3 rounded-xl shadow-xl space-y-3 z-[100]">
                                                            <div>
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-black uppercase tracking-widest text-indigo-400">{m.label} // {typeof m.val === 'number' ? `${m.val}${m.unit}` : m.val}</p>
                                                                    <Badge className={cn(
                                                                        "text-[6px] font-black border-none h-4",
                                                                        m.trend > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                                                                    )}>
                                                                        {m.trend > 0 ? '+' : ''}{m.trend}% vs prev.
                                                                    </Badge>
                                                                </div>
                                                                <p className="opacity-90 leading-relaxed">{m.desc}</p>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center text-[7px] font-black uppercase text-white/40 tracking-widest">
                                                                    <span>Trend (4 weeks)</span>
                                                                    <span className={cn(
                                                                        m.trend > 0 ? "text-emerald-400" : "text-rose-400"
                                                                    )}>{m.trendText}</span>
                                                                </div>
                                                                <div className="h-8 w-full flex items-end gap-0.5">
                                                                    {(m.sparkline || [30, 45, 35, 60, 55, 80, 75, 90]).map((h, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={cn(
                                                                                "flex-1 rounded-t-[1px] transition-all duration-500",
                                                                                idx === 7 ? "bg-indigo-500" : "bg-white/10"
                                                                            )}
                                                                            style={{ height: `${h}%` }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="pt-2 border-t border-white/10 space-y-2">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <span className="text-[7px] font-black uppercase text-slate-400 block tracking-widest">Контроль:</span>
                                                                        <span className="text-indigo-200 text-[8px] leading-tight block">{m.controlledIn}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[7px] font-black uppercase text-slate-400 block tracking-widest">Факторы:</span>
                                                                        <span className="text-emerald-400 text-[8px] leading-tight block">{m.factors}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-1 pt-1">
                                                                    <Button onClick={() => router.push(m.href)} variant="ghost" className="h-6 rounded-lg bg-white/5 hover:bg-white/10 text-[6px] font-black uppercase p-0 border border-white/5">Детали</Button>
                                                                    <Button variant="ghost" className="h-6 rounded-lg bg-white/5 hover:bg-white/10 text-[6px] font-black uppercase p-0 border border-white/5">Алерт</Button>
                                                                    <Button variant="ghost" className="h-6 rounded-lg bg-white/5 hover:bg-white/10 text-[6px] font-black uppercase p-0 border border-white/5">Экспорт</Button>
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
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shrink-0">
                                        <ListFilter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[100]">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b border-slate-50 mb-1">Все показатели</p>
                                    <TooltipProvider delayDuration={0}>
                                        {kpiData.map((m, i) => (
                                            <Tooltip key={i}>
                                                <TooltipTrigger asChild>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setCurrentKpiIndex(i);
                                                            router.push(m.href);
                                                        }}
                                                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("h-1.5 w-1.5 rounded-full", currentKpiIndex === i ? "bg-indigo-500" : "bg-slate-200")} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-indigo-600 transition-colors">{m.label}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn("text-[10px] font-black", m.color(typeof m.val === 'number' ? m.val : 100))}>
                                                                {typeof m.val === 'number' ? `${m.val}${m.unit}` : m.val}
                                                            </span>
                                                            <div className={cn(
                                                                "flex items-center text-[7px] font-bold",
                                                                m.trend > 0 ? "text-emerald-500" : "text-rose-500"
                                                            )}>
                                                                {m.trend > 0 ? '↑' : '↓'}{Math.abs(m.trend)}%
                                                            </div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="bg-slate-900 text-white border-none text-[9px] font-medium max-w-[220px] p-3 rounded-xl shadow-xl space-y-2 z-[110]">
                                                    <p className="font-black uppercase tracking-widest text-indigo-400">{m.label} // Детализация</p>
                                                    <p className="opacity-90 leading-relaxed">{m.desc}</p>
                                                    <div className="flex gap-3 pt-1 border-t border-white/10">
                                                        <div>
                                                            <span className="text-[7px] font-black uppercase text-slate-400 block tracking-widest">Контроль:</span>
                                                            <span className="text-indigo-200 text-[8px]">{m.controlledIn}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[7px] font-black uppercase text-slate-400 block tracking-widest">Факторы:</span>
                                                            <span className="text-emerald-400 text-[8px]">{m.factors}</span>
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
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-[4px] border border-slate-200 shadow-inner">
                            <button
                                onClick={() => setBusinessMode('b2b')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-[2px] text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                    businessMode === 'b2b' 
                                        ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Briefcase className="h-3.5 w-3.5" /> B2B Mode
                            </button>
                            <button
                                onClick={() => setBusinessMode('b2c')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-[2px] text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                    businessMode === 'b2c' 
                                        ? "bg-white text-rose-600 shadow-md ring-1 ring-slate-200" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Rocket className="h-3.5 w-3.5" /> B2C Mode
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="flex flex-wrap items-center gap-2 pt-0 border-b border-slate-100/80 pb-2">
                    {profile?.alerts?.map((alert: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="h-7 border-indigo-100 bg-indigo-50/30 text-indigo-600 text-[7px] font-black uppercase tracking-widest px-2 animate-pulse">
                            {alert.message}
                        </Badge>
                    ))}
                </div>

                <BrandSectionHeaderBlock />
                <StageContextBar />
                <main className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <PageContainer
                        className={cn(
                            '!py-4 sm:!py-5',
                            pathname?.startsWith('/brand/production/workshop2')
                                ? 'max-w-7xl'
                                : pathname !== '/brand' &&
                                    pathname !== '/brand/' &&
                                    !pathname?.startsWith('/brand/organization')
                                  ? 'max-w-6xl'
                                  : 'max-w-[1400px]'
                        )}
                    >
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </PageContainer>
                </main>
            </div>
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
                <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                    Загрузка…
                </div>
            }
        >
            <BrandLayoutContent>{children}</BrandLayoutContent>
        </Suspense>
    );
}
