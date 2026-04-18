'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, RefreshCw, Clock, ShieldCheck, ArrowRight, Activity, MapPin } from 'lucide-react';
import { getB2BRepairRequests } from '@/lib/fashion/repair-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductB2BRepairBlock({ product }: { product: Product }) {
  const repairs = getB2BRepairRequests('P-001').filter((r) => r.sku === product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-slate-50 bg-slate-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Wrench className="h-16 w-16 text-slate-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Wrench className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
            B2B Repair & Circularity Hub
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-slate-300 text-[8px] font-black uppercase text-slate-500"
        >
          Service Level: 48h
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
          <Activity className="h-3 w-3" /> Active Service Tickets
        </div>

        {repairs.length > 0 ? (
          <div className="space-y-2">
            {repairs.map((rep) => (
              <div
                key={rep.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-800">
                    {rep.id} • {rep.type}
                  </div>
                  {rep.trackingNumber && (
                    <div className="mt-0.5 text-[8px] font-bold uppercase text-slate-500">
                      Track: {rep.trackingNumber}
                    </div>
                  )}
                </div>
                <Badge
                  className={cn(
                    'h-3.5 border-none text-[7px]',
                    rep.status === 'fixing'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-700 text-slate-400'
                  )}
                >
                  {rep.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-100 p-6 text-center text-[9px] font-black uppercase text-slate-400">
            No active service requests for this SKU
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-8 border-slate-200 text-[8px] font-black uppercase text-slate-600"
        >
          Submit Defect Ticket
        </Button>
        <Button
          variant="outline"
          className="h-8 border-slate-200 text-[8px] font-black uppercase text-slate-600"
        >
          Request Recycling
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Integrated with RU EDO & Logistics</span>
        <span className="flex items-center gap-1 text-slate-600">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> QA Policy V2.1
        </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
