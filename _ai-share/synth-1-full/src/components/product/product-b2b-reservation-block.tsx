'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Box, Calendar, ShieldCheck, RefreshCw, BarChart3 } from 'lucide-react';
import { getRegionalHubFulfillment } from '@/lib/fashion/regional-hubs';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductB2BReservationBlock({ product }: { product: Product }) {
  const hubs = getRegionalHubFulfillment(product.sku);

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional Hub Stock Reservation
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">B2B Inventory Hubs</div>
      </div>

      <div className="space-y-4">
        {hubs.map((hub) => (
          <div
            key={hub.hubId}
            className="border-border-subtle rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Box className="text-accent-primary h-3.5 w-3.5" />
                <div className="text-text-primary text-[10px] font-black uppercase">
                  {hub.hubId}
                </div>
              </div>
              <Badge
                variant="outline"
                className="h-4 border-emerald-100 bg-emerald-50 text-[8px] font-black text-emerald-700"
              >
                ACTIVE
              </Badge>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-text-primary text-[14px] font-black leading-none">
                  {hub.availableForB2B}
                </div>
                <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                  Available B2B
                </div>
              </div>
              <div className="text-right">
                <div className="text-accent-primary text-[14px] font-black leading-none">
                  {hub.reservedForRetail}
                </div>
                <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                  Retail Buffer
                </div>
              </div>
            </div>

            <div>
              <div className="text-text-muted mb-1 flex items-center justify-between text-[8px] font-bold uppercase">
                <span>Hub Capacity Utilization</span>
                <span>{Math.round((hub.availableForB2B / hub.stockInHub) * 100)}%</span>
              </div>
              <Progress
                value={(hub.availableForB2B / hub.stockInHub) * 100}
                className="bg-bg-surface2 fill-accent-primary h-1"
              />
            </div>

            <div className="text-text-muted mt-3 flex items-center gap-1.5 text-[8px] font-black uppercase">
              <Calendar className="h-3 w-3" /> Next Arrival: {hub.nextReplenishmentDate}
            </div>
          </div>
        ))}
      </div>

      <div className="border-border-subtle text-text-muted mt-4 flex items-center justify-between border-t pt-3 text-[8px] font-black uppercase">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="text-accent-primary h-3 w-3" /> Secure B2B Reservation System
        </div>
        <button className="text-accent-primary flex items-center gap-1 hover:underline">
          <RefreshCw className="h-2.5 w-2.5" /> Force Sync
        </button>
      </div>
    </Card>
  );
}
