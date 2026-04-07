'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, ShieldCheck, Wallet, History, FileText, ArrowRight } from 'lucide-react';
import { getWholesalePartnerProfile } from '@/lib/fashion/wholesale-tiers';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductWholesaleTierBlock({ product }: { product: Product }) {
  // Demo: assumption of an active partner profile for this B2B view
  const profile = getWholesalePartnerProfile('PARTNER-RU-001');

  const tierColors = {
    Diamond: 'bg-indigo-600 text-white shadow-indigo-200',
    Platinum: 'bg-slate-700 text-white shadow-slate-200',
    Gold: 'bg-amber-500 text-white shadow-amber-200',
    Silver: 'bg-slate-400 text-white shadow-slate-200',
  };

  const limitUsage = Math.round((profile.unpaidInvoices / profile.creditLine) * 100);

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Gem className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Gem className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Wholesale Partner Hub</h4>
        </div>
        <Badge className={`${tierColors[profile.tier]} border-none uppercase text-[8px] font-black px-2.5 h-5 shadow-lg`}>
          {profile.tier} Tier
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest flex items-center gap-1.5">
               <Wallet className="w-3 h-3" /> Credit Line
            </div>
            <div className="text-lg font-black text-slate-800 leading-none">{(profile.availableLimit / 1000000).toFixed(1)}M <span className="text-xs">₽</span></div>
            <div className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Limit: {(profile.creditLine / 1000000).toFixed(0)}M</div>
         </div>
         <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest flex items-center gap-1.5">
               <ShieldCheck className="w-3 h-3" /> Net Payment
            </div>
            <div className="text-lg font-black text-slate-800 leading-none">30 <span className="text-xs">DAYS</span></div>
            <div className="text-[7px] font-bold text-emerald-600 mt-1 uppercase tracking-tight">Postpaid active</div>
         </div>
      </div>

      <div className="space-y-1.5 mb-6">
         <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
            <span>Credit Exposure</span>
            <span className={limitUsage > 80 ? "text-rose-500" : "text-slate-400"}>{limitUsage}% Used</span>
         </div>
         <Progress value={limitUsage} className="h-1 bg-slate-100 fill-indigo-600" />
      </div>

      <div className="p-3 bg-indigo-600/5 rounded-xl border border-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-600/10 transition-colors">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm">
               <FileText className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
               <div className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">B2B Loyalty Points</div>
               <div className="text-sm font-black text-indigo-700">{profile.loyaltyPoints.toLocaleString()} PTS</div>
            </div>
         </div>
         <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:text-indigo-600 transition-colors" />
      </div>
    </Card>
  );
}
