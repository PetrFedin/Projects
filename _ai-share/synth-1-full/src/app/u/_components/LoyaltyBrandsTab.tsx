'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Star,
  TrendingUp,
  Trophy,
  Gift,
  ArrowRight,
  ShieldCheck,
  Clock,
  ShoppingBag,
  Heart,
  ExternalLink,
  Zap,
  Sparkles,
  Brain,
  Layers,
  Calendar,
  MousePointer2,
  PieChart,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
      returnRate: 'Очень низкий (5%)',
    },
    brandSynergy: {
      mixesWith: ['Syntha Lab', 'Studio 29'],
      topCategories: ['Пальто', 'Трикотаж'],
    },
    benefits: [
      'Бесплатная экспресс-доставка',
      'Доступ к закрыстым распродажам (-24 часа)',
      'Персональный стилист 24/7',
    ],
    offers: [
      { id: 1, title: 'Скидка на новую капсулу', value: '-15%', code: 'GOLD15' },
      { id: 2, title: 'Удвоенные баллы за покупку', value: 'x2', code: 'DOUBLE' },
    ],
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
      returnRate: 'Средний (15%)',
    },
    brandSynergy: {
      mixesWith: ['Nordic Wool'],
      topCategories: ['Верхняя одежда', 'Брюки'],
    },
    benefits: ['Ранний доступ к новинкам', 'Приоритетное обслуживание'],
    offers: [{ id: 3, title: 'Подарок к следующему заказу', value: 'GIFT', code: 'HELLO_LAB' }],
  },
];

export function LoyaltyBrandsTab() {
  const [selectedBrand, setSelectedBrand] = useState(userBrands[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="space-y-10 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-tighter">Экосистема лояльности</h2>
          <p className="max-w-xl font-medium text-muted-foreground">
            Ваша ценность для брендов, детальная статистика по категориям и персональные условия
            участия.
          </p>
        </div>
        <div className="flex shrink-0 rounded-2xl border bg-muted/50 p-1">
          <div className="border-r px-4 py-2 text-center">
            <p className="mb-0.5 text-[10px] font-black uppercase text-muted-foreground">
              Всего LTV
            </p>
            <p className="text-sm font-black uppercase">199 800 ₽</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="mb-0.5 text-[10px] font-black uppercase text-muted-foreground">
              Активных статусов
            </p>
            <p className="text-sm font-black uppercase">2 бренда</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Brand List Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-muted/20 bg-muted/30 p-2 shadow-inner">
            {userBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => setSelectedBrand(brand)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-500',
                  selectedBrand.id === brand.id
                    ? 'scale-[1.02] border-none bg-white shadow-xl'
                    : 'opacity-60 grayscale hover:bg-white/50 hover:opacity-100 hover:grayscale-0'
                )}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  {typeof brand.logo === 'string' ? (
                    <Image src={brand.logo} alt={brand.name} fill className="object-contain p-3" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50">
                      <Building2 className="h-6 w-6 text-slate-200" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-black uppercase tracking-tight">
                    {brand.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        brand.level === 2 ? 'bg-yellow-400 text-black' : 'bg-slate-400 text-white'
                      )}
                    >
                      {brand.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {brand.points} Б
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    'h-5 w-5 transition-transform duration-500',
                    selectedBrand.id === brand.id
                      ? 'translate-x-1 text-accent'
                      : 'text-muted-foreground opacity-20'
                  )}
                />
              </div>
            ))}
          </div>

          <Card className="group relative overflow-hidden rounded-xl border-dashed border-muted-foreground/20 bg-muted/5">
            <CardContent className="relative z-10 space-y-4 p-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                <Building2 className="h-7 w-7 text-accent" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-tight">Новые горизонты</p>
                <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                  Система выявила 5 брендов со схожим Style DNA. Получите приветственные бонусы при
                  первом заказе.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-11 w-full rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black hover:text-white"
              >
                Найти бренды по ДНК <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </CardContent>
            <div className="absolute right-0 top-0 -mr-8 -mt-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
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
              <div className="relative overflow-hidden rounded-xl bg-black p-4 text-white shadow-2xl">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Trophy className="h-48 w-48 rotate-12" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-xl">
                      {typeof selectedBrand.logo === 'string' ? (
                        <Image
                          src={selectedBrand.logo}
                          alt={selectedBrand.name}
                          fill
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                          <Building2 className="h-8 w-8 text-slate-200" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase leading-none tracking-tighter">
                        {selectedBrand.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                          Personal Intelligence
                        </p>
                        <Badge className="border-none bg-accent px-2 text-[9px] font-black uppercase text-white">
                          ID: {selectedBrand.id.split('_')[1]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      {
                        label: 'Статус у бренда',
                        value: selectedBrand.status,
                        icon: <ShieldCheck className="h-4 w-4" />,
                      },
                      {
                        label: 'Доступно баллов',
                        value: `${selectedBrand.points} Б`,
                        icon: <Star className="h-4 w-4" />,
                      },
                      {
                        label: 'Объем покупок',
                        value: `${selectedBrand.totalSpent.toLocaleString('ru-RU')} ₽`,
                        icon: <ShoppingBag className="h-4 w-4" />,
                      },
                      {
                        label: 'Последний контакт',
                        value: selectedBrand.lastInteraction,
                        icon: <Clock className="h-4 w-4" />,
                      },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-6">
                  <h4 className="flex items-center gap-2 border-b pb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    <Brain className="h-4 w-4 text-accent" /> Ваш поведенческий профиль
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        label: 'Style DNA',
                        value: selectedBrand.behavioralProfile.styleDNA,
                        icon: <Sparkles className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Дни активности',
                        value: selectedBrand.behavioralProfile.purchaseDays.join(' / '),
                        icon: <Calendar className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Паттерн покупок',
                        value: selectedBrand.behavioralProfile.purchasePattern,
                        icon: <Layers className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Сезонный фокус',
                        value: selectedBrand.behavioralProfile.seasonality,
                        icon: <Zap className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Материалы',
                        value: selectedBrand.behavioralProfile.favoriteMaterials.join(', '),
                        icon: <ShieldCheck className="h-3.5 w-3.5" />,
                      },
                      {
                        label: 'Уровень возвратов',
                        value: selectedBrand.behavioralProfile.returnRate,
                        icon: <RotateCcw className="h-3.5 w-3.5" />,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-accent/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-accent/5 group-hover:text-accent">
                            {item.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="max-w-[140px] text-right text-[11px] font-black uppercase leading-tight">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 border-b pb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      <TrendingUp className="h-4 w-4 text-accent" /> Прогресс и Синергия
                    </h4>
                    <Card className="space-y-6 rounded-xl border bg-white p-4 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Следующий уровень
                            </p>
                            <p className="text-base font-black uppercase leading-none text-accent">
                              Level {selectedBrand.level + 1}
                            </p>
                          </div>
                          <Badge className="border-none bg-accent px-3 py-1 text-[10px] font-black uppercase text-white">
                            VIP Target
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Progress value={selectedBrand.progress} className="h-3 rounded-full" />
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                            <span>{selectedBrand.totalSpent.toLocaleString('ru-RU')} ₽</span>
                            <span>{selectedBrand.nextLevelAt.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-muted/20" />

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Синергия брендов
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBrand.brandSynergy.mixesWith.map((b, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="rounded-xl border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-tight"
                            >
                              {b} + {selectedBrand.name}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-[10px] font-medium italic leading-relaxed text-muted-foreground">
                          «Ваш стиль гармонично сочетает эти бренды. Система рекомендует обратить
                          внимание на новые поступления аксессуаров для завершения образов.»
                        </p>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 px-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      <Gift className="h-4 w-4 text-accent" /> Персональные офферы
                    </h4>
                    <div className="space-y-4">
                      {selectedBrand.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="group relative cursor-pointer overflow-hidden rounded-xl border border-accent/10 bg-accent/5 p-4 transition-all hover:bg-accent/10"
                        >
                          <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
                                <Gift className="h-5 w-5" />
                              </div>
                              <h5 className="text-base font-black uppercase leading-tight tracking-tighter">
                                {offer.title}
                              </h5>
                              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                                Промокод: {offer.code}
                              </p>
                            </div>
                            <span className="text-sm font-black text-accent drop-shadow-sm">
                              {offer.value}
                            </span>
                          </div>
                          <Button className="mt-8 h-12 w-full rounded-2xl bg-black text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/5 transition-all hover:bg-accent">
                            Активировать предложение <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <div className="absolute right-0 top-0 -mr-6 -mt-6 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.08]">
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
