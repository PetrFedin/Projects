'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Sparkles, AlertCircle, Info } from 'lucide-react';
import { optimizeProductPrice } from '@/lib/fashion/price-optimization';

export const ProductPriceOptimizationBlock: React.FC<{ product: Product }> = ({ product }) => {
  const opt = optimizeProductPrice(product);
  const diff = opt.recommendedPrice - opt.currentPrice;
  const isUp = diff > 0;
  
  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <TrendingUp className="w-16 h-16 text-indigo-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-xs uppercase text-indigo-700 tracking-tight">AI Price Optimization</h4>
        </div>
        <div className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1">
          Confidence: {opt.confidenceScore}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Price</div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
             {opt.recommendedPrice.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex flex-col justify-center items-end">
           <div className={`text-xs font-black uppercase flex items-center gap-1 ${isUp ? 'text-green-600' : 'text-rose-600'}`}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {isUp ? '+' : ''}{diff.toLocaleString()} ₽
           </div>
           <div className="text-[9px] font-black text-slate-400 uppercase leading-none mt-1">
              Based on {opt.trendFactor.replace('_', ' ')}
           </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100 flex gap-3 items-start shadow-sm">
         <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-[11px] font-medium text-indigo-700 leading-tight">
            {opt.reason}
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-indigo-50 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic">
         <Info className="w-3 h-3" /> Demand Forecasting Algorithm v2.1
      </div>
    </Card>
  );
};
