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
    active: 'text-green-600 bg-green-50 border-green-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    applied: 'text-blue-600 bg-blue-50 border-blue-200',
    error: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
<<<<<<< HEAD
    <Card className="border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-slate-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-600">
=======
    <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-secondary text-xs font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Честный ЗНАК (Compliance)
          </h4>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-black uppercase ${statusColors[hm.status]}`}
        >
          {hm.status === 'active' ? (
            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
          ) : (
            <Clock className="mr-1 h-2.5 w-2.5" />
          )}
          {hm.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-0.5">
<<<<<<< HEAD
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">GTIN</div>
          <div className="font-mono text-xs font-bold text-slate-700">{hm.gtin}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            ТН ВЭД (HS-Code)
          </div>
          <div className="font-mono text-xs font-bold text-slate-700">{hm.tnved}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            Label Group
          </div>
          <div className="text-xs font-bold uppercase text-slate-600">{hm.labelType}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-black uppercase leading-none text-slate-400">
            Last Audit
          </div>
          <div className="text-[10px] font-semibold text-slate-500">
=======
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">GTIN</div>
          <div className="text-text-primary font-mono text-xs font-bold">{hm.gtin}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
            ТН ВЭД (HS-Code)
          </div>
          <div className="text-text-primary font-mono text-xs font-bold">{hm.tnved}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
            Label Group
          </div>
          <div className="text-text-secondary text-xs font-bold uppercase">{hm.labelType}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
            Last Audit
          </div>
          <div className="text-text-secondary text-[10px] font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
            {hm.updatedAt.split('T')[0]}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-md border bg-white p-2.5">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
<<<<<<< HEAD
        <div className="text-[10px] leading-tight text-slate-500">
=======
        <div className="text-text-secondary text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
          Товар промаркирован в соответствии с законодательством РФ. Код маркировки Data Matrix
          нанесен на этикетку.
        </div>
      </div>
    </Card>
  );
};
