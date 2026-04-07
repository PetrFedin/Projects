'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeftRight, TrendingUp, AlertCircle, BarChart3, MoveRight } from 'lucide-react';
import { getDistributorStockAnalysis } from '@/lib/fashion/distributor-rebalance';
import type { Product } from '@/lib/types';

export function ProductDistributorStockBlock({ product }: { product: Product }) {
  const analysis = getDistributorStockAnalysis(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Distributor Inventory Balancing</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">National Distribution Hub</div>
      </div>

      <div className="space-y-3">
         {analysis.map((item) => (
           <div key={item.partnerId} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                 <div className="text-[10px] font-black text-slate-800 truncate mb-0.5">{item.partnerId}</div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-500">Stock: {item.currentStock}</span>
                    <span className="text-[9px] font-black text-emerald-600">{item.sellThroughRate}% STR</span>
                 </div>
              </div>
              
              <div className="text-right shrink-0">
                 <Badge className={
                   item.rebalanceSuggestion === 'transfer_in' ? 'bg-indigo-100 text-indigo-700 border-none text-[8px] h-5' :
                   item.rebalanceSuggestion === 'transfer_out' ? 'bg-amber-100 text-amber-700 border-none text-[8px] h-5' :
                   'bg-slate-100 text-slate-700 border-none text-[8px] h-5'
                 }>
                   {item.rebalanceSuggestion.replace('_', ' ')}
                 </Badge>
                 <div className="text-[8px] font-black text-slate-400 uppercase mt-1 leading-none">Target: {item.targetQty}</div>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100 flex items-center justify-between group cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Stock Swap Proposal</div>
               <div className="text-[9px] font-medium text-indigo-100">Balance regions based on Sell-Through</div>
            </div>
         </div>
         <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
