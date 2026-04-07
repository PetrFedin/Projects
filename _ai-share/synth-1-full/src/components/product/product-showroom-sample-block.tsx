'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Scan, MapPin, User, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { getShowroomSampleInventory } from '@/lib/fashion/showroom-sample-inventory';
import type { Product } from '@/lib/types';

export function ProductShowroomSampleBlock({ product }: { product: Product }) {
  const sample = getShowroomSampleInventory(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Scan className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Live Showroom Sample Tracker</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NFC / QR Sync</div>
      </div>

      <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
            <Box className="w-16 h-16 text-slate-900" />
         </div>

         <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md border-2 border-white ${
               sample.status === 'available' ? 'bg-emerald-100' :
               sample.status === 'with_buyer' ? 'bg-indigo-100' :
               'bg-amber-100'
            }`}>
               {sample.status === 'available' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : 
                sample.status === 'with_buyer' ? <User className="w-6 h-6 text-indigo-600" /> : 
                <AlertTriangle className="w-6 h-6 text-amber-600" />}
            </div>
            <div className="flex-1">
               <div className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{sample.id}</div>
               <Badge className={`text-[8px] font-black h-4 uppercase border-none ${
                  sample.status === 'available' ? 'bg-emerald-500 text-white' :
                  sample.status === 'with_buyer' ? 'bg-indigo-600 text-white' :
                  'bg-amber-600 text-white'
               }`}>
                  {sample.status.toUpperCase()}
               </Badge>
            </div>
         </div>

         <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Current Zone</div>
               </div>
               <div className="text-[10px] font-black text-slate-800">{sample.currentZone}</div>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Last Scanned</div>
               </div>
               <div className="text-[10px] font-black text-slate-800">{sample.lastScannedBy}</div>
            </div>
         </div>
      </div>

      <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-slate-200 relative overflow-hidden group/btn cursor-pointer">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/btn:scale-125 transition-transform">
            <Scan className="w-12 h-12 text-white" />
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest relative z-10">Scan Sample QR</div>
         <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
