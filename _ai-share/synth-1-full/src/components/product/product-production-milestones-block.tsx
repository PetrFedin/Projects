'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, CheckCircle2, AlertTriangle, Play, Calendar } from 'lucide-react';
import { getProductionMilestones } from '@/lib/fashion/production-milestones';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductProductionMilestonesBlock({ product }: { product: Product }) {
  const milestones = getProductionMilestones('ORDER-SS26-001');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Activity className="h-16 w-16 text-emerald-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <Activity className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Pre-Order Production Tracker
          </h4>
        </div>
        <Badge className="border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
          Order: SS26-Bulk
        </Badge>
      </div>

      <div className="space-y-4">
        {milestones.map((m, i) => (
          <div key={m.id} className="relative">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {m.status === 'completed' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : m.status === 'in_progress' ? (
                  <Play className="h-3.5 w-3.5 animate-pulse text-blue-500" />
                ) : (
                  <Clock className="text-text-muted h-3.5 w-3.5" />
                )}
                <span
                  className={cn(
                    'text-[9px] font-black uppercase',
                    m.status === 'completed' ? 'text-text-muted' : 'text-text-primary'
                  )}
                >
                  {m.label}
                </span>
              </div>
              <div className="text-text-muted flex items-center gap-1 text-[8px] font-bold uppercase">
                <Calendar className="h-2.5 w-2.5" /> {m.dueDate}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Progress value={m.progressPercent} className="h-1 flex-1" />
              <span className="text-text-secondary w-6 text-right text-[8px] font-black">
                {m.progressPercent}%
              </span>
            </div>

            {i < milestones.length - 1 && (
              <div className="bg-border-subtle absolute left-[7px] top-5 h-4 w-[1px]" />
            )}
          </div>
        ))}
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 text-[8px] font-black uppercase">
        <span>Estimated Delivery: June 20, 2026</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <CheckCircle2 className="h-3 w-3" /> QA Protocol Signed
        </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
