'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Briefcase, Plus, Package, TrendingUp, Heart, MessageSquare, Zap, Target, AlertTriangle, Activity, BarChart3, ArrowUpRight, MousePointer2, Leaf, Hammer, Box, LayoutGrid } from 'lucide-react';
import { getShowroomResourceAvailability } from '@/lib/fashion/showroom-resource-management';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductShowroomResourceBlock({ product }: { product: Product }) {
  const resources = getShowroomResourceAvailability();

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Showroom Resource Capacity</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Schedule</div>
      </div>

      <div className="space-y-4">
         {resources.map((r) => (
           <div key={r.resourceId} className="group/item p-3 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${r.availabilityPercent > 50 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                       {r.type === 'stylist' ? <Users className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} /> : 
                        r.type === 'fitting_room' ? <LayoutGrid className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} /> : 
                        <Box className={`w-4 h-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`} />}
                    </div>
                    <div>
                       <div className="text-[11px] font-black text-slate-800 leading-tight group-hover/item:text-indigo-600 transition-colors">{r.name}</div>
                       <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Next: {r.nextAvailableSlot}</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[11px] font-black text-slate-800">{r.availabilityPercent}%</div>
                    <div className="text-[7px] font-black text-slate-400 uppercase">Load</div>
                 </div>
              </div>
              
              <Progress value={r.availabilityPercent} className={`h-1.5 rounded-full ${r.availabilityPercent > 50 ? 'fill-emerald-500' : 'fill-amber-500'}`} />
           </div>
         ))}
      </div>

      <div className="mt-4 p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-slate-200 relative overflow-hidden group/btn cursor-pointer">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/btn:scale-125 transition-transform">
            <Plus className="w-12 h-12 text-white" />
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest relative z-10">Request Extra Slots</div>
         <Plus className="w-4 h-4 relative z-10 group-hover/btn:rotate-90 transition-transform" />
      </div>
    </Card>
  );
}
