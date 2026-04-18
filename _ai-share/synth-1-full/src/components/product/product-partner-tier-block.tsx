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
    <Card className="my-4 border-2 border-indigo-100 bg-indigo-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Partner B2B Status
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 px-3 text-[9px] font-black uppercase text-white">
          {activeTier.tier} Tier
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-indigo-50 bg-white p-2">
          <CreditCard className="h-3 w-3 text-indigo-400" />
          <div>
            <div className="mb-1 text-[8px] font-black uppercase leading-none text-slate-400">
              Credit Limit
            </div>
            <div className="text-[10px] font-black text-slate-800">
              {activeTier.creditLimit.toLocaleString()} ₽
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-indigo-50 bg-white p-2">
          <Tag className="h-3 w-3 text-indigo-400" />
          <div>
            <div className="mb-1 text-[8px] font-black uppercase leading-none text-slate-400">
              Base Discount
            </div>
            <div className="text-[10px] font-black text-slate-800">
              {activeTier.discountPercentage}% OFF
            </div>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-2 rounded-lg border border-indigo-50 bg-white p-2">
          <Clock className="h-3 w-3 text-indigo-400" />
          <div>
            <div className="mb-1 text-[8px] font-black uppercase leading-none text-slate-400">
              Payment Terms
            </div>
            <div className="text-[10px] font-black text-slate-800">
              Net {activeTier.paymentTermDays} (Post-payment allowed)
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
