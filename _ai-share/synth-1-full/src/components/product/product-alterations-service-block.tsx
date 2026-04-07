'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, MapPin, Star, Calendar, ChevronRight, Ruler } from 'lucide-react';
import { getAlterationServices } from '@/lib/fashion/alterations-network';
import { Button } from '@/components/ui/button';

export const ProductAlterationsServiceBlock: React.FC<{ product: Product }> = ({ product }) => {
  const ateliers = getAlterationServices(product);
  
  return (
    <Card className="p-4 border-2 border-amber-50 bg-amber-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Scissors className="w-12 h-12 text-amber-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-amber-600" />
          <h4 className="font-bold text-xs uppercase text-amber-700 tracking-tight">Подгонка по фигуре (Premium)</h4>
        </div>
        <div className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Near You
        </div>
      </div>

      <div className="space-y-3">
        {ateliers.map((a, idx) => (
          <div key={idx} className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm relative group transition-all hover:border-amber-300">
             <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                   <div className="text-sm font-black text-slate-800 tracking-tight">{a.atelierName}</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{a.distanceKm} km away</div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                   <Star className="w-3 h-3 fill-amber-500" /> 4.9
                </div>
             </div>
             
             <div className="flex flex-wrap gap-1.5 mb-3">
                {a.availableServices.map(s => (
                  <Badge key={s} variant="outline" className="text-[8px] h-3.5 bg-amber-50/50 border-amber-50 text-amber-700 font-black uppercase">{s}</Badge>
                ))}
             </div>

             <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="text-[10px] font-black text-slate-400 uppercase">From {a.estimatedPrice} ₽</div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-black uppercase text-amber-600 hover:bg-amber-50">
                   Book Now <ChevronRight className="w-2.5 h-2.5 ml-1" />
                </Button>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2.5 bg-amber-600 rounded-lg text-white flex items-center gap-3 shadow-md cursor-pointer hover:bg-amber-700 transition-colors">
         <Ruler className="w-5 h-5 opacity-80" />
         <div className="flex-1">
            <div className="text-[10px] font-black uppercase leading-none mb-0.5">VIP Home Service</div>
            <div className="text-[11px] font-medium leading-none">Вызвать портного на дом</div>
         </div>
         <ChevronRight className="w-4 h-4" />
      </div>
    </Card>
  );
};
