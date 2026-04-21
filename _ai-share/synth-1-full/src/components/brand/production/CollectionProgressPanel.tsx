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
    <Card className="border-border-subtle overflow-hidden rounded-xl border shadow-sm">
      <CardHeader className="border-border-subtle bg-bg-surface2/80 border-b p-4">
        <CardTitle className="text-text-primary text-[11px] font-bold uppercase tracking-wider">
          Прогресс по этапам
        </CardTitle>
        <p className="text-text-secondary mt-0.5 text-[9px]">{collectionName || collectionId}</p>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-[10px] font-bold uppercase">Готовность</span>
          <span className="text-accent-primary text-lg font-black">{readiness}%</span>
        </div>
        <Progress
          value={readiness}
          className="h-2"
          aria-label={`Готовность коллекции по этапам: ${readiness}%`}
        />
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => {
            const status =
              stageStatus[s.key] ?? (i < 2 ? 'completed' : i === 2 ? 'active' : 'locked');
            const locked = status === 'locked';
            const statusPhrase =
              status === 'completed' ? 'завершено' : status === 'active' ? 'в работе' : 'заблокировано';
            const navDisabled = locked || !onNavigate;
            return (
              <button
                key={s.id}
                type="button"
                disabled={navDisabled}
                onClick={() => {
                  if (!navDisabled) onNavigate?.(s.key);
                }}
                aria-label={`Этап «${s.label}»: ${statusPhrase}`}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-bold uppercase transition-all',
                  status === 'completed' && 'bg-emerald-50 text-emerald-700',
                  status === 'active' &&
                    'bg-accent-primary/10 text-accent-primary ring-accent-primary/30 ring-1',
                  status === 'locked' && 'bg-bg-surface2 text-text-muted cursor-not-allowed'
                )}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                ) : status === 'locked' ? (
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Circle className="h-3.5 w-3.5" aria-hidden />
                )}
                {s.label}
              </button>
            );
          })}
        </div>
        <div className="border-border-subtle grid grid-cols-3 gap-2 border-t pt-2 text-center">
          <div>
            <p className="text-text-muted text-[9px] font-bold">Артикулов</p>
            <p className="text-text-primary text-sm font-black">{skuCount}</p>
          </div>
          <div>
            <p className="text-text-muted text-[9px] font-bold">Утверждено</p>
            <p className="text-sm font-black text-emerald-600">{approvedCount}</p>
          </div>
          <div>
            <p className="text-text-muted text-[9px] font-bold">PO</p>
            <p className="text-accent-primary text-sm font-black">{poCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
