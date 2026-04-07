'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  { id: 'design', label: 'Дизайн', key: 'design' },
  { id: 'tz', label: 'ТЗ', key: 'tz' },
  { id: 'bom', label: 'BOM', key: 'bom' },
  { id: 'sample', label: 'Сэмплы', key: 'sample' },
  { id: 'approval', label: 'Утверждение', key: 'approval' },
  { id: 'po', label: 'PO', key: 'po' },
  { id: 'production', label: 'Производство', key: 'production' },
] as const;

export interface CollectionProgressPanelProps {
  collectionId: string;
  collectionName?: string;
  readiness: number; // 0-100
  stageStatus: Record<string, 'completed' | 'active' | 'locked'>;
  skuCount: number;
  approvedCount: number;
  poCount: number;
  onNavigate?: (stage: string) => void;
}

export function CollectionProgressPanel({
  collectionId,
  collectionName,
  readiness,
  stageStatus,
  skuCount,
  approvedCount,
  poCount,
  onNavigate,
}: CollectionProgressPanelProps) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
          Прогресс по этапам
        </CardTitle>
        <p className="text-[9px] text-slate-500 mt-0.5">{collectionName || collectionId}</p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase text-slate-500">Готовность</span>
          <span className="text-lg font-black text-indigo-600">{readiness}%</span>
        </div>
        <Progress value={readiness} className="h-2" />
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => {
            const status = stageStatus[s.key] ?? (i < 2 ? 'completed' : i === 2 ? 'active' : 'locked');
            return (
              <button
                key={s.id}
                onClick={() => onNavigate?.(s.key)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all',
                  status === 'completed' && 'bg-emerald-50 text-emerald-700',
                  status === 'active' && 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
                  status === 'locked' && 'bg-slate-50 text-slate-400 cursor-not-allowed'
                )}
              >
                {status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : status === 'locked' ? <Lock className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {s.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
          <div><p className="text-[9px] font-bold text-slate-400">Артикулов</p><p className="text-sm font-black text-slate-900">{skuCount}</p></div>
          <div><p className="text-[9px] font-bold text-slate-400">Утверждено</p><p className="text-sm font-black text-emerald-600">{approvedCount}</p></div>
          <div><p className="text-[9px] font-bold text-slate-400">PO</p><p className="text-sm font-black text-indigo-600">{poCount}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
