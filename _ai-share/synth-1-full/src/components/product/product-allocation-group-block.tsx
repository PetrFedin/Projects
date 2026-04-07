'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Store, Target, ArrowRight } from 'lucide-react';
import { getAllocationGroups } from '@/lib/fashion/allocation-groups';
import type { Product } from '@/lib/types';

export function ProductAllocationGroupBlock({ product }: { product: Product }) {
  const groups = getAllocationGroups();

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Store Clustering & Allocation</h4>
        </div>
        <div className="text-[8px] font-black text-slate-400 uppercase">B2B Strategy</div>
      </div>

      <div className="space-y-3">
         {groups.map((group) => (
           <div key={group.groupId} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                 <div className="text-[10px] font-black text-slate-800 mb-0.5">{group.groupId}</div>
                 <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase">
                    <Store className="w-2.5 h-2.5" /> {group.storeCount} Stores
                 </div>
              </div>
              
              <div className="text-right">
                 <Badge className={
                   group.priority === 'high' ? 'bg-indigo-100 text-indigo-700' :
                   group.priority === 'medium' ? 'bg-slate-100 text-slate-600' :
                   'bg-slate-50 text-slate-400'
                 } className="border-none text-[8px] h-4 font-black uppercase">
                   {group.priority} Priority
                 </Badge>
                 <div className="text-[9px] font-black text-slate-700 mt-1">Min: {group.minAssortmentWidth} SKU</div>
              </div>
           </div>
         ))}
      </div>

      <button className="w-full mt-4 h-9 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
         Configure Cluster Mix <ArrowRight className="w-3 h-3" />
      </button>
    </Card>
  );
}
