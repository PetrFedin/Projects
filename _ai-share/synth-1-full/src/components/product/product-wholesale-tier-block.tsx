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
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-100 bg-indigo-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Gem className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Gem className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Wholesale Partner Hub
          </h4>
        </div>
        <Badge
          className={`${tierColors[profile.tier]} h-5 border-none px-2.5 text-[8px] font-black uppercase shadow-lg`}
        >
          {profile.tier} Tier
        </Badge>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <Wallet className="h-3 w-3" /> Credit Line
          </div>
          <div className="text-lg font-black leading-none text-slate-800">
            {(profile.availableLimit / 1000000).toFixed(1)}M <span className="text-xs">₽</span>
          </div>
          <div className="mt-1 text-[7px] font-bold uppercase text-slate-400">
            Limit: {(profile.creditLine / 1000000).toFixed(0)}M
          </div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <ShieldCheck className="h-3 w-3" /> Net Payment
          </div>
          <div className="text-lg font-black leading-none text-slate-800">
            30 <span className="text-xs">DAYS</span>
          </div>
          <div className="mt-1 text-[7px] font-bold uppercase tracking-tight text-emerald-600">
            Postpaid active
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-1.5">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
          <span>Credit Exposure</span>
          <span className={limitUsage > 80 ? 'text-rose-500' : 'text-slate-400'}>
            {limitUsage}% Used
          </span>
        </div>
        <Progress value={limitUsage} className="h-1 bg-slate-100 fill-indigo-600" />
      </div>

      <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-indigo-100 bg-indigo-600/5 p-3 transition-colors hover:bg-indigo-600/10">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-indigo-100 bg-white p-2 shadow-sm">
            <FileText className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-tighter text-slate-800">
              B2B Loyalty Points
            </div>
            <div className="text-sm font-black text-indigo-700">
              {profile.loyaltyPoints.toLocaleString()} PTS
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-indigo-300 transition-colors group-hover:text-indigo-600" />
      </div>
    </Card>
  );
}
