'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  computeWorkshop2BomCostingRollup,
  bomCostDeltaBadgeLabel,
} from '@/lib/production/workshop2-bom-costing';
import { rollupSampleEconomicsFromBomCosting } from '@/lib/production/workshop2-sample-economics';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { saveWorkshop2DossierToApi } from '@/lib/production/workshop2-api-client';
import { summarizeWorkshop2SampleEconomicsRollupStatus } from '@/lib/production/workshop2-sample-economics-rollup-status';
import { Workshop2SurfaceStatusBanner } from '@/components/brand/production/Workshop2SurfaceStatusBanner';

export function Workshop2SampleEconomicsRollupPanel({
  dossier,
  collectionId,
  articleId,
  onDossierPatch,
}: {
  dossier: Workshop2DossierPhase1 | null;
  collectionId: string;
  articleId: string;
  onDossierPatch: (patch: Partial<Workshop2DossierPhase1>) => void;
}) {
  const { bundle, mergeBundle } = useArticleWorkspace();

  const economicsRollupStatus = useMemo(
    () =>
      dossier
        ? summarizeWorkshop2SampleEconomicsRollupStatus({
            dossier,
            draft: bundle?.sampleEconomics ?? dossier.sampleEconomicsDraft,
          })
        : null,
    [dossier, bundle?.sampleEconomics]
  );

  if (!dossier) return null;

  const rollup = computeWorkshop2BomCostingRollup(dossier);
  const draftRollup = bundle?.sampleEconomics?.bomRollup;
  const badge = bomCostDeltaBadgeLabel(rollup);

  const handleSync = async () => {
    const nextDraft = rollupSampleEconomicsFromBomCosting(dossier, bundle?.sampleEconomics ?? null);
    void mergeBundle({ sampleEconomics: nextDraft });
    onDossierPatch({
      sampleEconomicsDraft: nextDraft,
      bomCostingSnapshot: {
        computedAt: new Date().toISOString(),
        materialsTotal: rollup.materialsTotal,
        trimsTotal: rollup.trimsTotal,
        operationsTotal: rollup.operationsTotal,
        estimatedFob: rollup.estimatedFob,
        currency: rollup.currency,
        targetFob: rollup.targetFob,
        deltaBand: rollup.deltaBand,
        deltaPct: rollup.deltaPct,
      },
    });
    const merged = {
      ...dossier,
      sampleEconomicsDraft: nextDraft,
      bomCostingSnapshot: {
        computedAt: new Date().toISOString(),
        materialsTotal: rollup.materialsTotal,
        trimsTotal: rollup.trimsTotal,
        operationsTotal: rollup.operationsTotal,
        estimatedFob: rollup.estimatedFob,
        currency: rollup.currency,
        targetFob: rollup.targetFob,
        deltaBand: rollup.deltaBand,
        deltaPct: rollup.deltaPct,
      },
    };
    await saveWorkshop2DossierToApi(collectionId, articleId, merged);
  };

  return (
    <div className="border-border-default mt-3 space-y-2 rounded-lg border bg-emerald-50/40 p-3">
      <Workshop2SurfaceStatusBanner
        hintRu={economicsRollupStatus?.hintRu}
        detailRu={
          economicsRollupStatus && economicsRollupStatus.state !== 'ready'
            ? `FOB: ${economicsRollupStatus.estimatedFob.toFixed(2)} · строк BOM: ${economicsRollupStatus.bomReferenceLineCount}`
            : undefined
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
          <LucideIcons.TrendingUp className="h-4 w-4 text-emerald-700" />
          Экономика образца · BOM rollup
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          onClick={() => void handleSync()}
        >
          Синхронизировать с BOM
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-[11px]">
        <Badge variant="secondary">
          FOB оценка: {rollup.estimatedFob.toFixed(2)} {rollup.currency}
        </Badge>
        {rollup.targetFob != null ? (
          <Badge variant="outline">Целевой FOB: {rollup.targetFob.toFixed(2)}</Badge>
        ) : (
          <Badge variant="outline">Target FOB не задан (паспорт)</Badge>
        )}
        <Badge
          variant={
            rollup.deltaBand === 'over'
              ? 'destructive'
              : rollup.deltaBand === 'on_target'
                ? 'default'
                : 'outline'
          }
        >
          {badge}
        </Badge>
      </div>
      {draftRollup?.syncedAt ? (
        <p className="text-text-muted text-[10px]">
          Последняя синхронизация в черновик:{' '}
          {new Date(draftRollup.syncedAt).toLocaleString('ru-RU')}
        </p>
      ) : (
        <p className="text-text-muted text-[10px] italic">
          Нажмите «Синхронизировать» — строки затрат и bomRollup попадут в sampleEconomics (вкладка
          Снабжение).
        </p>
      )}
    </div>
  );
}
