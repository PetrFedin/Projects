'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Box, Calendar, ShieldCheck, RefreshCw, BarChart3 } from 'lucide-react';
import { getRegionalHubFulfillment } from '@/lib/fashion/regional-hubs';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductB2BReservationBlock({ product }: { product: Product }) {
  const hubs = getRegionalHubFulfillment(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional Hub Stock Reservation</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">B2B Inventory Hubs</div>
      </div>

      <div className="space-y-4">
         {hubs.map((hub) => (
           <div key={hub.hubId} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-indigo-500" />
                    <div className="text-[10px] font-black text-slate-800 uppercase">{hub.hubId}</div>
                 </div>
                 <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[8px] h-4 font-black">ACTIVE</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                 <div>
                    <div className="text-[14px] font-black text-slate-800 leading-none">{hub.availableForB2B}</div>
                    <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Available B2B</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[14px] font-black text-indigo-600 leading-none">{hub.reservedForRetail}</div>
                    <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Retail Buffer</div>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase mb-1">
                    <span>Hub Capacity Utilization</span>
                    <span>{Math.round((hub.availableForB2B / hub.stockInHub) * 100)}%</span>
                 </div>
                 <Progress value={(hub.availableForB2B / hub.stockInHub) * 100} className="h-1 bg-slate-50 fill-indigo-500" />
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                 <Calendar className="w-3 h-3" /> Next Arrival: {hub.nextReplenishmentDate}
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-indigo-500" /> Secure B2B Reservation System
         </div>
         <button className="flex items-center gap-1 text-indigo-600 hover:underline">
            <RefreshCw className="w-2.5 h-2.5" /> Force Sync
         </button>
      </div>
    </Card>
  );
}
