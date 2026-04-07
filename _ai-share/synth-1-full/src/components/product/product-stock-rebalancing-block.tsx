'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRightLeft, TrendingUp, AlertCircle } from 'lucide-react';
import { getStockRebalancingSuggestions } from '@/lib/fashion/stock-rebalancing';
import type { Product } from '@/lib/types';

export function ProductStockRebalancingBlock({ product }: { product: Product }) {
  const suggestions = getStockRebalancingSuggestions(product.sku);

  return (
    <Card className="p-4 border-2 border-teal-50 bg-teal-50/5 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-teal-600">
          <ArrowRightLeft className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Stock Rebalancing (B2B/Inter-store)</h4>
        </div>
        <Badge className="bg-teal-100 text-teal-700 border-none uppercase text-[8px] font-black animate-pulse">Auto-Suggestion</Badge>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, idx) => (
          <div key={idx} className="p-3 bg-white rounded-xl border border-teal-100 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase">
                   <span className="text-slate-800">{s.fromStoreId}</span>
                   <RefreshCw className="w-2.5 h-2.5 text-teal-500" />
                   <span className="text-slate-800">{s.toStoreId}</span>
                </div>
                <Badge variant="outline" className={`text-[7px] font-black h-3.5 uppercase ${s.urgency === 'high' ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-slate-200 text-slate-500'}`}>
                   {s.urgency} Priority
                </Badge>
             </div>
             
             <div className="flex items-end justify-between">
                <div>
                   <div className="text-lg font-black text-slate-800 leading-none">{s.suggestedQty} <span className="text-[10px] text-slate-400">PCS</span></div>
                   <div className="text-[8px] font-bold text-teal-600 uppercase mt-1 flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" /> {s.reason.replace('_', ' ')}
                   </div>
                </div>
                <button className="bg-teal-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase hover:bg-teal-700 shadow-sm transition-colors">
                   Execute Transfer
                </button>
             </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
