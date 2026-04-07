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
    <Card className="p-4 border-2 border-blue-50 bg-blue-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Landmark className="w-16 h-16 text-blue-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Landmark className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">B2B Partner Financial Scoring</h4>
        </div>
        <Badge className="bg-blue-600 text-white text-[8px] font-black border-none uppercase">Rating: {credit.rating}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-blue-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Internal Credit Score</div>
               <div className="text-2xl font-black text-blue-600">{credit.score} <span className="text-xs text-slate-400">/ 1000</span></div>
               <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${credit.score / 10}%` }} />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
               <div className="p-2 bg-white/50 rounded-xl border border-blue-100 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-[10px] font-black text-slate-800 leading-none">Low</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Def. Risk</div>
               </div>
               <div className="p-2 bg-white/50 rounded-xl border border-blue-100 text-center">
                  <Wallet className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
                  <div className="text-[10px] font-black text-slate-800 leading-none">{credit.availableCredit > 1000000 ? 'Good' : 'Limit'}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Liquidity</div>
               </div>
            </div>
         </div>

         <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-100 flex flex-col justify-center">
            <div className="text-[8px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
               <DollarSign className="w-3.5 h-3.5" /> Credit Availability
            </div>
            <div className="flex justify-between items-center mb-1">
               <span className="text-[9px] font-bold text-slate-500 uppercase">Limit</span>
               <span className="text-[10px] font-black text-slate-800">{credit.maxCreditLimit.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center mb-3">
               <span className="text-[9px] font-bold text-slate-500 uppercase">Available</span>
               <span className="text-[12px] font-black text-emerald-600">{credit.availableCredit.toLocaleString()} ₽</span>
            </div>
            <Button className="w-full h-8 bg-blue-600 text-white hover:bg-blue-700 text-[8px] font-black uppercase tracking-widest">
               Request Limit Increase
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Last Scoring Update: Today, 09:15</span>
         <span className="text-blue-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Financial Spec Ready
         </span>
      </div>
    </Card>
  );
}
