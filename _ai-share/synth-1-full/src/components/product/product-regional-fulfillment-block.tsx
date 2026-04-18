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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional Dispatch Windows
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">Distributor SLA</div>
      </div>

      <div className="relative z-10 space-y-3">
        {windows.map((w, i) => (
          <div
            key={i}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-indigo-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-indigo-50">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="mt-0.5 text-[7px] font-black uppercase text-indigo-400">
                  {w.truckType}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-800">
                  {new Date(w.earliestDeparture).toLocaleDateString('ru-RU')}
                </div>
                <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-slate-400">
                  <MapPin className="h-2.5 w-2.5" /> Arrival:{' '}
                  {new Date(w.latestArrival).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-black text-emerald-600">
                {w.availableCapacityUnits} Units
              </div>
              <div className="mt-0.5 text-[7px] font-black uppercase text-slate-400">
                Capacity left
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> Guaranteed Slots
        </div>
        <button className="flex items-center gap-1 text-[8px] font-black uppercase text-indigo-600 hover:underline">
          Book Freight <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </Card>
  );
}
