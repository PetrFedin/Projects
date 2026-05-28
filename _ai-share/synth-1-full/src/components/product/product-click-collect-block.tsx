'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, MapPin, Clock, Truck, ArrowRight, Activity, Share2 } from 'lucide-react';
import { getClickAndCollectStatus } from '@/lib/fashion/click-collect-logic';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductClickCollectBlock({ product }: { product: Product }) {
  const status = getClickAndCollectStatus(`ORD-${product.sku}-1`);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-sky-50 bg-sky-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Box className="h-16 w-16 text-sky-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-700">
          <Box className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Click & Collect Operations
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-sky-300 text-[8px] font-black uppercase text-sky-600"
        >
          Ready in 24h
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-center rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Store Inventory (Active)
            </div>
            <div className="text-text-primary text-xl font-black">42 Units</div>
            <div className="text-text-secondary mt-1 flex items-center gap-1 text-[7px] font-bold uppercase">
              <MapPin className="h-2.5 w-2.5" /> STORE-MOSCOW-CENTRAL
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Efficiency Status
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-sky-600">
              <Activity className="h-3.5 w-3.5" /> High Pick Speed
            </div>
            <div className="text-text-secondary mt-1 text-[7px] font-bold uppercase">
              Average: 12min to Ready
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-600/5 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-sky-600">
            <Clock className="h-3 w-3" /> Pickup Window Monitor
          </div>
          <p className="text-text-primary text-[10px] font-bold leading-snug">
            Order {status.orderId} will be ready by {status.readyForPickupDate}. Storage limit:{' '}
            {status.storageDaysLimit} days.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-8 flex-1 border-sky-200 text-[8px] font-black uppercase text-sky-600"
          >
            Manage Reservations
          </Button>
          <Button className="h-8 flex-1 bg-sky-600 text-[8px] font-black uppercase text-white shadow-sm hover:bg-sky-700">
            <Truck className="mr-1.5 h-3 w-3" /> Request Re-Allocation
          </Button>
        </div>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-sky-100 pt-4 text-[8px] font-black uppercase">
        <span>Integrated with Store PDA Apps</span>
        <span className="flex items-center gap-1 text-sky-600">
          <Share2 className="h-3 w-3 text-sky-500" /> Live Inventory Sync
        </span>
      </div>
    </Card>
  );
}
