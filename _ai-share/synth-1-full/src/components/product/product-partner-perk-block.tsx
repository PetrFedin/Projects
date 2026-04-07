'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, CheckCircle2, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { getPartnerPerks } from '@/lib/fashion/partner-perks';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductPartnerPerkBlock({ product }: { product: Product }) {
  // Demo current order value for this session
  const perks = getPartnerPerks('PARTNER-01', 1250000);

  return (
    <Card className="p-4 border-2 border-amber-100 bg-amber-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Gift className="w-16 h-16 text-amber-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-600">
          <Gift className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Partner Perk Eligibility</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Showroom Incentives</div>
      </div>

      <div className="space-y-4">
         {perks.map((perk) => (
           <div key={perk.perkId} className="group">
              <div className="flex justify-between items-start mb-1.5">
                 <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${perk.isUnlocked ? 'bg-amber-100' : 'bg-slate-100'}`}>
                       {perk.isUnlocked ? <Sparkles className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-800 leading-tight">{perk.title}</div>
                       <div className="text-[8px] font-medium text-slate-400">{perk.requirementDescription}</div>
                    </div>
                 </div>
                 {perk.isUnlocked && <Badge className="bg-emerald-500 text-white border-none text-[7px] h-4 font-black uppercase px-1">UNLOCKED</Badge>}
              </div>
              
              {!perk.isUnlocked && (
                <div className="flex items-center gap-2">
                   <div className="flex-1">
                      <Progress value={perk.progressPercent} className="h-1 bg-slate-100 fill-amber-500" />
                   </div>
                   <span className="text-[8px] font-black text-amber-600">{perk.progressPercent}%</span>
                </div>
              )}
           </div>
         ))}
      </div>

      <div className="mt-4 p-2.5 bg-white rounded-xl border border-amber-100 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <div className="text-[9px] font-bold text-slate-600">Add <b>750k ₽</b> more to unlock <b>Free Shipping</b></div>
         </div>
      </div>
    </Card>
  );
}
