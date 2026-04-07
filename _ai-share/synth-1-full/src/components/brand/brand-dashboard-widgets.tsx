'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

import { WidgetDetailSheet, WidgetType } from "@/components/brand/widget-detail-sheet";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fmtMoney } from "@/lib/format";
import { EXCHANGE_RATES } from "@/lib/constants";
import Link from "next/link";
import { useUIState } from "@/providers/ui-state";
import { getDefaultUpcomingDeadlines } from "@/lib/data/calendar-events";
import { fastApiService } from "@/lib/fastapi-service";

import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";

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
        dashboardPeriod, businessMode,
        filterChannel, setFilterChannel,
        filterRegion, setFilterRegion,
        filterCollection, setFilterCollection 
    } = useUIState();
    const period = dashboardPeriod;
    const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
    const [showEquivalents, setShowEquivalents] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [serverKpis, setServerKpis] = useState<any>(null);

    const btnStyle = "rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all h-8";
    const subBtnStyle = "rounded-lg font-bold uppercase text-[9px] tracking-wider transition-all h-7 px-3";

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
        { type: 'gmv' as WidgetType, label: "Выручка (GMV)", value: getKpi('revenue', 388000000), change: "+24%", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", section: "Финансы", href: "/brand/finance", desc: "Gross Merchandise Volume: Общий объем продаж всех товаров." },
        { type: 'fill_rate' as WidgetType, label: "Исполнение (Fill Rate)", value: getKpi('operations', 94.2) + "%", change: "+2.1%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", section: "Операции", href: "/brand/inventory", desc: "Процент укомплектованных и отгруженных заказов." },
        { type: 'pipeline' as WidgetType, label: "Активные заказы", value: getKpi('total_orders', 842), change: "+15", icon: Package, color: "text-indigo-600", bg: "bg-indigo-50", section: "Склад", href: "/brand/b2b-orders", desc: "Количество заказов в обработке на текущий момент." },
        { type: 'retailers' as WidgetType, label: "Партнеры (B2B)", value: getKpi('active_showrooms', 128), change: "+5", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", section: "Сеть", href: "/brand/retailers", desc: "Активные оптовые покупатели текущего сезона." },
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
        const usd = (scaledVal / EXCHANGE_RATES.USD).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
        const eur = (scaledVal / EXCHANGE_RATES.EUR).toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
        return `${usd} / ${eur}`;
    };

    const healthStats = [
        { label: 'Операции', value: getKpi('operations', 94), status: 'stable' },
        { label: 'Лояльность', value: 88, status: 'up' },
        { label: 'Маржа', value: getKpi('margin', 42), status: 'stable' },
        { label: 'Сток', value: getKpi('stock_health', 65), status: 'down' },
    ];

    return (
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
            {/* Breadcrumb Navigation - Refined for premium visibility */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <Link href="/brand" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    <Building className="h-3 w-3" />
                    ORGANIZATION
                </Link>
                <ChevronRight className="h-2 w-2 opacity-50" />
                <span className="text-slate-300">OPERATIONAL INTELLIGENCE</span>
            </div>

            {/* Control Panel: Strategic Tools - Pattern: [Title] [Filters] [Actions] */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-sm font-bold tracking-tighter text-slate-900 leading-none uppercase">Strategic Pulse</h1>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
                           <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /> LIVE STREAM
                        </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                        Context: <span className="text-indigo-600">Omni-Channel Aggregation</span>
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {/* Strategic Filters - Compact Row Layout */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <select 
                            value={filterChannel} 
                            onChange={(e) => setFilterChannel(e.target.value as any)} 
                            className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer hover:bg-slate-50 transition-all"
                        >
                            <option value="all">Global Channels</option>
                            <option value="b2b">B2B Wholesale</option>
                            <option value="b2c">B2C Omni</option>
                            <option value="marketplace">Marketroom</option>
                        </select>
                        <select 
                            value={filterRegion} 
                            onChange={(e) => setFilterRegion(e.target.value as any)} 
                            className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer hover:bg-slate-50 transition-all"
                        >
                            <option value="all">Geo Clusters</option>
                            <option value="ru">Russian Fed.</option>
                            <option value="kz">Kazakhstan</option>
                            <option value="by">Belarus</option>
                        </select>
                        <select 
                            value={filterCollection} 
                            onChange={(e) => setFilterCollection(e.target.value as any)} 
                            className="h-7 px-3 rounded-lg text-[9px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer hover:bg-slate-50 transition-all"
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

                    <div className="h-5 w-px bg-slate-200 mx-0.5" />

                    <div className="flex items-center gap-1.5">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowEquivalents(!showEquivalents)}
                            className={cn(
                                "h-7 px-3 rounded-lg font-bold uppercase text-[8px] tracking-widest transition-all shadow-sm border-slate-200",
                                showEquivalents ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {showEquivalents ? 'CURRENCY: RUB' : 'UNIFY: RUB / $/€'}
                        </Button>
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => router.push('/brand/b2b-orders')} 
                            className="h-7 px-4 rounded-lg font-bold uppercase text-[8px] tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all border border-indigo-500"
                        >
                            <Plus className="h-3.5 w-3.5 mr-1.5" /> Initialize Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* SECTION 1: Key Performance Entities */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-[2px] bg-indigo-500 rounded-full" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Core Performance Entities</h2>
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Real-time Attribution</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <TooltipProvider>
                        {mainKpis.map((stat, i) => (
                            <UITooltip key={i}>
                                <UITooltipTrigger asChild>
                                    <Card 
                                        className="rounded-xl border border-slate-100 shadow-sm p-3.5 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                        onClick={(e) => {
                                            if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                                            setSelectedWidget(stat.type);
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-2.5">
                                            <div className="flex flex-col gap-1.5">
                                                <Badge variant="outline" className="w-fit bg-slate-50/50 text-slate-400 border-slate-100 text-[7px] font-bold uppercase tracking-[0.15em] px-1.5 h-3.5 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors leading-none">
                                                    {stat.section}
                                                </Badge>
                                                <div className={cn("p-1.5 rounded-lg transition-all border border-transparent shadow-inner", stat.bg, "group-hover:scale-105 group-hover:border-white")}>
                                                    <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[9px] uppercase px-1.5 h-4 tracking-tight rounded-md shadow-sm">{stat.change}</Badge>
                                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                                    <Link href={stat.href}>
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">{stat.label}</p>
                                        <div className="flex flex-col justify-between">
                                            <p className="text-sm font-bold text-slate-900 tracking-tighter leading-none uppercase">
                                                {typeof stat.value === 'number' ? (stat.type === 'retailers' ? formatVal(stat.value, 'unit') : formatVal(stat.value, 'short')) : stat.value}
                                            </p>
                                            {showEquivalents && typeof stat.value === 'number' && (
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tabular-nums tracking-widest mt-2 border-t border-slate-50 pt-1.5 opacity-70">≈ {getEquiv(stat.value)}</p>
                                            )}
                                        </div>
                                    </Card>
                                </UITooltipTrigger>
                                <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[9px] font-bold uppercase tracking-widest p-2.5 rounded-lg shadow-2xl max-w-[180px] z-[100]">
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
                        <div className="h-3 w-[2px] bg-emerald-500 rounded-full" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Channel Efficiency Matrix</h2>
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Network Performance</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'B2B Wholesale', val: 288000000, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: Briefcase, change: '+18%', sub: 'Active Orders: 842' },
                        { label: 'B2C Omni-Channel', val: 84200000, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', icon: Rocket, change: '+24%', sub: 'Direct Fulfillment' },
                        { label: 'Marketroom Node', val: 12800000, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: Monitor, change: '+42%', sub: '240 Integrated SKUs' },
                        { label: 'Inventory Clearance', val: 5600000, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Tag, change: '-12%', sub: '180 SKU Residual' },
                    ].map((c, i) => (
                        <Card key={i} className="rounded-xl border border-slate-100 shadow-sm p-3.5 bg-white hover:border-emerald-100 transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className={cn("p-1.5 rounded-lg transition-all border shadow-inner", c.bg, c.border, "group-hover:scale-105 group-hover:bg-white transition-all")}>
                                    <c.icon className={cn("h-3.5 w-3.5", c.color)} />
                                </div>
                                <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-bold h-4 px-1.5 rounded-md tracking-widest">{c.change}</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">{c.label}</p>
                                <p className="text-sm font-bold text-slate-900 tracking-tighter uppercase leading-none">{formatVal(c.val, 'short')}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5 opacity-60 leading-none">{c.sub}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SECTION 3: Critical System Anomalies */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-[2px] bg-rose-500 rounded-full" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Critical System Anomalies</h2>
                    </div>
                    <Badge variant="outline" className="h-4 border-rose-100 bg-rose-50/50 text-rose-600 text-[7px] font-bold uppercase tracking-widest px-1.5 animate-pulse">3 Detected</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Manufacturing Alert */}
                    <Card className="rounded-xl border-l-4 border-l-rose-600 border-y border-r border-slate-100 shadow-sm bg-white overflow-hidden relative group hover:border-rose-200 transition-all flex flex-col justify-between">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600 border border-rose-100 shadow-inner group-hover:scale-105 transition-transform"><Factory className="h-3.5 w-3.5" /></div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Manufacturing Node</span>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/production"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 leading-none">Factory Latency Detected</h3>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-snug opacity-80 italic">Risk: Delivery slippage for key accounts (TSUM).</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-bold h-4.5 px-1.5 rounded-md shadow-sm uppercase tracking-tight">-5 Days Drift</Badge>
                                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500 animate-pulse">Severity: High</span>
                            </div>
                        </div>
                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-1.5">
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all tracking-widest shadow-sm">Escalate</Button>
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-slate-900 transition-all tracking-widest shadow-sm">Calibration</Button>
                        </div>
                    </Card>

                    {/* Inventory Alert */}
                    <Card className="rounded-xl border-l-4 border-l-amber-500 border-y border-r border-slate-100 shadow-sm bg-white overflow-hidden relative group hover:border-amber-200 transition-all flex flex-col justify-between">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-100 shadow-inner group-hover:scale-105 transition-transform"><Package className="h-3.5 w-3.5" /></div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Inventory Cluster</span>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/inventory"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 leading-none">Liquidity Risk: Low Velocity</h3>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-snug opacity-80 italic">SKU #4821: 12% Sell-thru @ 60 days. Stagnation alert.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-bold h-4.5 px-1.5 rounded-md shadow-sm uppercase tracking-tight">82% Risk Index</Badge>
                                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Optimization: Required</span>
                            </div>
                        </div>
                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-1.5">
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all tracking-widest shadow-sm">Markdown</Button>
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-indigo-600 transition-all tracking-widest shadow-sm flex items-center justify-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Strategy</Button>
                        </div>
                    </Card>

                    {/* Cash Flow Alert */}
                    <Card className="rounded-xl border-l-4 border-l-slate-900 border-y border-r border-slate-100 shadow-sm bg-white overflow-hidden relative group hover:border-slate-200 transition-all flex flex-col justify-between">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-900 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"><DollarSign className="h-3.5 w-3.5" /></div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Financial Pipeline</span>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/finance"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 leading-none">Capital Flux: Liquidity Gap</h3>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-snug opacity-80 italic">Predictive shortfall detected in T+18 days cycle.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-slate-900 text-white border-none text-[8px] font-bold h-4.5 px-1.5 rounded-md shadow-sm uppercase tracking-tight">18 Day Window</Badge>
                                <div className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">P&L Status: Warning</span>
                            </div>
                        </div>
                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-1.5">
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-indigo-600 transition-all tracking-widest shadow-sm">Factoring</Button>
                            <Button variant="outline" className="flex-1 h-6 rounded-lg text-[8px] font-bold uppercase bg-white border-slate-200 text-slate-500 hover:text-slate-900 transition-all tracking-widest shadow-sm">Ledger Details</Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* SECTION 4: Операционная эффективность */}
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1">
                    <div className="h-1 w-5 bg-indigo-600 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Операционная эффективность</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Воронка Pipeline */}
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between cursor-pointer hover:border-indigo-100 hover:shadow-md transition-all group">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform"><Waves className="h-3.5 w-3.5" /></div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Воронка выручки</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/analytics-360"><ArrowUpRight className="h-3 w-3" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-3">
                            <div className="space-y-2.5">
                                {[
                                    { label: 'Черновики', value: 78500000, progress: 40, color: 'bg-amber-500' },
                                    { label: 'На согласовании', value: 110900000, progress: 60, color: 'bg-indigo-500' },
                                    { label: 'Подтверждено', value: 194000000, progress: 90, color: 'bg-emerald-500' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-400">{item.label}</span>
                                            <span className="text-slate-900 leading-none">{formatVal(item.value, 'short')}</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Strategic Planner — ближайшие дедлайны */}
                    <Link href="/brand/calendar">
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between cursor-pointer hover:border-indigo-100 hover:shadow-md transition-all group">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-105 transition-transform"><Calendar className="h-3.5 w-3.5" /></div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Strategic Planner</CardTitle>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-1.5">
                            {getDefaultUpcomingDeadlines({ limit: 4 }).map((d, i) => (
                                <div key={i} className={cn(
                                    "flex items-center justify-between p-2 rounded-lg border transition-all group/item",
                                    d.isOverdue ? "bg-rose-50/50 border-rose-100" : "bg-slate-50/50 border-slate-100 hover:bg-indigo-50/30"
                                )}>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold uppercase text-slate-900 tracking-tight leading-none group-hover/item:text-indigo-600 transition-colors truncate">{d.t}</p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{[d.role, d.partner].filter(Boolean).join(' · ') || '—'}</p>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <Badge variant="outline" className={cn("text-[8px] font-bold h-4.5 px-1.5 rounded-md shadow-sm uppercase tracking-tight", d.color)}>{d.d}</Badge>
                                        {d.daysUntil !== undefined && (
                                            <p className={cn("text-[7px] font-bold mt-0.5 tabular-nums", d.isOverdue ? "text-rose-600" : d.daysUntil <= 3 ? "text-amber-600" : "text-slate-400")}>
                                                {d.isOverdue ? `−${Math.abs(d.daysUntil)}` : d.daysUntil === 0 ? "сегодня" : d.daysUntil === 1 ? "завтра" : `${d.daysUntil} дн`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    </Link>

                    {/* Showroom Live Activity */}
                    <Card className="rounded-xl border border-indigo-100 shadow-xl shadow-indigo-100/30 bg-indigo-600 text-white overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all group relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Monitor className="h-12 w-12" /></div>
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white/10 rounded-lg text-white shadow-lg border border-white/20 backdrop-blur-sm group-hover:scale-105 transition-transform"><Monitor className="h-3.5 w-3.5" /></div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 leading-none">Шоурум онлайн</CardTitle>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold text-indigo-200 uppercase tracking-widest leading-none">Байеры онлайн</p>
                                    <p className="text-sm font-bold text-white tracking-tighter leading-none">12</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <p className="text-[8px] font-bold text-indigo-200 uppercase tracking-widest leading-none">В корзине</p>
                                    <p className="text-sm font-bold text-white tracking-tighter leading-none uppercase">8.2M ₽</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <Button className="w-full h-7 bg-white text-indigo-600 hover:bg-indigo-50 font-bold uppercase text-[9px] rounded-lg shadow-lg tracking-widest transition-all">Управление</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 5: Production Node & Predictive AI */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-[2px] bg-emerald-500 rounded-full" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Production Node & Predictive AI</h2>
                    </div>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Forward Intelligence</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Factory Pulse Monitoring */}
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-indigo-100 transition-all group">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform"><Factory className="h-3.5 w-3.5" /></div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Manufacturing Pulse</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/production"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-2">
                            {[
                                { factory: 'Eastern Node (RU)', order: 'FW26 Core Expansion', progress: 68, color: 'bg-rose-500' },
                                { factory: 'Nordic Fabric (FI)', order: 'Outerwear Series', progress: 85, color: 'bg-emerald-500' },
                            ].map((f, i) => (
                                <div key={i} className="p-2.5 rounded-xl bg-slate-50/50 space-y-1.5 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group/item">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[9px] font-bold uppercase text-slate-900 tracking-tight leading-none group-hover/item:text-indigo-600 transition-colors">{f.factory}</p>
                                        <span className="text-[9px] font-bold text-slate-400 tabular-nums leading-none tracking-widest">{f.progress}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div className={cn("h-full transition-all duration-1000", f.color)} style={{ width: `${f.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Demand Forecast AI */}
                    <Card className="rounded-xl border border-indigo-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-indigo-200 transition-all group">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform"><Sparkles className="h-3.5 w-3.5" /></div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Neural Demand Forecast</h3>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/analytics-360"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3.5 space-y-3">
                            <div className="h-12 flex items-end gap-1 px-1">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className={cn("w-full rounded-t-sm transition-all duration-500", i === 5 ? "bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]" : "bg-indigo-100")} style={{ height: `${h}%` }} />
                                    </div>
                                ))}
                            </div>
                            <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100/50 group-hover:bg-indigo-50 transition-colors">
                                <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-widest leading-snug italic">AI Synthesis: Demand peak projected in T+14 days.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Global Distribution Summary */}
                    <Card className="rounded-xl border border-slate-900 shadow-xl shadow-slate-200/20 bg-slate-900 text-white overflow-hidden flex flex-col justify-between hover:bg-slate-800 transition-all group relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Rocket className="h-12 w-12" /></div>
                        <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 relative z-10">
                                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white border border-indigo-500 group-hover:scale-105 transition-transform shadow-lg"><Rocket className="h-3.5 w-3.5" /></div>
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-white leading-none">Marketroom Aggregate</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-white/10 text-white hover:bg-white hover:text-slate-900 transition-all shadow-sm relative z-10">
                                    <Link href="/outlet"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3.5 relative z-10">
                            <div className="space-y-3.5">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none opacity-80">Seasonal Yield</p>
                                        <p className="text-base font-bold text-white tracking-tighter leading-none uppercase">12.8M ₽</p>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none text-[8px] font-bold h-4 px-1.5 rounded-md shadow-lg shadow-emerald-500/20 tracking-widest">+24% Flux</Badge>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none opacity-80">Residual Assets</p>
                                        <p className="text-sm font-bold text-white/90 tracking-tighter leading-none uppercase">5.6M ₽</p>
                                    </div>
                                    <Badge className="bg-white/10 text-white border-none text-[8px] font-bold h-4 px-1.5 rounded-md tracking-widest uppercase">Clearance</Badge>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-white/5">
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic leading-none">Global Outlet: 180 SKU nodes active</p>
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
