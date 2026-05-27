'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentPipelineStrip({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { selectedId, collections, setActiveTab } = px;

  return (
    <>
      {selectedId && (
        <Card className="border-border-subtle mb-3 rounded-xl border bg-white p-3 shadow-sm">
          <p className="text-text-muted mb-2 text-[9px] font-black uppercase tracking-widest">
            Коллекция:{' '}
            <span className="text-accent-primary">
              {collections?.find((c: any) => c.id === selectedId)?.name || selectedId}
            </span>{' '}
            — Pipeline этапов
          </p>
          <div className="no-scrollbar flex flex-wrap items-center gap-2 overflow-x-auto">
            {[
              'Дизайн',
              'Тех-пак',
              'Сэмпл',
              'Утверждение',
              'PO',
              'Снабжение',
              'Цех',
              'QC',
              'Маркировка',
              'Отгрузка',
              'Склад',
            ].map((stage: string, i: number) => (
              <React.Fragment key={i}>
                <button
                  type="button"
                  onClick={() => {
                    if (stage === 'Дизайн' || stage === 'Тех-пак') setActiveTab?.('plm');
                    else if (stage === 'Сэмпл') setActiveTab?.('samples');
                    else if (stage === 'Утверждение') setActiveTab?.('approval');
                    else if (stage === 'PO') setActiveTab?.('orders');
                    else if (stage === 'Снабжение') setActiveTab?.('materials');
                    else if (stage === 'Цех') setActiveTab?.('execution');
                    else if (stage === 'QC') setActiveTab?.('compliance');
                    else if (stage === 'Маркировка') setActiveTab?.('labeling');
                    else if (stage === 'Отгрузка' || stage === 'Склад') setActiveTab?.('logistics');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all',
                    ['Сэмпл', 'PO', 'Цех'].includes(stage)
                      ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/30 border'
                      : 'bg-bg-surface2 text-text-secondary border-border-subtle hover:bg-bg-surface2 border'
                  )}
                >
                  {stage}
                </button>
                {i < 10 && <ChevronRight className="text-text-muted h-3 w-3 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
