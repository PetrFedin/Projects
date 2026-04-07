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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Truck className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Order Lifecycle Tracker</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Batch</div>
      </div>

      <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {milestones.map((m, i) => (
          <div key={m.id} className="relative flex items-center justify-between group">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10 ${
                m.status === 'completed' ? 'bg-emerald-500 text-white' :
                m.status === 'in_progress' ? 'bg-indigo-600 text-white animate-pulse' :
                'bg-slate-100 text-slate-400'
              }`}>
                {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                 m.id === 'PRODUCTION' ? <Factory className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{m.name}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">Est: {m.estimatedDate}</div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className={`text-[7px] font-black h-3.5 uppercase border-none ${
                m.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                m.status === 'in_progress' ? 'bg-indigo-50 text-indigo-600' :
                'bg-slate-100 text-slate-400'
              }`}>
                {m.status}
              </Badge>
              {m.riskFactor > 0 && (
                <div className="flex items-center gap-1 justify-end mt-1">
                   <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                   <span className="text-[7px] font-black text-amber-600">Risk: {m.riskFactor}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-2 bg-indigo-600/10 rounded-xl flex items-center justify-center gap-2">
         <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
         <span className="text-[8px] font-black text-indigo-700 uppercase tracking-widest">SLA: Production on track (v. 1.0.4)</span>
      </div>
    </Card>
  );
}
