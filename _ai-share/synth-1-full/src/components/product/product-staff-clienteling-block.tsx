'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Target, Heart, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { getClientStyleProfile } from '@/lib/fashion/instore-clienteling';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffClientelingBlock({ product }: { product: Product }) {
  // Demo: assumption of an active client in-store
  const client = getClientStyleProfile('CLIENT-RU-99');

  return (
    <Card className="p-4 border-2 border-sky-100 bg-sky-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <UserCheck className="w-16 h-16 text-sky-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sky-600">
          <UserCheck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">In-Store Clienteling Card</h4>
        </div>
        <Badge className="bg-sky-100 text-sky-700 border-none uppercase text-[8px] font-black">Active Client Profile</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className="p-3 bg-white/80 rounded-xl border border-sky-100 shadow-sm">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Style DNA Match</div>
            <div className="text-sm font-black text-slate-800">{client.styleProfile}</div>
            <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-600">
               <Sparkles className="w-2.5 h-2.5" /> 92% Alignment
            </div>
         </div>
         <div className="p-3 bg-white/80 rounded-xl border border-sky-100 shadow-sm">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Recommended Size</div>
            <div className="text-sm font-black text-slate-800">{client.sizeAffinity}</div>
            <div className="text-[8px] font-black text-slate-400 uppercase mt-1 leading-none">Base: {client.lastPurchaseCategory}</div>
         </div>
      </div>

      <div className="p-3 bg-sky-600/5 rounded-xl border border-sky-100 mb-2">
         <div className="text-[8px] font-black text-sky-600 uppercase mb-2 flex items-center gap-2 tracking-widest">
            <Target className="w-3.5 h-3.5" /> Cross-sell Strategy for Staff
         </div>
         <p className="text-[10px] font-bold text-slate-600 leading-tight">
            "Client prefers monochromatic looks. Offer this <b>{product.name}</b> as a layering piece for their existing <b>{client.lastPurchaseCategory}</b> collection."
         </p>
      </div>

      <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-[8px] font-black uppercase border-sky-200 text-sky-700 hover:bg-sky-50 flex items-center justify-center gap-2">
         <ShoppingBag className="w-3 h-3" /> View Full Purchase History <ArrowRight className="w-2.5 h-2.5" />
      </Button>
    </Card>
  );
}
