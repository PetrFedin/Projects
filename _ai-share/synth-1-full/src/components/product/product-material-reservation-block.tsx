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
    reserved: 'bg-accent-primary/15 text-accent-primary',
    released: 'bg-bg-surface2 text-text-secondary',
    converted_to_po: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Raw Material Booking (Production)
          </h4>
        </div>
        <Badge
          className={`${statusColors[booking.status]} border-none text-[8px] font-black uppercase`}
        >
          {booking.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="border-border-subtle mb-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Scissors className="text-accent-primary h-4 w-4" />
            </div>
            <div>
              <div className="text-text-primary text-[10px] font-black">{booking.fabricId}</div>
              <div className="text-text-muted text-[8px] font-bold uppercase">Primary Material</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-text-primary text-[12px] font-black">
              {booking.reservedQtyMeters} m
            </div>
            <div className="text-text-muted text-[8px] font-bold uppercase">Reserved</div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="bg-bg-surface2/50 border-border-subtle rounded-lg border p-2.5">
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase">Booking ID</div>
          <div className="text-text-primary text-[9px] font-black">{booking.bookingId}</div>
        </div>
        <div className="bg-bg-surface2/50 border-border-subtle rounded-lg border p-2.5">
          <div className="text-text-muted mb-1 text-[8px] font-black uppercase">Expires On</div>
          <div className="text-[9px] font-black text-rose-600">{booking.expiryDate}</div>
        </div>
      </div>

      <div className="text-text-secondary flex items-center gap-2 text-[9px] font-bold">
        <Briefcase className="h-3.5 w-3.5" /> Supplier:{' '}
        <span className="text-text-primary underline">{booking.supplierId}</span>
      </div>
    </Card>
  );
}
