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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Raw Material Booking (Production)</h4>
        </div>
        <Badge className={`${statusColors[booking.status]} border-none uppercase text-[8px] font-black`}>
          {booking.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-indigo-600" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-800">{booking.fabricId}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase">Primary Material</div>
               </div>
            </div>
            <div className="text-right">
               <div className="text-[12px] font-black text-slate-800">{booking.reservedQtyMeters} m</div>
               <div className="text-[8px] font-bold text-slate-400 uppercase">Reserved</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
         <div className="p-2.5 bg-slate-100/50 rounded-lg border border-slate-100">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Booking ID</div>
            <div className="text-[9px] font-black text-slate-700">{booking.bookingId}</div>
         </div>
         <div className="p-2.5 bg-slate-100/50 rounded-lg border border-slate-100">
            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Expires On</div>
            <div className="text-[9px] font-black text-rose-600">{booking.expiryDate}</div>
         </div>
      </div>

      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
         <Briefcase className="w-3.5 h-3.5" /> Supplier: <span className="text-slate-700 underline">{booking.supplierId}</span>
      </div>
    </Card>
  );
}
