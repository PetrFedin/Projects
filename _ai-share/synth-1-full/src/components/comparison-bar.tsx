'use client';

import * as React from 'react';
import { useUIState } from '@/providers/ui-state';
import { GitCompare, X, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function ComparisonBar() {
  const { comparisonList, toggleComparisonItem, clearComparisonList, saveComparison, setIsComparisonOpen } = useUIState();
  const [isSaving, setIsSaving] = React.useState(false);

  if (comparisonList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4"
      >
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-indigo-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <GitCompare className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Анализ сравнения</p>
              <p className="text-xs font-medium text-white">{comparisonList.length} из 4 позиций</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hidden py-1">
              {comparisonList.map((product) => (
                <div key={product.id} className="relative group shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 overflow-hidden">
                    <img 
                      src={product.images?.[0]?.url || product.image || product.thumbnail || '/placeholder.jpg'} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => toggleComparisonItem(product as any)}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 4 - comparisonList.length }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12 w-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsComparisonOpen(true)}
              className="bg-white text-slate-900 hover:bg-white/90 rounded-full px-8 h-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-white/5"
            >
              Сравнить
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
            <button
              onClick={clearComparisonList}
              className="text-white/40 hover:text-white transition-colors p-2"
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
