'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
    Sparkles, Search, Filter, RefreshCcw, Info, 
    Zap, AlertCircle, CheckCircle2, Globe, ShoppingBag,
    DollarSign, BarChart3, LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
    Tooltip as RechartsTooltip, CartesianGrid
} from 'recharts';

/** Deterministic grouping (avoids Node vs browser toLocaleString / ICU hydration mismatches). */
function formatRubInt(n: number): string {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const MOCK_PRICING_DATA = [
    { name: 'Mon', current: 4200, suggested: 4500, comp: 4800 },
    { name: 'Tue', current: 4200, suggested: 4400, comp: 4700 },
    { name: 'Wed', current: 4200, suggested: 4600, comp: 4650 },
    { name: 'Thu', current: 4200, suggested: 4800, comp: 4600 },
    { name: 'Fri', current: 4200, suggested: 4900, comp: 4550 },
    { name: 'Sat', current: 4200, suggested: 5100, comp: 4900 },
    { name: 'Sun', current: 4200, suggested: 5200, comp: 5000 },
];

export default function DynamicPricingEngine() {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    /** Fixed IDs so SSR and client always pick the same rows (avoids localeCompare / merged catalog order drift). */
    const priceSuggestions = useMemo(() => {
        const diffs = [5.2, -3.8, 8.1, -6.4, 2.7];
        const confidences = [89, 82, 94, 78, 91];
        const byId = new Map(allProducts.map((p) => [String(p.id), p]));
        const topFive: Product[] = [];
        for (const id of ['1', '2', '3', '4', '5'] as const) {
            const p = byId.get(id);
            if (p) topFive.push(p);
        }
        if (topFive.length < 5) {
            const rest = [...allProducts]
                .filter((p) => !topFive.some((t) => String(t.id) === String(p.id)))
                .sort((a, b) => {
                    const na = parseInt(String(a.id), 10);
                    const nb = parseInt(String(b.id), 10);
                    if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
                    return String(a.slug ?? a.id).localeCompare(String(b.slug ?? b.id), 'en-US');
                });
            for (const p of rest) {
                if (topFive.length >= 5) break;
                topFive.push(p);
            }
        }
        return topFive.map((p, i) => ({
            ...p,
            suggestedPrice: Math.round(p.price * (1 + diffs[i] / 100)),
            diff: diffs[i],
            reason: diffs[i] > 0 ? 'Высокий спрос + низкий сток' : 'Активность конкурентов ↑',
            confidence: confidences[i]
        }));
    }, []);

    const handleApplyAll = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            toast({
                title: "Цены обновлены",
                description: "AI-рекомендации применены ко всем выбранным товарам.",
            });
        }, 1500);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <Badge className="bg-indigo-600 text-white border-none mb-3 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        AI Revenue Management
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none italic">
                        Движок <span className="text-indigo-600">Динамического</span> Ценообразования
                    </h1>
                    <p className="mt-4 text-slate-500 font-medium max-w-xl">
                        Автоматическая оптимизация маржинальности. ИИ анализирует эластичность спроса, остатки и цены конкурентов 24/7.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 font-bold uppercase tracking-widest text-[9px]">
                        <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Обновить данные
                    </Button>
                    <Button 
                        onClick={handleApplyAll}
                        disabled={isUpdating}
                        className="rounded-xl h-10 px-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-slate-200 transition-all hover:bg-indigo-600"
                    >
                        {isUpdating ? <RefreshCcw className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Zap className="mr-2 h-3.5 w-3.5 fill-white" />}
                        Применить все советы
                    </Button>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-3 items-start">
                {/* Left: Global Analytics */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden p-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-base font-black uppercase tracking-tight">Прогноз выручки (7 дней)</h3>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-black uppercase text-slate-400">Текущая</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <span className="text-[9px] font-black uppercase text-slate-400">Оптимизированная</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_PRICING_DATA}>
                                    <defs>
                                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSuggested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                                    <YAxis hide />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="current" stroke="#e2e8f0" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                                    <Area type="monotone" dataKey="suggested" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSuggested)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-3 pt-8 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Прогноз роста выручки</p>
                                <p className="text-sm font-black text-emerald-600">+14.2%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Прирост валовой маржи</p>
                                <p className="text-sm font-black text-indigo-600">+5.8%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Эластичность цены</p>
                                <p className="text-sm font-black text-slate-900">0.82 <span className="text-[10px] text-slate-400">Высокая</span></p>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Топ рекомендаций
                            </h3>
                            <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View All SKU</button>
                        </div>
                        <div className="space-y-3">
                            {priceSuggestions.map(item => (
                                <Card key={item.id} className="rounded-2xl border-none shadow-md bg-white p-4 group hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-slate-50 relative overflow-hidden shrink-0">
                                            <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{item.brand}</p>
                                            <h4 className="text-xs font-black uppercase tracking-tight truncate leading-none mb-1.5">{item.name}</h4>
                                            <Badge variant="outline" className="text-[8px] font-black border-indigo-50 text-indigo-600 bg-indigo-50/30">{item.reason}</Badge>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1 px-4 border-x border-slate-50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Текущая: {formatRubInt(item.price)} ₽</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black text-slate-900">{formatRubInt(item.suggestedPrice)} ₽</p>
                                                <div className={cn(
                                                    "flex items-center text-[10px] font-black",
                                                    item.diff > 0 ? "text-emerald-600" : "text-rose-500"
                                                )}>
                                                    {item.diff > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                    {Math.abs(item.diff)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">ИИ-Точность</p>
                                            <p className="text-xs font-black text-indigo-600 italic">{item.confidence}%</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-900 hover:text-white transition-all ml-2">
                                            <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Rules & Config */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white overflow-hidden p-4 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LineChart className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <header className="space-y-2">
                                <Badge className="bg-indigo-500 text-white border-none font-black text-[8px] uppercase px-2 py-0.5">Автоматизация активна</Badge>
                                <h3 className="text-sm font-black uppercase tracking-tight leading-none italic">Политики <br /> Защиты Цен</h3>
                            </header>

                            <div className="space-y-4">
                                {[
                                    { label: 'Макс. дневное колебание', value: '+/- 15%', icon: TrendingUp },
                                    { label: 'Мин. чистая маржа', value: '35%', icon: DollarSign },
                                    { label: 'Режим распродажи стока', value: 'ВЫКЛ', icon: ShoppingBag, color: 'text-slate-500' },
                                    { label: 'Индекс цен конкурентов', value: 'Поддерживать 95%', icon: Globe }
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <rule.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{rule.label}</span>
                                        </div>
                                        <span className={cn("text-xs font-black", rule.color || "text-white")}>{rule.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-black/20">
                                Настроить все правила <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Данные конкурентов</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Marketplace A', status: 'Цена ниже', diff: '-8%', color: 'text-rose-500' },
                                { name: 'Mytheresa', status: 'Совпадает', diff: '0%', color: 'text-emerald-500' },
                                { name: 'Локальные бренды', status: 'Цена выше', diff: '+12%', color: 'text-emerald-500' }
                            ].map(comp => (
                                <div key={comp.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-900">{comp.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{comp.status}</p>
                                    </div>
                                    <div className={cn("text-xs font-black", comp.color)}>
                                        {comp.diff}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed text-center">
                            *Парсинг цен конкурентов выполняется каждые 15 минут через Syntha Proxy Grid.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-12 7" />
    </svg>
  )
}
