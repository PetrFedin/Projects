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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Store Staff Optimizer (AI)</h4>
        </div>
        <Badge className={shift.shiftStatus === 'optimal' ? 'bg-emerald-100 text-emerald-700 border-none uppercase text-[8px]' : 'bg-rose-100 text-rose-700 border-none uppercase text-[8px]'}>
          {shift.shiftStatus}
        </Badge>
      </div>

      <div className="space-y-4 mb-4">
         <div>
            <div className="flex justify-between items-end mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
               <span>Staff Coverage</span>
               <span className="text-slate-900">{shift.availableStaff} / {shift.totalStaffNeeded}</span>
            </div>
            <Progress value={(shift.availableStaff / shift.totalStaffNeeded) * 100} className="h-1.5 bg-slate-100 fill-indigo-500" />
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
               <div className="text-[16px] font-black text-slate-800 leading-none">{shift.peakHours.length}</div>
               <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Peak Hours Today</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="flex -space-x-2 justify-center">
                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">{i}</div>)}
                </div>
               <div className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest leading-none">On-Duty Profile</div>
            </div>
         </div>
      </div>

      {shift.shiftStatus === 'understaffed' && (
        <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 flex items-center gap-2.5 mb-2 shadow-sm">
           <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
           <p className="text-[9px] font-bold text-rose-700 leading-tight">
              <b>Traffic Spike Alert:</b> Additional staff required at 14:00. <span className="underline cursor-pointer">Call Backup</span>
           </p>
        </div>
      )}

      <div className="mt-2 text-[8px] font-black text-slate-400 uppercase flex items-center gap-1.5 opacity-60 italic">
         <Sparkles className="w-3 h-3 text-indigo-400" /> Auto-generated based on historical foot traffic.
      </div>
    </Card>
  );
}
