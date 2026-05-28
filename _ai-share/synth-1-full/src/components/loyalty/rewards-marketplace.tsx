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
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  ShoppingBag,
  Gift,
  Ticket,
  Smartphone,
  Globe,
  LayoutGrid,
  List,
  Sparkles,
  Lock,
  ChevronRight,
  Check,
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
    status: 'available',
  },
  {
    id: 'r2',
    title: 'NFT Wearable: Syntha Cyber Jacket',
    description: 'Эксклюзивная цифровая куртка для вашего аватара.',
    cost: 3000,
    image: 'https://picsum.photos/seed/r2/400/400',
    category: 'digital',
    status: 'limited',
  },
  {
    id: 'r3',
    title: 'Билет на Syntha Fashion Week',
    description: 'Доступ на главный показ сезона (Москва).',
    cost: 10000,
    image: 'https://picsum.photos/seed/r3/400/400',
    category: 'experience',
    status: 'limited',
  },
  {
    id: 'r4',
    title: 'Набор эко-мерча Syntha',
    description: 'Футболка из органического хлопка и шопер.',
    cost: 5000,
    image: 'https://picsum.photos/seed/r4/400/400',
    category: 'physical',
    status: 'available',
  },
  {
    id: 'r5',
    title: 'Ранний доступ к дропу SS26',
    description: 'Возможность купить новинки за 24 часа до релиза.',
    cost: 2000,
    image: 'https://picsum.photos/seed/r5/400/400',
    category: 'experience',
    status: 'available',
  },
  {
    id: 'r6',
    title: 'Цифровой сертификат на 1000 ₽',
    description: 'Можно подарить другу или использовать самому.',
    cost: 1000,
    image: 'https://picsum.photos/seed/r6/400/400',
    category: 'discount',
    status: 'available',
  },
];

export default function RewardsMarketplace() {
  const { toast } = useToast();
  const [balance, setBalance] = useState(4250); // Mock balance

  const handleBuy = (reward: Reward) => {
    if (balance < reward.cost) {
      toast({
        title: 'Недостаточно баллов',
        description: `Вам не хватает ${reward.cost - balance} SC для покупки этого вознаграждения.`,
        variant: 'destructive',
      });
      return;
    }
    setBalance((prev) => prev - reward.cost);
    toast({
      title: 'Успешная покупка!',
      description: `Вознаграждение "${reward.title}" теперь доступно в вашем профиле.`,
    });
  };

  return (
    <div className="space-y-4 delay-200 duration-1000 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
            Маркетплейс <span className="text-accent-primary italic">Наград</span>
          </h2>
          <p className="text-text-secondary mt-2 font-medium">
            Обменивайте накопленные баллы на реальные и цифровые привилегии.
          </p>
        </div>
        <Card className="bg-text-primary flex items-center gap-3 rounded-2xl border-none p-4 text-white shadow-lg">
          <div className="bg-accent-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Ваш баланс</p>
            <p className="text-base font-black tabular-nums">
              {balance.toLocaleString('ru-RU')} <span className="text-xs">SC</span>
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((reward) => (
          <Card
            key={reward.id}
            className="group flex flex-col overflow-hidden rounded-xl border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={reward.image}
                alt={reward.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <Badge
                className={cn(
                  'absolute left-4 top-4 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg',
                  reward.category === 'digital'
                    ? 'bg-accent-primary text-white'
                    : reward.category === 'experience'
                      ? 'bg-amber-500 text-white'
                      : reward.category === 'physical'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                )}
              >
                {reward.category === 'digital'
                  ? 'Digital NFT'
                  : reward.category === 'experience'
                    ? 'Experience'
                    : reward.category === 'physical'
                      ? 'Physical'
                      : 'Voucher'}
              </Badge>

              {reward.status === 'limited' && (
                <Badge className="absolute right-4 top-4 animate-pulse border-none bg-rose-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                  Limited Edition
                </Badge>
              )}
            </div>
            <CardHeader className="flex-1 pb-4">
              <CardTitle className="group-hover:text-accent-primary text-base font-black uppercase leading-tight tracking-tight transition-colors">
                {reward.title}
              </CardTitle>
              <CardDescription className="text-xs font-medium italic leading-relaxed">
                {reward.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-bg-surface2/80 flex items-center justify-between p-4 pt-0">
              <div className="text-accent-primary flex items-center gap-1 text-sm font-black">
                <Zap className="fill-accent-primary h-4 w-4" /> {reward.cost}{' '}
                <span className="ml-1 text-[10px] uppercase tracking-widest">SC</span>
              </div>
              <Button
                onClick={() => handleBuy(reward)}
                className={cn(
                  'h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest shadow-lg transition-all',
                  balance >= reward.cost
                    ? 'bg-text-primary hover:bg-accent-primary hover:shadow-accent-primary/10 text-white'
                    : 'bg-border-subtle text-text-muted cursor-not-allowed'
                )}
              >
                Обменять
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="from-text-primary to-text-primary group relative flex flex-col items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-br p-3 text-white shadow-2xl md:flex-row">
        <Sparkles className="absolute -right-10 -top-3 h-64 w-64 text-white opacity-[0.03] transition-transform duration-1000 group-hover:rotate-12" />
        <div className="relative z-10 text-center md:text-left">
          <Badge className="bg-accent-primary mb-4 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
            Coming Soon
          </Badge>
          <h3 className="mb-4 text-base font-black uppercase italic leading-none tracking-tighter">
            Marketplace <br /> Collaboration
          </h3>
          <p className="text-text-muted max-w-md text-sm font-medium leading-relaxed">
            Мы работаем над расширением наград: скоро вы сможете обменивать баллы на подписки Apple
            Music, билеты в кино и скидки у наших партнеров по всему миру.
          </p>
        </div>
        <div className="relative z-10 flex w-full flex-col gap-3 md:w-auto">
          <Button
            variant="outline"
            className="h-12 rounded-xl border-white/10 bg-white/5 px-8 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10"
          >
            Узнать больше <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button className="text-text-primary hover:bg-bg-surface2 h-12 rounded-xl bg-white px-8 text-[9px] font-black uppercase tracking-widest shadow-xl">
            Предложить награду <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
