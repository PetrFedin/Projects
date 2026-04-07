'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { getPartnerPerks } from '@/lib/fashion/partner-perks';
import { Button } from '@/components/ui/button';

export function ProductPartnerPerksBlock() {
  const perks = getPartnerPerks('P-001');

  return (
    <Card className="p-4 border-2 border-amber-50 bg-amber-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Star className="w-16 h-16 text-amber-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Partner Perks & Benefits</h4>
        </div>
        <Badge className="bg-amber-100 text-amber-700 text-[8px] font-black border-none uppercase">
          Loyalty Status
        </Badge>
      </div>

      <div className="space-y-3">
         {perks.map(perk => (
           <div key={perk.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <div className={cn("w-6 h-6 rounded flex items-center justify-center", perk.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400')}>
                    {perk.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                 </div>
                 <div>
                    <div className={cn("text-[10px] font-black uppercase tracking-tight leading-none", perk.status === 'locked' ? 'text-slate-400' : 'text-slate-800')}>
                       {perk.title}
                    </div>
                    {perk.unlockCondition && (
                      <div className="text-[7px] font-bold text-slate-400 uppercase mt-1">{perk.unlockCondition}</div>
                    )}
                 </div>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-500 transition-colors" />
           </div>
         ))}
      </div>

      <Button variant="ghost" className="w-full h-8 mt-4 text-[8px] font-black uppercase text-amber-700 hover:bg-amber-50">
         View All Rewards Hub
      </Button>
    </Card>
  );
}

import { cn } from '@/lib/utils';
