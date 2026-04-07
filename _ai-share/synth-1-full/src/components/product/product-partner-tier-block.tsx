'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, CreditCard, Clock, Tag } from 'lucide-react';
import { getPartnerTiers } from '@/lib/fashion/partner-tiering';

export function ProductPartnerTierBlock() {
  const tiers = getPartnerTiers();
  const activeTier = tiers[0]; // Demo: assume first tier is active

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/10 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Partner B2B Status</h4>
        </div>
        <Badge className="bg-indigo-600 text-white text-[9px] font-black border-none uppercase px-3">
          {activeTier.tier} Tier
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-white rounded-lg border border-indigo-50 flex items-center gap-2">
           <CreditCard className="w-3 h-3 text-indigo-400" />
           <div>
              <div className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Credit Limit</div>
              <div className="text-[10px] font-black text-slate-800">{activeTier.creditLimit.toLocaleString()} ₽</div>
           </div>
        </div>
        <div className="p-2 bg-white rounded-lg border border-indigo-50 flex items-center gap-2">
           <Tag className="w-3 h-3 text-indigo-400" />
           <div>
              <div className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Base Discount</div>
              <div className="text-[10px] font-black text-slate-800">{activeTier.discountPercentage}% OFF</div>
           </div>
        </div>
        <div className="p-2 bg-white rounded-lg border border-indigo-50 flex items-center gap-2 col-span-2">
           <Clock className="w-3 h-3 text-indigo-400" />
           <div>
              <div className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Payment Terms</div>
              <div className="text-[10px] font-black text-slate-800">Net {activeTier.paymentTermDays} (Post-payment allowed)</div>
           </div>
        </div>
      </div>
    </Card>
  );
}
