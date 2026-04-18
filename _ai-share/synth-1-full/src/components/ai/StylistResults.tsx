'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { LookResultCard } from './LookResultCard';
import { CapsuleView } from './CapsuleView';
import type { StylistResponse, WardrobeItem } from '@/lib/repo/aiStylistRepo';

interface StylistResultsProps {
  data: StylistResponse | null;
  selectedWardrobe: WardrobeItem[];
  viewRole?: 'client' | 'b2b';
}

export function StylistResults({
  data,
  selectedWardrobe,
  viewRole = 'client',
}: StylistResultsProps) {
  if (data?.capsule) {
    return (
      <div className="space-y-6 border-t border-slate-100 pt-6">
        {data.reply && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-[11px] font-medium leading-relaxed text-indigo-900 shadow-sm">
            {data.reply}
          </div>
        )}
        <CapsuleView capsule={data.capsule} wardrobe={selectedWardrobe} viewRole={viewRole} />
      </div>
    );
  }

  if (data?.looks?.length) {
    return (
      <div className="space-y-6 border-t border-slate-100 pt-6">
        {data.reply && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[11px] font-medium leading-relaxed text-slate-700">
            {data.reply}
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            РЕЗУЛЬТАТЫ_ГЕНЕРАЦИИ
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.looks.map((look, i) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <LookResultCard look={look} wardrobe={selectedWardrobe} viewRole={viewRole} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (data && !data.looks?.length) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-amber-100 bg-amber-50 p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-white shadow-sm">
          <Brain className="h-6 w-6 text-amber-300" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
            Нет подходящих товаров
          </p>
          <p className="max-w-xs text-[9px] font-medium uppercase tracking-tighter text-amber-600">
            Попробуйте другие категории или сезон
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-slate-100 bg-slate-50 p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
        <Brain className="h-6 w-6 text-slate-200" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Система готова к подбору
        </p>
        <p className="max-w-xs text-[9px] font-medium uppercase tracking-tighter text-slate-400">
          Опишите запрос или откройте расширенные настройки
        </p>
      </div>
    </div>
  );
}
