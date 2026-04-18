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
    <Card className="my-4 border-2 border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-slate-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Regional B2B Stock Hubs (RF)
          </h4>
        </div>
        <Badge variant="outline" className="border-slate-200 text-[8px] font-black uppercase">
          Live Inventory
        </Badge>
      </div>

      <div className="space-y-3">
        {stock.hubs.map((hub) => (
          <div key={hub.name} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                <MapPin className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-500" />
              </div>
              <div>
                <div className="mb-1 text-[10px] font-black uppercase leading-none tracking-tight text-slate-800">
                  {hub.name}
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-400">
                  <Clock className="h-2.5 w-2.5" /> {hub.transitDays}{' '}
                  {hub.transitDays === 1 ? 'day' : 'days'} transit
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-sm font-black leading-none text-slate-800">
                {hub.available.toLocaleString()}
              </div>
              <div className="text-[8px] font-black uppercase text-emerald-600">Units Avail.</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-400">
          <ArrowRightLeft className="h-3 w-3" /> Inter-hub transfers active
        </div>
        <Badge className="h-5 cursor-pointer border-none bg-slate-800 text-[8px] font-black uppercase text-white transition-colors hover:bg-black">
          Request Transfer
        </Badge>
      </div>
    </Card>
  );
}
