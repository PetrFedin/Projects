'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Settings2,
  Users,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function SmartAllocationEngine() {
  const { inventoryATS, retailerProfiles } = useB2BState();
  const [allocationStrategy, setAllocationStrategy] = useState<'fifo' | 'vip' | 'balanced'>('vip');

  const strategies = [
    {
      id: 'fifo',
      name: 'Первым пришел — первым ушел',
      desc: 'Заказы выполняются строго по дате создания.',
      icon: Clock,
    },
    {
      id: 'vip',
      name: 'VIP Приоритет',
      desc: 'Золотые и VIP клиенты получают приоритетный доступ к дефициту.',
      icon: Star,
    },
    {
      id: 'balanced',
      name: 'Сбалансированное деление',
      desc: 'Сток делится пропорционально между всеми активными заказами.',
      icon: Layers,
    },
  ];

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
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              ALLOCATION_CORE_v3.4
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Умное Распределение
            <br />
            Запасов
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Определение правил распределения ограниченного стока (ATS) при превышении спроса.
            Автоматическое резервирование на основе уровня ритейлера и его показателей.
          </p>
        </div>

<<<<<<< HEAD
        <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-200">
=======
        <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
          Выполнить глобальное перераспределение <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Strategy Selection */}
        {strategies.map((s) => (
          <Card
            key={s.id}
            onClick={() => setAllocationStrategy(s.id as any)}
            className={cn(
<<<<<<< HEAD
              'group relative cursor-pointer overflow-hidden rounded-xl border-none p-4 shadow-xl shadow-slate-200/50 transition-all',
              allocationStrategy === s.id ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50'
=======
              'group relative cursor-pointer overflow-hidden rounded-xl border-none p-4 shadow-md shadow-xl transition-all',
              allocationStrategy === s.id
                ? 'bg-text-primary text-white'
                : 'hover:bg-bg-surface2 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            {allocationStrategy === s.id && (
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <s.icon className="h-24 w-24" />
              </div>
            )}
            <div className="relative z-10 space-y-6">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl transition-colors',
<<<<<<< HEAD
                  allocationStrategy === s.id ? 'bg-white/10' : 'bg-slate-50'
=======
                  allocationStrategy === s.id ? 'bg-white/10' : 'bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <s.icon
                  className={cn(
                    'h-6 w-6',
<<<<<<< HEAD
                    allocationStrategy === s.id ? 'text-white' : 'text-slate-400'
=======
                    allocationStrategy === s.id ? 'text-white' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                />
              </div>
              <div>
                <h4 className="mb-2 text-base font-black uppercase tracking-tight">{s.name}</h4>
                <p
                  className={cn(
                    'text-[10px] font-medium uppercase leading-relaxed tracking-widest',
<<<<<<< HEAD
                    allocationStrategy === s.id ? 'text-slate-400' : 'text-slate-400'
=======
                    allocationStrategy === s.id ? 'text-text-muted' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {s.desc}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {allocationStrategy === s.id ? (
                  <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                    Active Strategy
                  </Badge>
                ) : (
<<<<<<< HEAD
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
=======
                  <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Select to activate
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Inventory Queue */}
        <div className="space-y-6 lg:col-span-8">
<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-black uppercase tracking-tight">
                  Ожидаемые распределения
                </CardTitle>
<<<<<<< HEAD
                <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
=======
                <CardDescription className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Товары, требующие ручного распределения или правил
                </CardDescription>
              </div>
              <Badge className="border-none bg-amber-50 text-[9px] font-black text-amber-600">
                14 КОНФЛИКТОВ
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                {inventoryATS.map((item, i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="group flex items-center justify-between rounded-3xl border border-transparent bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-slate-100"
=======
                    className="bg-bg-surface2 hover:bg-bg-surface2 hover:border-border-default group flex items-center justify-between rounded-3xl border border-transparent p-4 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <img
                          src={`https://placehold.co/100x100/f1f5f9/94a3b8?text=${item.sku.split('-')[0]}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
<<<<<<< HEAD
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {item.sku}
                        </p>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            Сток: {item.available}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
=======
                        <p className="text-text-muted text-xs font-black uppercase tracking-widest">
                          {item.sku}
                        </p>
                        <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted text-[10px] font-bold uppercase">
                            Сток: {item.available}
                          </span>
                          <span className="bg-border-subtle h-1 w-1 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                          <span className="text-[10px] font-bold uppercase text-rose-600">
                            Спрос: {item.reserved + 450}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
<<<<<<< HEAD
                        <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
                        <p className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Уровень конфликта
                        </p>
                        <Badge className="border-none bg-rose-100 px-2 py-0.5 text-[8px] font-black text-rose-600">
                          КРИТИЧЕСКИЙ
                        </Badge>
                      </div>
<<<<<<< HEAD
                      <Button className="h-12 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white">
=======
                      <Button className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        Решить конфликт <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Dashboard */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-accent-primary relative space-y-6 overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Star className="h-32 w-32" />
            </div>
            <h3 className="relative z-10 text-base font-black uppercase tracking-tight">
              Выполнение по уровням
            </h3>
            <div className="relative z-10 space-y-6">
              {[
                { tier: 'VIP/Gold', progress: 100, color: 'bg-emerald-400' },
<<<<<<< HEAD
                { tier: 'Silver', progress: 85, color: 'bg-indigo-300' },
=======
                { tier: 'Silver', progress: 85, color: 'bg-accent-primary/40' },
>>>>>>> recover/cabinet-wip-from-stash
                { tier: 'Standard', progress: 42, color: 'bg-white/20' },
              ].map((t) => (
                <div key={t.tier} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{t.tier}</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.progress}%` }}
                      className={cn('h-full', t.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                <ShieldCheck className="text-text-muted h-5 w-5" />
              </div>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Здоровье распределения
              </h4>
            </div>
            <div className="space-y-4">
<<<<<<< HEAD
              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-[9px] font-medium leading-relaxed text-slate-600">
=======
              <div className="bg-bg-surface2 border-border-subtle flex items-start gap-3 rounded-2xl border p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-text-secondary text-[9px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  92% предзаказов VIP успешно распределены. Текущая оптимизация стока на пике
                  эффективности.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-[9px] font-medium leading-relaxed text-amber-900">
                  Заказы уровня Standard на 'Cyber Tech Parka' задержаны из-за низкого ATS в хабе
                  Москва.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
