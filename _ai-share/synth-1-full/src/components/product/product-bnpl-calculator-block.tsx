'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight, Zap, Info } from 'lucide-react';
import { calculateBnpl } from '@/lib/fashion/bnpl-calculator';

export const ProductBnplBlock: React.FC<{ product: Product }> = ({ product }) => {
  const bnpl = calculateBnpl(product);

  return (
    <Card className="relative overflow-hidden border-2 border-yellow-50 bg-yellow-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-10">
        <CreditCard className="h-12 w-12" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-600" />
        <h4 className="text-xs font-bold uppercase tracking-tight text-yellow-700">
          BNPL: Оплата частями
        </h4>
      </div>

      <div className="mb-4 flex items-end gap-2">
<<<<<<< HEAD
        <div className="text-2xl font-black tracking-tighter text-slate-800">
          {bnpl.paymentAmount.toLocaleString()} ₽
        </div>
        <div className="mb-1.5 text-[10px] font-black uppercase text-slate-400">
=======
        <div className="text-text-primary text-2xl font-black tracking-tighter">
          {bnpl.paymentAmount.toLocaleString()} ₽
        </div>
        <div className="text-text-muted mb-1.5 text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          × {bnpl.installments} платежа
        </div>
      </div>

      <div className="space-y-2">
<<<<<<< HEAD
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
=======
        <div className="text-text-secondary flex items-center justify-between text-[11px] font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
          <span>Сегодня — {bnpl.paymentAmount.toLocaleString()} ₽</span>
          <ArrowRight className="h-3 w-3" />
          <span>Далее каждые 2 недели</span>
        </div>

<<<<<<< HEAD
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/4 bg-yellow-400" />
          <div className="h-full w-3/4 bg-slate-200" />
=======
        <div className="bg-bg-surface2 flex h-1.5 w-full overflow-hidden rounded-full">
          <div className="h-full w-1/4 bg-yellow-400" />
          <div className="bg-border-subtle h-full w-3/4" />
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="h-4 border-yellow-200 bg-white text-[9px] text-yellow-800"
        >
          Долями
        </Badge>
        <Badge
          variant="outline"
          className="h-4 border-yellow-200 bg-white text-[9px] text-yellow-800"
        >
          Сплит
        </Badge>
        <Badge
          variant="outline"
          className="h-4 border-yellow-200 bg-white text-[9px] text-yellow-800"
        >
          0% переплат
        </Badge>
      </div>

<<<<<<< HEAD
      <div className="mt-3 flex items-center gap-1 text-[9px] font-bold uppercase text-slate-400">
=======
      <div className="text-text-muted mt-3 flex items-center gap-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <Info className="h-2.5 w-2.5" /> Без кредитного договора • Нужна только карта
      </div>
    </Card>
  );
};
