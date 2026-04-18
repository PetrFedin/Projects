'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  History,
  ShoppingCart,
  Maximize2,
  Filter,
  Search,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function AIBuyPlanAdvisor() {
  const { viewRole } = useUIState();
  const { assortmentPlan } = useB2BState();
  const [activeAnalysis, setActiveAnalysis] = useState<'trends' | 'stock' | 'risk'>('trends');

  const recommendations = [
    {
      id: 'rec-1',
      style: 'Cyber Tech Parka',
      sku: 'CTP-26-001',
      action: 'Увеличить заказ',
      confidence: 94,
      reason:
        'Прогнозируемый высокий спрос в Московском регионе на основе климатических изменений и объема поисковых запросов.',
      impact: '+12% Маржа',
    },
    {
      id: 'rec-2',
      style: 'Neural Cargo Pants',
      sku: 'NCP-26-042',
      action: 'Диверсифицировать размеры',
      confidence: 82,
      reason:
        'Стандартный размер M перенасыщен. Рекомендуется увеличить аллокацию размеров L и XL.',
      impact: 'Снижение рисков',
    },
  ];

  return (
    <div className="min-h-screen space-y-4 bg-white p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Brain className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              AI_Strategic_Advisor_v4.0
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Оптимизатор
            <br />
            Закупок (Buy-Plan)
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Движок предиктивной аналитики, оптимизирующий ваши оптовые закупки на основе рыночных
            трендов, исторических данных и регионального спроса.
          </p>
        </div>

        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-1">
=======
          <div className="bg-bg-surface2 border-border-subtle flex items-center gap-1.5 rounded-2xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
            {[
              { id: 'trends', label: 'Тренды рынка', icon: TrendingUp },
              { id: 'stock', label: 'Здоровье стока', icon: BarChart3 },
              { id: 'risk', label: 'Анализ рисков', icon: AlertCircle },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveAnalysis(tab.id as any)}
                className={cn(
                  'h-10 gap-2 rounded-xl px-5 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeAnalysis === tab.id
<<<<<<< HEAD
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
=======
                    ? 'text-text-primary bg-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Main Recommendations */}
        <div className="space-y-6 lg:col-span-8">
          <div className="flex items-center justify-between px-2">
<<<<<<< HEAD
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
=======
            <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Стратегические рекомендации
            </h3>
            <Button
              variant="ghost"
<<<<<<< HEAD
              className="gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="text-accent-primary gap-2 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Обновить анализ <Zap className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
<<<<<<< HEAD
                className="group overflow-hidden rounded-xl border-none bg-slate-50/50 shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.01]"
=======
                className="bg-bg-surface2/80 group overflow-hidden rounded-xl border-none shadow-md shadow-xl transition-all hover:scale-[1.01]"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <CardContent className="p-4">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <Package className="h-8 w-8 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
                      <div className="border-border-subtle flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm">
                        <Package className="text-text-muted h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {rec.style}
                          </h4>
                          <Badge className="border-none bg-emerald-100 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                            Точность прогноза: {rec.confidence}%
                          </Badge>
                        </div>
<<<<<<< HEAD
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          {rec.sku}
                        </p>
                      </div>
                    </div>
<<<<<<< HEAD
                    <Badge className="border-none bg-indigo-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
=======
                    <Badge className="bg-accent-primary border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
                      {rec.action}
                    </Badge>
                  </div>

<<<<<<< HEAD
                  <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4">
                    <p className="text-sm font-medium italic leading-relaxed text-slate-600">
=======
                  <div className="border-border-subtle mb-6 rounded-2xl border bg-white p-4">
                    <p className="text-text-secondary text-sm font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      "{rec.reason}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-600">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {rec.impact}
                        </span>
                      </div>
<<<<<<< HEAD
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Применено к 12 активным заказам
                      </span>
                    </div>
                    <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white transition-colors group-hover:bg-indigo-600">
=======
                      <div className="bg-border-subtle h-1 w-1 rounded-full" />
                      <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Применено к 12 активным заказам
                      </span>
                    </div>
                    <Button className="bg-text-primary group-hover:bg-accent-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                      Принять оптимизацию <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Market Stats Sidebar */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="space-y-4 rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-text-primary space-y-4 rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-2">
              <h3 className="text-base font-black uppercase tracking-tight">Рыночный резонанс</h3>
              <p className="text-[10px] font-medium uppercase text-white/40">
                Глобальные кластеры спроса в текущем окне
              </p>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Кибер-минимализм', val: 88, color: 'bg-accent-primary' },
                { label: 'Техвир Элита', val: 64, color: 'bg-emerald-500' },
                { label: 'Цифровой кочевник', val: 42, color: 'bg-amber-500' },
              ].map((cluster, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {cluster.label}
                    </span>
                    <span className="text-[10px] font-bold text-white/60">{cluster.val}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cluster.val}%` }}
                      className={cn('h-full', cluster.color)}
                    />
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <Button className="h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-white/5 hover:bg-slate-100">
=======
            <Button className="text-text-primary hover:bg-bg-surface2 h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5">
>>>>>>> recover/cabinet-wip-from-stash
              Сформировать глубокий прогноз <Zap className="h-4 w-4" />
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <History className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                <History className="text-text-muted h-5 w-5" />
              </div>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Журнал оптимизаций
              </h4>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Обновление аллокации SKU', time: '2ч назад', status: 'Применено' },
                { title: 'Корректировка ценового уровня', time: 'Вчера', status: 'Ожидает' },
              ].map((log, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase leading-none text-slate-900">
                      {log.title}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-400">{log.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-200 text-[7px] font-bold uppercase"
=======
                  className="bg-bg-surface2 flex items-center justify-between rounded-xl p-4"
                >
                  <div className="space-y-1">
                    <p className="text-text-primary text-[10px] font-black uppercase leading-none">
                      {log.title}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">{log.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border-default text-[7px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
