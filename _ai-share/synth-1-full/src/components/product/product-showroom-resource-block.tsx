'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  Briefcase,
  Plus,
  Package,
  TrendingUp,
  Heart,
  MessageSquare,
  Zap,
  Target,
  AlertTriangle,
  Activity,
  BarChart3,
  ArrowUpRight,
  MousePointer2,
  Leaf,
  Hammer,
  Box,
  LayoutGrid,
} from 'lucide-react';
import { getShowroomResourceAvailability } from '@/lib/fashion/showroom-resource-management';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductShowroomResourceBlock({ product }: { product: Product }) {
  const resources = getShowroomResourceAvailability();

  return (
    <Card className="border-border-subtle bg-bg-surface2/10 group relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Users className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Showroom Resource Capacity
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
          Live Schedule
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((r) => (
          <div
            key={r.resourceId}
            className="group/item border-border-subtle relative overflow-hidden rounded-2xl border bg-white p-3 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${r.availabilityPercent > 50 ? 'bg-emerald-100' : 'bg-amber-100'}`}
                >
                  {r.type === 'stylist' ? (
                    <Users
                      className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                    />
                  ) : r.type === 'fitting_room' ? (
                    <LayoutGrid
                      className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                    />
                  ) : (
                    <Box
                      className={`h-4 w-4 ${r.availabilityPercent > 50 ? 'text-emerald-600' : 'text-amber-600'}`}
                    />
                  )}
                </div>
                <div>
                  <div className="text-text-primary group-hover/item:text-accent-primary text-[11px] font-black leading-tight transition-colors">
                    {r.name}
                  </div>
                  <div className="text-text-muted text-[8px] font-bold uppercase tracking-wider">
                    Next: {r.nextAvailableSlot}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-text-primary text-[11px] font-black">
                  {r.availabilityPercent}%
                </div>
                <div className="text-text-muted text-[7px] font-black uppercase">Load</div>
              </div>
            </div>

            <Progress
              value={r.availabilityPercent}
              className={`h-1.5 rounded-full ${r.availabilityPercent > 50 ? 'fill-emerald-500' : 'fill-amber-500'}`}
            />
          </div>
        ))}
      </div>

      <div className="bg-text-primary group/btn relative mt-4 flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl p-3 text-white shadow-lg shadow-md">
        <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover/btn:scale-125">
          <Plus className="h-12 w-12 text-white" />
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest">
          Request Extra Slots
        </div>
        <Plus className="relative z-10 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
      </div>
    </Card>
  );
}
