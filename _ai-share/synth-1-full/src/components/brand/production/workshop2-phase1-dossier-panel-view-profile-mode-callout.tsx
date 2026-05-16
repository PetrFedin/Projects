'use client';

import { Button } from '@/components/ui/button';
import {
  WORKSHOP2_DOSSIER_VIEW_HINTS,
  WORKSHOP2_DOSSIER_VIEW_OPTIONS,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

export function Workshop2DossierViewProfileModeCallout({
  dossierViewProfile,
  onSwitchToFull,
}: {
  dossierViewProfile: Workshop2DossierViewProfile;
  onSwitchToFull: () => void;
}) {
  if (dossierViewProfile === 'full') {
    return null;
  }

  return (
    <div
      className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary flex flex-col gap-2 rounded-lg border px-3 py-2 text-xs leading-snug sm:flex-row sm:items-center sm:justify-between"
      role="note"
    >
      <p className="min-w-0 flex-1">
        <span className="font-semibold">Режим:</span>{' '}
        {WORKSHOP2_DOSSIER_VIEW_OPTIONS.find((o) => o.value === dossierViewProfile)?.label ??
          dossierViewProfile}
        . Порядок вкладок и акценты зависят от режима (в т.ч. из ссылки{' '}
        <span className="font-mono text-[10px]">?w2view=…</span> или последнего выбора в этом
        браузере). {WORKSHOP2_DOSSIER_VIEW_HINTS[dossierViewProfile]}
      </p>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="h-8 shrink-0 self-start text-[11px] sm:self-center"
        onClick={onSwitchToFull}
      >
        Полный вид ТЗ
      </Button>
    </div>
  );
}
