'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Map, Truck, Package, Clock, ShieldCheck } from 'lucide-react';
import { getRegionalStocks } from '@/lib/fashion/local-logistics';

export const ProductRegionalStockBlock: React.FC<{ product: Product }> = ({ product }) => {
  const stocks = getRegionalStocks(product);
  
  return (
    <Card className="p-4 border-2 border-sky-50 bg-sky-50/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-sky-600" />
          <h4 className="font-bold text-xs uppercase text-sky-700 tracking-tight">Региональные склады (РФ)</h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-sky-500 font-black uppercase">
          <Clock className="w-3 h-3" /> Real-time Sync
        </div>
      </div>

      <div className="space-y-2.5">
        {stocks.map((stock, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
              <div className="text-[11px] font-bold text-slate-600">{stock.warehouse}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-slate-400 font-semibold">
                Доставка {stock.deliveryDays} дн.
              </div>
              <div className="text-xs font-black text-slate-700 w-8 text-right">
                {stock.quantity > 0 ? `${stock.quantity} шт.` : '0'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase">
          <Truck className="w-3 h-3" /> CDEK / Boxberry / PickPoint
        </div>
        <div className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase">
          <ShieldCheck className="w-3 h-3" /> Insured Delivery
        </div>
      </div>
    </Card>
  );
};
