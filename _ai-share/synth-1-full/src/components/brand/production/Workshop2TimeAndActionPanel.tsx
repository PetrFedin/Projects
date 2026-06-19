'use client';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Workshop2TaMilestone,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Workshop2SampleGanttChart, type GanttPhase } from './workshop2-sample-gantt-chart';
import {
  Workshop2OperationalMetaChips,
  Workshop2OperationalPanelChrome,
  Workshop2OperationalPanelShell,
  Workshop2OperationalPgMirrorChip,
} from '@/components/brand/production/workshop2-operational-panel-chrome';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import {
  resolveWorkshop2TaMilestones,
  summarizeWorkshop2TaMilestonesStatus,
} from '@/lib/production/workshop2-ta-milestones-status';
import { copyTaMilestonesToDossier } from '@/lib/production/workshop2-ta-milestones-dossier-persist';
import { persistWorkshop2TaMilestonesMirrorToDossier } from '@/lib/production/workshop2-ta-milestones-mirror-persist';
import { putWorkshop2Wave24DossierPatch } from '@/lib/production/workshop2-wave24-persist-client';
import { persistWorkshop2PlanTaMirrorToDossier } from '@/lib/production/workshop2-plan-ta-dossier-persist';
import { putWorkshop2Wave26DossierPatch } from '@/lib/production/workshop2-wave26-persist-client';
import { saveWorkshop2DossierToApi } from '@/lib/production/workshop2-api-client';
import { useToast } from '@/hooks/use-toast';
import { showWorkshop2PersistToast } from '@/lib/production/workshop2-persist-toast-messages';
import { summarizeWorkshop2TzTimeAndActionPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import { Workshop2TaMilestonesStatusBanner } from '@/components/brand/production/workshop2-panel-status-banners';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

interface Workshop2TimeAndActionPanelProps {
  articleId: string;
  dossier?: Workshop2DossierPhase1 | null;
}

export function Workshop2TimeAndActionPanel({
  articleId,
  dossier,
  collectionId,
}: Workshop2TimeAndActionPanelProps & { collectionId?: string }) {
  const { bundle, loading: wsLoading, mergeBundle } = useArticleWorkspace();
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [persistBusy, setPersistBusy] = useState(false);
  const [taMirrorBusy, setTaMirrorBusy] = useState(false);
  const [planTaMirrorBusy, setPlanTaMirrorBusy] = useState(false);
  const { toast } = useToast();

  const { milestones } = useMemo(
    () => resolveWorkshop2TaMilestones({ dossier, bundleTa: bundle?.timeAndAction }),
    [dossier, bundle?.timeAndAction]
  );

  const taStatus = useMemo(
    () =>
      summarizeWorkshop2TaMilestonesStatus({
        dossier,
        bundleTa: bundle?.timeAndAction,
        surface: 'plan',
      }),
    [dossier, bundle?.timeAndAction]
  );

  const updateMilestone = (id: string, updates: Partial<Workshop2TaMilestone>) => {
    if (!bundle) return;
    void mergeBundle({
      timeAndAction: {
        milestones: milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      },
    });
  };

  const handlePredictiveRecalculation = async () => {
    if (!bundle) return;
    setRecalcLoading(true);
    try {
      let delayOffset = 0;
      const recalculated = milestones.map((m) => {
        if (m.status === 'delayed') delayOffset += 5;
        if (delayOffset > 0 && m.status === 'pending') {
          const d = new Date(m.targetDate);
          d.setDate(d.getDate() + delayOffset);
          return { ...m, targetDate: d.toISOString().split('T')[0] };
        }
        return m;
      });
      await mergeBundle({ timeAndAction: { milestones: recalculated } });
    } finally {
      setRecalcLoading(false);
    }
  };

  const getStatusIcon = (status: Workshop2TaMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="text-text-muted h-5 w-5" />;
    }
  };

  const handlePersistTaToDossier = async () => {
    if (!dossier) return;
    setPersistBusy(true);
    try {
      const next = copyTaMilestonesToDossier({
        dossier,
        bundleTa: bundle?.timeAndAction,
        milestones,
      });
      if (collectionId && articleId) {
        await saveWorkshop2DossierToApi({ collectionId, articleId, dossier: next });
        const mirrored = persistWorkshop2TaMilestonesMirrorToDossier(
          next,
          bundle?.timeAndAction ?? null
        );
        const res = await putWorkshop2Wave24DossierPatch({
          collectionId,
          articleId,
          base: next,
          apply: () => mirrored,
          field: 'ta_milestones_mirror',
          updatedByLabel: 'ta-panel',
        });
        if (res.ok) {
          toast({
            title: 'T&A сохранён в досье',
            description: `${res.dossier.taMilestones?.length ?? 0} вех · PG + mirror`,
          });
          return;
        }
      }
      toast({
        title: 'T&A сохранён в досье',
        description: `${next.taMilestones?.length ?? 0} вех · PUT dossier`,
      });
    } finally {
      setPersistBusy(false);
    }
  };

  const handlePlanTaMirrorOnly = async () => {
    if (!dossier || !collectionId) return;
    setPlanTaMirrorBusy(true);
    try {
      const res = await putWorkshop2Wave26DossierPatch({
        collectionId,
        articleId,
        base: dossier,
        apply: (d) => persistWorkshop2PlanTaMirrorToDossier(d, bundle?.timeAndAction ?? null),
        field: 'plan_ta_mirror',
        updatedByLabel: 'plan-ta-panel',
      });
      showWorkshop2PersistToast(toast, {
        scopeLabelRu: 'Plan T&A',
        ok: res.ok,
        mirrorField: 'planTaMirror',
        reason: res.reason,
        okHintRu: 'planTaMirror в досье (sample-order gate).',
      });
    } finally {
      setPlanTaMirrorBusy(false);
    }
  };

  const handleTaMirrorOnly = async () => {
    if (!dossier || !collectionId) return;
    setTaMirrorBusy(true);
    try {
      const res = await putWorkshop2Wave24DossierPatch({
        collectionId,
        articleId,
        base: dossier,
        apply: (d) => persistWorkshop2TaMilestonesMirrorToDossier(d, bundle?.timeAndAction ?? null),
        field: 'ta_milestones_mirror',
        updatedByLabel: 'ta-panel',
      });
      showWorkshop2PersistToast(toast, {
        scopeLabelRu: 'T&A',
        ok: res.ok,
        mirrorField: 'taMilestonesMirror',
        reason: res.reason,
        okHintRu: 'taMilestonesMirror в досье (sample-order gate).',
      });
    } finally {
      setTaMirrorBusy(false);
    }
  };

  const ganttPhases: GanttPhase[] = useMemo(() => {
    if (milestones.length < 2) return [];
    const sorted = [...milestones].sort(
      (a, b) =>
        new Date(a.actualDate || a.targetDate).getTime() -
        new Date(b.actualDate || b.targetDate).getTime()
    );
    const firstDate = new Date(sorted[0].actualDate || sorted[0].targetDate).getTime();
    const lastDate = new Date(
      sorted[sorted.length - 1].actualDate || sorted[sorted.length - 1].targetDate
    ).getTime();
    const totalDuration = lastDate - firstDate;
    if (totalDuration <= 0) return [];
    return sorted.slice(0, -1).map((m, i) => {
      const nextM = sorted[i + 1];
      const start = new Date(m.actualDate || m.targetDate).getTime();
      const end = new Date(nextM.actualDate || nextM.targetDate).getTime();
      let color =
        m.status === 'completed'
          ? 'bg-emerald-500'
          : m.status === 'delayed'
            ? 'bg-red-500'
            : 'bg-blue-500';
      return {
        id: m.id,
        name: m.title,
        startPercent: ((start - firstDate) / totalDuration) * 100,
        widthPercent: ((end - start) / totalDuration) * 100,
        color,
      };
    });
  }, [milestones]);

  if (wsLoading) return <div className="text-text-secondary text-sm">Загрузка календаря...</div>;
  if (!bundle) return <div className="text-text-secondary text-sm">Данные не найдены.</div>;

  const taMeta = {
    summary: taStatus.hintRu,
    readiness:
      taStatus.milestoneCount > 0
        ? `Milestones: ${taStatus.milestoneCount} · done ${taStatus.completedCount} · source ${taStatus.source}`
        : workshop2PgMirrorStr(dossier?.taMilestonesMirror, 'hintRu') || undefined,
    nextAction: workshop2PgMirrorStr(dossier?.taMilestonesMirror, 'persistedAt')
      ? 'Mirror в PG — обновите при изменении milestones'
      : 'Сохраните T&A mirror в досье при изменении milestones',
  };

  return (
    <Workshop2OperationalPanelShell className="mt-4 w-full">
      <Workshop2OperationalPanelChrome
        icon={Clock}
        title="Управление критическим путём (T&A)"
        description="Time and Action Calendar — контроль вех от размещения заказа до отгрузки."
        meta={<Workshop2OperationalMetaChips {...taMeta} />}
        actions={
          dossier ? (
            <>
              {milestones.length > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px]"
                  disabled={persistBusy}
                  onClick={() => void handlePersistTaToDossier()}
                >
                  {persistBusy ? '…' : 'T&A в досье'}
                </Button>
              ) : null}
              {collectionId ? (
                <>
                  <Workshop2DossierPersistButton
                    busy={planTaMirrorBusy}
                    onClick={() => void handlePlanTaMirrorOnly()}
                    title="planTaMirror → PG"
                  />
                  {milestones.length > 0 ? (
                    <Workshop2DossierPersistButton
                      busy={taMirrorBusy}
                      onClick={() => void handleTaMirrorOnly()}
                      title="taMilestonesMirror → PG"
                    />
                  ) : null}
                </>
              ) : null}
            </>
          ) : null
        }
      />
      <Workshop2TaMilestonesStatusBanner status={taStatus} />
      <div className="mt-2">
        <span data-testid="workshop2-ta-milestones-pg-chip">
          <Workshop2OperationalPgMirrorChip
            {...summarizeWorkshop2TzTimeAndActionPgMirror(dossier)}
          />
        </span>
      </div>
      <Workshop2SampleGanttChart phases={ganttPhases} />
    </Workshop2OperationalPanelShell>
  );
}
