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
    <Card className="my-4 border-2 border-blue-50 bg-blue-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            EAEU Customs Value (Estimator)
          </h4>
        </div>
        <Badge className="border-none bg-blue-100 text-[8px] font-black uppercase text-blue-700">
          Import/Export RU-KZ-BY
        </Badge>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span>Transaction Value</span>
          <span>{customs.transactionValue.toLocaleString()} ₽</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span>Duty ({customs.dutyRatePercent}%)</span>
          <span>
            {(customs.totalCustomsValue * (customs.dutyRatePercent / 100)).toLocaleString()} ₽
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span>VAT ({customs.vatRatePercent}%)</span>
          <span>
            {(
              (customs.totalCustomsValue +
                customs.totalCustomsValue * (customs.dutyRatePercent / 100)) *
              (customs.vatRatePercent / 100)
            ).toLocaleString()}{' '}
            ₽
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-blue-100 pt-2">
          <div className="text-[10px] font-black uppercase text-blue-700">Estimated Total Tax</div>
          <div className="text-sm font-black text-blue-800">
            {customs.estimatedTotalTax.toLocaleString()} ₽
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-50 bg-white p-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
        <div className="text-[9px] font-medium leading-tight text-blue-700">
          <b>Логистический расчет:</b> Указана ориентировочная стоимость таможенной очистки при
          ввозе партии в РФ. Точный расчет зависит от ТН ВЭД кода.
        </div>
      </div>
    </Card>
  );
}
