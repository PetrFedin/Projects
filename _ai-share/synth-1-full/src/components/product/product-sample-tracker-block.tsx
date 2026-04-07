'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Truck, CheckCircle2, History, Briefcase, Plus } from 'lucide-react';
import { getSampleLifecycle } from '@/lib/fashion/sample-lifecycle';
import type { Product } from '@/lib/types';

export function ProductSampleTrackerBlock({ product }: { product: Product }) {
  const samples = getSampleLifecycle(product.sku);

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Package className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Package className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Sample Lifecycle Tracker</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Sourcing Hub</div>
      </div>

      <div className="space-y-3 mb-6 relative z-10">
         {samples.map((s, i) => (
           <div key={i} className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-[10px] font-black text-indigo-600 tracking-tighter">{s.sampleType}</span>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-800 mb-0.5 uppercase">{s.sampleType} Sample</div>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase">
                       <MapPin className="w-2.5 h-2.5" /> {s.location}
                    </div>
                 </div>
              </div>
              
              <div className="text-right">
                 <Badge className={
                   s.status === 'received' ? 'bg-emerald-100 text-emerald-700 border-none text-[8px] h-4 font-black px-1.5 uppercase' :
                   s.status === 'in_transit' ? 'bg-indigo-100 text-indigo-700 border-none text-[8px] h-4 font-black px-1.5 uppercase' :
                   'bg-slate-100 text-slate-500 border-none text-[8px] h-4 font-black px-1.5 uppercase'
                 }>
                   {s.status.replace('_', ' ')}
                 </Badge>
                 {s.trackingNumber && <div className="text-[7px] font-mono text-slate-400 mt-1 uppercase leading-none">{s.trackingNumber}</div>}
              </div>
           </div>
         ))}
      </div>

      <div className="flex gap-2">
         <button className="flex-1 h-9 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
            <Plus className="w-3.5 h-3.5" /> New Sample Req
         </button>
         <button className="flex-1 h-9 bg-white border border-indigo-100 text-indigo-600 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all hover:bg-indigo-50">
            Full History
         </button>
      </div>
    </Card>
  );
}
