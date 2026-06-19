'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Factory } from 'lucide-react';
import type { MatchContractorsOutput } from '@/lib/production/workshop2-match-contractors-types';
import type {
  Workshop2SewingContractorsPayload,
  SewingPlanPartnerRow,
} from '@/lib/production/workshop2-sewing-plan-reference-types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useToast } from '@/hooks/use-toast';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import { Workshop2OperationalPgMirrorChip } from '@/components/brand/production/workshop2-operational-panel-chrome';
import { summarizeWorkshop2MatchmakerPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import { persistWorkshop2MatchmakerMirrorToDossier } from '@/lib/production/workshop2-matchmaker-dossier-persist';
import { putWorkshop2Wave25DossierPatch } from '@/lib/production/workshop2-wave25-persist-client';
import { summarizeWorkshop2MatchmakerSyncUi } from '@/lib/production/workshop2-no-demo-deadends';
import { workshop2DevWarn } from '@/lib/production/workshop2-dev-log';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import {
  formatWorkshop2PersistToastDescription,
  formatWorkshop2PersistToastTitle,
} from '@/lib/production/workshop2-persist-toast-messages';

interface Workshop2ContractorMatchmakerProps {
  articleDescription: string;
  dossier?: Workshop2DossierPhase1 | null;
  onDossierChange?: (next: Workshop2DossierPhase1) => void;
}

export function Workshop2ContractorMatchmaker({
  articleDescription,
  dossier = null,
  onDossierChange,
}: Workshop2ContractorMatchmakerProps) {
  const { ref } = useArticleWorkspace();
  const [loading, setLoading] = useState(false);
  const [mirrorBusy, setMirrorBusy] = useState(false);
  const [result, setResult] = useState<MatchContractorsOutput | null>(null);
  const [contractors, setContractors] = useState<SewingPlanPartnerRow[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/brand/sewing-contractors')
      .then((res) => res.json())
      .then((payload: unknown) => {
        const data = payload as Workshop2SewingContractorsPayload;
        if (data?.partners) setContractors(data.partners);
      })
      .catch((err) =>
        workshop2DevWarn('matchmaker.contractors_fetch', 'fetch failed', { cause: err })
      );
  }, []);

  const matchmakerPgMirror = useMemo(
    () => summarizeWorkshop2MatchmakerPgMirror(dossier ?? ({} as Workshop2DossierPhase1)),
    [dossier]
  );
  const syncUi = useMemo(
    () =>
      summarizeWorkshop2MatchmakerSyncUi({
        hasMatchmakerResult: Boolean(result || dossier?.matchmakerResult),
        hasMatchmakerMirror: Boolean(dossier?.matchmakerMirror?.mirroredAt),
        lastRunAt: workshop2PgMirrorStr(dossier?.matchmakerMirror, 'mirroredAt') || undefined,
      }),
    [result, dossier]
  );

  const persistMirror = useCallback(async () => {
    if (!dossier) return;
    setMirrorBusy(true);
    try {
      const res = await putWorkshop2Wave25DossierPatch({
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
        base: dossier,
        apply: persistWorkshop2MatchmakerMirrorToDossier,
        field: 'matchmaker_mirror',
        updatedByLabel: 'matchmaker-panel',
      });
      if (res.ok) onDossierChange?.(res.dossier);
      toast({
        title: formatWorkshop2PersistToastTitle({ scopeLabelRu: 'Matchmaker', ok: res.ok }),
        description: formatWorkshop2PersistToastDescription({
          mirrorField: 'matchmakerMirror',
          ok: res.ok,
          reason: res.reason,
        }),
        variant: res.ok ? 'default' : 'destructive',
      });
    } finally {
      setMirrorBusy(false);
    }
  }, [dossier, onDossierChange, ref.articleId, ref.collectionId, toast]);

  const runMatchmaker = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brand/workshop2/ai/match-contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleDescription }),
      });
      if (!res.ok) throw new Error('Failed to run matchmaker');
      const data = (await res.json()) as MatchContractorsOutput;
      setResult(data);
      toast({ title: 'Анализ завершен', description: 'Подобраны рекомендации подрядчиков.' });
    } catch (error) {
      workshop2DevWarn('matchmaker.run', 'run failed', { cause: error });
      toast({
        title: 'Ошибка',
        description: 'Не удалось подобрать подрядчиков',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getContractorDetails = (id: string) => contractors.find((c) => c.id === id);

  return (
    <Card className="border-border-subtle bg-bg-surface">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-accent-primary h-4 w-4" />
              AI Подбор подрядчика
            </CardTitle>
            <CardDescription className="text-xs">
              Рекомендации на основе требований и оборудования · {syncUi.label}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span data-testid="workshop2-matchmaker-pg-chip">
              <Workshop2OperationalPgMirrorChip {...matchmakerPgMirror} />
            </span>
            <Workshop2DossierPersistButton
              busy={mirrorBusy}
              disabled={!dossier}
              onClick={() => void persistMirror()}
              title="matchmakerMirror"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={runMatchmaker}
              disabled={loading}
              className="h-8 text-xs"
            >
              {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
              {result ? 'Обновить подбор' : 'Подобрать подрядчиков'}
            </Button>
          </div>
        </div>
      </CardHeader>
      {result ? (
        <CardContent className="space-y-3 pt-0">
          {result.matches.map((match, idx) => {
            const contractor = getContractorDetails(match.contractorId);
            return (
              <div
                key={idx}
                className="bg-bg-surface2 border-border-subtle rounded-md border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Factory className="text-text-muted h-4 w-4" />
                    <p className="font-semibold">{contractor?.label || match.contractorId}</p>
                  </div>
                  <Badge variant={match.score >= 80 ? 'default' : 'secondary'}>
                    {match.score}% совпадение
                  </Badge>
                </div>
                <p className="text-text-secondary mt-2 text-xs leading-relaxed">
                  {match.rationale}
                </p>
              </div>
            );
          })}
        </CardContent>
      ) : null}
    </Card>
  );
}
