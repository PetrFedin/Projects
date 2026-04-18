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
    <Card className="relative overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <TrendingUp className="h-16 w-16 text-indigo-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-indigo-700">
            AI Price Optimization
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-indigo-500">
          Confidence: {opt.confidenceScore}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 text-[10px] font-black uppercase text-slate-400">Target Price</div>
          <div className="text-2xl font-black tracking-tight text-slate-800">
            {opt.recommendedPrice.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex flex-col items-end justify-center">
          <div
            className={`flex items-center gap-1 text-xs font-black uppercase ${isUp ? 'text-green-600' : 'text-rose-600'}`}
          >
            {isUp ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5" />
            )}
            {isUp ? '+' : ''}
            {diff.toLocaleString()} ₽
          </div>
          <div className="mt-1 text-[9px] font-black uppercase leading-none text-slate-400">
            Based on {opt.trendFactor.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-indigo-100 bg-white p-3 shadow-sm">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
        <div className="text-[11px] font-medium leading-tight text-indigo-700">{opt.reason}</div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-indigo-50 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
        <Info className="h-3 w-3" /> Demand Forecasting Algorithm v2.1
      </div>
    </Card>
  );
};
