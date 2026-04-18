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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Store Clustering & Allocation
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">B2B Strategy</div>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.groupId}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[10px] font-black text-slate-800">{group.groupId}</div>
              <div className="flex items-center gap-2 text-[8px] font-bold uppercase text-slate-400">
                <Store className="h-2.5 w-2.5" /> {group.storeCount} Stores
              </div>
            </div>

            <div className="text-right">
              <Badge
                className={
                  group.priority === 'high'
                    ? 'bg-indigo-100 text-indigo-700'
                    : group.priority === 'medium'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-slate-50 text-slate-400'
                }
                className="h-4 border-none text-[8px] font-black uppercase"
              >
                {group.priority} Priority
              </Badge>
              <div className="mt-1 text-[9px] font-black text-slate-700">
                Min: {group.minAssortmentWidth} SKU
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-[9px] font-black uppercase text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
        Configure Cluster Mix <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
