'use client';

import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function OrderAllocationTab() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1 text-left">
          <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
            Pre-Allocation Plan
          </h4>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Distribute order items across your physical locations
          </p>
        </div>
        <Button className="bg-text-primary h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white">
          <Plus className="h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-left">
        {[
          { name: 'Flagship Store (Tverskaya)', units: 140, capacity: 85 },
          { name: 'Dep. Store (Aviapark)', units: 85, capacity: 42 },
          { name: 'Concept Store (Atrium)', units: 45, capacity: 90 },
        ].map((loc, i) => (
          <Card key={i} className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <MapPin className="text-accent-primary h-5 w-5" />
              <Badge className="bg-bg-surface2 text-text-secondary border-none px-2 text-[8px] font-black uppercase tracking-widest">
                {loc.capacity}% UTILIZED
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-text-primary text-sm font-black uppercase">{loc.name}</p>
              <p className="text-text-primary text-base font-black">{loc.units}</p>
              <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                Units Allocated
              </p>
            </div>
            <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-accent-primary h-full" style={{ width: `${loc.capacity}%` }} />
            </div>
            <Button
              variant="outline"
              className="border-border-default h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              Edit Distribution
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
