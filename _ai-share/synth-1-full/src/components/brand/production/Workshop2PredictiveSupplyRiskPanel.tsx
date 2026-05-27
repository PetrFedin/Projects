'use client';

import React, { useMemo } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2PredictiveSupplyRiskFromDossier } from '@/lib/production/workshop2-predictive-supply-risk';

/** Wave 6 #60: панель риска снабжения в supply pane — score 0–100, без ML. */
export function Workshop2PredictiveSupplyRiskPanel({
  dossier,
}: {
  dossier?: Workshop2DossierPhase1 | null;
}) {
  const model = useMemo(
    () => (dossier ? evaluateWorkshop2PredictiveSupplyRiskFromDossier(dossier) : null),
    [dossier]
  );

  if (!model) {
    return (
      <div
        className="border-border-default bg-bg-surface2 text-text-secondary rounded-xl border border-dashed p-4 text-center text-xs"
        data-testid="workshop2-predictive-supply-risk-panel"
      >
        Нет досье — эвристика риска снабжения недоступна.
      </div>
    );
  }

  const tone =
    model.riskLevel === 'High'
      ? 'text-red-700 bg-red-50 border-red-200'
      : model.riskLevel === 'Medium'
        ? 'text-amber-800 bg-amber-50 border-amber-200'
        : 'text-emerald-800 bg-emerald-50 border-emerald-200';

  const Icon =
    model.riskLevel === 'High' ? AlertTriangle : model.riskLevel === 'Medium' ? Info : CheckCircle2;

  return (
    <div
      className={cn('mt-4 rounded-xl border p-4', tone)}
      data-testid="workshop2-predictive-supply-risk-panel"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg border border-white/60 bg-white/80 p-2">
          <ShieldAlert className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">Прогноз риска снабжения</h3>
            <Badge variant="outline" className="text-[10px]">
              score {model.score}/100
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              эвристика
            </Badge>
          </div>
          <p className="text-[11px] opacity-90">{model.rationale}</p>
          <div className="flex items-center gap-2 text-[11px]">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>Уровень: {model.riskLevel}</span>
          </div>
          {model.blockers.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-[11px] opacity-90">
              {model.blockers.map((b) => (
                <li key={b.id}>
                  {b.severity === 'blocker' ? '⛔ ' : '⚠ '}
                  {b.messageRu}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] opacity-80">Блокеров не выявлено.</p>
          )}
          <p className="font-mono text-[10px] opacity-70">{model.inputsUsed.join(' · ')}</p>
        </div>
      </div>
    </div>
  );
}
