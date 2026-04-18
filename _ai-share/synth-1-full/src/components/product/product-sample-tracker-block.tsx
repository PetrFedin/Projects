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
<<<<<<< HEAD
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
=======
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
>>>>>>> recover/cabinet-wip-from-stash
          Global Sourcing Hub
        </div>
      </div>

      <div className="relative z-10 mb-6 space-y-3">
        {samples.map((s, i) => (
          <div
            key={i}
<<<<<<< HEAD
            className="flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <span className="text-[10px] font-black tracking-tighter text-indigo-600">
=======
            className="border-accent-primary/20 flex items-center justify-between gap-4 rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-accent-primary text-[10px] font-black tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                  {s.sampleType}
                </span>
              </div>
              <div>
<<<<<<< HEAD
                <div className="mb-0.5 text-[10px] font-black uppercase text-slate-800">
                  {s.sampleType} Sample
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-400">
=======
                <div className="text-text-primary mb-0.5 text-[10px] font-black uppercase">
                  {s.sampleType} Sample
                </div>
                <div className="text-text-muted flex items-center gap-1.5 text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                      ? 'h-4 border-none bg-indigo-100 px-1.5 text-[8px] font-black uppercase text-indigo-700'
                      : 'h-4 border-none bg-slate-100 px-1.5 text-[8px] font-black uppercase text-slate-500'
=======
                      ? 'bg-accent-primary/15 text-accent-primary h-4 border-none px-1.5 text-[8px] font-black uppercase'
                      : 'bg-bg-surface2 text-text-secondary h-4 border-none px-1.5 text-[8px] font-black uppercase'
>>>>>>> recover/cabinet-wip-from-stash
                }
              >
                {s.status.replace('_', ' ')}
              </Badge>
              {s.trackingNumber && (
<<<<<<< HEAD
                <div className="mt-1 font-mono text-[7px] uppercase leading-none text-slate-400">
=======
                <div className="text-text-muted mt-1 font-mono text-[7px] uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                  {s.trackingNumber}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
<<<<<<< HEAD
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-[9px] font-black uppercase text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> New Sample Req
        </button>
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white text-[9px] font-black uppercase text-indigo-600 transition-all hover:bg-indigo-50">
=======
        <button className="bg-accent-primary shadow-accent-primary/10 hover:bg-accent-primary flex h-9 flex-1 items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-all">
          <Plus className="h-3.5 w-3.5" /> New Sample Req
        </button>
        <button className="border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border bg-white text-[9px] font-black uppercase transition-all">
>>>>>>> recover/cabinet-wip-from-stash
          Full History
        </button>
      </div>
    </Card>
  );
}
