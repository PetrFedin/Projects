'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, ArrowRightLeft, Package, History } from 'lucide-react';
import { getRegionalHubStock } from '@/lib/fashion/regional-hubs';
import type { Product } from '@/lib/types';

export function ProductRegionalHubStockBlock({ product }: { product: Product }) {
  const stock = getRegionalHubStock(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-white shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional B2B Stock Hubs (RF)</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-slate-200 uppercase">
           Live Inventory
        </Badge>
      </div>

      <div className="space-y-3">
         {stock.hubs.map(hub => (
           <div key={hub.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{hub.name}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                       <Clock className="w-2.5 h-2.5" /> {hub.transitDays} {hub.transitDays === 1 ? 'day' : 'days'} transit
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-black text-slate-800 leading-none mb-1">{hub.available.toLocaleString()}</div>
                 <div className="text-[8px] font-black text-emerald-600 uppercase">Units Avail.</div>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
         <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase">
            <ArrowRightLeft className="w-3 h-3" /> Inter-hub transfers active
         </div>
         <Badge className="bg-slate-800 text-white text-[8px] font-black border-none uppercase h-5 cursor-pointer hover:bg-black transition-colors">
            Request Transfer
         </Badge>
      </div>
    </Card>
  );
}
