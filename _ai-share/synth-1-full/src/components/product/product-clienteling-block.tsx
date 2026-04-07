'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Calendar, Star, TrendingUp, Gift, MessageSquare, ExternalLink } from 'lucide-react';
import { getB2BClientelingData } from '@/lib/fashion/clienteling-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductClientelingBlock({ product }: { product: Product }) {
  const clientData = getB2BClientelingData('P-001');

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <UserCheck className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <UserCheck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">B2B Clienteling Hub</h4>
        </div>
        <Badge className="bg-indigo-600 text-white text-[8px] font-black border-none uppercase">Buyer: Fashion Dist RU</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Lifetime Value</div>
               <div className="text-xl font-black text-slate-800">{clientData.totalLifetimeValue.toLocaleString()} ₽</div>
               <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-600 uppercase">+15% YoY</span>
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unlocked Perks</div>
               <div className="space-y-1">
                  {clientData.unlockedPerks.map((p, i) => (
                    <div key={i} className="text-[9px] font-bold text-indigo-600 flex items-center gap-1.5">
                       <Star className="w-3 h-3 fill-indigo-100" /> {p}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="p-4 bg-indigo-600/5 rounded-xl border border-indigo-100 flex flex-col justify-center">
            <div className="text-[8px] font-black text-indigo-600 uppercase mb-2 flex items-center gap-2">
               <Calendar className="w-3.5 h-3.5" /> Next Strategic Review
            </div>
            <div className="text-lg font-black text-slate-800 leading-none mb-1">{clientData.nextSuggestedMeeting}</div>
            <p className="text-[9px] font-bold text-slate-500 uppercase leading-tight">
               Agenda: SS26 Assortment Finalization & Credit Extension
            </p>
            <Button variant="outline" className="w-full mt-3 h-8 text-[8px] font-black uppercase border-indigo-200 text-indigo-600">
               Schedule via Telegram
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Last Direct Interaction: {clientData.lastInteractionDate}</span>
         <span className="text-indigo-600 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> View Comm. History
         </span>
      </div>
    </Card>
  );
}
