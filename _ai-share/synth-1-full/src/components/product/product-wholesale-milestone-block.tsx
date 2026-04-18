'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, CheckCircle2, Clock, Factory, ShieldCheck, AlertCircle } from 'lucide-react';
import { getWholesaleMilestones } from '@/lib/fashion/wholesale-milestones';
import type { Product } from '@/lib/types';

export function ProductWholesaleMilestoneBlock({ product }: { product: Product }) {
  const milestones = getWholesaleMilestones('PO-2026-001');

  return (
    <Card className="border-border-subtle bg-bg-surface2/5 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Order Lifecycle Tracker
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
          Active Batch
        </div>
      </div>

      <div className="before:via-border-default relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:to-transparent">
        {milestones.map((m, i) => (
          <div key={m.id} className="group relative flex items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div
                className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white ${
                  m.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : m.status === 'in_progress'
                      ? 'bg-accent-primary animate-pulse text-white'
                      : 'bg-bg-surface2 text-text-muted'
                }`}
              >
                {m.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : m.id === 'PRODUCTION' ? (
                  <Factory className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-text-primary mb-1 text-[10px] font-black uppercase leading-none tracking-tight">
                  {m.name}
                </div>
                <div className="text-text-muted text-[8px] font-bold uppercase">
                  Est: {m.estimatedDate}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge
                className={`h-3.5 border-none text-[7px] font-black uppercase ${
                  m.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-600'
                    : m.status === 'in_progress'
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'bg-bg-surface2 text-text-muted'
                }`}
              >
                {m.status}
              </Badge>
              {m.riskFactor > 0 && (
                <div className="mt-1 flex items-center justify-end gap-1">
                  <AlertCircle className="h-2.5 w-2.5 text-amber-500" />
                  <span className="text-[7px] font-black text-amber-600">
                    Risk: {m.riskFactor}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-accent-primary/10 mt-4 flex items-center justify-center gap-2 rounded-xl p-2">
        <ShieldCheck className="text-accent-primary h-3.5 w-3.5" />
        <span className="text-accent-primary text-[8px] font-black uppercase tracking-widest">
          SLA: Production on track (v. 1.0.4)
        </span>
      </div>
    </Card>
  );
}
