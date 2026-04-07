'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, AlertCircle, Clock, ShoppingBag } from 'lucide-react';
import { getLaunchReadiness } from '@/lib/fashion/launch-readiness';

export const ProductLaunchReadinessBlock: React.FC<{ product: Product }> = ({ product }) => {
  const r = getLaunchReadiness(product);
  
  const statusColors: Record<string, string> = {
    'on_track': 'bg-green-50 text-green-700 border-green-200',
    'at_risk': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'delayed': 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-xs uppercase text-indigo-700 tracking-tight">Season Launch Readiness</h4>
        </div>
        <Badge variant="outline" className={`text-[9px] font-black uppercase ${statusColors[r.launchStatus]}`}>
          {r.launchStatus.replace('_', ' ')}
        </Badge>
      </div>

      <div className="mb-4">
         <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5">Target Holiday (RF)</div>
         <div className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-400" /> {r.targetHoliday}
         </div>
      </div>

      <div className="space-y-2.5">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
            <span>Overall Readiness</span>
            <span className="text-indigo-600">{r.stockReadiness}%</span>
         </div>
         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${r.stockReadiness}%` }} />
         </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
         <div className={`p-2 rounded border flex items-center justify-between ${r.marketingContentReady ? 'bg-white border-green-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <span className="text-[9px] font-black text-slate-500 uppercase">Content</span>
            {r.marketingContentReady ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3 text-slate-300" />}
         </div>
         <div className={`p-2 rounded border flex items-center justify-between ${r.honestMarkReady ? 'bg-white border-green-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <span className="text-[9px] font-black text-slate-500 uppercase">Honest Mark</span>
            {r.honestMarkReady ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Clock className="w-3 h-3 text-slate-300" />}
         </div>
      </div>
    </Card>
  );
};
