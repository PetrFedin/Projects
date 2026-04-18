'use client';

import * as React from 'react';
import { useUIState } from '@/providers/ui-state';
import { GitCompare, X, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function ComparisonBar() {
  const {
    comparisonList,
    toggleComparisonItem,
    clearComparisonList,
    saveComparison,
    setIsComparisonOpen,
  } = useUIState();
  const [isSaving, setIsSaving] = React.useState(false);

  if (comparisonList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 z-[100] w-full max-w-3xl -translate-x-1/2 px-4"
      >
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-indigo-500/20 backdrop-blur-2xl">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20">
              <GitCompare className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Анализ сравнения
              </p>
              <p className="text-xs font-medium text-white">{comparisonList.length} из 4 позиций</p>
            </div>

            <div className="custom-scrollbar-hidden flex items-center gap-2 overflow-x-auto py-1">
              {comparisonList.map((product) => (
                <div key={product.id} className="group relative shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/10">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.image ||
                        product.thumbnail ||
                        '/placeholder.jpg'
                      }
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => toggleComparisonItem(product as any)}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 4 - comparisonList.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/10"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsComparisonOpen(true)}
              className="h-10 rounded-full bg-white px-8 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg shadow-white/5 hover:bg-white/90"
            >
              Сравнить
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
            <button
              onClick={clearComparisonList}
              className="p-2 text-white/40 transition-colors hover:text-white"
              title="Очистить список"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
