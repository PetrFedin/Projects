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
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Package className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Package className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Sample Lifecycle Tracker
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
          Global Sourcing Hub
        </div>
      </div>

      <div className="relative z-10 mb-6 space-y-3">
        {samples.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <span className="text-[10px] font-black tracking-tighter text-indigo-600">
                  {s.sampleType}
                </span>
              </div>
              <div>
                <div className="mb-0.5 text-[10px] font-black uppercase text-slate-800">
                  {s.sampleType} Sample
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-400">
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
                      ? 'h-4 border-none bg-indigo-100 px-1.5 text-[8px] font-black uppercase text-indigo-700'
                      : 'h-4 border-none bg-slate-100 px-1.5 text-[8px] font-black uppercase text-slate-500'
                }
              >
                {s.status.replace('_', ' ')}
              </Badge>
              {s.trackingNumber && (
                <div className="mt-1 font-mono text-[7px] uppercase leading-none text-slate-400">
                  {s.trackingNumber}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-[9px] font-black uppercase text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> New Sample Req
        </button>
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white text-[9px] font-black uppercase text-indigo-600 transition-all hover:bg-indigo-50">
          Full History
        </button>
      </div>
    </Card>
  );
}
