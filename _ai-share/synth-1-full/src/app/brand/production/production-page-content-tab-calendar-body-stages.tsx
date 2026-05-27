'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

const STAGES = [
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
] as const;

export function ProductionPageContentTabCalendarBodyStages({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab } = px;

  return (
    <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-[11px] font-black uppercase">Этапы и дедлайны</CardTitle>
        <CardDescription className="text-[10px]">
          Дизайн → Тех-пак → Сэмпл → Утверждение → PO → Снабжение → Цех → QC → Отгрузка
        </CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-2">
        {STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() =>
              stage === 'Сэмпл'
                ? setActiveTab?.('samples')
                : stage === 'PO'
                  ? setActiveTab?.('orders')
                  : stage === 'Снабжение'
                    ? setActiveTab?.('materials')
                    : stage === 'Цех'
                      ? setActiveTab?.('execution')
                      : stage === 'QC'
                        ? setActiveTab?.('compliance')
                        : undefined
            }
            className={cn(
              'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
              ['Сэмпл', 'PO', 'Цех'].includes(stage)
                ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/30 border'
                : 'bg-bg-surface2 text-text-secondary border-border-subtle border'
            )}
          >
            {stage}
          </button>
        ))}
      </div>
    </Card>
  );
}
