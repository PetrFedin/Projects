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
    <Card className="relative overflow-hidden border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Scale className="h-16 w-16 text-slate-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-700">
            Customs Duty Estimator (Import)
          </h4>
        </div>
        {duty.isAboveThreshold ? (
          <Badge className="h-4 border-none bg-orange-500 text-[9px] font-black uppercase text-white">
            Above Threshold
          </Badge>
        ) : (
          <Badge className="h-4 border-none bg-green-500 text-[9px] font-black uppercase text-white">
            Duty Free
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
            Total Duty Payable
          </div>
          <div className="text-2xl font-black tracking-tight text-slate-800">
            {duty.totalDutyRub.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex flex-col items-end justify-center text-right">
          <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
            Exchange EUR/RUB: 100.0
          </div>
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            Net Value: €{duty.priceEur}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-black uppercase leading-none text-slate-500">
          <span>Broker Fee (incl.)</span>
          <span>{duty.brokerFee} ₽</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-black uppercase leading-none text-slate-500">
          <span>Customs Rate (Excess)</span>
          <span>15%</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
        <Info className="h-3 w-3" /> EAEU Cross-border Regulations 2026. Threshold: €200.
      </div>
    </Card>
  );
};
