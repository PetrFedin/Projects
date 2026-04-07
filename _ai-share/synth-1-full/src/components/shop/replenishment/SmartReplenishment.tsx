'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    AlertTriangle, ShoppingCart, RefreshCcw, 
    TrendingUp, Package, Truck, Info, Zap,
    ArrowUpRight, Clock, CheckCircle2, Factory,
    BarChart3, Layers, FileText, Settings2, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function SmartReplenishment() {
    const { toast } = useToast();
    const [isOrdering, setIsOrdering] = useState(false);

    const replenishmentAlerts = useMemo(() => {
        return allProducts.slice(5, 9).map((p, i) => {
            const stock = Math.round(Math.random() * 15);
            const sellThrough = Math.round(Math.random() * 30 + 65);
            return {
                ...p,
                currentStock: stock,
                suggestedQty: Math.round((sellThrough / 10) * 10),
                sellThrough,
                daysUntilOut: Math.max(1, Math.round(stock / 2)),
                urgency: stock < 5 ? 'critical' : 'medium'
            };
        });
    }, []);

    const handleCreateOrders = () => {
        setIsOrdering(true);
        setTimeout(() => {
            setIsOrdering(false);
            toast({
                title: "Заказы на пополнение созданы",
                description: "4 черновика заказов отправлены брендам на согласование.",
            });
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <Badge className="bg-amber-500 text-white border-none mb-3 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        B2B Inventory Intelligence
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none">
                        Smart <span className="text-amber-500 italic">Replenishment</span>
                    </h1>
                    <p className="mt-4 text-slate-500 font-medium max-w-xl">
                        AI анализирует ваши POS-данные и остатки, чтобы предотвратить упущенную выгоду. Система сама предложит, что и когда дозаказать.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl h-12 border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Правила авто-заказа
                    </Button>
                    <Button 
                        onClick={handleCreateOrders}
                        disabled={isOrdering}
                        className="rounded-xl h-12 px-8 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 transition-all hover:bg-amber-600"
                    >
                        {isOrdering ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                        Заказать пополнение ({replenishmentAlerts.length})
                    </Button>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-3">
                {/* Left: Alerts Feed */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Срочно требуется сток
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-rose-500" />
                                <span className="text-[9px] font-black uppercase text-slate-400">Критично (&lt; 3 дн)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-[9px] font-black uppercase text-slate-400">Средне (&lt; 7 дн)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {replenishmentAlerts.map(item => (
                            <Card key={item.id} className={cn(
                                "rounded-xl border-none shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-500",
                                item.urgency === 'critical' ? "ring-2 ring-rose-500/20" : ""
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-24 w-20 rounded-2xl bg-slate-50 relative overflow-hidden shrink-0">
                                            <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                            {item.urgency === 'critical' && (
                                                <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] flex items-center justify-center">
                                                    <AlertTriangle className="h-6 w-6 text-rose-500" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{item.brand}</p>
                                                    <h4 className="text-sm font-black uppercase tracking-tight leading-none">{item.name}</h4>
                                                </div>
                                                <Badge className={cn(
                                                    "border-none text-[9px] font-black uppercase px-2 py-0.5",
                                                    item.urgency === 'critical' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                                                )}>
                                                    {item.urgency === 'critical' ? 'Critical' : 'Alert'}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black uppercase text-slate-400">Текущий сток</p>
                                                    <p className="text-base font-black text-slate-900">{item.currentStock} <span className="text-[10px]">ед.</span></p>
                                                </div>
                                                <div className="space-y-1 border-x border-slate-100 px-6">
                                                    <p className="text-[8px] font-black uppercase text-slate-400">Sell-Through</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-base font-black text-emerald-600">{item.sellThrough}%</p>
                                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black uppercase text-slate-400">Хватит на</p>
                                                    <p className={cn(
                                                        "text-base font-black",
                                                        item.daysUntilOut < 3 ? "text-rose-500" : "text-amber-500"
                                                    )}>{item.daysUntilOut} дн.</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-slate-50 flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Activity className="h-3 w-3 text-indigo-500" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live API Stock:</span>
                                                    <span className="text-[9px] font-bold text-indigo-600">Sync Active</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Sell-through:</span>
                                                    <span className="text-[9px] font-bold text-emerald-600">95%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-48 bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-100">
                                            <p className="text-[8px] font-black uppercase text-slate-400">Рекомендация AI</p>
                                            <div className="text-center">
                                                <p className="text-sm font-black text-indigo-600">+{item.suggestedQty}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">ед. товара</p>
                                            </div>
                                            <Button size="sm" className="w-full h-8 rounded-xl bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all text-[9px] font-black uppercase">
                                                В корзину B2B
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right: Stats & Trends */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 relative overflow-hidden group">
                        <Zap className="absolute -right-4 -top-4 h-32 w-32 text-white opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-4">
                            <header className="space-y-2">
                                <Badge className="bg-amber-500 text-white border-none font-black text-[8px] uppercase px-2 py-0.5">Автоматический режим</Badge>
                                <h3 className="text-sm font-black uppercase tracking-tight leading-none italic">Replenishment <br /> Strategy</h3>
                            </header>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Inventory Health</span>
                                        <span>74%</span>
                                    </div>
                                    <Progress value={74} className="h-1.5 bg-white/10 rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Lost Revenue Risk</p>
                                        <p className="text-sm font-black text-rose-400">1.2M ₽</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1">In Transit</p>
                                        <p className="text-sm font-black text-indigo-400">450 ед.</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-black/20">
                                View Full Report <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Ближайшие поставки</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 'ORD-992', brand: 'Syntha Lab', status: 'In Transit', date: 'Сегодня', color: 'text-indigo-600' },
                                { id: 'ORD-987', brand: 'Nordic Wool', status: 'Processing', date: '12 фев', color: 'text-amber-500' },
                                { id: 'ORD-985', brand: 'Studio 29', status: 'Ready to Ship', date: '15 фев', color: 'text-emerald-500' }
                            ].map(ship => (
                                <div key={ship.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 group hover:border-indigo-100 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-900">{ship.brand}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{ship.id} • {ship.date}</p>
                                    </div>
                                    <div className={cn("text-[9px] font-black uppercase", ship.color)}>
                                        {ship.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
                            Все поставки <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ArrowUpRight(props: any) {
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
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

function ChevronRight(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
