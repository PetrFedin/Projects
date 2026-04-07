'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, MessageSquare, TrendingUp, DollarSign, Package, ExternalLink, Activity } from 'lucide-react';
import { getStockExchangeOffers } from '@/lib/fashion/stock-exchange';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStockExchangeBlock({ product }: { product: Product }) {
  const offers = getStockExchangeOffers(product.sku);

  return (
    <Card className="p-4 border-2 border-orange-50 bg-orange-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <ArrowRightLeft className="w-16 h-16 text-orange-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-orange-600">
          <ArrowRightLeft className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">B2B Stock Exchange (Secondary Market)</h4>
        </div>
        <Badge className="bg-orange-600 text-white text-[8px] font-black border-none uppercase">Secondary Market Active</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="space-y-3">
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> External Liquidity
               </div>
               {offers.length > 0 ? (
                 <div className="space-y-2">
                    {offers.map((off, i) => (
                      <div key={i} className="p-2.5 bg-white/80 rounded-xl border border-orange-200 shadow-sm flex justify-between items-center group cursor-pointer hover:bg-white transition-colors">
                         <div>
                            <div className={off.type === 'excess' ? 'text-emerald-600' : 'text-rose-600'}>
                               <span className="text-[10px] font-black uppercase">{off.type === 'excess' ? 'Partner Surplus' : 'Partner Seek'}</span>
                            </div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{off.quantity} Units @ {off.location}</div>
                         </div>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-400 opacity-0 group-hover:opacity-100">
                            <MessageSquare className="w-4 h-4" />
                         </Button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-8 text-center text-slate-400 text-[9px] font-black uppercase tracking-widest border-2 border-dashed border-orange-200 rounded-xl">
                    No active offers
                 </div>
               )}
            </div>
            <Button className="w-full h-8 bg-orange-600 text-white hover:bg-orange-700 text-[9px] font-black uppercase tracking-widest shadow-lg">
               List My Surplus
            </Button>
         </div>

         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <TrendingUp className="w-3 h-3" /> Liquidity Metrics
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="p-3 bg-white/50 rounded-xl border border-orange-100 flex flex-col items-center">
                  <Package className="w-4 h-4 text-orange-600 mb-1" />
                  <div className="text-[14px] font-black text-slate-800 leading-none">420</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Avail. Units</div>
               </div>
               <div className="p-3 bg-white/50 rounded-xl border border-orange-100 flex flex-col items-center">
                  <DollarSign className="w-4 h-4 text-emerald-600 mb-1" />
                  <div className="text-[14px] font-black text-emerald-600 leading-none">4.2k</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Avg. Bid</div>
               </div>
            </div>
            
            <div className="p-4 bg-orange-600/5 rounded-xl border border-orange-200 shadow-sm mt-2">
               <div className="text-[8px] font-black text-orange-600 uppercase mb-2">Market Insights</div>
               <p className="text-[9px] font-bold text-slate-600 leading-tight">
                  Demand for {product.name} in Novosibirsk is peaking. Secondary resale price is 8% above pre-order MSRP.
               </p>
            </div>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-orange-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>B2B Peer-to-Peer Stock Swapping</span>
         <span className="text-orange-600">Trading Fee: 1.5%</span>
      </div>
    </Card>
  );
}
