'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SampleForPO {
  skuId: string;
  skuName: string;
  collection: string;
  status: string;
  stage: string;
  approved: boolean;
}

export interface CreatePOFromSamplesProps {
  approvedSamples: SampleForPO[];
  materialsOk: boolean;
  onCreatePO: () => void;
  disabled?: boolean;
}

export function CreatePOFromSamples({
  approvedSamples,
  materialsOk,
  onCreatePO,
  disabled,
}: CreatePOFromSamplesProps) {
  const canCreate = approvedSamples.length > 0 && materialsOk;
  const warnings = useMemo(() => {
    const w: string[] = [];
    if (approvedSamples.length === 0) w.push('Нет утверждённых сэмплов');
    if (!materialsOk) w.push('Проверьте наличие сырья и фурнитуры');
    return w;
  }, [approvedSamples.length, materialsOk]);

  return (
    <Card className="overflow-hidden rounded-xl border border-indigo-100 shadow-sm">
      <CardHeader className="border-b border-slate-50 bg-indigo-50/30 p-4">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
          <Package className="h-4 w-4 text-indigo-600" />
          PO из утверждённых сэмплов
        </CardTitle>
        <p className="mt-0.5 text-[9px] text-slate-500">
          Один клик — создать заказ на производство
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {approvedSamples.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-600">
              Утверждённые артикулы ({approvedSamples.length})
            </p>
            {approvedSamples.slice(0, 5).map((s) => (
              <div key={s.skuId} className="flex items-center gap-2 text-[10px]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="font-bold">{s.skuName}</span>
                <Badge variant="outline" className="border-emerald-200 text-[8px]">
                  {s.collection}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">
            Утвердите сэмплы во вкладке «Сэмплы» или «Утверждение»
          </p>
        )}
        {!materialsOk && approvedSamples.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 p-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[9px] font-bold text-amber-800">
              Проверьте остатки сырья и фурнитуры в разделе «Материалы»
            </p>
          </div>
        )}
        <Button
          onClick={onCreatePO}
          disabled={disabled || !canCreate}
          className={cn(
            'h-10 w-full rounded-xl text-[10px] font-black uppercase',
            canCreate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-200 text-slate-500'
          )}
        >
          Создать PO
        </Button>
      </CardContent>
    </Card>
  );
}
