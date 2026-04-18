'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Star,
  Target,
  CheckCircle2,
  Gift,
  MessageSquare,
  ShoppingBag,
  Share2,
  Camera,
  Trophy,
  Sparkles,
  Clock,
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
    category: 'daily',
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
    category: 'daily',
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
    category: 'weekly',
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
    category: 'weekly',
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
    category: 'achievement',
  },
];

export default function LoyaltyQuests() {
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  const handleClaim = (id: string) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'claimed' as const } : q)));
    toast({
      title: 'Награда получена!',
      description: 'Баллы зачислены на ваш бонусный счет.',
    });
  };

  return (
    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
            Квесты и <span className="text-accent-primary italic">Достижения</span>
          </h2>
          <p className="text-text-secondary mt-2 font-medium">
            Выполняйте задания и получайте Syntha Coins (SC).
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-accent-primary/10 text-accent-primary border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">
            <Clock className="mr-1 h-3 w-3" /> Обновление через 14ч
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <Card
            key={quest.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border-none shadow-xl transition-all duration-500',
              quest.status === 'claimed'
                ? 'bg-bg-surface2 opacity-60 grayscale'
                : 'bg-white hover:-translate-y-1 hover:shadow-2xl'
            )}
          >
            {quest.status === 'completed' && (
              <div className="absolute right-0 top-0 p-4">
                <Sparkles className="text-accent-primary h-6 w-6 animate-pulse" />
              </div>
            )}
            <CardHeader className="pb-4">
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                  quest.category === 'daily'
                    ? 'bg-amber-50 text-amber-600'
                    : quest.category === 'weekly'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-accent-primary/10 text-accent-primary'
                )}
              >
                <quest.icon className="h-6 w-6" />
              </div>
              <div className="flex items-start justify-between">
                <Badge
                  className={cn(
                    'mb-2 border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest',
                    quest.category === 'daily'
                      ? 'bg-amber-100 text-amber-700'
                      : quest.category === 'weekly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-accent-primary/15 text-accent-primary'
                  )}
                >
                  {quest.category === 'daily'
                    ? 'Ежедневный'
                    : quest.category === 'weekly'
                      ? 'Еженедельный'
                      : 'Достижение'}
                </Badge>
                <div className="text-accent-primary flex items-center gap-1 text-xs font-black">
                  <Zap className="fill-accent-primary h-3 w-3" /> +{quest.reward} SC
                </div>
              </div>
              <CardTitle className="text-sm font-black uppercase leading-tight tracking-tight">
                {quest.title}
              </CardTitle>
              <CardDescription className="text-[11px] font-medium leading-relaxed">
                {quest.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-text-muted flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Прогресс</span>
                  <span>
                    {quest.progress} / {quest.target}
                  </span>
                </div>
                <Progress
                  value={(quest.progress / quest.target) * 100}
                  className={cn(
                    'h-1.5 rounded-full',
                    quest.status === 'completed' || quest.status === 'claimed'
                      ? 'bg-emerald-100'
                      : 'bg-bg-surface2'
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {quest.status === 'active' ? (
                <Button
                  variant="outline"
                  className="border-border-subtle group-hover:border-accent-primary/30 group-hover:text-accent-primary h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  В процессе...
                </Button>
              ) : quest.status === 'completed' ? (
                <Button
                  onClick={() => handleClaim(quest.id)}
                  className="bg-accent-primary shadow-accent-primary/10 h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
                >
                  Забрать награду <Gift className="ml-2 h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  disabled
                  className="bg-border-subtle text-text-muted h-10 w-full rounded-xl border-none text-[9px] font-black uppercase tracking-widest"
                >
                  Награда получена <CheckCircle2 className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        <Card className="border-border-subtle bg-bg-surface2/30 hover:border-accent-primary/20 group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
            <Trophy className="text-text-muted group-hover:text-accent-primary h-8 w-8" />
          </div>
          <h4 className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
            Скоро новые квесты
          </h4>
          <p className="text-text-muted text-[10px] font-medium">
            Следите за обновлениями, чтобы не пропустить эксклюзивные задания от брендов.
          </p>
        </Card>
      </div>
    </div>
  );
}
