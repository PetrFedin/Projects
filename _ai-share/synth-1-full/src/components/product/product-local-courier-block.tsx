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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Last-Mile Logistics (RU Local)
          </h4>
        </div>
        <Badge
          className={`${statusColors[status.status]} border-none text-[8px] font-black uppercase`}
        >
          {status.status}
        </Badge>
      </div>

      <div className="mb-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-black text-slate-800">{status.courierService} Hub</div>
          <div className="font-mono text-[10px] text-slate-400">
            #ORD-{status.orderId.slice(-8)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-indigo-500" /> Currently at:{' '}
          <span className="text-slate-900">{status.currentHub}</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-100 bg-slate-100/50 p-2.5">
          <div className="mb-1 flex items-center gap-1 text-[8px] font-black uppercase text-slate-400">
            <Clock className="h-2.5 w-2.5" /> ETA Arrival
          </div>
          <div className="text-[10px] font-black text-slate-700">
            {new Date(status.estimatedArrival).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <button
          onClick={() => window.open(status.trackingLink, '_blank')}
          className="group flex items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5 transition-colors hover:bg-indigo-50"
        >
          <span className="text-[8px] font-black uppercase text-indigo-600">Live Tracking</span>
          <ExternalLink className="h-2.5 w-2.5 text-indigo-500 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-60">
        <Navigation className="h-2.5 w-2.5" /> Optimized routing by CDEK/Boxberry
      </div>
    </Card>
  );
}
