'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, ShoppingBag, Timer, ArrowRightLeft } from 'lucide-react';
import { getFittingAnalytics } from '@/lib/fashion/fitting-analytics';

export const ProductFittingAnalyticsBlock: React.FC<{ product: Product }> = ({ product }) => {
  const analytics = getFittingAnalytics(product);
  
  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Shirt className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-slate-600" />
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-tight">Fitting Room Intelligence (Offline)</h4>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase">Store Count: {analytics.length}</div>
      </div>

      <div className="space-y-4">
        {analytics.map((s, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{s.storeId}</span>
              <Badge variant="outline" className="text-[9px] h-4 bg-slate-50 border-slate-100">
                CR: {s.conversionToPurchase}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Fittings</span>
                <span className="text-sm font-black text-slate-700 flex items-center gap-1">
                   <ShoppingBag className="w-3 h-3 text-slate-400" /> {s.fittingsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Avg Time</span>
                <span className="text-sm font-black text-slate-700 flex items-center gap-1">
                   <Timer className="w-3 h-3 text-slate-400" /> {s.avgTimeInFittingRoom}m
                </span>
              </div>
            </div>

            {s.topAlternativeSku && (
              <div className="mt-2.5 pt-2 border-t flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                 <ArrowRightLeft className="w-2.5 h-2.5" /> Alt: {s.topAlternativeSku}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold uppercase italic flex items-center gap-1.5">
         Store-to-Web attribution active • Physical-to-Digital Loop v1.1
      </div>
    </Card>
  );
};
