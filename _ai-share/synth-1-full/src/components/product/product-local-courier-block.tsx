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
    dispatched: 'bg-accent-primary/15 text-accent-primary',
    collected: 'bg-amber-100 text-amber-700',
    delivered: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Last-Mile Logistics (RU Local)
          </h4>
        </div>
        <Badge
          className={`${statusColors[status.status]} border-none text-[8px] font-black uppercase`}
        >
          {status.status}
        </Badge>
      </div>

      <div className="border-border-subtle mb-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-text-primary text-[11px] font-black">
            {status.courierService} Hub
          </div>
          <div className="text-text-muted font-mono text-[10px]">
            #ORD-{status.orderId.slice(-8)}
          </div>
        </div>
        <div className="text-text-secondary flex items-center gap-2 text-[10px] font-bold">
          <MapPin className="text-accent-primary h-3.5 w-3.5" /> Currently at:{' '}
          <span className="text-text-primary">{status.currentHub}</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="bg-bg-surface2/50 border-border-subtle rounded-lg border p-2.5">
          <div className="text-text-muted mb-1 flex items-center gap-1 text-[8px] font-black uppercase">
            <Clock className="h-2.5 w-2.5" /> ETA Arrival
          </div>
          <div className="text-text-primary text-[10px] font-black">
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
          className="bg-accent-primary/10 hover:bg-accent-primary/10 border-accent-primary/20 group flex items-center justify-center gap-1.5 rounded-lg border p-2.5 transition-colors"
        >
          <span className="text-accent-primary text-[8px] font-black uppercase">Live Tracking</span>
          <ExternalLink className="text-accent-primary h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="text-text-muted mt-2 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-60">
        <Navigation className="h-2.5 w-2.5" /> Optimized routing by CDEK/Boxberry
      </div>
    </Card>
  );
}
