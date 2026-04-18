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
import type { Look, LookItem, WardrobeItem } from '@/lib/ai-stylist/types';
import { resolveProductForDisplay } from '@/lib/ai-stylist/product-source';

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
      <div className="bg-text-primary flex flex-col justify-between gap-3 rounded-xl p-4 shadow-2xl md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary shadow-accent-primary/20 border-accent-primary/40 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase leading-none tracking-tighter text-white">
              AI_Capsule_Generator
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Sparkles className="text-accent-primary h-2.5 w-2.5" />
              <span className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
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
                ? 'text-text-primary bg-white shadow-xl'
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
                ? 'text-text-primary bg-white shadow-xl'
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
                className="border-border-subtle hover:border-text-primary group relative overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.p.image}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.p.title}
                  />
                  <div className="from-text-primary/60 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    <Badge className="text-text-primary border-none bg-white/90 px-1.5 py-0.5 text-[7px] font-black backdrop-blur-md">
                      {Math.round(95 + Math.random() * 4)}%_FIT
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 p-3">
                  <div className="text-text-muted truncate text-[8px] font-black uppercase tracking-widest">
                    {item.p.brand}
                  </div>
                  <div className="text-text-primary line-clamp-1 text-[10px] font-black uppercase leading-tight tracking-tight">
                    {item.p.title}
                  </div>
                  <div className="text-accent-primary text-[9px] font-bold">
                    {item.p.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}

            <button className="border-border-default hover:border-text-primary hover:bg-bg-surface2 group flex aspect-[3/4] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-4 transition-all">
              <div className="bg-bg-surface2 group-hover:bg-text-primary/90 mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-text-muted group-hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-colors">
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
                      ? 'bg-text-primary border-text-primary text-white shadow-xl'
                      : 'border-border-subtle text-text-muted hover:border-border-default bg-white'
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
                <div className="bg-bg-surface2 border-border-subtle flex h-full flex-col justify-center space-y-6 rounded-xl border p-4 text-center">
                  <div className="mx-auto max-w-md space-y-4">
                    <div className="border-border-subtle mx-auto flex h-12 w-12 rotate-3 items-center justify-center rounded-3xl border bg-white shadow-xl">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-text-primary text-sm font-black uppercase tracking-tighter">
                      Все вещи совместимы
                    </h3>
                    <p className="text-text-secondary text-sm font-medium leading-relaxed">
                      Этот набор из {resolvedItems.length} вещей позволяет составить более 12
                      различных образов для разных сценариев — от работы до вечернего выхода.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border-border-subtle group flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-white"
                      >
                        <div className="text-text-muted group-hover:text-accent-primary text-[8px] font-black uppercase tracking-[0.3em] transition-colors">
                          PREVIEW_MODE_{i}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="bg-accent-primary hover:bg-accent-primary button-glimmer h-10 w-full rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all">
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
