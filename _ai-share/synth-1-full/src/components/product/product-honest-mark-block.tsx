'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, QrCode, Info, CheckCircle2, Clock } from 'lucide-react';
import { getHonestMarkStatus } from '@/lib/fashion/honest-mark';

export const ProductHonestMarkBlock: React.FC<{ product: Product }> = ({ product }) => {
  const hm = getHonestMarkStatus(product);
  
  const statusColors: Record<string, string> = {
    'active': 'text-green-600 bg-green-50 border-green-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'applied': 'text-blue-600 bg-blue-50 border-blue-200',
    'error': 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-slate-600" />
          <h4 className="font-bold text-xs uppercase text-slate-600 tracking-tight">Честный ЗНАК (Compliance)</h4>
        </div>
        <Badge variant="outline" className={`text-[10px] font-black uppercase ${statusColors[hm.status]}`}>
          {hm.status === 'active' ? <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> : <Clock className="w-2.5 h-2.5 mr-1" />}
          {hm.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        <div className="space-y-0.5">
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">GTIN</div>
          <div className="text-xs font-mono font-bold text-slate-700">{hm.gtin}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">ТН ВЭД (HS-Code)</div>
          <div className="text-xs font-mono font-bold text-slate-700">{hm.tnved}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Label Group</div>
          <div className="text-xs font-bold text-slate-600 uppercase">{hm.labelType}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black text-slate-400 uppercase leading-none">Last Audit</div>
          <div className="text-[10px] font-semibold text-slate-500">{hm.updatedAt.split('T')[0]}</div>
        </div>
      </div>

      <div className="mt-4 p-2.5 bg-white rounded-md border flex gap-2 items-start">
        <ShieldCheck className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
        <div className="text-[10px] text-slate-500 leading-tight">
          Товар промаркирован в соответствии с законодательством РФ. Код маркировки Data Matrix нанесен на этикетку.
        </div>
      </div>
    </Card>
  );
};
