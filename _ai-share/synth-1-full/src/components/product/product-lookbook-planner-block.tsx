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
    <Card className="p-4 border-2 border-stone-200 bg-stone-50/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-stone-600" />
          <h4 className="font-bold text-sm uppercase text-stone-600">Lookbook Project</h4>
        </div>
        <div className="text-[10px] font-black bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 uppercase">
          {lb.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-bold text-stone-800 leading-tight">{lb.name}</div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> {lb.shootingDate}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> {lb.location}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-stone-400 h-full w-[30%]" />
          </div>
          <span className="text-[10px] text-stone-400 font-bold uppercase">Ready</span>
        </div>

        <Button variant="outline" size="sm" className="w-full text-[10px] h-8 border-stone-200 text-stone-700 hover:bg-stone-50">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Add to Shooting List
        </Button>
      </div>
    </Card>
  );
};
