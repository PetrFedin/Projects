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
    <Card className="border border-indigo-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-50 bg-indigo-50/30">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-600" />
          PO из утверждённых сэмплов
        </CardTitle>
        <p className="text-[9px] text-slate-500 mt-0.5">Один клик — создать заказ на производство</p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {approvedSamples.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-600">Утверждённые артикулы ({approvedSamples.length})</p>
            {approvedSamples.slice(0, 5).map((s) => (
              <div key={s.skuId} className="flex items-center gap-2 text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-bold">{s.skuName}</span>
                <Badge variant="outline" className="text-[8px] border-emerald-200">{s.collection}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">Утвердите сэмплы во вкладке «Сэмплы» или «Утверждение»</p>
        )}
        {!materialsOk && approvedSamples.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[9px] font-bold text-amber-800">Проверьте остатки сырья и фурнитуры в разделе «Материалы»</p>
          </div>
        )}
        <Button
          onClick={onCreatePO}
          disabled={disabled || !canCreate}
          className={cn("w-full h-10 rounded-xl font-black uppercase text-[10px]", canCreate ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-200 text-slate-500")}
        >
          Создать PO
        </Button>
      </CardContent>
    </Card>
  );
}
