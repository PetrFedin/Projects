'use client';

import Link from 'next/link';
import { 
    Sparkles, 
    Calendar, 
    Info, 
    TrendingUp, 
    ShoppingBag, 
    Users, 
    Gem, 
    Rocket, 
    Zap, 
    Search, 
    ArrowRight, 
    TrendingDown, 
    Trophy, 
    MessageSquare, 
    Palette,
    Brain 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import AIDashboard from '@/components/user/ai-dashboard';
import ActivityTracker from '@/components/user/activity-tracker';
import { RecommendationCard, OfferCoupon } from './DashboardWidgets';
import EnhancedDataVisualization from '@/components/user/enhanced-data-visualization';

interface DashboardTabProps {
    overviewSubTab: 'analytics' | 'ai' | 'activity' | 'recommendations';
    setOverviewSubTab: (tab: 'analytics' | 'ai' | 'activity' | 'recommendations') => void;
    analyticsPeriod: 'week' | 'month' | 'year' | 'custom';
    setAnalyticsPeriod: (period: 'week' | 'month' | 'year' | 'custom') => void;
    recommendationOfferTab: 'active' | 'archive';
    setRecommendationOfferTab: (tab: 'active' | 'archive') => void;
    offerFilterBrand: string;
    setOfferFilterBrand: (brand: string) => void;
    offerFilterType: string;
    setOfferFilterType: (type: string) => void;
    user: any;
    activity: any;
    orderStats: any;
}

export function DashboardTab({
    overviewSubTab,
    setOverviewSubTab,
    analyticsPeriod,
    setAnalyticsPeriod,
    recommendationOfferTab,
    setRecommendationOfferTab,
    offerFilterBrand,
    setOfferFilterBrand,
    offerFilterType,
    setOfferFilterType,
    user,
    activity,
    orderStats
}: DashboardTabProps) {
    return (
        <div className="space-y-4">
            <Tabs value={overviewSubTab} onValueChange={(v) => setOverviewSubTab(v as any)}>
                <TabsList className="w-full justify-start flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    {[
                        { value: 'analytics', label: 'Intelligence' },
                        { value: 'ai', label: 'AI Strategy' },
                        { value: 'activity', label: 'Pulse' },
                        { value: 'recommendations', label: 'Curated' },
                    ].map((t) => (
                        <TabsTrigger 
                            key={t.value}
                            value={t.value} 
                            className="rounded-lg px-4 h-7 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:border border-transparent"
                        >
                            {t.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {overviewSubTab === 'analytics' && (
                <div className="space-y-4">
                    {/* Global Analytics Filter */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-2.5 px-3">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
                                {analyticsPeriod === 'week' 
                                    ? 'Week Delta: -800 ₽ cost reduction. Style optimization active.' 
                                    : analyticsPeriod === 'year' 
                                    ? 'Annual yield: 18,400 ₽ saved. Portfolio quality +25%.' 
                                    : 'Monthly cycle: 3,200 ₽ liquidity gain. Affinity +15%.'}
                            </span>
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm shrink-0">
                            {['week', 'month', 'year'].map((p) => (
                                <button 
                                    key={p}
                                    onClick={() => setAnalyticsPeriod(p as any)}
                                    className={cn(
                                        "h-6 px-3 text-[9px] font-bold uppercase tracking-widest transition-all rounded-md", 
                                        analyticsPeriod === p ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {p === 'week' ? 'W' : p === 'month' ? 'M' : 'Y'}
                                </button>
                            ))}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="h-6 px-2 text-slate-400 hover:text-slate-900 transition-all rounded-md"><Calendar className="h-3 w-3" /></button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <div className="p-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">Temporal Selection...</div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Top 5 Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* 1. CLV */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col h-full cursor-pointer hover:border-accent/50 transition-colors group relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                                            <span>CLV</span>
                                            <div className="flex items-center gap-1">
                                                <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <TrendingUp className="h-3 w-3" />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-base font-bold">
                                            {analyticsPeriod === 'year' ? '128 500 ₽' : analyticsPeriod === 'month' ? '32 400 ₽' : '8 200 ₽'}
                                        </div>
                                        <p className="text-[10px] text-green-600 font-medium">+15% прогноз</p>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-xl bg-accent/10">
                                            <TrendingUp className="h-6 w-6 text-accent" />
                                        </div>
                                        <DialogTitle className="text-sm">Ваш потенциал (CLV)</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-base pt-2 text-foreground">
                                        CLV — это ваша суммарная ценность для бренда. У вас **высокий потенциал роста**.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 space-y-6">
                                    <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Следующая цель</div>
                                                <div className="text-base font-bold">Уровень "Elite"</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-accent">Осталось: 21 500 ₽</div>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-background rounded-full overflow-hidden border">
                                            <div className="h-full bg-accent w-[82%] rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-3 italic">
                                            При достижении уровня Elite вы получите **бессрочную бесплатную доставку** и доступ к консьерж-сервису.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                            <div className="text-[10px] uppercase font-bold text-green-700 mb-1">Ваш статус</div>
                                            <div className="text-sm font-bold text-green-900">Топ-3% базы</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                            <div className="text-[10px] uppercase font-bold text-blue-700 mb-1">Прогноз LTV</div>
                                            <div className="text-sm font-bold text-blue-900">+25% к году</div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* 2. Purchase Stats */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col h-full cursor-pointer hover:border-accent/50 transition-colors group relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                                            <span>Статистика</span>
                                            <div className="flex items-center gap-1">
                                                <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-[10px] font-bold text-orange-600 normal-case">
                                                    {analyticsPeriod === 'year' ? '11%' : analyticsPeriod === 'month' ? '8%' : '0%'} возвр.
                                                </span>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-base font-bold">
                                            {analyticsPeriod === 'year' ? '9' : analyticsPeriod === 'month' ? '2' : '1'} <span className="text-[10px] font-normal text-muted-foreground">зак.</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1 truncate">
                                            Потрачено: <span className="font-bold text-foreground">
                                                {(analyticsPeriod === 'year' ? 163200 : analyticsPeriod === 'month' ? 42100 : 12500).toLocaleString('ru-RU')} ₽
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                                            <ShoppingBag className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <DialogTitle className="text-sm">Активность покупок</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-base pt-2 text-foreground">
                                        Ваша статистика за выбранный период. Мы ценим каждый ваш выбор.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl border bg-muted/30">
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Всего заказов</div>
                                            <div className="text-sm font-bold">{analyticsPeriod === 'year' ? '9' : analyticsPeriod === 'month' ? '2' : '1'}</div>
                                        </div>
                                        <div className="p-4 rounded-xl border bg-muted/30">
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Сумма выкупа</div>
                                            <div className="text-sm font-bold text-green-600">89%</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Trophy className="h-4 w-4 text-orange-600" />
                                            <div className="text-xs font-bold uppercase text-orange-800 tracking-wider">К чему стремиться</div>
                                        </div>
                                        <div className="text-sm text-orange-900 leading-relaxed font-medium">
                                            Оформите еще **один заказ** на этой неделе, чтобы получить персональную скидку 10% на следующую покупку аксессуаров.
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* 3. RFM */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col h-full cursor-pointer hover:border-accent/50 transition-colors group relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                                            <span>RFM Сегмент</span>
                                            <div className="flex items-center gap-1">
                                                <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Users className="h-3 w-3" />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-sm font-bold truncate">
                                            {analyticsPeriod === 'week' ? 'Новичок' : 'Лояльные чемпионы'}
                                        </div>
                                        <Badge variant="outline" className="text-[9px] h-4 px-1 mt-1 bg-primary/10 text-primary border-primary/20">
                                            {analyticsPeriod === 'week' ? 'R1 F1 M1' : 'R5 F8 M9'}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>RFM Анализ</DialogTitle>
                                    <DialogDescription className="text-base pt-4 leading-relaxed">
                                        RFM — это метод сегментации клиентов по трём показателям: 
                                        <br/>• <b>Recency</b> (давность заказа)
                                        <br/>• <b>Frequency</b> (частота заказов)
                                        <br/>• <b>Monetary</b> (сумма трат)
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="text-sm font-semibold mb-2">Ваш статус: {analyticsPeriod === 'week' ? 'Новичок' : 'Лояльный чемпион'}</div>
                                    <p className="text-xs text-muted-foreground">Вы находитесь в топ-5% нашей клиентской базы. Это дает вам приоритетную доставку и персонального менеджера.</p>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* 4. Loyalty Score */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col h-full cursor-pointer hover:border-accent/50 transition-colors group relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                                            <span>Loyalty Score</span>
                                            <div className="flex items-center gap-1">
                                                <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Gem className="h-3 w-3 text-blue-500" />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-base font-bold">
                                            {analyticsPeriod === 'year' ? '850' : analyticsPeriod === 'month' ? '820' : '815'}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Платиновый уровень</p>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                            <Gem className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <DialogTitle className="text-sm">Ваша программа лояльности</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-base pt-2 text-foreground">
                                        Loyalty Score отражает вашу общую ценность и вовлеченность.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 space-y-6">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm font-bold text-blue-900">Уровень: Платиновый</div>
                                                <div className="text-sm font-black text-blue-600">{analyticsPeriod === 'year' ? '850' : '820'} / 1000</div>
                                            </div>
                                            <div className="h-3 w-full bg-blue-200/50 rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-blue-600 w-[85%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-800 uppercase tracking-tight">
                                                <Sparkles className="h-3 w-3" />
                                                Осталось 150 баллов до уровня "Diamond"
                                            </div>
                                        </div>
                                        <Gem className="absolute -right-4 -bottom-4 h-24 w-24 text-blue-200/20 rotate-12" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-muted-foreground uppercase">Как получить баллы быстрее?</div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="flex items-center justify-between p-3 rounded-lg border bg-background hover:border-blue-200 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Palette className="h-4 w-4 text-purple-500" />
                                                    <span className="text-xs font-medium">Создать новый лукборд</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-green-600">+50 баллов</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border bg-background hover:border-blue-200 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare className="h-4 w-4 text-blue-500" />
                                                    <span className="text-xs font-medium">Оставить отзыв на покупку</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-green-600">+30 баллов</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* 5. Influence Score */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col h-full cursor-pointer hover:border-accent/50 transition-colors group relative">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                                            <span>Influence</span>
                                            <div className="flex items-center gap-1">
                                                <Info className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Rocket className="h-3 w-3 text-amber-500" />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-base font-bold">
                                            {analyticsPeriod === 'year' ? '75' : analyticsPeriod === 'month' ? '72' : '70'}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground truncate">Высокий потенциал</p>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Influence Score</DialogTitle>
                                    <DialogDescription className="text-base pt-4 leading-relaxed">
                                        Этот показатель оценивает ваше влияние на других пользователей через социальные сети и внутренние активности.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <Rocket className="h-8 w-8 text-amber-500" />
                                    <div className="text-xs text-amber-900">
                                        Вы вдохновляете! Ваши лукборды получили <b>124 сохранения</b> за последний месяц.
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Key Metrics move up, behavior patterns stay down */}
                    <div className="pt-2">
                        <EnhancedDataVisualization period={analyticsPeriod} variant="metrics" />
                    </div>

                    {/* Second Row: History and Engagement Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <Card className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-accent" />
                                    История покупок
                                </CardTitle>
                                <CardDescription>
                                    {analyticsPeriod === 'week' ? 'За последние 7 дней' : 
                                     analyticsPeriod === 'month' ? 'Динамика за месяц' : 'За последний год'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
                                    <AreaChart data={
                                        analyticsPeriod === 'week' ? [
                                            { label: "Пн", total: 1200 }, { label: "Вт", total: 0 }, { label: "Ср", total: 4500 }, 
                                            { label: "Чт", total: 0 }, { label: "Пт", total: 6800 }, { label: "Сб", total: 0 }, { label: "Вс", total: 0 }
                                        ] : analyticsPeriod === 'month' ? [
                                            { label: "1 нед", total: 8600 }, { label: "2 нед", total: 12500 }, { label: "3 нед", total: 9700 }, { label: "4 нед", total: 11400 }
                                        ] : [
                                            { label: "Янв", total: 18600 }, { label: "Фев", total: 30500 }, { label: "Март", total: 23700 }, 
                                            { label: "Апр", total: 17300 }, { label: "Май", total: 20900 }, { label: "Июнь", total: 21400 },
                                        ]
                                    }>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString('ru-RU')} ₽`} />} />
                                        <Area type="natural" dataKey="total" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-blue-500" />
                                    Динамика вовлеченности
                                </CardTitle>
                                <CardDescription>Уровень активности за период</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
                                    <AreaChart data={
                                        analyticsPeriod === 'week' ? [
                                            { label: "Пн", level: 85 }, { label: "Вт", level: 40 }, { label: "Ср", level: 92 }, 
                                            { label: "Чт", level: 65 }, { label: "Пт", level: 88 }, { label: "Сб", level: 95 }, { label: "Вс", level: 70 }
                                        ] : [
                                            { label: "Янв", level: 65 }, { label: "Фев", level: 72 }, { label: "Март", level: 68 }, 
                                            { label: "Апр", level: 85 }, { label: "Май", level: 78 }, { label: "Июнь", level: 92 },
                                        ]
                                    }>
                                        <defs>
                                            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} tickMargin={10} unit="%" />
                                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                                        <Area type="natural" dataKey="level" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorLevel)" strokeWidth={2} />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Third Row: Category Views and Return Reasons Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        {/* Category Views - Donut Chart + Table Details */}
                        <Card className="lg:col-span-7 flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Search className="h-5 w-5 text-purple-500" />
                                    Интерес по категориям
                                </CardTitle>
                                <CardDescription>Распределение за {analyticsPeriod === 'week' ? '7 дней' : analyticsPeriod === 'month' ? 'месяц' : 'год'}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full items-center">
                                    {/* Left: Chart */}
                                    <div className="h-[240px] w-full">
                                        <ChartContainer config={{}} className="w-full h-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            analyticsPeriod === 'week' ? [
                                                                { name: 'Топы', value: 45 }, { name: 'Брюки', value: 30 }, { name: 'Платья', value: 15 }, { name: 'Аксессуары', value: 10 }
                                                            ] : analyticsPeriod === 'month' ? [
                                                                { name: 'Топы', value: 450 }, { name: 'Брюки', value: 380 }, { name: 'Платья', value: 320 }, { name: 'Аксессуары', value: 240 }, { name: 'Обувь', value: 190 }
                                                            ] : [
                                                                { name: 'Топы', value: 2450 }, { name: 'Брюки', value: 1880 }, { name: 'Платья', value: 1320 }, { name: 'Аксессуары', value: 940 }, { name: 'Обувь', value: 890 }
                                                            ]
                                                        }
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                    >
                                                        <Cell fill="#8884d8" stroke="transparent" />
                                                        <Cell fill="#82ca9d" stroke="transparent" />
                                                        <Cell fill="#ffc658" stroke="transparent" />
                                                        <Cell fill="#ff8042" stroke="transparent" />
                                                        <Cell fill="#0088FE" stroke="transparent" />
                                                    </Pie>
                                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </div>
                                    {/* Right: Modern Data Table */}
                                    <div className="space-y-2 pr-4">
                                        <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground pb-2 border-b">
                                            <span>Категория</span>
                                            <div className="flex gap-3">
                                                <span>Клики</span>
                                                <span className="w-8 text-right">%</span>
                                            </div>
                                        </div>
                                        {(analyticsPeriod === 'week' ? [
                                            { label: 'Топы', value: 45, percent: 45, color: 'bg-[#8884d8]' },
                                            { label: 'Брюки', value: 30, percent: 30, color: 'bg-[#82ca9d]' },
                                            { label: 'Платья', value: 15, percent: 15, color: 'bg-[#ffc658]' },
                                            { label: 'Аксессуары', value: 10, percent: 10, color: 'bg-[#ff8042]' },
                                        ] : analyticsPeriod === 'month' ? [
                                            { label: 'Топы', value: 450, percent: 28, color: 'bg-[#8884d8]' },
                                            { label: 'Брюки', value: 380, percent: 24, color: 'bg-[#82ca9d]' },
                                            { label: 'Платья', value: 320, percent: 20, color: 'bg-[#ffc658]' },
                                            { label: 'Аксессуары', value: 240, percent: 15, color: 'bg-[#ff8042]' },
                                            { label: 'Обувь', value: 190, percent: 13, color: 'bg-[#0088FE]' },
                                        ] : [
                                            { label: 'Топы', value: 2450, percent: 33, color: 'bg-[#8884d8]' },
                                            { label: 'Брюки', value: 1880, percent: 25, color: 'bg-[#82ca9d]' },
                                            { label: 'Платья', value: 1320, percent: 18, color: 'bg-[#ffc658]' },
                                            { label: 'Аксессуары', value: 940, percent: 12, color: 'bg-[#ff8042]' },
                                            { label: 'Обувь', value: 890, percent: 12, color: 'bg-[#0088FE]' },
                                        ]).map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-1.5 group/row cursor-default transition-colors hover:bg-muted/30 px-1 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                                                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold">{item.value}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground w-8 text-right bg-muted px-1 rounded">{item.percent}%</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-accent/10 hover:text-accent"
                                                        asChild
                                                    >
                                                        <Link href={`/search?q=${item.label}`}>
                                                            <ArrowRight className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Return Reasons - Stylized list with progress bars */}
                        <Card className="lg:col-span-5 flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-orange-500" />
                                    Критичные отказы
                                </CardTitle>
                                <CardDescription>
                                    Общий % возвратов: {analyticsPeriod === 'week' ? '0' : analyticsPeriod === 'month' ? '8' : '11'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-6 pt-4">
                                {(analyticsPeriod === 'week' ? [
                                    { label: 'Нет возвратов за неделю', value: 0, color: 'bg-green-500' }
                                ] : [
                                    { label: 'Размер не подошел', value: analyticsPeriod === 'month' ? 45 : 60, color: 'bg-orange-500' },
                                    { label: 'Качество материала', value: analyticsPeriod === 'month' ? 30 : 25, color: 'bg-amber-400' },
                                    { label: 'Цвет в реальности', value: analyticsPeriod === 'month' ? 25 : 15, color: 'bg-yellow-200 text-yellow-900' },
                                ]).map((reason, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">{reason.label}</span>
                                            {reason.value > 0 && <span className="font-bold">{reason.value}%</span>}
                                        </div>
                                        {reason.value > 0 && (
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full transition-all duration-500", reason.color)} 
                                                    style={{ width: `${reason.value}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="mt-8 p-3 rounded-lg bg-orange-50 border border-orange-100 text-[11px] text-orange-800 leading-relaxed italic">
                                    {analyticsPeriod === 'week' 
                                        ? "AI-прогноз: На этой неделе возвратов не ожидается. Клиент доволен текущими покупками."
                                        : "AI-рекомендация: Для снижения возвратов по размеру предложите клиенту обновить мерки в профиле."
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Deep metrics and behavior patterns at the bottom, reacting to period */}
                    <div className="pt-2 border-t">
                        <EnhancedDataVisualization period={analyticsPeriod} variant="patterns" />
                    </div>
                </div>
            )}

            {overviewSubTab === 'ai' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        <div className="lg:col-span-7">
                            <AIDashboard />
                        </div>
                        <div className="lg:col-span-5 space-y-6">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>AI-Персонализация</CardTitle>
                                    <CardDescription>Как мы подбираем для вас</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Brain className="h-4 w-4 text-accent" />
                                                <span className="font-bold text-sm">Style DNA</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Ваш стиль определен как "Минимализм с акцентами". Мы ищем вещи простых форм, но ярких цветов.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-muted/30 border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ShoppingBag className="h-4 w-4 text-primary" />
                                                <span className="font-bold text-sm">История покупок</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Анализ 12 последних заказов показывает предпочтение натуральным тканям (лен, хлопок).</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {overviewSubTab === 'activity' && (
                <div className="space-y-6">
                    <ActivityTracker />
                </div>
            )}

            {overviewSubTab === 'recommendations' && (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
                            <button 
                                onClick={() => setRecommendationOfferTab('active')}
                                className={cn("px-3 h-6.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", recommendationOfferTab === 'active' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
                            >
                                Active
                            </button>
                            <button 
                                onClick={() => setRecommendationOfferTab('archive')}
                                className={cn("px-3 h-6.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", recommendationOfferTab === 'archive' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
                            >
                                Archive
                            </button>
                        </div>
                        <div className="flex gap-1.5 px-1 shrink-0">
                            <select 
                                className="h-7 rounded-lg border border-slate-200 bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all outline-none"
                                value={offerFilterBrand}
                                onChange={(e) => setOfferFilterBrand(e.target.value)}
                            >
                                <option value="all">Global Brands</option>
                                <option value="Syntha">Syntha</option>
                                <option value="Zara">Zara</option>
                                <option value="H&M">H&M</option>
                            </select>
                            <select 
                                className="h-7 rounded-lg border border-slate-200 bg-white px-2.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all outline-none"
                                value={offerFilterType}
                                onChange={(e) => setOfferFilterType(e.target.value)}
                            >
                                <option value="all">All Modules</option>
                                <option value="promo">Incentives</option>
                                <option value="points">Capital</option>
                                <option value="match">Curations</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { id: 1, name: 'Жакет Oversize', brand: 'Syntha', price: '12 900 ₽', oldPrice: '18 900 ₽', match: 98, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', type: 'promo', promo: 'SYNTHA-20', benefit: 'Выгода 6 000 ₽', synergy: 12, rarity: 'Bestseller' },
                            { id: 2, name: 'Брюки Палаццо', brand: 'Zara', price: '4 500 ₽', pointsPrice: '2 250', match: 92, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', type: 'points', benefit: 'Списание 50%', synergy: 8, rarity: 'Last Size' },
                            { id: 3, name: 'Платье-комбинация', brand: 'H&M', price: '3 999 ₽', match: 88, img: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80', type: 'match', benefit: 'Идеальный цвет', synergy: 5, rarity: 'New' },
                            { id: 4, name: 'Тренч Бежевый', brand: 'Syntha', price: '24 900 ₽', promo: 'TRENCH-15', match: 95, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', type: 'promo', benefit: 'Выгода 3 700 ₽', synergy: 15, rarity: 'Limited' },
                        ]
                        .filter(item => {
                            if (recommendationOfferTab === 'archive') return false; // Mock archive empty
                            if (offerFilterBrand !== 'all' && item.brand !== offerFilterBrand) return false;
                            if (offerFilterType !== 'all' && item.type !== offerFilterType) return false;
                            return true;
                        })
                        .map((item) => (
                            <RecommendationCard key={item.id} item={item} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <OfferCoupon 
                            type="discount" 
                            brand="Syntha" 
                            title="Скидка 20% на новую коллекцию" 
                            desc="Действует на все товары без скидки" 
                            expiry="до 15.06" 
                            color="accent" 
                        />
                        <OfferCoupon 
                            type="gift" 
                            brand="Lime" 
                            title="Аксессуар в подарок" 
                            desc="При покупке от 5000 ₽" 
                            expiry="до 20.06" 
                            color="purple" 
                        />
                        <OfferCoupon 
                            type="promo" 
                            brand="Zara" 
                            title="3 по цене 2" 
                            desc="На раздел Basic" 
                            expiry="до 12.06" 
                            color="emerald" 
                        />
                        <OfferCoupon 
                            type="discount" 
                            brand="H&M" 
                            title="-15% на первый заказ" 
                            desc="В приложении" 
                            expiry="бессрочно" 
                            color="indigo" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
