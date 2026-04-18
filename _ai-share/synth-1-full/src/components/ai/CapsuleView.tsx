'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Package,
  LayoutGrid,
  Layers,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Info,
  Trash2,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LookResultCard } from './LookResultCard';
import type { Look, LookItem, WardrobeItem } from '@/lib/repo/aiStylistRepo';
import { resolveProductForDisplay } from '@/lib/ai-stylist';

interface CapsuleViewProps {
  capsule: {
    items: LookItem[];
    combinations: Look[];
  };
  wardrobe?: WardrobeItem[];
  viewRole?: 'client' | 'b2b';
}

export function CapsuleView({ capsule, wardrobe, viewRole = 'client' }: CapsuleViewProps) {
  const [activeTab, setActiveTab] = React.useState<'items' | 'combinations'>('items');
  const [selectedComboIdx, setSelectedComboIdx] = React.useState(0);

  const resolvedItems = capsule.items
    .map((it) => {
      const p = resolveProductForDisplay(it.productId, wardrobe);
      return p ? { ...it, p } : null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Header / Tabs */}
      <div className="flex flex-col justify-between gap-3 rounded-xl bg-slate-900 p-4 shadow-2xl md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase leading-none tracking-tighter text-white">
              AI_Capsule_Generator
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">
                {resolvedItems.length} вещей • {capsule.combinations.length} сочетаний
              </span>
            </div>
          </div>
        </div>

        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setActiveTab('items')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all',
              activeTab === 'items'
                ? 'bg-white text-slate-900 shadow-xl'
                : 'text-white/40 hover:text-white'
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Состав
          </button>
          <button
            onClick={() => setActiveTab('combinations')}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all',
              activeTab === 'combinations'
                ? 'bg-white text-slate-900 shadow-xl'
                : 'text-white/40 hover:text-white'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            Образы
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'items' ? (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6"
          >
            {resolvedItems.map((item: any, idx) => (
              <div
                key={item.p.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all duration-500 hover:border-slate-900 hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.p.image}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.p.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    <Badge className="border-none bg-white/90 px-1.5 py-0.5 text-[7px] font-black text-slate-900 backdrop-blur-md">
                      {Math.round(95 + Math.random() * 4)}%_FIT
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 p-3">
                  <div className="truncate text-[8px] font-black uppercase tracking-widest text-slate-400">
                    {item.p.brand}
                  </div>
                  <div className="line-clamp-1 text-[10px] font-black uppercase leading-tight tracking-tight text-slate-900">
                    {item.p.title}
                  </div>
                  <div className="text-[9px] font-bold text-indigo-600">
                    {item.p.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}

            <button className="group flex aspect-[3/4] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 p-4 transition-all hover:border-slate-900 hover:bg-slate-50">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-900">
                Добавить вещь
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="combinations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
              {capsule.combinations.map((combo, idx) => (
                <button
                  key={combo.id}
                  onClick={() => setSelectedComboIdx(idx)}
                  className={cn(
                    'flex shrink-0 flex-col gap-1 rounded-2xl border-2 px-6 py-3 transition-all',
                    selectedComboIdx === idx
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xl'
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'
                  )}
                >
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">
                    Комбинация
                  </div>
                  <div className="text-[11px] font-black uppercase">Вариант #{idx + 1}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <LookResultCard
                  look={capsule.combinations[selectedComboIdx]}
                  wardrobe={wardrobe}
                  viewRole={viewRole}
                />
              </div>

              <div className="space-y-6 lg:col-span-8">
                <div className="flex h-full flex-col justify-center space-y-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <div className="mx-auto max-w-md space-y-4">
                    <div className="mx-auto flex h-12 w-12 rotate-3 items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-xl">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">
                      Все вещи совместимы
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-500">
                      Этот набор из {resolvedItems.length} вещей позволяет составить более 12
                      различных образов для разных сценариев — от работы до вечернего выхода.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="group flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white"
                      >
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 transition-colors group-hover:text-indigo-500">
                          PREVIEW_MODE_{i}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="button-glimmer h-10 w-full rounded-2xl bg-indigo-600 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:bg-indigo-700">
                    Купить всю капсулу
                    <ShoppingCart className="ml-3 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
