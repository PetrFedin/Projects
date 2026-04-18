'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Star, Clock, Calendar, MoveRight, ShoppingBag, Sparkles } from 'lucide-react';
import { getStoreVipFittings } from '@/lib/fashion/store-vip-fittings';
import type { Product } from '@/lib/types';

export function ProductStoreVipFittingBlock({ product }: { product: Product }) {
  const appointments = getStoreVipFittings('STORE-MSK-MAIN');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-100 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Star className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Star className="h-4 w-4 fill-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            VIP In-Store Appointments
          </h4>
        </div>
        <Badge className="border-none bg-indigo-100 text-[8px] font-black uppercase text-indigo-700">
          Today's Schedule
        </Badge>
      </div>

      <div className="mb-4 space-y-3">
        {appointments.map((app) => (
          <div
            key={app.appointmentId}
            className="group flex items-center justify-between rounded-xl border border-indigo-50 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-black text-slate-400">
                {app.clientId[0]}
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-800">{app.clientId}</div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-400">
                  <Clock className="h-2.5 w-2.5" /> {app.timeSlot.split(' ')[1]}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge
                className={
                  app.status === 'active'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }
                variant="outline"
                className="h-4 border-none px-1 text-[7px] font-black uppercase"
              >
                {app.status}
              </Badge>
              <div className="mt-1 text-[8px] font-black uppercase tracking-tighter text-indigo-600">
                Stylist: {app.stylistId.split('-')[1]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="group mb-2 flex cursor-pointer items-center justify-between rounded-xl border border-indigo-100 bg-white p-3 transition-colors hover:bg-indigo-50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-indigo-500" />
          <div className="text-[10px] font-bold text-slate-700">Pre-selected for items: 2 SKU</div>
        </div>
        <MoveRight className="h-3.5 w-3.5 text-indigo-400 transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] font-black uppercase italic tracking-widest text-slate-400">
        <Sparkles className="h-3 w-3 text-indigo-400" /> Stylist hub sync active
      </div>
    </Card>
  );
}
