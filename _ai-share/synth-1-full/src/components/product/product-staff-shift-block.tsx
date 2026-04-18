'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { getStaffShiftOptimization } from '@/lib/fashion/staff-schedule-optimizer';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductStaffShiftBlock({ product }: { product: Product }) {
  const shift = getStaffShiftOptimization('STORE-MOSCOW-MAIN');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Store Staff Optimizer (AI)
          </h4>
        </div>
        <Badge
          className={
            shift.shiftStatus === 'optimal'
              ? 'border-none bg-emerald-100 text-[8px] uppercase text-emerald-700'
              : 'border-none bg-rose-100 text-[8px] uppercase text-rose-700'
          }
        >
          {shift.shiftStatus}
        </Badge>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <div className="mb-1 flex items-end justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
            <span>Staff Coverage</span>
            <span className="text-slate-900">
              {shift.availableStaff} / {shift.totalStaffNeeded}
            </span>
          </div>
          <Progress
            value={(shift.availableStaff / shift.totalStaffNeeded) * 100}
            className="h-1.5 bg-slate-100 fill-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="text-[16px] font-black leading-none text-slate-800">
              {shift.peakHours.length}
            </div>
            <div className="mt-1 text-[8px] font-black uppercase text-slate-400">
              Peak Hours Today
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
            <div className="flex justify-center -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[8px] font-bold text-slate-500"
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="mt-1 text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
              On-Duty Profile
            </div>
          </div>
        </div>
      </div>

      {shift.shiftStatus === 'understaffed' && (
        <div className="mb-2 flex items-center gap-2.5 rounded-lg border border-rose-100 bg-rose-50/50 p-3 shadow-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
          <p className="text-[9px] font-bold leading-tight text-rose-700">
            <b>Traffic Spike Alert:</b> Additional staff required at 14:00.{' '}
            <span className="cursor-pointer underline">Call Backup</span>
          </p>
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase italic text-slate-400 opacity-60">
        <Sparkles className="h-3 w-3 text-indigo-400" /> Auto-generated based on historical foot
        traffic.
      </div>
    </Card>
  );
}
