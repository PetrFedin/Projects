'use client';

import { Factory, Route, ShieldCheck, Truck, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WORKSHOP2_LOGISTICS_STEPS,
  type Workshop2LogisticsStepId,
} from '@/lib/production/workshop2-logistics-flow';

const ICONS = {
  factory: Factory,
  truck: Truck,
  route: Route,
  customs: ShieldCheck,
  warehouse: Warehouse,
} as const;

type Props = {
  currentStepIndex: number;
  onStepClick: (index: number) => void;
};

/** Горизонтальный трек: кружки на отдельной строке, подписи строго под ними. */
export function Workshop2LogisticsTimeline({ currentStepIndex, onStepClick }: Props) {
  const progressPct =
    WORKSHOP2_LOGISTICS_STEPS.length > 1
      ? (currentStepIndex / (WORKSHOP2_LOGISTICS_STEPS.length - 1)) * 100
      : 0;

  return (
    <div className="overflow-x-auto pb-2 pt-1" data-testid="workshop2-logistics-timeline">
      <div className="min-w-[640px] px-2">
        {/* Строка кружков + линия — фиксированная высота, без текста */}
        <div className="relative grid grid-cols-5 items-center" style={{ minHeight: 56 }}>
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-1/2 z-0 h-0 -translate-y-1/2 border-t-2 border-slate-200"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-[10%] top-1/2 z-0 h-0 -translate-y-1/2 border-t-2 border-blue-600 transition-all duration-500"
            style={{ width: `${progressPct * 0.8}%` }}
            aria-hidden
          />
          {WORKSHOP2_LOGISTICS_STEPS.map((step, idx) => {
            const Icon = ICONS[step.icon];
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div key={step.id} className="relative z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => onStepClick(idx)}
                  aria-label={step.label}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white transition-colors',
                    isCompleted && 'border-blue-600 bg-blue-50 text-blue-600',
                    isCurrent && 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200',
                    isPending &&
                      'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                </button>
              </div>
            );
          })}
        </div>

        {/* Подписи — отдельная строка с отступом сверху */}
        <div className="mt-3 grid grid-cols-5 gap-1">
          {WORKSHOP2_LOGISTICS_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={`${step.id}-label`}
                type="button"
                onClick={() => onStepClick(idx)}
                className={cn(
                  'px-1 text-center text-[10px] leading-snug transition-colors',
                  isCurrent ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <span className="block font-medium">{step.label}</span>
                <span className="text-text-muted mt-0.5 block text-[9px]">{step.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function workshop2LogisticsStepIdAt(index: number): Workshop2LogisticsStepId {
  return WORKSHOP2_LOGISTICS_STEPS[index]?.id ?? 'factory';
}
