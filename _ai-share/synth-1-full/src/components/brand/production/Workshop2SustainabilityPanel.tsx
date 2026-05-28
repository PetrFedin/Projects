'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import { useToast } from '@/hooks/use-toast';
import { persistWorkshop2SustainabilityLcaToDossier } from '@/lib/production/workshop2-sustainability-lca-persist';
import {
  evaluateWorkshop2SustainabilityCarbonRollup,
  persistWorkshop2SustainabilityCarbonRollupToDossier,
} from '@/lib/production/workshop2-sustainability-carbon-rollup';
import { putWorkshop2Wave20DossierPatch } from '@/lib/production/workshop2-wave20-persist-client';
import { Leaf } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import {
  buildWorkshop2DppExportBlock,
  extractWorkshop2DppMaterialsFromDossier,
} from '@/lib/production/workshop2-dpp-export';
import {
  collectWorkshop2SustainabilityExportChecks,
  workshop2SustainabilityExportBlocked,
} from '@/lib/production/workshop2-sustainability-export-checks';
import {
  evaluateWorkshop2CarbonRollupPersistHonestyGate,
  summarizeWorkshop2CarbonRollupPersistHonesty,
} from '@/lib/production/workshop2-sustainability-carbon-rollup-honesty';
import { Workshop2GateChecksBlock } from '@/components/brand/production/Workshop2GateChecksBlock';
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import { Workshop2DppDossierExportBlock } from '@/components/brand/production/Workshop2DppDossierExportBlock';
import { Workshop2SurfaceStatusBanner } from '@/components/brand/production/Workshop2SurfaceStatusBanner';
import { Workshop2CeilingIntegrationBlock } from '@/components/brand/production/Workshop2CeilingIntegrationBlock';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { fetchWorkshop2LiveIntegrationProbes } from '@/lib/production/workshop2-live-integration-probes-client';
import { summarizeWorkshop2SustainabilityStatus } from '@/lib/production/workshop2-sustainability-status';

/**
 * Эко-показатели из досье (BOM + бирка) — тот же расчёт, что DPP export.
 * Без отдельного bundle.dpp и без фейкового публичного URL реестра.
 */
export function Workshop2SustainabilityPanel({
  dossier,
  onDossierChange,
}: {
  dossier: Workshop2DossierPhase1;
  onDossierChange?: (next: Workshop2DossierPhase1) => void;
}) {
  const { ref } = useArticleWorkspace();
  const { toast } = useToast();
  const [persisting, setPersisting] = useState(false);
  const [rollupBusy, setRollupBusy] = useState(false);
  const [stagingBusy, setStagingBusy] = useState(false);
  const [lcaLiveConfigured, setLcaLiveConfigured] = useState(false);
  const [exportGateChecks, setExportGateChecks] = useState<Workshop2ApiGateCheck[] | null>(null);

  useEffect(() => {
    void fetchWorkshop2LiveIntegrationProbes().then((r) => {
      if (r?.probes) setLcaLiveConfigured(r.probes.sustainability);
    });
  }, []);

  const block = useMemo(
    () =>
      buildWorkshop2DppExportBlock({
        dossier,
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
      }),
    [dossier, ref.articleId, ref.collectionId]
  );

  const materials = useMemo(() => extractWorkshop2DppMaterialsFromDossier(dossier), [dossier]);
  const hasBomSource = materials.length > 0;
  const carbonRollup = useMemo(
    () =>
      evaluateWorkshop2SustainabilityCarbonRollup({
        dossier,
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
      }),
    [dossier, ref.articleId, ref.collectionId]
  );

  const sustainabilityStatus = useMemo(
    () =>
      summarizeWorkshop2SustainabilityStatus({
        dossier,
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
      }),
    [dossier, ref.articleId, ref.collectionId]
  );

  const sustainabilityExportChecks = useMemo(() => {
    const base = collectWorkshop2SustainabilityExportChecks({
      dossier,
      collectionId: ref.collectionId,
      articleId: String(ref.articleId),
    });
    const carbonHonesty = evaluateWorkshop2CarbonRollupPersistHonestyGate({
      dossier,
      collectionId: ref.collectionId,
      articleId: String(ref.articleId),
    });
    return carbonHonesty ? [...base, carbonHonesty] : base;
  }, [dossier, ref.articleId, ref.collectionId]);
  const sustainabilityExportBlocked = workshop2SustainabilityExportBlocked(
    sustainabilityExportChecks
  );

  const carbonRollupHonesty = useMemo(
    () =>
      summarizeWorkshop2CarbonRollupPersistHonesty({
        dossier,
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
      }),
    [dossier, ref.articleId, ref.collectionId]
  );

  const persistLca = useCallback(async () => {
    setPersisting(true);
    try {
      const res = await putWorkshop2Wave20DossierPatch({
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
        base: dossier,
        apply: (d) =>
          persistWorkshop2SustainabilityLcaToDossier(d, {
            collectionId: ref.collectionId,
            articleId: String(ref.articleId),
          }),
        field: 'sustainability_lca_snapshot',
        updatedByLabel: 'sustainability-panel',
      });
      if (res.ok) onDossierChange?.(res.dossier);
      toast({
        title: res.ok ? 'LCA в PG' : 'Локально',
        description: res.ok
          ? 'Эко/LCA snapshot записан в досье (export-tz gate).'
          : `Сервер: ${res.reason ?? 'offline'}`,
        variant: res.ok ? 'default' : 'destructive',
      });
    } finally {
      setPersisting(false);
    }
  }, [dossier, onDossierChange, ref.articleId, ref.collectionId, toast]);

  return (
    <div className="border-border-default mt-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
            <Leaf className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Эко-след и DPP (из ТЗ)</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Показатели из BOM и полей паспорта/бирки — те же данные, что JSON-LD в
              export-tz-bundle. EU registry write-back не подключён.
            </p>
          </div>
        </div>
        <Workshop2DossierPersistButton
          busy={rollupBusy}
          disabled={!hasBomSource}
          className="h-8 shrink-0 text-[11px]"
          title="Heuristic BOM carbon rollup + threshold warnings "
          onClick={() => {
            void (async () => {
              setRollupBusy(true);
              try {
                const res = await putWorkshop2Wave20DossierPatch({
                  collectionId: ref.collectionId,
                  articleId: String(ref.articleId),
                  base: dossier,
                  apply: (d) =>
                    persistWorkshop2SustainabilityCarbonRollupToDossier(d, {
                      collectionId: ref.collectionId,
                      articleId: String(ref.articleId),
                    }),
                  field: 'sustainability_carbon_rollup',
                  updatedByLabel: 'sustainability-panel',
                });
                if (res.ok) onDossierChange?.(res.dossier);
                toast({
                  title: res.ok ? 'Carbon rollup в PG' : 'Локально',
                  description: res.ok ? carbonRollup.hintRu : (res.reason ?? 'offline'),
                  variant: res.ok ? 'default' : 'destructive',
                });
              } finally {
                setRollupBusy(false);
              }
            })();
          }}
        />
        <Workshop2DossierPersistButton
          busy={persisting}
          disabled={!hasBomSource}
          className="h-8 shrink-0 text-[11px]"
          title="sustainabilityLcaSnapshot "
          onClick={() => void persistLca()}
        />
      </div>
      {dossier.sustainabilityCarbonRollupMirror?.thresholdWarnings?.length ? (
        <ul className="mb-2 list-disc rounded border border-amber-200 bg-amber-50 px-2 py-1 pl-4 text-[10px] text-amber-900">
          {dossier.sustainabilityCarbonRollupMirror.thresholdWarnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : carbonRollup.thresholdWarnings.length > 0 ? (
        <p className="mb-2 text-[10px] text-amber-800">{carbonRollup.thresholdWarnings[0]}</p>
      ) : null}
      {!carbonRollupHonesty.persisted && carbonRollupHonesty.computed ? (
        <p className="mb-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-900">
          {carbonRollupHonesty.hintRu}
        </p>
      ) : null}
      {dossier.sustainabilityLcaSnapshot?.snapshotAt ? (
        <p className="text-text-muted mb-2 font-mono text-[10px]">
          PG LCA ·{' '}
          {new Date(dossier.sustainabilityLcaSnapshot.snapshotAt).toLocaleString('ru-RU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </p>
      ) : null}

      <Workshop2CeilingIntegrationBlock
        catalogId={53}
        kind="sustainability"
        partnerAckId={dossier.sustainabilityStagingMirror?.partnerAckId ?? null}
        stagingContractMode={dossier.sustainabilityStagingMirror?.stagingContractMode}
        stagingBusy={stagingBusy}
        onStagingAttempt={async () => {
          if (sustainabilityExportBlocked) {
            setExportGateChecks(sustainabilityExportChecks);
            toast({
              title: 'LCA staging fail-closed',
              description: sustainabilityExportChecks.find((c) => c.severity === 'blocker')
                ?.messageRu,
              variant: 'destructive',
            });
            return;
          }
          setStagingBusy(true);
          try {
            const res = await fetch(
              `/api/workshop2/articles/${encodeURIComponent(ref.collectionId)}/${encodeURIComponent(String(ref.articleId))}/sustainability/lca-staging`,
              { method: 'POST', headers: buildWorkshop2ApiRequestHeaders() }
            );
            const json = (await res.json()) as {
              ok?: boolean;
              error?: string;
              messageRu?: string;
              checks?: unknown;
            };
            if (!json.ok) {
              setExportGateChecks(
                Array.isArray(json.checks)
                  ? (json.checks as Workshop2ApiGateCheck[])
                  : sustainabilityExportChecks
              );
            } else {
              setExportGateChecks(null);
            }
            toast({
              title: json.ok ? 'LCA staging' : 'LCA staging fail-closed',
              description: json.ok
                ? 'Journal в досье.'
                : (json.messageRu ?? json.error ?? `HTTP ${res.status}`),
              variant: json.ok ? 'default' : 'destructive',
            });
          } finally {
            setStagingBusy(false);
          }
        }}
      />
      <Workshop2SurfaceStatusBanner
        hintRu={sustainabilityStatus.hintRu}
        detailRu={
          hasBomSource
            ? `Eco ${sustainabilityStatus.ecoScore}/100 · вторсырьё ${sustainabilityStatus.recycledContentPct}%`
            : undefined
        }
        tone={sustainabilityStatus.state === 'ready' ? 'emerald' : 'amber'}
      />

      {!hasBomSource ? (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50/80 px-2 py-1.5 text-[11px] text-amber-800">
          Заполните материалы в ТЗ → материалы или состав на бирке.
        </p>
      ) : null}

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
          <div className="text-text-muted mb-1 text-[10px] font-semibold">Углеродный след</div>
          <div className="text-text-primary text-base font-bold">
            {block.metrics.carbonFootprint} kg CO₂e
          </div>
        </div>
        <div className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
          <div className="text-text-muted mb-1 text-[10px] font-semibold">Вода</div>
          <div className="text-text-primary text-base font-bold">{block.metrics.waterUsage} L</div>
        </div>
        <div className="border-border-subtle rounded-lg border bg-white p-3 shadow-sm">
          <div className="text-text-muted mb-1 text-[10px] font-semibold">Вторсырьё</div>
          <div className="text-text-primary text-base font-bold">
            {block.metrics.recycledContentPct}%
          </div>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold text-emerald-800">Эко-балл</div>
          <div className="text-base font-bold text-emerald-700">{block.metrics.ecoScore} / 100</div>
        </div>
      </div>

      <p className="text-text-muted mb-2 font-mono text-[10px]">
        Черновик паспорта: {block.passportId}
      </p>

      <div className="mb-2 flex flex-wrap gap-2">
        {(exportGateChecks?.length ?? sustainabilityExportChecks.length) ? (
          <Workshop2GateChecksBlock
            checks={exportGateChecks ?? sustainabilityExportChecks}
            title="Sustainability export gate — полный список проверок"
            testId="workshop2-sustainability-export-gate-checks"
            className="mb-2 w-full"
            collectionId={ref.collectionId}
            articleUrlSegment={String(ref.articleId)}
          />
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-7 text-[10px]"
          disabled={!lcaLiveConfigured || sustainabilityExportBlocked}
          title={
            sustainabilityExportBlocked
              ? 'Export gate: заполните BOM и LCA snapshot'
              : !lcaLiveConfigured
                ? 'WORKSHOP2_LCA_API_URL / CERTIFIED_LCA_FEED не задан — write-back в EU registry недоступен'
                : 'Live LCA feed подключён'
          }
          onClick={() => {
            if (!lcaLiveConfigured || sustainabilityExportBlocked) {
              setExportGateChecks(sustainabilityExportChecks);
              toast({
                title: 'Registry write-back fail-closed',
                description:
                  sustainabilityExportChecks.find((c) => c.severity === 'blocker')?.messageRu ??
                  'WORKSHOP2_LCA_API_URL не задан — HTTP 503 на staging API.',
                variant: 'destructive',
              });
              return;
            }
            toast({
              title: 'Registry write-back',
              description: 'Используйте настроенный LCA API endpoint (production).',
            });
          }}
        >
          Опубликовать в EU registry (live)
        </Button>
      </div>

      <Workshop2DppDossierExportBlock
        dossier={dossier}
        collectionId={ref.collectionId}
        articleId={String(ref.articleId)}
      />
    </div>
  );
}
