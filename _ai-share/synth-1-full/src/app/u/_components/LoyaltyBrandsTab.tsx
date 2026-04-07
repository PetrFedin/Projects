'use client';

import React, { useState, useEffect } from 'react';
import { 
    Building2, Star, TrendingUp, Trophy, 
    Gift, ArrowRight, ShieldCheck, Clock,
    ShoppingBag, Heart, ExternalLink,
    Zap, Sparkles, Brain, Layers, 
    Calendar, MousePointer2, PieChart,
    ChevronRight, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const userBrands = [
    {
        id: 'brand_nordic_wool',
        name: 'Nordic Wool',
        logo: 'https://picsum.photos/seed/nordic-wool/200/200',
        status: 'Gold Client',
        level: 2,
        points: 1250,
        totalSpent: 154800,
        nextLevelAt: 200000,
        progress: 65,
        lastInteraction: '2 дня назад',
        
        // Behavioral Insights for User
        behavioralProfile: {
            styleDNA: 'Minimalist / Heritage',
            purchaseDays: ['Суббота', 'Воскресенье'],
            seasonality: 'Зима / Осень',
            favoriteMaterials: ['Кашемир', 'Меринос'],
            purchasePattern: 'Покупаю образами (Total Look)',
            returnRate: 'Очень низкий (5%)'
        },
        brandSynergy: {
            mixesWith: ['Syntha Lab', 'Studio 29'],
            topCategories: ['Пальто', 'Трикотаж']
        },
        benefits: [
            'Бесплатная экспресс-доставка',
            'Доступ к закрыстым распродажам (-24 часа)',
            'Персональный стилист 24/7'
        ],
        offers: [
            { id: 1, title: 'Скидка на новую капсулу', value: '-15%', code: 'GOLD15' },
            { id: 2, title: 'Удвоенные баллы за покупку', value: 'x2', code: 'DOUBLE' }
        ]
    },
    {
        id: 'brand_syntha_lab',
        name: 'Syntha Lab',
        logo: 'https://picsum.photos/seed/syntha-lab/200/200',
        status: 'Silver Client',
        level: 1,
        points: 450,
        totalSpent: 45000,
        nextLevelAt: 100000,
        progress: 45,
        lastInteraction: '1 неделю назад',
        
        behavioralProfile: {
            styleDNA: 'Techwear / Urban',
            purchaseDays: ['Понедельник'],
            seasonality: 'Всесезонно',
            favoriteMaterials: ['Мембрана', 'Нейлон'],
            purchasePattern: 'Коллекционирую дропы',
            returnRate: 'Средний (15%)'
        },
        brandSynergy: {
            mixesWith: ['Nordic Wool'],
            topCategories: ['Верхняя одежда', 'Брюки']
        },
        benefits: [
            'Ранний доступ к новинкам',
            'Приоритетное обслуживание'
        ],
        offers: [
            { id: 3, title: 'Подарок к следующему заказу', value: 'GIFT', code: 'HELLO_LAB' }
        ]
    }
];

export function LoyaltyBrandsTab() {
    const [selectedBrand, setSelectedBrand] = useState(userBrands[0]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                <div className="space-y-2">
                    <h2 className="text-sm font-black uppercase tracking-tighter">Экосистема лояльности</h2>
                    <p className="text-muted-foreground font-medium max-w-xl">Ваша ценность для брендов, детальная статистика по категориям и персональные условия участия.</p>
                </div>
                <div className="flex bg-muted/50 p-1 rounded-2xl border shrink-0">
                    <div className="px-4 py-2 text-center border-r">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Всего LTV</p>
                        <p className="text-sm font-black uppercase">199 800 ₽</p>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">Активных статусов</p>
                        <p className="text-sm font-black uppercase">2 бренда</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Brand List Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-muted/30 p-2 rounded-xl border border-muted/20 shadow-inner">
                        {userBrands.map((brand) => (
                            <div 
                                key={brand.id}
                                onClick={() => setSelectedBrand(brand)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-500",
                                    selectedBrand.id === brand.id 
                                        ? "bg-white shadow-xl scale-[1.02] border-none" 
                                        : "hover:bg-white/50 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 relative bg-white shadow-sm shrink-0">
                                    {typeof brand.logo === 'string' ? (
                                        <Image src={brand.logo} alt={brand.name} fill className="object-contain p-3" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-slate-50">
                                            <Building2 className="h-6 w-6 text-slate-200" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-black uppercase tracking-tight truncate">{brand.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                            brand.level === 2 ? "bg-yellow-400 text-black" : "bg-slate-400 text-white"
                                        )}>
                                            {brand.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground">{brand.points} Б</span>
                                    </div>
                                </div>
                                <ChevronRight className={cn("h-5 w-5 transition-transform duration-500", selectedBrand.id === brand.id ? "translate-x-1 text-accent" : "text-muted-foreground opacity-20")} />
                            </div>
                        ))}
                    </div>

                    <Card className="rounded-xl border-dashed border-muted-foreground/20 bg-muted/5 relative overflow-hidden group">
                        <CardContent className="p-3 text-center space-y-4 relative z-10">
                            <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                <Building2 className="h-7 w-7 text-accent" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-tight">Новые горизонты</p>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Система выявила 5 брендов со схожим Style DNA. Получите приветственные бонусы при первом заказе.</p>
                            </div>
                            <Button variant="outline" className="w-full rounded-2xl h-11 text-[10px] font-black uppercase tracking-widest border-2 hover:bg-black hover:text-white transition-all">
                                Найти бренды по ДНК <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </CardContent>
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Sparkles className="h-40 w-40" />
                        </div>
                    </Card>
                </div>

                {/* Brand Details Content */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedBrand.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-10"
                        >
                            {/* Brand Hero Card */}
                            <div className="bg-black rounded-xl p-4 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy className="h-48 w-48 rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-20 w-20 rounded-[1.5rem] bg-white p-4 overflow-hidden relative shadow-xl">
                                            {typeof selectedBrand.logo === 'string' ? (
                                                <Image src={selectedBrand.logo} alt={selectedBrand.name} fill className="object-contain p-3" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full bg-slate-50">
                                                    <Building2 className="h-8 w-8 text-slate-200" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black uppercase tracking-tighter leading-none">{selectedBrand.name}</h3>
                                            <div className="flex items-center gap-3">
                                                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Personal Intelligence</p>
                                                <Badge className="bg-accent text-white uppercase text-[9px] font-black border-none px-2">ID: {selectedBrand.id.split('_')[1]}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: 'Статус у бренда', value: selectedBrand.status, icon: <ShieldCheck className="h-4 w-4" /> },
                                            { label: 'Доступно баллов', value: `${selectedBrand.points} Б`, icon: <Star className="h-4 w-4" /> },
                                            { label: 'Объем покупок', value: `${selectedBrand.totalSpent.toLocaleString('ru-RU')} ₽`, icon: <ShoppingBag className="h-4 w-4" /> },
                                            { label: 'Последний контакт', value: selectedBrand.lastInteraction, icon: <Clock className="h-4 w-4" /> }
                                        ].map((stat, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase text-white/40 tracking-widest">
                                                    {stat.icon}
                                                    {stat.label}
                                                </div>
                                                <p className="text-sm font-black uppercase leading-none">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Behavioral Profile & Synergy */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-3 flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-accent" /> Ваш поведенческий профиль
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { label: 'Style DNA', value: selectedBrand.behavioralProfile.styleDNA, icon: <Sparkles className="h-3.5 w-3.5" /> },
                                            { label: 'Дни активности', value: selectedBrand.behavioralProfile.purchaseDays.join(' / '), icon: <Calendar className="h-3.5 w-3.5" /> },
                                            { label: 'Паттерн покупок', value: selectedBrand.behavioralProfile.purchasePattern, icon: <Layers className="h-3.5 w-3.5" /> },
                                            { label: 'Сезонный фокус', value: selectedBrand.behavioralProfile.seasonality, icon: <Zap className="h-3.5 w-3.5" /> },
                                            { label: 'Материалы', value: selectedBrand.behavioralProfile.favoriteMaterials.join(', '), icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                                            { label: 'Уровень возвратов', value: selectedBrand.behavioralProfile.returnRate, icon: <RotateCcw className="h-3.5 w-3.5" /> }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-accent/20 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{item.label}</span>
                                                </div>
                                                <span className="text-[11px] font-black uppercase text-right leading-tight max-w-[140px]">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-3 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-accent" /> Прогресс и Синергия
                                        </h4>
                                        <Card className="bg-white p-4 rounded-xl shadow-sm border space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Следующий уровень</p>
                                                        <p className="text-base font-black uppercase leading-none text-accent">Level {selectedBrand.level + 1}</p>
                                                    </div>
                                                    <Badge className="bg-accent text-white uppercase text-[10px] font-black border-none px-3 py-1">VIP Target</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Progress value={selectedBrand.progress} className="h-3 rounded-full" />
                                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                                                        <span>{selectedBrand.totalSpent.toLocaleString('ru-RU')} ₽</span>
                                                        <span>{selectedBrand.nextLevelAt.toLocaleString('ru-RU')} ₽</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-px bg-muted/20" />

                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Синергия брендов</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedBrand.brandSynergy.mixesWith.map((b, i) => (
                                                        <Badge key={i} variant="outline" className="rounded-xl px-3 py-1.5 bg-slate-50 text-[10px] font-black border-slate-200 uppercase tracking-tight">
                                                            {b} + {selectedBrand.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                                                    «Ваш стиль гармонично сочетает эти бренды. Система рекомендует обратить внимание на новые поступления аксессуаров для завершения образов.»
                                                </p>
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4 flex items-center gap-2">
                                            <Gift className="h-4 w-4 text-accent" /> Персональные офферы
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedBrand.offers.map((offer) => (
                                                <div key={offer.id} className="group bg-accent/5 hover:bg-accent/10 border border-accent/10 p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden">
                                                    <div className="flex justify-between items-start relative z-10">
                                                        <div className="space-y-2">
                                                            <div className="h-10 w-10 rounded-2xl bg-accent text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                                                                <Gift className="h-5 w-5" />
                                                            </div>
                                                            <h5 className="text-base font-black uppercase tracking-tighter leading-tight">{offer.title}</h5>
                                                            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">Промокод: {offer.code}</p>
                                                        </div>
                                                        <span className="text-sm font-black text-accent drop-shadow-sm">{offer.value}</span>
                                                    </div>
                                                    <Button className="w-full h-12 mt-8 rounded-2xl bg-black text-white font-black uppercase text-[11px] tracking-[0.2em] hover:bg-accent transition-all shadow-xl shadow-black/5">
                                                        Активировать предложение <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                    <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                                        <Gift className="h-40 w-40 rotate-12" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
