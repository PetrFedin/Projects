'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import type { Workshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';

export type Workshop2Phase1DossierPanelHandoffBlockProps = {
  tzGateSnapshot: Workshop2TzGateSnapshot;
  overallPct: number;
  onHandoffClick: () => void;
};

export function Workshop2Phase1DossierPanelHandoffBlock({
  tzGateSnapshot,
  overallPct,
  onHandoffClick,
}: Workshop2Phase1DossierPanelHandoffBlockProps) {
  const [hasFiredConfetti, setHasFiredConfetti] = useState(false);

  // We exclude 'handoff_marks' because this button's purpose is to initiate the handoff
  const handoffBlockers = tzGateSnapshot.blockers.filter((b) => b.id !== 'handoff_marks');
  const isReady = handoffBlockers.length === 0;

  const missingLabels = handoffBlockers.map((b) => b.label).join(', ');

  useEffect(() => {
    if (isReady && !hasFiredConfetti) {
      setHasFiredConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#10B981', '#3B82F6', '#6366F1'],
      });
    } else if (!isReady && hasFiredConfetti) {
      setHasFiredConfetti(false);
    }
  }, [isReady, hasFiredConfetti]);

  return (
    <div className="mt-8 mb-4 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex w-full max-w-md flex-col gap-2 text-center">
        <div className="flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Готовность к передаче</span>
          <span className={cn(isReady ? 'text-emerald-600' : '')}>{overallPct}%</span>
        </div>
        <Progress value={overallPct} className="h-2.5 w-full bg-slate-100" />
        
        {!isReady && missingLabels.length > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            Осталось заполнить: <span className="text-amber-600 font-medium">{missingLabels}</span>
          </p>
        )}
        
        {isReady && (
          <p className="text-xs text-emerald-600 mt-1 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Все обязательные поля заполнены. Можно отправлять!
          </p>
        )}
      </div>

      <Button
        type="button"
        size="lg"
        disabled={!isReady}
        onClick={onHandoffClick}
        className={cn(
          'h-12 w-full max-w-md gap-2 text-base font-semibold shadow-sm transition-all',
          isReady
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
            : 'bg-slate-100 text-slate-400'
        )}
      >
        <Send className="h-5 w-5" />
        Сформировать Tech Pack и запросить пошив
      </Button>
    </div>
  );
}
