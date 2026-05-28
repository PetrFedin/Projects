'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Download, ChevronDown, ChevronUp } from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2DppExportBlock,
  buildWorkshop2DppJsonLdStub,
} from '@/lib/production/workshop2-dpp-export';
import {
  buildWorkshop2DppExportValidationRecord,
  evaluateWorkshop2DppExportGate,
} from '@/lib/production/workshop2-dpp-export-gate';
import { validateWorkshop2DppJsonLdForExport } from '@/lib/production/workshop2-dpp-jsonld-validator';
import { saveWorkshop2DossierToApi } from '@/lib/production/workshop2-api-client';
import { Workshop2CeilingIntegrationBlock } from '@/components/brand/production/Workshop2CeilingIntegrationBlock';
import { fetchWorkshop2LiveIntegrationProbes } from '@/lib/production/workshop2-live-integration-probes-client';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { useToast } from '@/hooks/use-toast';
import { evaluateWorkshop2DppRegistryWriteHonesty } from '@/lib/production/workshop2-dpp-registry-write-honesty';
import {
  collectWorkshop2DppExportChecks,
  workshop2DppExportBlocked,
} from '@/lib/production/workshop2-dpp-export-checks';
import { Workshop2GateChecksBlock } from '@/components/brand/production/Workshop2GateChecksBlock';
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import { parseWorkshop2ApiGateChecksFromJson } from '@/lib/production/workshop2-api-gate-messages';

type Props = {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
  onDossierSaved?: (next: Workshop2DossierPhase1) => void;
};

/** Экспорт заготовки DPP из досье (BOM + паспорт → JSON-LD). */
export function Workshop2DppDossierExportBlock({
  dossier,
  collectionId,
  articleId,
  articleSku,
  articleName,
  onDossierSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [validating, setValidating] = useState(false);
  const [stagingBusy, setStagingBusy] = useState(false);
  const [dppLiveConfigured, setDppLiveConfigured] = useState(false);
  const [exportGateChecks, setExportGateChecks] = useState<Workshop2ApiGateCheck[] | null>(null);

  useEffect(() => {
    void fetchWorkshop2LiveIntegrationProbes().then((p) => {
      if (p) setDppLiveConfigured(p.dpp);
    });
  }, []);
  const registryHonesty = useMemo(
    () =>
      evaluateWorkshop2DppRegistryWriteHonesty({
        dossier,
        collectionId,
        articleId,
      }),
    [dossier, collectionId, articleId]
  );
  const dppExportChecks = useMemo(
    () =>
      collectWorkshop2DppExportChecks({
        dossier,
        collectionId,
        articleId,
        articleSku,
        articleName,
      }),
    [dossier, collectionId, articleId, articleSku, articleName]
  );
  const dppExportBlocked = workshop2DppExportBlocked(dppExportChecks);
  const block = useMemo(
    () =>
      buildWorkshop2DppExportBlock({
        dossier,
        collectionId,
        articleId,
        articleSku,
        articleName,
      }),
    [dossier, collectionId, articleId, articleSku, articleName]
  );
  const jsonLdValidation = useMemo(
    () =>
      validateWorkshop2DppJsonLdForExport({
        dossier,
        collectionId,
        articleId,
        articleSku,
        articleName,
      }),
    [dossier, collectionId, articleId, articleSku, articleName]
  );

  const downloadJsonLd = () => {
    if (dppExportBlocked) {
      setExportGateChecks(dppExportChecks);
      toast({
        title: 'Экспорт DPP заблокирован',
        description: dppExportChecks.find((c) => c.severity === 'blocker')?.messageRu,
        variant: 'destructive',
      });
      return;
    }
    setExportGateChecks(null);
    const jsonLd = buildWorkshop2DppJsonLdStub(block);
    const blob = new Blob([JSON.stringify(jsonLd, null, 2)], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpp-draft-${block.passportId}.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
      <Workshop2CeilingIntegrationBlock
        catalogId={50}
        kind="dpp"
        partnerAckId={dossier.dppRegistryDraftMirror?.partnerAckId ?? null}
        stagingContractMode={dossier.dppRegistryDraftMirror?.stagingContractMode}
        disabledReasonRu={
          !dppLiveConfigured
            ? 'WORKSHOP2_DPP_REGISTRY_URL не задан — staging POST недоступен (fail-closed).'
            : undefined
        }
        stagingBusy={stagingBusy}
        stagingLabel="Проба реестра DPP"
        onStagingAttempt={async () => {
          setStagingBusy(true);
          try {
            const res = await fetch(
              `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/dpp/registry-staging`,
              { method: 'POST', headers: buildWorkshop2ApiRequestHeaders() }
            );
            const json = (await res.json()) as {
              ok?: boolean;
              error?: string;
              skipped?: boolean;
              messageRu?: string;
              registryStubOnly?: boolean;
              checks?: unknown;
            };
            if (!json.ok) {
              const apiChecks = parseWorkshop2ApiGateChecksFromJson(json);
              if (apiChecks.length) setExportGateChecks(apiChecks);
              toast({
                title: registryHonesty.registryStubOnly
                  ? 'DPP registry stub only'
                  : 'DPP staging fail-closed',
                description: json.messageRu ?? json.error ?? `HTTP ${res.status}`,
                variant: 'destructive',
              });
            } else if (json.ok && registryHonesty.allowStagingSuccessUi) {
              toast({
                title: 'DPP staging',
                description: 'Journal записан в досье (ACK только из HTTP).',
              });
            }
          } finally {
            setStagingBusy(false);
          }
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Leaf className="h-4 w-4 text-emerald-700" />
        <span className="text-[11px] font-semibold text-emerald-900">Экспорт заготовки DPP</span>
        <Badge
          variant="outline"
          className={
            registryHonesty.registryStubOnly
              ? 'border-amber-300 text-[9px] text-amber-900'
              : 'border-emerald-300 text-[9px] text-emerald-800'
          }
        >
          {registryHonesty.registryStubOnly
            ? `${block.registryStub.scheme} · stub`
            : block.registryStub.scheme}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-6 px-1 text-[10px]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>
      <p className="text-[10px] leading-snug text-emerald-800/90">
        JSON-LD из BOM и полей паспорта/бирки. EU registry write-back не выполняется —{' '}
        <span className="font-mono">{block.registryStub.status}</span>.
      </p>
      {block.compositionText ? (
        <p className="text-[10px] text-slate-700">
          <span className="font-semibold">Состав:</span> {block.compositionText}
        </p>
      ) : (
        <p className="text-[10px] text-amber-800">
          Заполните BOM или бирку состава в ТЗ → материалы.
        </p>
      )}
      {block.customsTnvedCode ? (
        <p className="text-[10px] text-slate-700">
          <span className="font-semibold">ТН ВЭД:</span> {block.customsTnvedCode}
        </p>
      ) : null}
      {block.colorways?.length ? (
        <p className="text-[10px] text-slate-700">
          <span className="font-semibold">Цветомодель:</span>{' '}
          {block.colorways.map((c) => `${c.paletteCode} (${c.label})`).join(', ')}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={
            jsonLdValidation.state === 'valid'
              ? 'border-emerald-300 text-[9px] text-emerald-800'
              : 'border-amber-300 text-[9px] text-amber-900'
          }
        >
          JSON-LD schema:{' '}
          {jsonLdValidation.state === 'valid'
            ? 'valid'
            : `invalid (${jsonLdValidation.issueCount})`}
        </Badge>
        {dossier.dppExportValidation?.schemaState ? (
          <span className="text-[9px] text-slate-600">
            PG · {dossier.dppExportValidation.schemaState}
          </span>
        ) : null}
      </div>
      {open ? (
        <pre className="max-h-40 overflow-x-auto rounded bg-white/70 p-2 font-mono text-[9px]">
          {JSON.stringify(jsonLdValidation.previewJsonLd, null, 2)}
        </pre>
      ) : null}
      {jsonLdValidation.state === 'invalid' && jsonLdValidation.issues.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-[9px] text-amber-900">
          {jsonLdValidation.issues.slice(0, 4).map((i) => (
            <li key={i.code}>{i.messageRu}</li>
          ))}
        </ul>
      ) : null}
      {dppExportBlocked ? (
        <p className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-900">
          {dppExportChecks.find((c) => c.severity === 'blocker')?.messageRu}
        </p>
      ) : null}
      {(exportGateChecks?.length ?? dppExportChecks.length) ? (
        <Workshop2GateChecksBlock
          checks={exportGateChecks ?? dppExportChecks}
          title="DPP export gate — полный список проверок"
          testId="workshop2-dpp-export-gate-checks"
          collectionId={collectionId}
          articleUrlSegment={articleId}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          disabled={dppExportBlocked}
          title={
            !dppLiveConfigured
              ? 'JSON-LD draft — live EU DPP registry (WORKSHOP2_DPP_REGISTRY_URL) не подключён'
              : undefined
          }
          onClick={downloadJsonLd}
        >
          <Download className="mr-1 h-3 w-3" />
          Скачать JSON-LD
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          disabled={!dppLiveConfigured || dppExportBlocked}
          title={
            !dppLiveConfigured
              ? 'WORKSHOP2_DPP_REGISTRY_URL не задан — EU registry write-back недоступен'
              : 'Live DPP registry'
          }
          onClick={() => {
            if (!dppLiveConfigured) return;
            toast({
              title: 'DPP registry',
              description: 'Используйте настроенный EU DPP endpoint (production).',
            });
          }}
        >
          EU registry (live)
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 text-[10px]"
          disabled={validating}
          title={
            !dppLiveConfigured
              ? 'Локальная фиксация в досье; EU registry write-back требует WORKSHOP2_DPP_REGISTRY_URL'
              : undefined
          }
          onClick={() => {
            void (async () => {
              setValidating(true);
              try {
                const record = buildWorkshop2DppExportValidationRecord({
                  dossier,
                  collectionId,
                  articleId,
                  articleSku,
                  articleName,
                });
                const next = { ...dossier, dppExportValidation: record };
                await saveWorkshop2DossierToApi(collectionId, articleId, next);
                onDossierSaved?.(next);
              } finally {
                setValidating(false);
              }
            })();
          }}
        >
          {validating ? '…' : 'Зафиксировать DPP в досье'}
        </Button>
      </div>
    </div>
  );
}
