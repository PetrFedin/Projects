'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, Box, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { getRegionalDeliveryWindows } from '@/lib/fashion/regional-delivery-windows';
import type { Product } from '@/lib/types';

export function RegionalFulfillmentWindowBlock({ product }: { product: Product }) {
  const windows = getRegionalDeliveryWindows('Moscow & MO');

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Regional Dispatch Windows</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">Distributor SLA</div>
      </div>

      <div className="space-y-3 relative z-10">
         {windows.map((w, i) => (
           <div key={i} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-indigo-50 flex flex-col items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-[7px] font-black text-indigo-400 uppercase mt-0.5">{w.truckType}</span>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-800">{new Date(w.earliestDeparture).toLocaleDateString('ru-RU')}</div>
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase">
                       <MapPin className="w-2.5 h-2.5" /> Arrival: {new Date(w.latestArrival).toLocaleDateString('ru-RU')}
                    </div>
                 </div>
              </div>
              
              <div className="text-right">
                 <div className="text-[11px] font-black text-emerald-600">{w.availableCapacityUnits} Units</div>
                 <div className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Capacity left</div>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Guaranteed Slots
         </div>
         <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline flex items-center gap-1">
            Book Freight <ArrowRight className="w-2.5 h-2.5" />
         </button>
      </div>
    </Card>
  );
}
