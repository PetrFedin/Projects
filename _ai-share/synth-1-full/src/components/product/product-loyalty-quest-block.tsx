'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Zap, Trophy, Gift, ArrowRight } from 'lucide-react';
import { getB2BLoyaltyQuests } from '@/lib/fashion/loyalty-quests';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductLoyaltyQuestBlock({ product }: { product: Product }) {
  const quests = getB2BLoyaltyQuests('P-001');

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Award className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Award className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Active B2B Loyalty Quests</h4>
        </div>
        <Badge className="bg-indigo-600 text-white text-[8px] font-black border-none uppercase">Partner Tier: Gold</Badge>
      </div>

      <div className="space-y-4">
         {quests.map(q => (
           <div key={q.id} className="p-3 bg-white/80 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <div className="text-[10px] font-black uppercase text-slate-800 flex items-center gap-1.5">
                       {q.status === 'completed' ? <Trophy className="w-3 h-3 text-amber-500" /> : <Zap className="w-3 h-3 text-indigo-500" />}
                       {q.title}
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{q.description}</p>
                 </div>
                 <div className="text-[10px] font-black text-indigo-600">+{q.rewardPoints} Pts</div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${q.progressPercent}%` }} />
                 </div>
                 <span className="text-[9px] font-black text-slate-400">{q.progressPercent}%</span>
              </div>
           </div>
         ))}
      </div>

      <Button variant="ghost" className="w-full mt-3 h-8 text-[8px] font-black uppercase text-indigo-500 hover:bg-indigo-50 flex items-center justify-center gap-2">
         View Reward Catalog <ArrowRight className="w-3 h-3" />
      </Button>

      <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Next Reward at 10,000 Pts</span>
         <span className="text-indigo-600 flex items-center gap-1">
            <Gift className="w-3 h-3" /> Extra 2% Discount
         </span>
      </div>
    </Card>
  );
}
