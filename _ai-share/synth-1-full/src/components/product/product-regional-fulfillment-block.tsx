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
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional Dispatch Windows
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">Distributor SLA</div>
=======
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional Dispatch Windows
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">Distributor SLA</div>
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="relative z-10 space-y-3">
        {windows.map((w, i) => (
          <div
            key={i}
<<<<<<< HEAD
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-indigo-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-indigo-50">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="mt-0.5 text-[7px] font-black uppercase text-indigo-400">
=======
            className="border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer items-center justify-between rounded-xl border bg-white p-3 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-9 w-9 flex-col items-center justify-center rounded-lg">
                <Calendar className="text-accent-primary h-4 w-4" />
                <span className="text-accent-primary mt-0.5 text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  {w.truckType}
                </span>
              </div>
              <div>
<<<<<<< HEAD
                <div className="text-[10px] font-black text-slate-800">
                  {new Date(w.earliestDeparture).toLocaleDateString('ru-RU')}
                </div>
                <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-slate-400">
=======
                <div className="text-text-primary text-[10px] font-black">
                  {new Date(w.earliestDeparture).toLocaleDateString('ru-RU')}
                </div>
                <div className="text-text-muted flex items-center gap-1 text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  <MapPin className="h-2.5 w-2.5" /> Arrival:{' '}
                  {new Date(w.latestArrival).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-black text-emerald-600">
                {w.availableCapacityUnits} Units
              </div>
<<<<<<< HEAD
              <div className="mt-0.5 text-[7px] font-black uppercase text-slate-400">
=======
              <div className="text-text-muted mt-0.5 text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Capacity left
              </div>
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Guaranteed Slots
        </div>
        <button className="flex items-center gap-1 text-[8px] font-black uppercase text-indigo-600 hover:underline">
=======
      <div className="border-border-subtle mt-4 flex items-center justify-between border-t pt-3">
        <div className="text-text-muted flex items-center gap-1.5 text-[8px] font-black uppercase">
          <ShieldCheck className="text-accent-primary h-3.5 w-3.5" /> Guaranteed Slots
        </div>
        <button className="text-accent-primary flex items-center gap-1 text-[8px] font-black uppercase hover:underline">
>>>>>>> recover/cabinet-wip-from-stash
          Book Freight <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </Card>
  );
}
