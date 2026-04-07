'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Landmark, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { getB2BPreOrderFinancing } from '@/lib/fashion/b2b-financing';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductB2BFinancingBlock({ product }: { product: Product }) {
  const financing = getB2BPreOrderFinancing(product.price * 100);

  return (
    <Card className="p-4 border-2 border-amber-50 bg-amber-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <CreditCard className="w-16 h-16 text-amber-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-600">
          <CreditCard className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">B2B Pre-Order Financing (RU)</h4>
        </div>
        <Badge className="bg-amber-600 text-white text-[8px] font-black border-none uppercase">Split 30/70 Split</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Initial Deposit (30%)</div>
               <div className="text-xl font-black text-slate-800">{financing.depositAmount.toLocaleString()} ₽</div>
               <div className="text-[9px] font-black text-amber-600 uppercase mt-1">Due: On Confirmation</div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Remaining Balance (70%)</div>
               <div className="text-xl font-black text-slate-800">{financing.remainingAmount.toLocaleString()} ₽</div>
               <div className="text-[9px] font-black text-amber-600 uppercase mt-1">Due: {financing.remainingDueDate}</div>
            </div>
         </div>

         <div className="p-4 bg-amber-600/5 rounded-xl border border-amber-100 flex flex-col justify-center text-center">
            <Calendar className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-[9px] font-bold text-slate-600 leading-tight">
               Interest-free for {financing.creditTermDays} days. Credit limit subject to credit scoring.
            </p>
            <Button variant="link" className="text-[8px] font-black uppercase text-amber-600 h-auto p-0 mt-2">
               Download Schedule PDF
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-amber-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Integrated with VTB/Sber B2B Factor</span>
         <span className="text-amber-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Insured by EXIAR
         </span>
      </div>
    </Card>
  );
}
