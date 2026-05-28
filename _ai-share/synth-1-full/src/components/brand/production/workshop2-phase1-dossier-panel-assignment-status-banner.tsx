'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Workshop2DossierAssignmentStatusBanner({
  hubReady,
  statusText,
  onOpenProblemBlock,
  onOpenPulse,
}: {
  hubReady: boolean;
  statusText: string;
  onOpenProblemBlock: () => void;
  onOpenPulse?: () => void;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-[11px] leading-snug',
        hubReady
          ? 'border-emerald-200/90 bg-emerald-50/80 text-emerald-900'
          : 'border-amber-200/90 bg-amber-50/80 text-amber-950'
      )}
      role="status"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{statusText}</p>
        <div className="flex items-center gap-2">
          {onOpenPulse && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 bg-white text-[10px] text-slate-700 hover:bg-slate-50"
              onClick={onOpenPulse}
            >
              Пульс артикула
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 shrink-0 text-[10px]"
            disabled={hubReady}
            onClick={onOpenProblemBlock}
          >
            Открыть проблемный блок
          </Button>
        </div>
      </div>
    </div>
  );
}
