'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Zap, ShoppingBag, Gift, Ticket, 
    Smartphone, Globe, LayoutGrid, List,
    Sparkles, Lock, ChevronRight, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface Reward {
    id: string;
    title: string;
    description: string;
    cost: number;
    image: string;
    category: 'discount' | 'digital' | 'physical' | 'experience';
    status: 'available' | 'sold_out' | 'limited';
}

const REWARDS: Reward[] = [
    { 
        id: 'r1', 
        title: '-25% на следующую покупку', 
        description: 'Действует на все бренды, кроме Outlet.', 
        cost: 1500, 
        image: 'https://picsum.photos/seed/r1/400/400', 
        category: 'discount',
        status: 'available'
    },
    { 
        id: 'r2', 
        title: 'NFT Wearable: Syntha Cyber Jacket', 
        description: 'Эксклюзивная цифровая куртка для вашего аватара.', 
        cost: 3000, 
        image: 'https://picsum.photos/seed/r2/400/400', 
        category: 'digital',
        status: 'limited'
    },
    { 
        id: 'r3', 
        title: 'Билет на Syntha Fashion Week', 
        description: 'Доступ на главный показ сезона (Москва).', 
        cost: 10000, 
        image: 'https://picsum.photos/seed/r3/400/400', 
        category: 'experience',
        status: 'limited'
    },
    { 
        id: 'r4', 
        title: 'Набор эко-мерча Syntha', 
        description: 'Футболка из органического хлопка и шопер.', 
        cost: 5000, 
        image: 'https://picsum.photos/seed/r4/400/400', 
        category: 'physical',
        status: 'available'
    },
    { 
        id: 'r5', 
        title: 'Ранний доступ к дропу SS26', 
        description: 'Возможность купить новинки за 24 часа до релиза.', 
        cost: 2000, 
        image: 'https://picsum.photos/seed/r5/400/400', 
        category: 'experience',
        status: 'available'
    },
    { 
        id: 'r6', 
        title: 'Цифровой сертификат на 1000 ₽', 
        description: 'Можно подарить другу или использовать самому.', 
        cost: 1000, 
        image: 'https://picsum.photos/seed/r6/400/400', 
        category: 'discount',
        status: 'available'
    }
];

export default function RewardsMarketplace() {
    const { toast } = useToast();
    const [balance, setBalance] = useState(4250); // Mock balance

    const handleBuy = (reward: Reward) => {
        if (balance < reward.cost) {
            toast({
                title: "Недостаточно баллов",
                description: `Вам не хватает ${reward.cost - balance} SC для покупки этого вознаграждения.`,
                variant: "destructive"
            });
            return;
        }
        setBalance(prev => prev - reward.cost);
        toast({
            title: "Успешная покупка!",
            description: `Вознаграждение "${reward.title}" теперь доступно в вашем профиле.`,
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">
                        Маркетплейс <span className="text-indigo-600 italic">Наград</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">Обменивайте накопленные баллы на реальные и цифровые привилегии.</p>
                </div>
                <Card className="rounded-2xl border-none shadow-lg bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <Zap className="h-5 w-5 fill-white" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Ваш баланс</p>
                        <p className="text-base font-black tabular-nums">{balance.toLocaleString('ru-RU')} <span className="text-xs">SC</span></p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {REWARDS.map(reward => (
                    <Card 
                        key={reward.id} 
                        className="group rounded-xl border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col bg-white"
                    >
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <Image 
                                src={reward.image} 
                                alt={reward.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <Badge className={cn(
                                "absolute top-4 left-4 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 shadow-lg",
                                reward.category === 'digital' ? "bg-purple-600 text-white" :
                                reward.category === 'experience' ? "bg-amber-500 text-white" :
                                reward.category === 'physical' ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                            )}>
                                {reward.category === 'digital' ? 'Digital NFT' :
                                 reward.category === 'experience' ? 'Experience' :
                                 reward.category === 'physical' ? 'Physical' : 'Voucher'}
                            </Badge>

                            {reward.status === 'limited' && (
                                <Badge className="absolute top-4 right-4 bg-rose-600 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 shadow-lg animate-pulse">
                                    Limited Edition
                                </Badge>
                            )}
                        </div>
                        <CardHeader className="flex-1 pb-4">
                            <CardTitle className="text-base font-black uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                {reward.title}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium leading-relaxed italic">
                                {reward.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 p-4 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-1 text-indigo-600 font-black text-sm">
                                <Zap className="h-4 w-4 fill-indigo-600" /> {reward.cost} <span className="text-[10px] uppercase tracking-widest ml-1">SC</span>
                            </div>
                            <Button 
                                onClick={() => handleBuy(reward)}
                                className={cn(
                                    "rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[9px] shadow-lg transition-all",
                                    balance >= reward.cost ? "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-100" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                Обменять
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-3 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl relative overflow-hidden group">
                <Sparkles className="absolute -right-10 -top-3 h-64 w-64 text-white opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000" />
                <div className="relative z-10 text-center md:text-left">
                    <Badge className="bg-indigo-600 text-white border-none mb-4 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                        Coming Soon
                    </Badge>
                    <h3 className="text-base font-black uppercase tracking-tighter italic leading-none mb-4">
                        Marketplace <br /> Collaboration
                    </h3>
                    <p className="text-sm text-slate-400 font-medium max-w-md leading-relaxed">
                        Мы работаем над расширением наград: скоро вы сможете обменивать баллы на подписки Apple Music, билеты в кино и скидки у наших партнеров по всему миру.
                    </p>
                </div>
                <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-[9px] h-12 px-8 hover:bg-white/10">
                        Узнать больше <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button className="rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] h-12 px-8 hover:bg-slate-100 shadow-xl">
                        Предложить награду <Check className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
