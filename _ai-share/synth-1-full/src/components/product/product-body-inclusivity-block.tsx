'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Ruler, Info, Star } from 'lucide-react';
import { getBodyInclusivity } from '@/lib/fashion/body-inclusivity';

export const ProductBodyInclusivityBlock: React.FC<{ product: Product }> = ({ product }) => {
  const i = getBodyInclusivity(product);
  
  return (
    <Card className="p-4 border-2 border-fuchsia-50 bg-fuchsia-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Users className="w-16 h-16 text-fuchsia-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-fuchsia-600" />
          <h4 className="font-bold text-xs uppercase text-fuchsia-700 tracking-tight">Body Inclusivity Index</h4>
        </div>
        <div className="text-[10px] font-black text-fuchsia-500 uppercase flex items-center gap-1">
          <Star className="w-3 h-3 fill-fuchsia-500" /> Slavic Fit: {i.slavicFitScore}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${i.petiteFriendly ? 'bg-white border-fuchsia-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
            <Ruler className="w-4 h-4 text-fuchsia-400 mb-1" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Petite Friendly</span>
         </div>
         <div className={`p-3 rounded-xl border flex flex-col items-center justify-center ${i.tallFriendly ? 'bg-white border-fuchsia-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
            <Users className="w-4 h-4 text-fuchsia-400 mb-1" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Tall Friendly</span>
         </div>
      </div>

      <div className="space-y-2">
         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Adjustment Points</div>
         <div className="flex flex-wrap gap-1.5">
            {i.adjustmentPoints.map(p => (
              <Badge key={p} variant="secondary" className="text-[8px] h-4 bg-white border border-fuchsia-50 text-fuchsia-700 font-bold uppercase">
                {p}
              </Badge>
            ))}
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-fuchsia-100 text-[9px] text-slate-400 font-bold uppercase italic flex items-center gap-1.5">
         <Info className="w-3 h-3" /> Based on regional demographic fit data v3.1
      </div>
    </Card>
  );
};
