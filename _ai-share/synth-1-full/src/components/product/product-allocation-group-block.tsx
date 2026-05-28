'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Store, Target, ArrowRight } from 'lucide-react';
import { getAllocationGroups } from '@/lib/fashion/allocation-groups';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProductAllocationGroupBlock({ product }: { product: Product }) {
  const groups = getAllocationGroups();

  return (
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Store Clustering & Allocation
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">B2B Strategy</div>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.groupId}
            className="border-border-subtle flex items-center justify-between gap-4 rounded-xl border bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="text-text-primary mb-0.5 text-[10px] font-black">{group.groupId}</div>
              <div className="text-text-muted flex items-center gap-2 text-[8px] font-bold uppercase">
                <Store className="h-2.5 w-2.5" /> {group.storeCount} Stores
              </div>
            </div>

            <div className="text-right">
              <Badge
                className={cn(
                  group.priority === 'high'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : group.priority === 'medium'
                      ? 'bg-bg-surface2 text-text-secondary'
                      : 'bg-bg-surface2 text-text-muted',
                  'h-4 border-none text-[8px] font-black uppercase'
                )}
              >
                {group.priority} Priority
              </Badge>
              <div className="text-text-primary mt-1 text-[9px] font-black">
                Min: {group.minAssortmentWidth} SKU
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-accent-primary shadow-accent-primary/10 hover:bg-accent-primary mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-all">
        Configure Cluster Mix <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
