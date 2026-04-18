'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Map, Truck, Package, Clock, ShieldCheck } from 'lucide-react';
import { getRegionalStocks } from '@/lib/fashion/local-logistics';

export const ProductRegionalStockBlock: React.FC<{ product: Product }> = ({ product }) => {
  const stocks = getRegionalStocks(product);

  return (
    <Card className="border-2 border-sky-50 bg-sky-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-sky-700">
            Региональные склады (РФ)
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black uppercase text-sky-500">
          <Clock className="h-3 w-3" /> Real-time Sync
        </div>
      </div>

      <div className="space-y-2.5">
        {stocks.map((stock, idx) => (
          <div key={idx} className="group flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-400 transition-transform group-hover:scale-125" />
<<<<<<< HEAD
              <div className="text-[11px] font-bold text-slate-600">{stock.warehouse}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-semibold text-slate-400">
                Доставка {stock.deliveryDays} дн.
              </div>
              <div className="w-8 text-right text-xs font-black text-slate-700">
=======
              <div className="text-text-secondary text-[11px] font-bold">{stock.warehouse}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-text-muted text-[10px] font-semibold">
                Доставка {stock.deliveryDays} дн.
              </div>
              <div className="text-text-primary w-8 text-right text-xs font-black">
>>>>>>> recover/cabinet-wip-from-stash
                {stock.quantity > 0 ? `${stock.quantity} шт.` : '0'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sky-100 pt-3">
<<<<<<< HEAD
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-400">
=======
        <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          <Truck className="h-3 w-3" /> CDEK / Boxberry / PickPoint
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-green-600">
          <ShieldCheck className="h-3 w-3" /> Insured Delivery
        </div>
      </div>
    </Card>
  );
};
