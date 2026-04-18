'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Camera, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { createLookbookProject } from '@/lib/fashion/lookbook-planner';
import { Button } from '@/components/ui/button';

export const ProductLookbookPlannerBlock: React.FC<{ product: Product }> = ({ product }) => {
  const lb = createLookbookProject(product);

  return (
    <Card className="border-2 border-stone-200 bg-stone-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-stone-600" />
          <h4 className="text-sm font-bold uppercase text-stone-600">Lookbook Project</h4>
        </div>
        <div className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-stone-500">
          {lb.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-bold leading-tight text-stone-800">{lb.name}</div>

        <div className="grid grid-cols-2 gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> {lb.shootingDate}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> {lb.location}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div className="h-full w-[30%] bg-stone-400" />
          </div>
          <span className="text-[10px] font-bold uppercase text-stone-400">Ready</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full border-stone-200 text-[10px] text-stone-700 hover:bg-stone-50"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" /> Add to Shooting List
        </Button>
      </div>
    </Card>
  );
};
