"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
    AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useUIState } from "@/providers/ui-state";
import Link from 'next/link';
import { fmtNumber } from '@/lib/format';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { WidgetDetailSheet, WidgetType } from "@/components/brand/widget-detail-sheet";
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";

import { CustomerBrandMatrix } from '@/components/brand/customer-brand-matrix';
import FeedbackAnalytics from '@/components/brand/analytics/feedback-analytics';
export default function CustomerIntelligencePage() {
    const router = useRouter();
    const { 
        dashboardPeriod,
        filterChannel, setFilterChannel,
        filterRegion, setFilterRegion,
        filterCollection, setFilterCollection
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
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <Link href="/brand" className="hover:text-indigo-600 transition-colors">Организация</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900">Центр управления</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-indigo-600">Клиентский интеллект</span>
            </div>

            {/* Control Panel: Strategic Hub */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3">
                    <Badge className="bg-slate-900 text-white border-none font-bold text-[10px] uppercase h-6 px-3 shadow-md">
                        <Users className="h-3.5 w-3.5 mr-2 text-indigo-400 fill-indigo-400" /> CRM Intelligence
                    </Badge>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /> Анализ лояльности
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value as any)} className="h-8 px-2 rounded-lg text-[10px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer">
                            <option value="all">Все каналы</option>
                            <option value="b2b">B2B Опт</option>
                            <option value="b2c">B2C Омни</option>
                            <option value="marketplace">Marketroom</option>
                        </select>
                        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value as any)} className="h-8 px-2 rounded-lg text-[10px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer">
                            <option value="all">Все регионы</option>
                            <option value="ru">Россия</option>
                            <option value="kz">Казахстан</option>
                            <option value="by">Беларусь</option>
                        </select>
                        <select value={filterCollection} onChange={(e) => setFilterCollection(e.target.value as any)} className="h-8 px-2 rounded-lg text-[10px] font-bold uppercase border-none bg-white text-slate-600 shadow-sm outline-none cursor-pointer">
                            <option value="all">Все коллекции</option>
                            <optgroup label="FW26">
                                <option value="fw26-pre">FW26 Pre</option>
                                <option value="fw26-main">FW26 Main</option>
                            </optgroup>
                            <option value="outlet">Outlet</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50"
                        >
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>

            {/* 1. High-Level Customer KPIs */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ключевые показатели аудитории</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <TooltipProvider>
                        {[
                            { type: 'customer_profiles' as WidgetType, label: "Профили (Omni)", value: formatNum(12482), change: "+12%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", section: "База", desc: "Общее количество уникальных клиентов." },
                            { type: 'churn_rate' as WidgetType, label: "Удержание (CRR)", value: "88.4%", change: "+2.4%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", section: "Лояльность", desc: "Customer Retention Rate: Общий показатель лояльности." },
                            { type: 'returns_rate' as WidgetType, label: "Доля возвратов", value: "4.2%", change: "-0.8%", icon: Activity, color: "text-rose-600", bg: "bg-rose-50", section: "Качество", desc: "Процент возвратов во всех розничных каналах." },
                            { type: 'clv_analysis' as WidgetType, label: "Ценность (CLV)", value: `${formatNum(142000)} ₽`, change: "+5.4%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", section: "Ценность", desc: "Средний LTV клиента." },
                        ].map((stat, i) => (
                            <UITooltip key={i}>
                                <UITooltipTrigger asChild>
                                    <Card 
                                        className="rounded-xl border border-slate-100 shadow-sm p-4 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300 group overflow-hidden cursor-pointer relative"
                                        onClick={() => setSelectedWidget(stat.type)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-col gap-1.5">
                                                <Badge variant="outline" className="w-fit bg-slate-50 text-slate-500 border-slate-100 text-[8px] font-bold uppercase px-1.5 h-4 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                                    {stat.section}
                                                </Badge>
                                                <div className={cn("p-2 rounded-lg transition-colors w-fit shadow-sm", stat.bg, "group-hover:bg-white")}>
                                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                                </div>
                                            </div>
                                            <Badge className={cn("bg-slate-50 text-slate-600 border-none font-bold text-[9px] uppercase px-1.5 h-4.5", stat.change.includes('+') ? "bg-emerald-50 text-emerald-600" : "")}>{stat.change}</Badge>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                                            <p className="text-base font-bold text-slate-900 tracking-tight">{stat.value}</p>
                                        </div>
                                    </Card>
                                </UITooltipTrigger>
                                <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[10px] p-2 rounded-lg shadow-xl">
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
                    <div className="h-1 w-6 bg-emerald-600 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Поведенческий анализ</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Активность байеров */}
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group">
                        <CardHeader className="p-3 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm"><Activity className="h-4 w-4" /></div>
                                    <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">Активность байеров</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/showroom"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2 space-y-2.5">
                            {[
                                { buyer: 'ЦУМ Москва', action: 'Просмотр FW26', time: '2 мин' },
                                { buyer: 'Aizel', action: 'Добавил в корзину', time: '8 мин' },
                                { buyer: 'TSUM KZ', action: 'Запросил прайс', time: '15 мин' },
                            ].map((a, i) => (
                                <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center hover:bg-slate-100 transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-900 uppercase">{a.buyer}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{a.action}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{a.time}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Reorder алерты */}
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group">
                        <CardHeader className="p-3 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shadow-sm"><Clock className="h-4 w-4" /></div>
                                    <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">Прогноз сегментов</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/dashboard"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2 space-y-2.5">
                            {[
                                { segment: 'VIP (Loyal)', count: '124 чел.', prob: 92 },
                                { segment: 'Lapsed (Risk)', count: '48 чел.', prob: 78 },
                                { segment: 'New (B2B)', count: '12 орг.', prob: 85 },
                            ].map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-900 uppercase">{r.segment}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{r.count}</p>
                                    </div>
                                    <Badge className="bg-amber-500 text-white text-[9px] font-bold h-4 px-1.5 rounded shadow-sm">{r.prob}%</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Клиентский Пульс */}
                    <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col justify-between cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group">
                        <CardHeader className="p-3 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm"><Users className="h-4 w-4" /></div>
                                    <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">Клиентский Пульс</CardTitle>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <Link href="/brand/customers"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2 space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ценность (CLV)</p>
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">{formatNum(142000)} ₽</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Отток</p>
                                    <p className="text-sm font-bold text-rose-600 tracking-tight">4.2%</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-50">
                                <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-bold px-2 h-5 w-full justify-center shadow-sm">+12% рост активности</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 3. Retention & Churn Intelligence */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-1 w-6 bg-amber-500 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Удержание и риски</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Когортный срез */}
                    <Card className="rounded-xl border border-slate-800 shadow-lg bg-slate-900 text-white overflow-hidden p-4 relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Target className="h-12 w-12" /></div>
                        <div className="flex justify-between items-start mb-6">
                            <Badge variant="outline" className="border-white/20 text-indigo-300 text-[8px] font-bold uppercase px-2 h-4.5 bg-white/5">Retention</Badge>
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-white/10 text-white hover:bg-white hover:text-slate-900 transition-all shadow-sm">
                                <Link href="/brand/analytics-360"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">M1 Retention</p>
                                <p className="text-base font-bold text-white tracking-tight">75%</p>
                            </div>
                            <p className="text-[11px] text-white/50 font-medium">Лучший результат в когорте Мар 2025.</p>
                        </div>
                    </Card>

                    {/* Клиенты под риском */}
                    <Card className="md:col-span-2 rounded-xl border border-amber-400 shadow-lg bg-amber-500 text-white overflow-hidden p-4 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-4 w-4 text-white" />
                                <h3 className="text-[13px] font-bold uppercase tracking-wider">Алерт удержания (VIP)</h3>
                            </div>
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-white/10 text-white hover:bg-white hover:text-amber-600 transition-all shadow-sm">
                                <Link href="/brand/customers"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                {[
                                    { name: 'Мария С.', last: '92д', ltv: '184K' },
                                    { name: 'Игорь Д.', last: '107д', ltv: '92K' },
                                ].map((c, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/10 p-2.5 rounded-lg border border-white/20 backdrop-blur-sm">
                                        <span className="text-[11px] font-bold uppercase">{c.name}</span>
                                        <Badge className="bg-rose-500 text-white border-none text-[10px] font-bold h-4.5 px-2 rounded shadow-sm">{c.last}</Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-[11px] leading-relaxed font-medium backdrop-blur-sm">
                                💡 AI совет: Обновить размерную сетку в категории Брюки на основе фактических возвратов.
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 4. Strategic Behavioral Matrix */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Матрица Клиентского Опыта</h2>
                </div>
                <div className="rounded-xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CustomerBrandMatrix />
                </div>
            </div>

            {/* 5. Customer Feedback Analytics */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Обратная связь и NPS</h2>
                </div>
                <div className="rounded-xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                    <FeedbackAnalytics brandId="BRAND-XYZ" />
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
