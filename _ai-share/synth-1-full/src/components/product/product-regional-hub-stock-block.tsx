'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, ArrowRightLeft, Package, History } from 'lucide-react';
import { getRegionalHubStock } from '@/lib/fashion/regional-hubs';
import type { Product } from '@/lib/types';

export function ProductRegionalHubStockBlock({ product }: { product: Product }) {
  const stock = getRegionalHubStock(product.sku);

  return (
    <Card className="border-border-subtle my-4 border-2 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional B2B Stock Hubs (RF)
          </h4>
        </div>
        <Badge variant="outline" className="border-border-default text-[8px] font-black uppercase">
          Live Inventory
        </Badge>
      </div>

      <div className="space-y-3">
        {stock.hubs.map((hub) => (
          <div key={hub.name} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 border-border-subtle flex h-8 w-8 items-center justify-center rounded-lg border">
                <MapPin className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5 transition-colors" />
              </div>
              <div>
                <div className="text-text-primary mb-1 text-[10px] font-black uppercase leading-none tracking-tight">
                  {hub.name}
                </div>
                <div className="text-text-muted flex items-center gap-1.5 text-[8px] font-bold uppercase">
                  <Clock className="h-2.5 w-2.5" /> {hub.transitDays}{' '}
                  {hub.transitDays === 1 ? 'day' : 'days'} transit
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-text-primary mb-1 text-sm font-black leading-none">
                {hub.available.toLocaleString()}
              </div>
              <div className="text-[8px] font-black uppercase text-emerald-600">Units Avail.</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border-subtle mt-4 flex items-center justify-between border-t pt-4">
        <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase">
          <ArrowRightLeft className="h-3 w-3" /> Inter-hub transfers active
        </div>
        <Badge className="bg-text-primary/90 h-5 cursor-pointer border-none text-[8px] font-black uppercase text-white transition-colors hover:bg-black">
          Request Transfer
        </Badge>
      </div>
    </Card>
  );
}
