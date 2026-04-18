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
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Wrench className="text-text-secondary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-primary flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
            B2B Repair & Circularity Hub
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-border-default text-text-secondary text-[8px] font-black uppercase"
        >
          Service Level: 48h
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
          <Activity className="h-3 w-3" /> Active Service Tickets
        </div>

        {repairs.length > 0 ? (
          <div className="space-y-2">
            {repairs.map((rep) => (
              <div
                key={rep.id}
                className="border-border-default flex items-center justify-between rounded-xl border bg-white/80 p-3 shadow-sm"
              >
                <div>
                  <div className="text-text-primary flex items-center gap-1.5 text-[10px] font-black uppercase">
                    {rep.id} • {rep.type}
                  </div>
                  {rep.trackingNumber && (
                    <div className="text-text-secondary mt-0.5 text-[8px] font-bold uppercase">
                      Track: {rep.trackingNumber}
                    </div>
                  )}
                </div>
                <Badge
                  className={cn(
                    'h-3.5 border-none text-[7px]',
                    rep.status === 'fixing'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-text-primary/75 text-text-muted'
                  )}
                >
                  {rep.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-text-muted border-border-subtle rounded-xl border-2 border-dashed p-6 text-center text-[9px] font-black uppercase">
            No active service requests for this SKU
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="border-border-default text-text-secondary h-8 text-[8px] font-black uppercase"
        >
          Submit Defect Ticket
        </Button>
        <Button
          variant="outline"
          className="border-border-default text-text-secondary h-8 text-[8px] font-black uppercase"
        >
          Request Recycling
        </Button>
      </div>

      <div className="border-border-subtle text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[8px] font-black uppercase">
        <span>Integrated with RU EDO & Logistics</span>
        <span className="text-text-secondary flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> QA Policy V2.1
        </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
