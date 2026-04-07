'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
    Zap, Star, Target, CheckCircle2, 
    Gift, MessageSquare, ShoppingBag, 
    Share2, Camera, Trophy, Sparkles, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Quest {
    id: string;
    title: string;
    description: string;
    reward: number;
    progress: number;
    target: number;
    icon: any;
    status: 'active' | 'completed' | 'claimed';
    category: 'daily' | 'weekly' | 'achievement';
}

const INITIAL_QUESTS: Quest[] = [
    { 
        id: 'q1', 
        title: 'Утренний лук', 
        description: 'Создайте 1 новый образ в Конструкторе Лука.', 
        reward: 50, 
        progress: 0, 
        target: 1, 
        icon: Camera, 
        status: 'active',
        category: 'daily'
    },
    { 
        id: 'q2', 
        title: 'Экспертное мнение', 
        description: 'Оставьте подробный отзыв о купленном товаре.', 
        reward: 100, 
        progress: 0, 
        target: 1, 
        icon: MessageSquare, 
        status: 'active',
        category: 'daily'
    },
    { 
        id: 'q3', 
        title: 'Модный шоппинг', 
        description: 'Сделайте заказ на сумму от 15 000 ₽.', 
        reward: 500, 
        progress: 8500, 
        target: 15000, 
        icon: ShoppingBag, 
        status: 'active',
        category: 'weekly'
    },
    { 
        id: 'q4', 
        title: 'Трендсеттер', 
        description: 'Поделитесь 3 образами в социальных сетях.', 
        reward: 200, 
        progress: 1, 
        target: 3, 
        icon: Share2, 
        status: 'active',
        category: 'weekly'
    },
    { 
        id: 'q5', 
        title: 'Коллекционер', 
        description: 'Соберите 10 товаров в одном мудборде.', 
        reward: 150, 
        progress: 10, 
        target: 10, 
        icon: Star, 
        status: 'completed',
        category: 'achievement'
    },
];

export default function LoyaltyQuests() {
    const { toast } = useToast();
    const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

    const handleClaim = (id: string) => {
        setQuests(prev => prev.map(q => 
            q.id === id ? { ...q, status: 'claimed' as const } : q
        ));
        toast({
            title: "Награда получена!",
            description: "Баллы зачислены на ваш бонусный счет.",
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">
                        Квесты и <span className="text-indigo-600 italic">Достижения</span>
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">Выполняйте задания и получайте Syntha Coins (SC).</p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                        <Clock className="mr-1 h-3 w-3" /> Обновление через 14ч
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quests.map(quest => (
                    <Card 
                        key={quest.id} 
                        className={cn(
                            "group rounded-xl border-none shadow-xl transition-all duration-500 overflow-hidden relative",
                            quest.status === 'claimed' ? "opacity-60 grayscale bg-slate-50" : "bg-white hover:shadow-2xl hover:-translate-y-1"
                        )}
                    >
                        {quest.status === 'completed' && (
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
                            </div>
                        )}
                        <CardHeader className="pb-4">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                quest.category === 'daily' ? "bg-amber-50 text-amber-600" :
                                quest.category === 'weekly' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                            )}>
                                <quest.icon className="h-6 w-6" />
                            </div>
                            <div className="flex justify-between items-start">
                                <Badge className={cn(
                                    "border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 mb-2",
                                    quest.category === 'daily' ? "bg-amber-100 text-amber-700" :
                                    quest.category === 'weekly' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                                )}>
                                    {quest.category === 'daily' ? 'Ежедневный' : quest.category === 'weekly' ? 'Еженедельный' : 'Достижение'}
                                </Badge>
                                <div className="flex items-center gap-1 text-indigo-600 font-black text-xs">
                                    <Zap className="h-3 w-3 fill-indigo-600" /> +{quest.reward} SC
                                </div>
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-tight leading-tight">{quest.title}</CardTitle>
                            <CardDescription className="text-[11px] font-medium leading-relaxed">{quest.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Прогресс</span>
                                    <span>{quest.progress} / {quest.target}</span>
                                </div>
                                <Progress 
                                    value={(quest.progress / quest.target) * 100} 
                                    className={cn(
                                        "h-1.5 rounded-full",
                                        quest.status === 'completed' || quest.status === 'claimed' ? "bg-emerald-100" : "bg-slate-100"
                                    )} 
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            {quest.status === 'active' ? (
                                <Button variant="outline" className="w-full rounded-xl border-slate-100 font-black uppercase tracking-widest text-[9px] h-10 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                                    В процессе...
                                </Button>
                            ) : quest.status === 'completed' ? (
                                <Button 
                                    onClick={() => handleClaim(quest.id)}
                                    className="w-full rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] h-10 shadow-lg shadow-indigo-100"
                                >
                                    Забрать награду <Gift className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            ) : (
                                <Button disabled className="w-full rounded-xl bg-slate-200 text-slate-400 border-none font-black uppercase tracking-widest text-[9px] h-10">
                                    Награда получена <CheckCircle2 className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
                
                <Card className="rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-4 text-center bg-slate-50/30 group hover:border-indigo-100 transition-all">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Trophy className="h-8 w-8 text-slate-200 group-hover:text-indigo-300" />
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-2">Скоро новые квесты</h4>
                    <p className="text-[10px] font-medium text-slate-400">Следите за обновлениями, чтобы не пропустить эксклюзивные задания от брендов.</p>
                </Card>
            </div>
        </div>
    );
}
