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
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-50 bg-emerald-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <CreditCard className="h-16 w-16 text-emerald-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <CreditCard className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Wholesale Credit & Factoring
          </h4>
        </div>
        <Badge
          className={
            status.factoringStatus === 'eligible'
              ? 'border-none bg-emerald-100 text-[8px] uppercase text-emerald-700'
              : 'border-none bg-amber-100 text-[8px] uppercase text-amber-700'
          }
        >
          {status.factoringStatus.replace('_', ' ')}
        </Badge>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <div className="mb-1 flex items-end justify-between text-[9px] font-black uppercase tracking-widest">
<<<<<<< HEAD
            <span className="text-slate-500">Credit Utilization</span>
=======
            <span className="text-text-secondary">Credit Utilization</span>
>>>>>>> recover/cabinet-wip-from-stash
            <span className="text-emerald-700">
              {Math.round(((status.totalLimit - status.availableLimit) / status.totalLimit) * 100)}%
            </span>
          </div>
          <Progress
            value={((status.totalLimit - status.availableLimit) / status.totalLimit) * 100}
<<<<<<< HEAD
            className="h-1.5 bg-slate-100 fill-emerald-500"
=======
            className="bg-bg-surface2 h-1.5 fill-emerald-500"
>>>>>>> recover/cabinet-wip-from-stash
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
<<<<<<< HEAD
            <div className="text-[16px] font-black leading-none text-slate-800">
              {status.availableLimit.toLocaleString()} ₽
            </div>
            <div className="mt-1 text-[8px] font-black uppercase text-slate-400">
=======
            <div className="text-text-primary text-[16px] font-black leading-none">
              {status.availableLimit.toLocaleString()} ₽
            </div>
            <div className="text-text-muted mt-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              Available Limit
            </div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
<<<<<<< HEAD
            <div className="text-[16px] font-black leading-none text-slate-800">
              {status.averageDaysToPay}d
            </div>
            <div className="mt-1 text-[8px] font-black uppercase text-slate-400">Avg Pay Cycle</div>
=======
            <div className="text-text-primary text-[16px] font-black leading-none">
              {status.averageDaysToPay}d
            </div>
            <div className="text-text-muted mt-1 text-[8px] font-black uppercase">
              Avg Pay Cycle
            </div>
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        </div>
      </div>

      {status.overdueAmount > 0 && (
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-3 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <p className="text-[9px] font-bold leading-tight text-rose-700">
            <b>Overdue detected: {status.overdueAmount.toLocaleString()} ₽.</b> Wholesale orders may
            be restricted.
          </p>
        </div>
      )}

<<<<<<< HEAD
      <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <Info className="h-3 w-3" /> Factoring provided by Alfa-Factoring RU
      </div>
    </Card>
  );
}
