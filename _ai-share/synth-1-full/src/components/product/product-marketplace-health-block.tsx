'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, TrendingUp, TrendingDown, Info, ShoppingCart, Target } from 'lucide-react';
import { getMarketplaceHealth } from '@/lib/fashion/marketplace-health';

export const ProductMarketplaceHealthBlock: React.FC<{ product: Product }> = ({ product }) => {
  const health = getMarketplaceHealth(product);
  
  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <HeartPulse className="w-16 h-16 text-emerald-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-xs uppercase text-emerald-700 tracking-tight">Marketplace Health Scorecard</h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-black uppercase">
           WB / Ozon Sync OK
        </div>
      </div>

      <div className="space-y-4">
        {health.map((h, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                   <Badge className="bg-emerald-600 text-[10px] font-black h-4 border-none text-white uppercase">{h.marketplace}</Badge>
                   <div className="text-[10px] font-black text-slate-400 uppercase">Buyback: {h.buybackRate}%</div>
                </div>
                <div className={`text-[10px] font-black uppercase flex items-center gap-1 ${h.buyboxStatus === 'won' ? 'text-green-600' : 'text-rose-600'}`}>
                   {h.buyboxStatus === 'won' ? <Target className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                   Buybox {h.buyboxStatus}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase mb-1">Out of Stock Risk</span>
                   <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1 overflow-hidden">
                         <div className={`h-full ${h.outOfStockRisk > 30 ? 'bg-orange-400' : 'bg-green-400'}`} style={{ width: `${h.outOfStockRisk}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 leading-none">{h.outOfStockRisk}%</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-400 uppercase mb-1">Rating Trend</span>
                   <div className={`text-xs font-black flex items-center gap-1 ${h.ratingTrend === 'up' ? 'text-green-600' : 'text-slate-500'}`}>
                      {h.ratingTrend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5 opacity-40" />}
                      {h.ratingTrend.toUpperCase()}
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-50 text-[9px] text-slate-400 font-bold uppercase italic flex items-center gap-1.5 leading-none">
         <Info className="w-3 h-3" /> Aggregated Marketplace Analytics v3.2
      </div>
    </Card>
  );
};
