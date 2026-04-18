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
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Package className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <Package className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Sample Lifecycle Tracker
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase leading-none tracking-widest">
          Global Sourcing Hub
        </div>
      </div>

      <div className="relative z-10 mb-6 space-y-3">
        {samples.map((s, i) => (
          <div
            key={i}
            className="border-accent-primary/20 flex items-center justify-between gap-4 rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-accent-primary text-[10px] font-black tracking-tighter">
                  {s.sampleType}
                </span>
              </div>
              <div>
                <div className="text-text-primary mb-0.5 text-[10px] font-black uppercase">
                  {s.sampleType} Sample
                </div>
                <div className="text-text-muted flex items-center gap-1.5 text-[8px] font-bold uppercase">
                  <MapPin className="h-2.5 w-2.5" /> {s.location}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge
                className={
                  s.status === 'received'
                    ? 'h-4 border-none bg-emerald-100 px-1.5 text-[8px] font-black uppercase text-emerald-700'
                    : s.status === 'in_transit'
                      ? 'bg-accent-primary/15 text-accent-primary h-4 border-none px-1.5 text-[8px] font-black uppercase'
                      : 'bg-bg-surface2 text-text-secondary h-4 border-none px-1.5 text-[8px] font-black uppercase'
                }
              >
                {s.status.replace('_', ' ')}
              </Badge>
              {s.trackingNumber && (
                <div className="text-text-muted mt-1 font-mono text-[7px] uppercase leading-none">
                  {s.trackingNumber}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="bg-accent-primary shadow-accent-primary/10 hover:bg-accent-primary flex h-9 flex-1 items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-all">
          <Plus className="h-3.5 w-3.5" /> New Sample Req
        </button>
        <button className="border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border bg-white text-[9px] font-black uppercase transition-all">
          Full History
        </button>
      </div>
    </Card>
  );
}
