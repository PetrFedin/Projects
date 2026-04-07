'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Truck, MapPin, Search, ChevronRight } from 'lucide-react';
import { calculateLocalDelivery } from '@/lib/fashion/local-delivery-rates';

export const ProductLocalDeliveryBlock: React.FC = () => {
  const rates = calculateLocalDelivery('Москва');
  
  return (
    <Card className="p-4 border-2 border-emerald-50 bg-emerald-50/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-xs uppercase text-emerald-700 tracking-tight">Доставка по РФ</h4>
        </div>
        <button className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 hover:underline">
          <MapPin className="w-3 h-3" /> Выбрать город <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {rates.map((rate, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex flex-col">
              <div className="text-[11px] font-bold text-slate-700">{rate.service}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">{rate.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-800">{rate.price} ₽</div>
              <div className="text-[10px] text-emerald-600 font-bold">{rate.days} дн.</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-white rounded-md border border-emerald-100 flex items-center gap-2">
        <div className="p-1 rounded bg-emerald-50">
          <Search className="w-3 h-3 text-emerald-600" />
        </div>
        <input 
          placeholder="Поиск города..." 
          className="bg-transparent border-none text-[11px] outline-none flex-1 placeholder:text-slate-300"
        />
      </div>
    </Card>
  );
};
