'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, ExternalLink, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { getLocalCourierStatus } from '@/lib/fashion/local-courier-dispatch';
import type { Product } from '@/lib/types';

export function ProductLocalCourierBlock({ product }: { product: Product }) {
  const status = getLocalCourierStatus(`ORD-${product.sku.slice(-5)}-RU`);

  const statusColors = {
    dispatched: 'bg-indigo-100 text-indigo-700',
    collected: 'bg-amber-100 text-amber-700',
    delivered: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Last-Mile Logistics (RU Local)</h4>
        </div>
        <Badge className={`${statusColors[status.status]} border-none uppercase text-[8px] font-black`}>
          {status.status}
        </Badge>
      </div>

      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
         <div className="flex justify-between items-center mb-2">
            <div className="text-[11px] font-black text-slate-800">{status.courierService} Hub</div>
            <div className="text-[10px] font-mono text-slate-400">#ORD-{status.orderId.slice(-8)}</div>
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Currently at: <span className="text-slate-900">{status.currentHub}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
         <div className="p-2.5 bg-slate-100/50 rounded-lg border border-slate-100">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
               <Clock className="w-2.5 h-2.5" /> ETA Arrival
            </div>
            <div className="text-[10px] font-black text-slate-700">{new Date(status.estimatedArrival).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
         </div>
         <button onClick={() => window.open(status.trackingLink, '_blank')} className="p-2.5 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-colors flex items-center justify-center gap-1.5 group">
            <span className="text-[8px] font-black text-indigo-600 uppercase">Live Tracking</span>
            <ExternalLink className="w-2.5 h-2.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
         </button>
      </div>

      <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest justify-center mt-2 opacity-60">
         <Navigation className="w-2.5 h-2.5" /> Optimized routing by CDEK/Boxberry
      </div>
    </Card>
  );
}
