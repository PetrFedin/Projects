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
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Activity className="w-16 h-16 text-emerald-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Activity className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Pre-Order Production Tracker</h4>
        </div>
        <Badge className="bg-emerald-600 text-white text-[8px] font-black border-none uppercase">Order: SS26-Bulk</Badge>
      </div>

      <div className="space-y-4">
         {milestones.map((m, i) => (
           <div key={m.id} className="relative">
              <div className="flex justify-between items-center mb-1.5">
                 <div className="flex items-center gap-2">
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : m.status === 'in_progress' ? (
                      <Play className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className={cn("text-[9px] font-black uppercase", m.status === 'completed' ? 'text-slate-400' : 'text-slate-800')}>
                       {m.label}
                    </span>
                 </div>
                 <div className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> {m.dueDate}
                 </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <Progress value={m.progressPercent} className="h-1 flex-1" />
                 <span className="text-[8px] font-black text-slate-500 w-6 text-right">{m.progressPercent}%</span>
              </div>
              
              {i < milestones.length - 1 && (
                <div className="absolute left-[7px] top-5 w-[1px] h-4 bg-slate-200" />
              )}
           </div>
         ))}
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Estimated Delivery: June 20, 2026</span>
         <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> QA Protocol Signed
         </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
