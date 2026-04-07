'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowRight, ArrowLeftRight, Activity, Info, MapPin } from 'lucide-react';
import { getStoreStockSwapOffers } from '@/lib/fashion/stock-swap';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStoreStockSwapBlock({ product }: { product: Product }) {
  const swaps = getStoreStockSwapOffers(product.sku);

  return (
    <Card className="p-4 border-2 border-orange-50 bg-orange-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <RefreshCw className="w-16 h-16 text-orange-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-orange-600">
          <RefreshCw className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Network Store-to-Store Stock Swap</h4>
        </div>
        <Badge className="bg-orange-600 text-white text-[8px] font-black border-none uppercase">Network Balance Active</Badge>
      </div>

      <div className="space-y-3">
         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" /> Active Swap Requests
         </div>
         
         {swaps.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {swaps.map(swap => (
                <div key={swap.id} className="p-3 bg-white/80 rounded-xl border border-orange-100 shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-1.5">
                         <ArrowLeftRight className="w-3.5 h-3.5 text-orange-500" />
                         {swap.quantity} Units
                      </div>
                      <Badge className={cn("text-[7px] h-3.5 border-none", swap.urgency === 'high' ? 'bg-rose-500' : 'bg-orange-500')}>
                         {swap.urgency.toUpperCase()}
                      </Badge>
                   </div>
                   <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase">
                      <MapPin className="w-2.5 h-2.5" /> {swap.fromStoreId.split('-')[1]} 
                      <ArrowRight className="w-2.5 h-2.5 text-slate-300" /> 
                      {swap.toStoreId.split('-')[1]}
                   </div>
                   <div className="mt-2 text-[7px] font-black text-emerald-600 uppercase">
                      Status: {swap.status.replace('_', ' ')}
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="p-8 text-center text-slate-400 text-[9px] font-black uppercase border-2 border-dashed border-orange-100 rounded-xl">
              No network rebalancing required
           </div>
         )}
      </div>

      <Button variant="ghost" className="w-full mt-3 h-8 text-[8px] font-black uppercase text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2">
         Initiate Network Rebalance <ArrowRight className="w-3 h-3" />
      </Button>

      <div className="mt-4 pt-4 border-t border-orange-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Optimizing Sell-Through Across 12 Locations</span>
         <span className="text-orange-600">AI Logistic Route Prep Ready</span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
