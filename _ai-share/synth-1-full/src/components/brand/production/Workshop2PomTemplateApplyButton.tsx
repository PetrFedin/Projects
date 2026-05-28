'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { applyWorkshop2PomTemplate } from '@/lib/production/workshop2-references-client';
import { appendWorkshop2PomTemplateApplyWithAudit } from '@/lib/production/workshop2-pom-template-apply-audit';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Dispatch, SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';

export type Workshop2PomTemplateApplyButtonProps = {
  categoryLeafId: string;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  disabled?: boolean;
  onApplied?: (addedCount: number) => void;
};

/** Кнопка «Подставить шаблон POM» — API + merge в productionModel.measurements. */
export function Workshop2PomTemplateApplyButton({
  categoryLeafId,
  dossier,
  setDossier,
  disabled,
  onApplied,
}: Workshop2PomTemplateApplyButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleApply = async () => {
    const leafId = categoryLeafId.trim();
    if (!leafId || disabled || busy) return;
    setBusy(true);
    try {
      const res = await applyWorkshop2PomTemplate({ leafId, mode: 'merge' });
      if (!res?.ok || !res.template) return;
      let added = 0;
      setDossier((prev) => {
        const applied = appendWorkshop2PomTemplateApplyWithAudit({
          dossier: prev,
          categoryLeafId: leafId,
          template: res.template!,
          mode: 'merge',
        });
        if (!applied) return prev;
        added = applied.record.addedMeasurementCount;
        return applied.dossier;
      });
      onApplied?.(added || res.measurements?.length || 0);
    } finally {
      setBusy(false);
    }
  };

  const lastApply = dossier.pomTemplateApplyLog?.[0];

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        disabled={disabled || busy || !categoryLeafId.trim()}
        onClick={() => void handleApply()}
      >
        {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
        Подставить шаблон POM
      </Button>
      {lastApply ? (
        <span className="text-text-muted text-[10px]">
          В досье: +{lastApply.addedMeasurementCount} мерок ·{' '}
          {new Date(lastApply.appliedAt).toLocaleString('ru-RU')}
        </span>
      ) : null}
    </div>
  );
}
