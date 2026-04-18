'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Star, Clock, Calendar, MoveRight, ShoppingBag, Sparkles } from 'lucide-react';
import { getStoreVipFittings } from '@/lib/fashion/store-vip-fittings';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProductStoreVipFittingBlock({ product }: { product: Product }) {
  const appointments = getStoreVipFittings('STORE-MSK-MAIN');

  return (
    <Card className="border-accent-primary/20 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5">
        <Star className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <Star className="fill-accent-primary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            VIP In-Store Appointments
          </h4>
        </div>
        <Badge className="bg-accent-primary/15 text-accent-primary border-none text-[8px] font-black uppercase">
          Today's Schedule
        </Badge>
      </div>

      <div className="mb-4 space-y-3">
        {appointments.map((app) => (
          <div
            key={app.appointmentId}
            className="border-accent-primary/15 group flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 text-text-muted flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-black">
                {app.clientId[0]}
              </div>
              <div>
                <div className="text-text-primary text-[10px] font-black">{app.clientId}</div>
                <div className="text-text-muted flex items-center gap-1.5 text-[8px] font-bold uppercase">
                  <Clock className="h-2.5 w-2.5" /> {app.timeSlot.split(' ')[1]}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge
                variant="outline"
                className={cn(
                  app.status === 'active'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-bg-surface2 text-text-secondary',
                  'h-4 border-none px-1 text-[7px] font-black uppercase'
                )}
              >
                {app.status}
              </Badge>
              <div className="text-accent-primary mt-1 text-[8px] font-black uppercase tracking-tighter">
                Stylist: {app.stylistId.split('-')[1]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-accent-primary/20 hover:bg-accent-primary/10 group mb-2 flex cursor-pointer items-center justify-between rounded-xl border bg-white p-3 transition-colors">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-accent-primary h-4 w-4" />
          <div className="text-text-primary text-[10px] font-bold">
            Pre-selected for items: 2 SKU
          </div>
        </div>
        <MoveRight className="text-accent-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="text-text-muted mt-2 flex items-center justify-center gap-1.5 text-[8px] font-black uppercase italic tracking-widest">
        <Sparkles className="text-accent-primary h-3 w-3" /> Stylist hub sync active
      </div>
    </Card>
  );
}
