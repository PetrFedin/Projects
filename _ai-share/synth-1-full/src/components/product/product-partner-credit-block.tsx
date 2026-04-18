'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, ShieldCheck, AlertTriangle, ArrowRight, DollarSign, Wallet } from 'lucide-react';
import { getPartnerCreditScore } from '@/lib/fashion/partner-credit-score';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductPartnerCreditBlock({ product }: { product: Product }) {
  const credit = getPartnerCreditScore('P-001');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-blue-50 bg-blue-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Landmark className="h-16 w-16 text-blue-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Landmark className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            B2B Partner Financial Scoring
          </h4>
        </div>
        <Badge className="border-none bg-blue-600 text-[8px] font-black uppercase text-white">
<<<<<<< HEAD
          Rating: {credit.rating}
=======
          Risk: {credit.riskRating}
>>>>>>> recover/cabinet-wip-from-stash
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Internal Credit Score
            </div>
            <div className="text-2xl font-black text-blue-600">
              {credit.score} <span className="text-xs text-slate-400">/ 1000</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-blue-500" style={{ width: `${credit.score / 10}%` }} />
=======
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Internal Credit Score
            </div>
            <div className="text-2xl font-black text-blue-600">
              {credit.creditScore} <span className="text-text-muted text-xs">/ 1000</span>
            </div>
            <div className="bg-bg-surface2 mt-2 h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${credit.creditScore / 10}%` }}
              />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-blue-100 bg-white/50 p-2 text-center">
              <ShieldCheck className="mx-auto mb-1 h-3.5 w-3.5 text-emerald-500" />
<<<<<<< HEAD
              <div className="text-[10px] font-black leading-none text-slate-800">Low</div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Def. Risk</div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white/50 p-2 text-center">
              <Wallet className="mx-auto mb-1 h-3.5 w-3.5 text-blue-500" />
              <div className="text-[10px] font-black leading-none text-slate-800">
                {credit.availableCredit > 1000000 ? 'Good' : 'Limit'}
              </div>
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Liquidity</div>
=======
              <div className="text-text-primary text-[10px] font-black leading-none">Low</div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">Def. Risk</div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white/50 p-2 text-center">
              <Wallet className="mx-auto mb-1 h-3.5 w-3.5 text-blue-500" />
              <div className="text-text-primary text-[10px] font-black leading-none">
                {credit.recommendedLimit > 1_000_000 ? 'Good' : 'Limit'}
              </div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">Liquidity</div>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-blue-100 bg-blue-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-blue-600">
            <DollarSign className="h-3.5 w-3.5" /> Credit Availability
          </div>
          <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
            <span className="text-[9px] font-bold uppercase text-slate-500">Limit</span>
            <span className="text-[10px] font-black text-slate-800">
              {credit.maxCreditLimit.toLocaleString()} ₽
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase text-slate-500">Available</span>
            <span className="text-[12px] font-black text-emerald-600">
              {credit.availableCredit.toLocaleString()} ₽
=======
            <span className="text-text-secondary text-[9px] font-bold uppercase">Limit</span>
            <span className="text-text-primary text-[10px] font-black">
              {credit.recommendedLimit.toLocaleString()} ₽
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-text-secondary text-[9px] font-bold uppercase">Available</span>
            <span className="text-[12px] font-black text-emerald-600">
              {Math.round(credit.recommendedLimit * 0.85).toLocaleString()} ₽
>>>>>>> recover/cabinet-wip-from-stash
            </span>
          </div>
          <Button className="h-8 w-full bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white hover:bg-blue-700">
            Request Limit Increase
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-4 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-blue-100 pt-4 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Last Scoring Update: Today, 09:15</span>
        <span className="flex items-center gap-1 text-blue-600">
          <ShieldCheck className="h-3 w-3" /> Financial Spec Ready
        </span>
      </div>
    </Card>
  );
}
