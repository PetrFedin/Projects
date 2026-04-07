'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getB2BReorderSuggestions } from '@/lib/fashion/b2b-reorder-engine';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductReorderRecommendationBlock({ product }: { product: Product }) {
  const recommendations = getB2BReorderSuggestions('PARTNER-01', [product.sku]);

  return (
    <Card className="p-4 border-2 border-indigo-600 bg-indigo-600 text-white shadow-2xl my-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
         <Sparkles className="w-16 h-16 text-white" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-100">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">AI-Driven Reorder Suggestions</h4>
        </div>
        <Badge className="bg-indigo-500 text-white border-none text-[8px] h-4 font-black uppercase">Smart Hub</Badge>
      </div>

      <div className="space-y-4">
         {recommendations.map((r) => (
           <div key={r.sku} className="group/item p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md">
                       <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                       <div className="text-[11px] font-black text-white leading-tight uppercase tracking-tight">{r.sku}</div>
                       <div className="text-[8px] font-bold text-indigo-200 uppercase tracking-wider">{r.reason}</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[14px] font-black text-white">+{r.suggestedQty}</div>
                    <div className="text-[7px] font-black text-indigo-300 uppercase leading-none">Suggested</div>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                 <div className="flex-1">
                    <Progress value={r.confidenceScore} className="h-1 bg-white/10 fill-white rounded-full" />
                 </div>
                 <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">{r.confidenceScore}% Conf.</span>
              </div>

              <button className="w-full h-8 bg-white text-indigo-600 rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-700/50 hover:bg-indigo-50 transition-all">
                 Quick Reorder <Plus className="w-3 h-3" />
              </button>
           </div>
         ))}
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
         <RefreshCw className="w-4 h-4 text-indigo-300 animate-spin-slow" />
         <div className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest">Live Sync: Analyzing {recommendations.length} SKU dependencies...</div>
      </div>
    </Card>
  );
}
