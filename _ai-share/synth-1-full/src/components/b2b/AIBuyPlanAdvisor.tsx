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
  Package
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
      reason: 'Прогнозируемый высокий спрос в Московском регионе на основе климатических изменений и объема поисковых запросов.',
      impact: '+12% Маржа'
    },
    {
      id: 'rec-2',
      style: 'Neural Cargo Pants',
      sku: 'NCP-26-042',
      action: 'Диверсифицировать размеры',
      confidence: 82,
      reason: 'Стандартный размер M перенасыщен. Рекомендуется увеличить аллокацию размеров L и XL.',
      impact: 'Снижение рисков'
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              AI_Strategic_Advisor_v4.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Оптимизатор<br/>Закупок (Buy-Plan)
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Движок предиктивной аналитики, оптимизирующий ваши оптовые закупки на основе рыночных трендов, исторических данных и регионального спроса.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {[
              { id: 'trends', label: 'Тренды рынка', icon: TrendingUp },
              { id: 'stock', label: 'Здоровье стока', icon: BarChart3 },
              { id: 'risk', label: 'Анализ рисков', icon: AlertCircle }
            ].map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveAnalysis(tab.id as any)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all gap-2",
                  activeAnalysis === tab.id ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Стратегические рекомендации</h3>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 gap-2">
              Обновить анализ <Zap className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden hover:scale-[1.01] transition-all bg-slate-50/50 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <Package className="h-8 w-8 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{rec.style}</h4>
                          <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[8px] px-2 py-0.5 uppercase">
                            Точность прогноза: {rec.confidence}%
                          </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.sku}</p>
                      </div>
                    </div>
                    <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] px-3 py-1 uppercase tracking-widest">
                      {rec.action}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-100 mb-6">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{rec.reason}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{rec.impact}</span>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Применено к 12 активным заказам</span>
                    </div>
                    <Button className="h-11 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 group-hover:bg-indigo-600 transition-colors">
                      Принять оптимизацию <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Market Stats Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-black uppercase tracking-tight">Рыночный резонанс</h3>
              <p className="text-[10px] font-medium text-white/40 uppercase">Глобальные кластеры спроса в текущем окне</p>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Кибер-минимализм', val: 88, color: 'bg-indigo-500' },
                { label: 'Техвир Элита', val: 64, color: 'bg-emerald-500' },
                { label: 'Цифровой кочевник', val: 42, color: 'bg-amber-500' }
              ].map((cluster, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest">{cluster.label}</span>
                    <span className="text-[10px] font-bold text-white/60">{cluster.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cluster.val}%` }}
                      className={cn("h-full", cluster.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full h-10 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-white/5">
              Сформировать глубокий прогноз <Zap className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <History className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Журнал оптимизаций</h4>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Обновление аллокации SKU', time: '2ч назад', status: 'Применено' },
                { title: 'Корректировка ценового уровня', time: 'Вчера', status: 'Ожидает' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{log.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{log.time}</p>
                  </div>
                  <Badge variant="outline" className="text-[7px] border-slate-200 font-bold uppercase">
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
