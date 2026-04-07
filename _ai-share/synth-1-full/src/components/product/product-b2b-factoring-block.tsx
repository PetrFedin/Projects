'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, ShieldCheck, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { getB2BFactoringStatus } from '@/lib/fashion/b2b-factoring';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductB2BFactoringBlock({ product }: { product: Product }) {
  const status = getB2BFactoringStatus('PARTNER-CENTRAL-01');

  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <CreditCard className="w-16 h-16 text-emerald-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CreditCard className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Wholesale Credit & Factoring</h4>
        </div>
        <Badge className={status.factoringStatus === 'eligible' ? 'bg-emerald-100 text-emerald-700 border-none uppercase text-[8px]' : 'bg-amber-100 text-amber-700 border-none uppercase text-[8px]'}>
          {status.factoringStatus.replace('_', ' ')}
        </Badge>
      </div>

      <div className="space-y-4 mb-4">
         <div>
            <div className="flex justify-between items-end mb-1 text-[9px] font-black uppercase tracking-widest">
               <span className="text-slate-500">Credit Utilization</span>
               <span className="text-emerald-700">{Math.round(( (status.totalLimit - status.availableLimit) / status.totalLimit) * 100)}%</span>
            </div>
            <Progress value={( (status.totalLimit - status.availableLimit) / status.totalLimit) * 100} className="h-1.5 bg-slate-100 fill-emerald-500" />
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
               <div className="text-[16px] font-black text-slate-800 leading-none">{status.availableLimit.toLocaleString()} ₽</div>
               <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Available Limit</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
               <div className="text-[16px] font-black text-slate-800 leading-none">{status.averageDaysToPay}d</div>
               <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Avg Pay Cycle</div>
            </div>
         </div>
      </div>

      {status.overdueAmount > 0 && (
        <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 flex items-center gap-3 mb-2 shadow-sm">
           <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
           <p className="text-[9px] font-bold text-rose-700 leading-tight">
              <b>Overdue detected: {status.overdueAmount.toLocaleString()} ₽.</b> Wholesale orders may be restricted.
           </p>
        </div>
      )}

      <div className="mt-2 text-[8px] font-black text-slate-400 uppercase flex items-center gap-1.5">
         <Info className="w-3 h-3" /> Factoring provided by Alfa-Factoring RU
      </div>
    </Card>
  );
}
