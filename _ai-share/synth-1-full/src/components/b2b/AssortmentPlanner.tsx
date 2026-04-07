'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutGrid, 
  Trash2, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  Plus,
  Layers,
  ArrowUpRight,
  Brain,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function VisualAssortmentPlanner({ onClose }: { onClose: () => void }) {
  const { viewRole } = useUIState();
  const { assortmentPlan, removeFromAssortmentPlan, clearAssortmentPlan } = useB2BState();
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'budget' | 'categories' | 'ai'>('budget');

  // Business Logic Calculations
  const wholesaleTotal = useMemo(() => assortmentPlan.reduce((acc, p) => acc + (p.price * 0.6), 0), [assortmentPlan]);
  const rrpTotal = useMemo(() => assortmentPlan.reduce((acc, p) => acc + p.price, 0), [assortmentPlan]);
  const marginPercent = wholesaleTotal > 0 ? ((rrpTotal - wholesaleTotal) / rrpTotal) * 100 : 0;

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    assortmentPlan.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: (count / assortmentPlan.length) * 100
    }));
  }, [assortmentPlan]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col md:flex-row p-4 md:p-4 gap-3 overflow-hidden"
    >
      {/* Top Header Layer (Mobile friendly) */}
      <div className="absolute top-4 left-8 right-8 z-[110] flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
            <Layers className="h-6 w-6 text-slate-900" />
          </div>
          <div className="space-y-0.5">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5">
              PLANNER_v3.0_PRO
            </Badge>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Визуальный Ассортимент</h2>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="h-12 w-12 rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all pointer-events-auto"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Rail (Virtual Showroom) */}
      <div className="flex-1 mt-20 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {assortmentPlan.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {assortmentPlan.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="group relative aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-2xl border border-white/5"
                  >
                    <img 
                      src={product.images?.[0]?.url || (product as any).image} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={product.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button 
                        onClick={() => removeFromAssortmentPlan(product.id)}
                        className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 leading-none">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-black tabular-nums">{(product.price * 0.6).toLocaleString('ru-RU')} ₽ <span className="text-[8px] opacity-50 ml-1">ОПТ</span></p>
                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">В наличии</Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-24 w-24 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <ShoppingBag className="h-10 w-10 text-white/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-white uppercase tracking-tight">Ваш рейл пуст</h3>
                <p className="text-white/40 text-xs font-medium max-w-xs">Перетащите товары из шоурума сюда, чтобы начать планирование ассортимента.</p>
              </div>
              <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest gap-2">
                Просмотреть коллекцию <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Quick Toolbar */}
        {assortmentPlan.length > 0 && (
          <div className="p-4 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Выбрано товаров</p>
                <p className="text-sm font-black text-white tabular-nums">{assortmentPlan.length}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Черновой бюджет</p>
                <p className="text-sm font-black text-emerald-400 tabular-nums">{wholesaleTotal.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={clearAssortmentPlan} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-rose-500/20 hover:border-rose-500/50 rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest">
                Сбросить черновик
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
                Оформить заказ <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Side Intelligence Panel */}
      <div className="w-full md:w-[400px] flex flex-col gap-3 mt-20 md:mt-0">
        <Card className="bg-white border-none rounded-xl shadow-2xl overflow-hidden flex flex-col flex-1">
          <CardHeader className="p-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-base font-black uppercase tracking-tight">Лаборатория Аналитики</CardTitle>
              <Badge className="bg-indigo-100 text-indigo-600 border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">Live</Badge>
            </div>
            <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {[
                { id: 'budget', label: 'Финансы', icon: DollarSign },
                { id: 'categories', label: 'Баланс', icon: BarChart3 },
                { id: 'ai', label: 'AI Советник', icon: Brain }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalysisTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeAnalysisTab === tab.id 
                      ? "bg-white text-slate-900 shadow-md border border-slate-100" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-4 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {activeAnalysisTab === 'budget' && (
                <motion.div 
                  key="budget"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                      <div className="absolute top-4 right-6 opacity-10 group-hover:rotate-12 transition-transform">
                        <TrendingUp className="h-12 w-12 text-indigo-600" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Прогноз маржи</p>
                      <h3 className="text-sm font-black text-slate-900 tracking-tighter">{marginPercent.toFixed(1)}%</h3>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase mt-2">Выше среднего по отрасли (+4.2%)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Оптовая стоимость</p>
                        <p className="text-sm font-black text-slate-900 tabular-nums">{wholesaleTotal.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Ожид. выручка</p>
                        <p className="text-sm font-black text-slate-900 tabular-nums">{rrpTotal.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Инсайты оптимизации</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Потенциал оптовой скидки', val: '5%', color: 'text-indigo-600' },
                        { label: 'Эффективность доставки', val: '94%', color: 'text-emerald-600' },
                        { label: 'Риск затоваривания', val: 'Низкий', color: 'text-emerald-600' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-400 uppercase">{item.label}</span>
                          <span className={item.color}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAnalysisTab === 'categories' && (
                <motion.div 
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {categories.length > 0 ? categories.map((cat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{cat.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">{cat.count} шт / {cat.percent.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percent}%` }}
                            className="h-full bg-indigo-600 rounded-full"
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center text-slate-300">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Нет данных по категориям</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeAnalysisTab === 'ai' && (
                <motion.div 
                  key="ai"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-slate-900 rounded-xl text-white relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 h-24 w-24 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">AI Стратегический Совет</p>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                      "На основе текущих трендов TikTok, ваша коллекция недостаточно представлена в стиле 'Cyber-Minimalism'. 
                      Рассмотрите возможность добавления 3-4 товаров из капсулы Syntha Lab FW26 для увеличения вовлеченности на 18%."
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Рекомендуемые дополнения</h4>
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-indigo-200 transition-all">
                          <div className="h-12 w-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                            <img src={`https://placehold.co/100x100/f8fafc/64748b?text=SKU_${i}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] font-black uppercase text-indigo-600">Высокий виральный потенциал</p>
                            <p className="text-xs font-black text-slate-900 uppercase">Neural Knit Jacket</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-white shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  Гарантия опта
                </span>
                <span className="text-[10px] font-bold text-slate-900 uppercase">Платформа защищена</span>
              </div>
              <Button className="w-full h-10 bg-slate-900 text-white hover:bg-black rounded-2xl font-black uppercase text-[11px] tracking-[0.1em] shadow-xl button-glimmer">
                Завершить план ассортимента
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Network Node (For Admin/Distributor visibility) */}
        <Card className="bg-slate-900 border-none rounded-xl p-4 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Админ-надзор</p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tight">
              Этот черновой план виден <span className="text-white">Администратору платформы</span> и <span className="text-white">Региональному дистрибьютору</span> для синхронизации цепочки поставок.
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
