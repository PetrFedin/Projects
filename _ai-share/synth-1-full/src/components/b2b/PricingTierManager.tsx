'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  Settings2,
  Users,
  BarChart3,
  ChevronRight,
  Plus,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function PricingTierManager() {
  const { viewRole } = useUIState();
  const { wholesaleCollections } = useB2BState();
  const [tiers, setTiers] = useState([
    {
      id: 't1',
      name: 'Стандарт Бутик',
      discount: 0,
      moq: '500K ₽',
      accounts: 42,
<<<<<<< HEAD
      color: 'bg-slate-500',
=======
      color: 'bg-bg-surface2',
>>>>>>> recover/cabinet-wip-from-stash
    },
    {
      id: 't2',
      name: 'Премиум Партнер',
      discount: 5,
      moq: '1.5M ₽',
      accounts: 12,
<<<<<<< HEAD
      color: 'bg-indigo-500',
=======
      color: 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
    },
    {
      id: 't3',
      name: 'Ключевой клиент / Универмаг',
      discount: 12,
      moq: '5M ₽',
      accounts: 4,
      color: 'bg-emerald-500',
    },
  ]);

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-4">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Percent className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              PRICING_CORE_v4.2
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Матрица
            <br />
            Ценовых Уровней
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Определение уровней цен и структуры скидок. Автоматическое применение цен в зависимости
            от объема закупок, статуса лояльности и региона.
          </p>
        </div>

<<<<<<< HEAD
        <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
        <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
          <Plus className="h-4 w-4" /> Создать новый уровень
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
<<<<<<< HEAD
            className="group space-y-4 rounded-xl border-none bg-white p-4 shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.02]"
=======
            className="group space-y-4 rounded-xl border-none bg-white p-4 shadow-md shadow-xl transition-all hover:scale-[1.02]"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <div className="flex items-center justify-between">
              <div
                className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', tier.color)}
              >
                <Target className="h-6 w-6 text-white" />
              </div>
<<<<<<< HEAD
              <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase">
=======
              <Badge
                variant="outline"
                className="border-border-subtle text-[8px] font-black uppercase"
              >
>>>>>>> recover/cabinet-wip-from-stash
                {tier.accounts} аккаунтов
              </Badge>
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
              <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                {tier.name}
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Percent className="h-3.5 w-3.5" />
                  <span className="text-sm font-black">{tier.discount}% Скидка</span>
                </div>
<<<<<<< HEAD
                <div className="h-1 w-1 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold uppercase text-slate-400">
=======
                <div className="bg-border-subtle h-1 w-1 rounded-full" />
                <span className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  MOQ: {tier.moq}
                </span>
              </div>
            </div>

<<<<<<< HEAD
            <div className="space-y-4 border-t border-slate-50 pt-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Ср. маржа</span>
                <span className="text-slate-900">{65 - tier.discount}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
=======
            <div className="border-border-subtle space-y-4 border-t pt-4">
              <div className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Ср. маржа</span>
                <span className="text-text-primary">{65 - tier.discount}%</span>
              </div>
              <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                <div
                  className={cn('h-full', tier.color)}
                  style={{ width: `${100 - tier.discount}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-10 flex-1 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest"
=======
                className="border-border-subtle h-10 flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Настроить
              </Button>
              <Button
                variant="outline"
                size="icon"
<<<<<<< HEAD
                className="h-10 w-10 rounded-xl border-slate-100"
              >
                <Settings2 className="h-4 w-4 text-slate-400" />
=======
                className="border-border-subtle h-10 w-10 rounded-xl"
              >
                <Settings2 className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Tier Simulation */}
        <div className="lg:col-span-8">
<<<<<<< HEAD
          <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                  Симулятор прибыльности
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Оценка маржи для разных уровней текущей коллекции (₽)
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                <BarChart3 className="h-6 w-6 text-slate-400" />
=======
          <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                  Симулятор прибыльности
                </h3>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  Оценка маржи для разных уровней текущей коллекции (₽)
                </p>
              </div>
              <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center rounded-2xl">
                <BarChart3 className="text-text-muted h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: 'Cyber Tech Parka',
                  base: '12,400 ₽',
                  t1: '12,400 ₽',
                  t2: '11,780 ₽',
                  t3: '10,912 ₽',
                },
                {
                  name: 'Neural Cargo Pants',
                  base: '8,900 ₽',
                  t1: '8,900 ₽',
                  t2: '8,455 ₽',
                  t3: '7,832 ₽',
                },
                {
                  name: 'Minimalist Overcoat',
                  base: '15,600 ₽',
                  t1: '15,600 ₽',
                  t2: '14,820 ₽',
                  t3: '13,728 ₽',
                },
              ].map((item, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group grid grid-cols-5 items-center rounded-3xl border border-transparent bg-slate-50 p-4 transition-all hover:border-slate-200"
                >
                  <div className="col-span-1">
                    <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">
=======
                  className="bg-bg-surface2 hover:border-border-default group grid grid-cols-5 items-center rounded-3xl border border-transparent p-4 transition-all"
                >
                  <div className="col-span-1">
                    <p className="text-text-primary text-[10px] font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {item.name}
                    </p>
                  </div>
                  <div className="text-center">
<<<<<<< HEAD
                    <p className="mb-1 text-[8px] font-bold uppercase text-slate-400">
                      База (MSRP)
                    </p>
                    <p className="text-xs font-black text-slate-400">{item.base}</p>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-[8px] font-bold uppercase text-slate-500">T1 (0%)</p>
                    <p className="text-xs font-black text-slate-900">{item.t1}</p>
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-[8px] font-bold uppercase text-indigo-500">T2 (-5%)</p>
                    <p className="text-xs font-black text-indigo-600">{item.t2}</p>
=======
                    <p className="text-text-muted mb-1 text-[8px] font-bold uppercase">
                      База (MSRP)
                    </p>
                    <p className="text-text-muted text-xs font-black">{item.base}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-secondary mb-1 text-[8px] font-bold uppercase">
                      T1 (0%)
                    </p>
                    <p className="text-text-primary text-xs font-black">{item.t1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-accent-primary mb-1 text-[8px] font-bold uppercase">
                      T2 (-5%)
                    </p>
                    <p className="text-accent-primary text-xs font-black">{item.t2}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="text-center">
                    <p className="mb-1 text-[8px] font-bold uppercase text-emerald-500">
                      T3 (-12%)
                    </p>
                    <p className="text-xs font-black text-emerald-600">{item.t3}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Global Rules */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-text-primary relative space-y-6 overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-5">
              <ShieldCheck className="h-32 w-32" />
            </div>
            <h3 className="relative z-10 text-base font-black uppercase tracking-tight">
              Глобальные правила
            </h3>
            <div className="relative z-10 space-y-4">
              {[
                'Авто-апгрейд уровня при закупках от 5M+ ₽ в год',
                'Региональная наценка для ОАЭ (4.2%)',
                'Скидка за ранний предзаказ: +2%',
                'Множитель баллов лояльности: 1.5x для T3',
              ].map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
<<<<<<< HEAD
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
=======
                  <Zap className="text-accent-primary h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                  <span className="text-[9px] font-bold uppercase tracking-tight text-white/80">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <Button className="h-12 w-full gap-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900">
=======
            <Button className="text-text-primary h-12 w-full gap-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Редактировать логику <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
