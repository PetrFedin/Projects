'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Globe, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateCustomsDuty } from '@/lib/fashion/customs-duty-calc';

export const ProductCustomsDutyBlock: React.FC<{ product: Product }> = ({ product }) => {
  const duty = calculateCustomsDuty(product);
  
  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <Scale className="w-16 h-16 text-slate-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-tight">Customs Duty Estimator (Import)</h4>
        </div>
        {duty.isAboveThreshold ? (
          <Badge className="bg-orange-500 text-white border-none text-[9px] h-4 uppercase font-black">
            Above Threshold
          </Badge>
        ) : (
          <Badge className="bg-green-500 text-white border-none text-[9px] h-4 uppercase font-black">
            Duty Free
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Duty Payable</div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
             {duty.totalDutyRub.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex flex-col justify-center items-end text-right">
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Exchange EUR/RUB: 100.0</div>
           <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Net Value: €{duty.priceEur}</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-slate-100 flex flex-col gap-2 shadow-sm">
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase leading-none">
            <span>Broker Fee (incl.)</span>
            <span>{duty.brokerFee} ₽</span>
         </div>
         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase leading-none">
            <span>Customs Rate (Excess)</span>
            <span>15%</span>
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold uppercase italic flex items-center gap-1.5">
         <Info className="w-3 h-3" /> EAEU Cross-border Regulations 2026. Threshold: €200.
      </div>
    </Card>
  );
};
