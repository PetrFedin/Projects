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
    <Card className="relative my-4 overflow-hidden border-2 border-amber-50 bg-amber-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <CreditCard className="h-16 w-16 text-amber-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-600">
          <CreditCard className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            B2B Pre-Order Financing (RU)
          </h4>
        </div>
        <Badge className="border-none bg-amber-600 text-[8px] font-black uppercase text-white">
          Split 30/70 Split
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Initial Deposit (30%)
            </div>
            <div className="text-xl font-black text-slate-800">
=======
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Initial Deposit (30%)
            </div>
            <div className="text-text-primary text-xl font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {financing.depositAmount.toLocaleString()} ₽
            </div>
            <div className="mt-1 text-[9px] font-black uppercase text-amber-600">
              Due: On Confirmation
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Remaining Balance (70%)
            </div>
            <div className="text-xl font-black text-slate-800">
=======
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Remaining Balance (70%)
            </div>
            <div className="text-text-primary text-xl font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {financing.remainingAmount.toLocaleString()} ₽
            </div>
            <div className="mt-1 text-[9px] font-black uppercase text-amber-600">
              Due: {financing.remainingDueDate}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-amber-100 bg-amber-600/5 p-4 text-center">
          <Calendar className="mx-auto mb-2 h-5 w-5 text-amber-400" />
<<<<<<< HEAD
          <p className="text-[9px] font-bold leading-tight text-slate-600">
=======
          <p className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Interest-free for {financing.creditTermDays} days. Credit limit subject to credit
            scoring.
          </p>
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-[8px] font-black uppercase text-amber-600"
          >
            Download Schedule PDF
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-4 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-amber-100 pt-4 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Integrated with VTB/Sber B2B Factor</span>
        <span className="flex items-center gap-1 text-amber-600">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Insured by EXIAR
        </span>
      </div>
    </Card>
  );
}
