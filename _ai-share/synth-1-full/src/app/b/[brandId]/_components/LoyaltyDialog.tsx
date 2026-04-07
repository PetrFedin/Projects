'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
    Trophy, Zap, Star, Gift, ArrowRight, 
    TrendingUp, ShoppingBag, Clock, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoyaltyDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    displayName: string;
}

export function LoyaltyDialog({ isOpen, onOpenChange, displayName }: LoyaltyDialogProps) {
    const loyaltyStats = {
        level: 2,
        status: 'Gold Client',
        points: 1250,
        totalSpent: 154800,
        nextLevelAt: 200000,
        progress: 65,
        benefits: [
            'Бесплатная экспресс-доставка',
            'Доступ к закрытым распродажам (-24 часа)',
            'Персональный стилист 24/7',
            'Подарок на день рождения'
        ],
        offers: [
            { id: 1, title: 'Скидка на новую капсулу', value: '-15%', code: 'GOLD15', icon: <Zap className="h-4 w-4" /> },
            { id: 2, title: 'Удвоенные баллы за покупку', value: 'x2', code: 'DOUBLE', icon: <TrendingUp className="h-4 w-4" /> }
        ]
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden border-none shadow-2xl bg-slate-50">
                <DialogTitle className="sr-only">Программа лояльности {displayName}</DialogTitle>
                <DialogDescription className="sr-only">Детальная информация о вашем статусе и привилегиях</DialogDescription>
                <div className="relative">
                    {/* Header Banner */}
                    <div className="bg-black p-3 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-yellow-400 text-black font-black uppercase text-[10px] px-3 py-1 border-none">
                                    Level {loyaltyStats.level}
                                </Badge>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Программа лояльности</span>
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-tighter leading-none">
                                {loyaltyStats.status}
                            </h2>
                            <p className="text-white/60 text-sm font-medium max-w-md">
                                Вы входите в топ-5% клиентов бренда {displayName}. Спасибо за доверие!
                            </p>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { label: 'Баллы', value: `${loyaltyStats.points} Б`, icon: <Star className="text-yellow-500" /> },
                                { label: 'Покупок', value: `${loyaltyStats.totalSpent.toLocaleString('ru-RU')} ₽`, icon: <ShoppingBag className="text-blue-500" /> },
                                { label: 'Статус до', value: '31.12.2026', icon: <Clock className="text-purple-500" /> }
                            ].map((stat, i) => (
                                <Card key={i} className="rounded-2xl border-none shadow-sm bg-white">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center mb-1">
                                            {stat.icon}
                                        </div>
                                        <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
                                        <p className="text-sm font-black uppercase">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Progress to next level */}
                        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">До статуса VIP</h4>
                                    <p className="text-sm font-black uppercase leading-none">{(loyaltyStats.nextLevelAt - loyaltyStats.totalSpent).toLocaleString('ru-RU')} ₽</p>
                                </div>
                                <span className="text-[10px] font-black text-accent uppercase">VIP Client</span>
                            </div>
                            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loyaltyStats.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-accent"
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground font-medium text-center italic">
                                Совершите покупки на сумму {(loyaltyStats.nextLevelAt - loyaltyStats.totalSpent).toLocaleString('ru-RU')} ₽ для перехода на следующий уровень
                            </p>
                        </div>

                        {/* Two Columns: Benefits & Offers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-500" /> Привилегии
                                </h3>
                                <ul className="space-y-3">
                                    {loyaltyStats.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[11px] font-bold">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <Gift className="h-4 w-4 text-accent" /> Уникальные предложения
                                </h3>
                                <div className="space-y-3">
                                    {loyaltyStats.offers.map((offer) => (
                                        <div key={offer.id} className="p-4 rounded-2xl bg-accent/5 border border-accent/10 group cursor-pointer hover:bg-accent/10 transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-lg bg-accent text-white flex items-center justify-center">
                                                        {offer.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase leading-tight">{offer.title}</span>
                                                </div>
                                                <span className="text-sm font-black text-accent">{offer.value}</span>
                                            </div>
                                            <Button variant="outline" className="w-full h-8 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white border-accent/20 hover:bg-accent hover:text-white transition-all">
                                                Активировать <ArrowRight className="h-3 w-3 ml-2" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
