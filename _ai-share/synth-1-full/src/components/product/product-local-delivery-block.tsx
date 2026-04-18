'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Truck, MapPin, Search, ChevronRight } from 'lucide-react';
import { calculateLocalDelivery } from '@/lib/fashion/local-delivery-rates';

export const ProductLocalDeliveryBlock: React.FC = () => {
  const rates = calculateLocalDelivery('Москва');

  return (
    <Card className="border-2 border-emerald-50 bg-emerald-50/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-emerald-700">
            Доставка по РФ
          </h4>
        </div>
        <button className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:underline">
          <MapPin className="h-3 w-3" /> Выбрать город <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {rates.map((rate, idx) => (
          <div key={idx} className="group flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-text-primary text-[11px] font-bold">{rate.service}</div>
              <div className="text-text-muted text-[9px] font-bold uppercase">{rate.type}</div>
            </div>
            <div className="text-right">
              <div className="text-text-primary text-sm font-black">{rate.price} ₽</div>
              <div className="text-[10px] font-bold text-emerald-600">{rate.days} дн.</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-100 bg-white p-2">
        <div className="rounded bg-emerald-50 p-1">
          <Search className="h-3 w-3 text-emerald-600" />
        </div>
        <input
          placeholder="Поиск города..."
          className="placeholder:text-text-muted flex-1 border-none bg-transparent text-[11px] outline-none"
        />
      </div>
    </Card>
  );
};
