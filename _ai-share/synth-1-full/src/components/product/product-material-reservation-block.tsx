'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Scissors, CheckCircle2, History, Package, Briefcase } from 'lucide-react';
import { getRawMaterialBooking } from '@/lib/fashion/material-reservation';
import type { Product } from '@/lib/types';

export function ProductMaterialReservationBlock({ product }: { product: Product }) {
  const booking = getRawMaterialBooking(product.sku);

  const statusColors = {
    reserved: 'bg-indigo-100 text-indigo-700',
    released: 'bg-slate-100 text-slate-500',
    converted_to_po: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Raw Material Booking (Production)
          </h4>
        </div>
        <Badge
          className={`${statusColors[booking.status]} border-none text-[8px] font-black uppercase`}
        >
          {booking.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="mb-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <Scissors className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-800">{booking.fabricId}</div>
              <div className="text-[8px] font-bold uppercase text-slate-400">Primary Material</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-black text-slate-800">
              {booking.reservedQtyMeters} m
            </div>
            <div className="text-[8px] font-bold uppercase text-slate-400">Reserved</div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-100 bg-slate-100/50 p-2.5">
          <div className="mb-1 text-[8px] font-black uppercase text-slate-400">Booking ID</div>
          <div className="text-[9px] font-black text-slate-700">{booking.bookingId}</div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-100/50 p-2.5">
          <div className="mb-1 text-[8px] font-black uppercase text-slate-400">Expires On</div>
          <div className="text-[9px] font-black text-rose-600">{booking.expiryDate}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
        <Briefcase className="h-3.5 w-3.5" /> Supplier:{' '}
        <span className="text-slate-700 underline">{booking.supplierId}</span>
      </div>
    </Card>
  );
}
