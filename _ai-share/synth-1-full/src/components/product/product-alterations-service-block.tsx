'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, MapPin, Star, Calendar, ChevronRight, Ruler } from 'lucide-react';
import { getAlterationServices } from '@/lib/fashion/alterations-network';
import { Button } from '@/components/ui/button';

export const ProductAlterationsServiceBlock: React.FC<{ product: Product }> = ({ product }) => {
  const ateliers = getAlterationServices(product);

  return (
    <Card className="relative overflow-hidden border-2 border-amber-50 bg-amber-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Scissors className="h-12 w-12 text-amber-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-amber-700">
            Подгонка по фигуре (Premium)
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-500">
          <MapPin className="h-3 w-3" /> Near You
        </div>
      </div>

      <div className="space-y-3">
        {ateliers.map((a, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl border border-amber-100 bg-white p-3 shadow-sm transition-all hover:border-amber-300"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex flex-col">
                <div className="text-sm font-black tracking-tight text-slate-800">
                  {a.atelierName}
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase text-slate-400">
                  {a.distanceKm} km away
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                <Star className="h-3 w-3 fill-amber-500" /> 4.9
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {a.availableServices.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="h-3.5 border-amber-50 bg-amber-50/50 text-[8px] font-black uppercase text-amber-700"
                >
                  {s}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-2">
              <div className="text-[10px] font-black uppercase text-slate-400">
                From {a.estimatedPrice} ₽
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[9px] font-black uppercase text-amber-600 hover:bg-amber-50"
              >
                Book Now <ChevronRight className="ml-1 h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-amber-600 p-2.5 text-white shadow-md transition-colors hover:bg-amber-700">
        <Ruler className="h-5 w-5 opacity-80" />
        <div className="flex-1">
          <div className="mb-0.5 text-[10px] font-black uppercase leading-none">
            VIP Home Service
          </div>
          <div className="text-[11px] font-medium leading-none">Вызвать портного на дом</div>
        </div>
        <ChevronRight className="h-4 w-4" />
      </div>
    </Card>
  );
};
