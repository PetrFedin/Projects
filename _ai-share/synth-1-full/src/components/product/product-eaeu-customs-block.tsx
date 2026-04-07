'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Calculator, Info, ShieldCheck, Truck } from 'lucide-react';
import { calculateEaeuCustomsValue } from '@/lib/fashion/eaeu-customs-calc';
import type { Product } from '@/lib/types';

export function ProductEaeuCustomsBlock({ product }: { product: Product }) {
  const customs = calculateEaeuCustomsValue(product.sku, product.price * 0.55, 100);

  return (
    <Card className="p-4 border-2 border-blue-50 bg-blue-50/10 shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">EAEU Customs Value (Estimator)</h4>
        </div>
        <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black border-none uppercase">
          Import/Export RU-KZ-BY
        </Badge>
      </div>

      <div className="space-y-2.5">
         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
            <span>Transaction Value</span>
            <span>{customs.transactionValue.toLocaleString()} ₽</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
            <span>Duty ({customs.dutyRatePercent}%)</span>
            <span>{(customs.totalCustomsValue * (customs.dutyRatePercent/100)).toLocaleString()} ₽</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
            <span>VAT ({customs.vatRatePercent}%)</span>
            <span>{((customs.totalCustomsValue + (customs.totalCustomsValue * (customs.dutyRatePercent/100))) * (customs.vatRatePercent/100)).toLocaleString()} ₽</span>
         </div>
         <div className="pt-2 border-t border-blue-100 flex justify-between items-center">
            <div className="text-[10px] font-black uppercase text-blue-700">Estimated Total Tax</div>
            <div className="text-sm font-black text-blue-800">{customs.estimatedTotalTax.toLocaleString()} ₽</div>
         </div>
      </div>

      <div className="mt-4 p-2.5 bg-white rounded-lg border border-blue-50 flex gap-2 items-start">
         <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
         <div className="text-[9px] text-blue-700 font-medium leading-tight">
            <b>Логистический расчет:</b> Указана ориентировочная стоимость таможенной очистки при ввозе партии в РФ. Точный расчет зависит от ТН ВЭД кода.
         </div>
      </div>
    </Card>
  );
}
