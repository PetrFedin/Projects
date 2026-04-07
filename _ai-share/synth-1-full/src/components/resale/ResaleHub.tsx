'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Recycle, ArrowUpRight, ShieldCheck, Tag, 
    Zap, Sparkles, Filter, Search, 
    CheckCircle2, AlertCircle, RefreshCcw,
    Camera, History, TrendingUp, Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

export default function ResaleHub() {
    const { toast } = useToast();
    const [view, setView] = useState<'buy' | 'sell'>('buy');
    const [isListing, setIsListing] = useState(false);

    const resaleProducts = allProducts.slice(2, 8).map(p => ({
        ...p,
        resalePrice: Math.round(p.price * 0.65),
        condition: ['Excellent', 'Great', 'Good'][Math.floor(Math.random() * 3)],
        verified: Math.random() > 0.3,
        owner: 'User_' + Math.floor(Math.random() * 1000)
    }));

    const myPurchases = allProducts.slice(0, 3).map(p => ({
        ...p,
        purchaseDate: '12.05.2025',
        estimatedResale: Math.round(p.price * 0.7)
    }));

    const handleListForResale = (productId: string) => {
        setIsListing(true);
        setTimeout(() => {
            setIsListing(false);
            toast({
                title: "Товар выставлен на продажу",
                description: "AI подтвердил подлинность через DPP. Ваше объявление активно.",
            });
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div className="space-y-4">
                    <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        Circularity & Resale 2.0
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
                        Syntha <span className="text-emerald-500 italic">Resale</span> Hub
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl text-sm">
                        Вторая жизнь ваших вещей. Верификация через блокчейн, автоматическая оценка состояния и безопасные сделки.
                    </p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl shrink-0">
                    <button 
                        onClick={() => setView('buy')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            view === 'buy' ? "bg-white text-slate-900 shadow-lg" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Купить
                    </button>
                    <button 
                        onClick={() => setView('sell')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            view === 'sell' ? "bg-white text-slate-900 shadow-lg" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Продать
                    </button>
                </div>
            </header>

            {view === 'buy' ? (
                <div className="grid lg:grid-cols-12 gap-3">
                    {/* Filters & Search */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Поиск по ресейлу</h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Найти бренд или модель..." 
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border-2 border-slate-50 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
                                />
                            </div>
                        </div>

                        <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4">
                            <Sparkles className="h-8 w-8 text-emerald-400 mb-6" />
                            <h3 className="text-base font-black uppercase tracking-tight mb-4 leading-tight italic">AI Price Analytics</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                                Текущий рынок ресейла на 15% ниже, чем в прошлом месяце. Идеальное время для покупки люкса.
                            </p>
                            <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px]">
                                Посмотреть отчет <TrendingUp className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Состояние</h3>
                            <div className="space-y-2">
                                {['New with Tags', 'Excellent', 'Very Good', 'Good'].map(cond => (
                                    <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="h-5 w-5 rounded-md border-2 border-slate-100 group-hover:border-emerald-500 transition-all" />
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{cond}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-9">
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                            {resaleProducts.map(item => (
                                <Card key={item.id} className="rounded-xl border-none shadow-xl bg-white overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                                    <div className="h-80 relative overflow-hidden">
                                        <Image src={item.images[0].url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[8px] uppercase px-2 py-1">
                                                {item.condition}
                                            </Badge>
                                            {item.verified && (
                                                <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase px-2 py-1 flex items-center gap-1">
                                                    <ShieldCheck className="h-3 w-3" /> DPP Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <button className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all shadow-lg">
                                            <Tag className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{item.brand}</p>
                                            <h4 className="text-sm font-black uppercase tracking-tight leading-none truncate">{item.name}</h4>
                                        </div>
                                        <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-slate-400 line-through">{item.price.toLocaleString('ru-RU')} ₽</p>
                                                <p className="text-sm font-black text-slate-900">{item.resalePrice.toLocaleString('ru-RU')} ₽</p>
                                            </div>
                                            <Button className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[9px] transition-all">
                                                Купить
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden p-4 text-center space-y-4">
                        <div className="h-24 w-24 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto">
                            <Camera className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-base font-black uppercase tracking-tight">Выставить товар на ресейл</h2>
                            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                                Выберите товар из истории покупок. AI автоматически подгрузит все данные из Digital Product Passport, подтвердит подлинность и предложит цену.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">No Fake Policy</span>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl">
                                <Zap className="h-5 w-5 text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Instant AI Quote</span>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl">
                                <Handshake className="h-5 w-5 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Secure Escrow</span>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
                            <History className="h-4 w-4" /> Ваши покупки, готовые к перепродаже
                        </h3>
                        <div className="grid md:grid-cols-3 gap-3">
                            {myPurchases.map(item => (
                                <Card key={item.id} className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6 group hover:ring-2 ring-emerald-500/20 transition-all duration-500">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                                        <Image src={item.images[0].url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Button 
                                                onClick={() => handleListForResale(item.id)}
                                                disabled={isListing}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8"
                                            >
                                                {isListing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : 'Выставить'}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">{item.brand}</p>
                                            <h4 className="text-sm font-black uppercase tracking-tight truncate leading-none">{item.name}</h4>
                                        </div>
                                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black uppercase text-slate-400">Est. Value</p>
                                                <p className="text-sm font-black text-emerald-600">{item.estimatedResale.toLocaleString('ru-RU')} ₽</p>
                                            </div>
                                            <div className="text-right space-y-0.5">
                                                <p className="text-[8px] font-black uppercase text-slate-400">Bought</p>
                                                <p className="text-[10px] font-black text-slate-900">{item.purchaseDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
