'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, MapPin, Clock, Truck, ArrowRight, Activity, Share2 } from 'lucide-react';
import { getClickAndCollectStatus } from '@/lib/fashion/click-collect-logic';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductClickCollectBlock({ product }: { product: Product }) {
  const status = getClickAndCollectStatus(`ORD-${product.sku}-1`);

  return (
    <Card className="p-4 border-2 border-sky-50 bg-sky-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Box className="w-16 h-16 text-sky-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sky-700">
          <Box className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Click & Collect Operations</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-sky-300 text-sky-600 uppercase">Ready in 24h</Badge>
      </div>

      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/80 rounded-xl border border-sky-100 shadow-sm flex flex-col justify-center">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Store Inventory (Active)</div>
               <div className="text-xl font-black text-slate-800">42 Units</div>
               <div className="text-[7px] text-slate-500 uppercase font-bold mt-1 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> STORE-MOSCOW-CENTRAL
               </div>
            </div>
            
            <div className="p-3 bg-white/80 rounded-xl border border-sky-100 shadow-sm flex flex-col justify-center">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Efficiency Status</div>
               <div className="text-[10px] font-black text-sky-600 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> High Pick Speed
               </div>
               <div className="text-[7px] text-slate-500 uppercase font-bold mt-1">Average: 12min to Ready</div>
            </div>
         </div>

         <div className="p-3 bg-sky-600/5 rounded-xl border border-sky-100">
            <div className="text-[8px] font-black text-sky-600 uppercase mb-1 tracking-widest flex items-center gap-1.5">
               <Clock className="w-3 h-3" /> Pickup Window Monitor
            </div>
            <p className="text-[10px] font-bold text-slate-700 leading-snug">
               Order {status.orderId} will be ready by {status.readyForPickupDate}. Storage limit: {status.storageDaysLimit} days.
            </p>
         </div>

         <div className="flex gap-2">
            <Button variant="outline" className="h-8 flex-1 text-[8px] font-black uppercase border-sky-200 text-sky-600">
               Manage Reservations
            </Button>
            <Button className="h-8 flex-1 bg-sky-600 text-white hover:bg-sky-700 text-[8px] font-black uppercase shadow-sm">
               <Truck className="w-3 h-3 mr-1.5" /> Request Re-Allocation
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-sky-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Integrated with Store PDA Apps</span>
         <span className="text-sky-600 flex items-center gap-1">
            <Share2 className="w-3 h-3 text-sky-500" /> Live Inventory Sync
         </span>
      </div>
    </Card>
  );
}
