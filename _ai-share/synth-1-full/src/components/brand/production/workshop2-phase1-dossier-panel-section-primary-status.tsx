'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type WorkshopPhaseDigit = '1' | '2' | '3';

export function Workshop2SectionPrimaryStatusBanner({
  pct,
  minPct,
  gateErrors,
  currentPhase,
  minimalModeEnabled,
  onToggleMinimalMode,
  onOpenPulse,
}: {
  pct: number;
  minPct: number;
  gateErrors: readonly string[];
  currentPhase: WorkshopPhaseDigit;
  minimalModeEnabled: boolean;
  onToggleMinimalMode: () => void;
  onOpenPulse?: () => void;
}) {
  const ready = pct >= minPct && gateErrors.length === 0;
  const tone = ready
    ? 'border-emerald-200/90 bg-emerald-50/80 text-emerald-900'
    : 'border-amber-200/90 bg-amber-50/80 text-amber-950';
  const text = ready
    ? `Шаг готов к подтверждению секции (${pct}%).`
    : gateErrors.length > 0
      ? `Есть ошибки секции: ${gateErrors.length}. Исправьте их перед подтверждением.`
      : `Заполните шаг до ${minPct}% (сейчас ${pct}%).`;

  return (
    <div className={cn('rounded-lg border px-3 py-2 text-[11px] leading-snug', tone)} role="status">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{text}</p>
        <div className="flex items-center gap-2">
          {onOpenPulse && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 bg-white text-[10px] text-slate-700 hover:bg-slate-50"
              onClick={onOpenPulse}
            >
              Пульс раздела
            </Button>
          )}
          {(currentPhase === '1' || currentPhase === '2') && (
            <Button
              type="button"
              variant={minimalModeEnabled ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-[10px]"
              title="Показать только обязательные для фазы поля и скрыть «Позже» там, где это поддерживается"
              onClick={onToggleMinimalMode}
            >
              {minimalModeEnabled ? 'Минимум шага: вкл' : 'Минимум шага'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
