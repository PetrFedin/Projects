'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, RefreshCw, Clock, ShieldCheck, ArrowRight, Activity, MapPin } from 'lucide-react';
import { getB2BRepairRequests } from '@/lib/fashion/repair-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductB2BRepairBlock({ product }: { product: Product }) {
  const repairs = getB2BRepairRequests('P-001').filter(r => r.sku === product.sku);

  return (
    <Card className="p-4 border-2 border-slate-50 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Wrench className="w-16 h-16 text-slate-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Wrench className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">B2B Repair & Circularity Hub</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-slate-300 text-slate-500 uppercase">Service Level: 48h</Badge>
      </div>

      <div className="space-y-3">
         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" /> Active Service Tickets
         </div>
         
         {repairs.length > 0 ? (
           <div className="space-y-2">
              {repairs.map(rep => (
                <div key={rep.id} className="p-3 bg-white/80 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                   <div>
                      <div className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-1.5">
                         {rep.id} • {rep.type}
                      </div>
                      {rep.trackingNumber && (
                        <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">
                           Track: {rep.trackingNumber}
                        </div>
                      )}
                   </div>
                   <Badge className={cn("text-[7px] h-3.5 border-none", rep.status === 'fixing' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400')}>
                      {rep.status.toUpperCase()}
                   </Badge>
                </div>
              ))}
           </div>
         ) : (
           <div className="p-6 text-center text-slate-400 text-[9px] font-black uppercase border-2 border-dashed border-slate-100 rounded-xl">
              No active service requests for this SKU
           </div>
         )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
         <Button variant="outline" className="h-8 text-[8px] font-black uppercase border-slate-200 text-slate-600">
            Submit Defect Ticket
         </Button>
         <Button variant="outline" className="h-8 text-[8px] font-black uppercase border-slate-200 text-slate-600">
            Request Recycling
         </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Integrated with RU EDO & Logistics</span>
         <span className="text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> QA Policy V2.1
         </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
