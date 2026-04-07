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
    <Card className="p-4 border-2 border-yellow-50 bg-yellow-50/10 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12">
        <CreditCard className="w-12 h-12" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-yellow-600" />
        <h4 className="font-bold text-xs uppercase text-yellow-700 tracking-tight">BNPL: Оплата частями</h4>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <div className="text-2xl font-black text-slate-800 tracking-tighter">
          {bnpl.paymentAmount.toLocaleString()} ₽
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase mb-1.5">
          × {bnpl.installments} платежа
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
          <span>Сегодня — {bnpl.paymentAmount.toLocaleString()} ₽</span>
          <ArrowRight className="w-3 h-3" />
          <span>Далее каждые 2 недели</span>
        </div>
        
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-yellow-400 w-1/4" />
          <div className="h-full bg-slate-200 w-3/4" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-[9px] h-4 bg-white border-yellow-200 text-yellow-800">Долями</Badge>
        <Badge variant="outline" className="text-[9px] h-4 bg-white border-yellow-200 text-yellow-800">Сплит</Badge>
        <Badge variant="outline" className="text-[9px] h-4 bg-white border-yellow-200 text-yellow-800">0% переплат</Badge>
      </div>

      <div className="mt-3 text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
        <Info className="w-2.5 h-2.5" /> Без кредитного договора • Нужна только карта
      </div>
    </Card>
  );
};
