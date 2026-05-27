'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAqlPlan, AqlLevel } from '@/lib/production/aql-standards';

import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { fetchWorkshop2SampleOrders } from '@/lib/production/workshop2-sample-api-client';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  summarizeWorkshop2AqlInspectionStatus,
  summarizeWorkshop2AqlPanelDisplayFromMirror,
  collectWorkshop2AqlSignoffGateChecks,
} from '@/lib/production/workshop2-aql-inspection-status';
import { persistWorkshop2QcAqlRecordToDossier } from '@/lib/production/workshop2-qc-aql-dossier-persist';
import { putWorkshop2Wave30DossierPatch } from '@/lib/production/workshop2-wave30-persist-client';
import {
  Workshop2OperationalMetaChips,
  Workshop2OperationalPanelChrome,
  Workshop2OperationalPanelShell,
  Workshop2OperationalPgMirrorChip,
} from '@/components/brand/production/workshop2-operational-panel-chrome';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';
import { Workshop2GateChecksBlock } from '@/components/brand/production/Workshop2GateChecksBlock';
import { summarizeWorkshop2AqlPgMirror } from '@/lib/production/workshop2-operational-pg-mirror-status';
import {
  formatWorkshop2PersistToastDescription,
  formatWorkshop2PersistToastTitle,
} from '@/lib/production/workshop2-persist-toast-messages';

export function Workshop2AQLInspectionPanel({
  dossier = null,
  onDossierChange,
}: {
  dossier?: Workshop2DossierPhase1 | null;
  onDossierChange?: (next: Workshop2DossierPhase1) => void;
} = {}) {
  const { ref, bundle, mergeBundle } = useArticleWorkspace();
  const { toast } = useToast();
  const [persisting, setPersisting] = useState(false);
  const qc = bundle?.qc;
  const batches = qc?.batches || [];

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [sampleOrderQty, setSampleOrderQty] = useState<number | null>(null);

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const [fallbackOrderQty, setFallbackOrderQty] = useState<number>(1000);

  useEffect(() => {
    void fetchWorkshop2SampleOrders(ref.collectionId, String(ref.articleId)).then((orders) => {
      const q = orders[0]?.quantity;
      if (typeof q === 'number' && q > 0) setSampleOrderQty(q);
    });
  }, [ref.collectionId, ref.articleId]);
  const [aqlLevel, setAqlLevel] = useState<string>('2.5');
  const [criticalFound, setCriticalFound] = useState<number>(0);
  const [fallbackMajorFound, setFallbackMajorFound] = useState<number>(0);
  const [minorFound, setMinorFound] = useState<number>(0);

  const orderQty = activeBatch
    ? activeBatch.batchSize || sampleOrderQty || fallbackOrderQty
    : sampleOrderQty || fallbackOrderQty;
  const majorFound = activeBatch ? activeBatch.majorDefects || 0 : fallbackMajorFound;

  const handleOrderQtyChange = (val: number) => {
    if (activeBatch && qc) {
      void mergeBundle({
        qc: {
          ...qc,
          batches: qc.batches.map((b) => (b.id === activeBatch.id ? { ...b, batchSize: val } : b)),
        },
      });
    } else {
      setFallbackOrderQty(val);
    }
  };

  const handleMajorFoundChange = (val: number) => {
    if (activeBatch && qc) {
      void mergeBundle({
        qc: {
          ...qc,
          batches: qc.batches.map((b) =>
            b.id === activeBatch.id ? { ...b, majorDefects: val } : b
          ),
        },
      });
    } else {
      setFallbackMajorFound(val);
    }
  };

  const aqlLevelTyped = aqlLevel as AqlLevel;
  const majorAqlPlan = getAqlPlan(orderQty, aqlLevelTyped);
  // For minor defects, ISO usually suggests a more relaxed AQL level by shifting index.
  const minorAqlLevel = aqlLevelTyped === '1.5' ? '2.5' : aqlLevelTyped === '2.5' ? '4.0' : '4.0';
  const minorAqlPlan = getAqlPlan(orderQty, minorAqlLevel as AqlLevel);

  const sampleSize = majorAqlPlan.sampleSize;

  const isFail =
    criticalFound > 0 ||
    majorFound >= majorAqlPlan.rejectLimit ||
    minorFound >= minorAqlPlan.rejectLimit;

  const qtySource: 'batch' | 'sample_order' | 'fallback' = activeBatch?.batchSize
    ? 'batch'
    : sampleOrderQty != null && sampleOrderQty > 0
      ? 'sample_order'
      : 'fallback';

  const persistAqlToPg = useCallback(async () => {
    if (!dossier) return;
    setPersisting(true);
    try {
      const res = await putWorkshop2Wave30DossierPatch({
        collectionId: ref.collectionId,
        articleId: String(ref.articleId),
        base: dossier,
        apply: (d) =>
          persistWorkshop2QcAqlRecordToDossier(d, {
            orderQty,
            qtySource,
            aqlLevel,
            sampleSize,
            criticalFound,
            majorFound,
            minorFound,
            majorRejectLimit: majorAqlPlan.rejectLimit,
            minorRejectLimit: minorAqlPlan.rejectLimit,
            isFail,
            batchId: activeBatch?.id,
          }),
        field: 'qc_aql_mirror',
        updatedByLabel: 'aql-panel',
        meta: { isFail, aqlLevel },
      });
      if (res.ok) onDossierChange?.(res.dossier);
      toast({
        title: formatWorkshop2PersistToastTitle({ scopeLabelRu: 'AQL', ok: res.ok }),
        description: formatWorkshop2PersistToastDescription({
          mirrorField: 'qcAqlMirror',
          ok: res.ok,
          reason: res.reason,
        }),
        variant: res.ok ? 'default' : 'destructive',
      });
    } finally {
      setPersisting(false);
    }
  }, [
    activeBatch?.id,
    aqlLevel,
    criticalFound,
    dossier,
    isFail,
    majorAqlPlan.rejectLimit,
    majorFound,
    minorAqlPlan.rejectLimit,
    minorFound,
    onDossierChange,
    orderQty,
    qtySource,
    ref.articleId,
    ref.collectionId,
    sampleSize,
    toast,
  ]);

  const aqlStatus = useMemo(
    () =>
      summarizeWorkshop2AqlPanelDisplayFromMirror({
        dossier,
        live: summarizeWorkshop2AqlInspectionStatus({
          batchCount: batches.length,
          orderQty,
          qtySource,
          majorPlan: majorAqlPlan,
          criticalFound,
          majorFound,
          minorFound,
          minorRejectLimit: minorAqlPlan.rejectLimit,
        }),
      }),
    [
      batches.length,
      orderQty,
      qtySource,
      majorAqlPlan,
      criticalFound,
      majorFound,
      minorFound,
      minorAqlPlan.rejectLimit,
      dossier,
    ]
  );

  const aqlPgMirror = useMemo(() => summarizeWorkshop2AqlPgMirror(dossier), [dossier]);

  const aqlSignoffGateChecks = useMemo(
    () => collectWorkshop2AqlSignoffGateChecks({ dossier, isFail }),
    [dossier, isFail]
  );

  const aqlSignoffBlocked = aqlSignoffGateChecks.some((c) => c.severity === 'blocker');

  const aqlMeta = {
    summary: aqlStatus.hintRu,
    readiness:
      aqlStatus.state !== 'ready'
        ? `Qty: ${aqlStatus.orderQty} (${aqlStatus.qtySource}) Â· sample: ${aqlStatus.sampleSize}`
        : 'AQL ÑÐ°ÑÑÑÑ Ð³Ð¾ÑÐ¾Ð²',
    nextAction: aqlStatus.isFail
      ? 'Ð¡ÐºÐ¾ÑÑÐµÐºÑÐ¸ÑÑÐ¹ÑÐµ Ð´ÐµÑÐµÐºÑÑ Ð¸Ð»Ð¸ Ð¿Ð°ÑÑÐ¸Ñ'
      : 'Ð¡Ð¾ÑÑÐ°Ð½Ð¸ÑÐµ AQL mirror Ð² Ð´Ð¾ÑÑÐµ',
    blockers: aqlStatus.isFail ? ['AQL fail â Ð¿Ð°ÑÑÐ¸Ñ Ð½Ðµ Ð¿ÑÐ¾ÑÐ¾Ð´Ð¸Ñ'] : undefined,
  };

  return (
    <Workshop2OperationalPanelShell
      className="scroll-mt-24 space-y-6"
      id="w2article-section-aql"
      data-testid="workshop2-aql-inspection-panel"
    >
      <Workshop2OperationalPanelChrome
        icon={AlertTriangle}
        title="ÐÐ°Ð»ÑÐºulator Ð¸Ð½ÑÐ¿ÐµÐºÑÐ¸Ð¸ (AQL)"
        description={`Ð Ð°ÑÑÑÑ Ð²ÑÐ±Ð¾ÑÐºÐ¸ ISO 2859-1 (AQL).${sampleOrderQty ? ` qty Ð¾Ð±ÑÐ°Ð·ÑÐ° Ð¸Ð· API: ${sampleOrderQty}` : ''}`}
        meta={<Workshop2OperationalMetaChips {...aqlMeta} />}
        actions={
          <>
            <span data-testid="workshop2-aql-pg-chip">
              <Workshop2OperationalPgMirrorChip {...aqlPgMirror} />
            </span>
            <Workshop2DossierPersistButton
              busy={persisting}
              disabled={!dossier || aqlSignoffBlocked}
              onClick={() => void persistAqlToPg()}
              title="qcAqlMirror â PG"
            />
            {dossier?.qcAqlMirror?.recordedAt ? (
              <span className="text-text-muted font-mono text-[10px]">
                mirror{' '}
                {new Date(dossier.qcAqlMirror.recordedAt).toLocaleString('ru-RU', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            ) : null}
            {batches.length > 0 && (
              <Select value={activeBatch?.id || ''} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="h-8 w-[180px] bg-white text-xs">
                  <SelectValue placeholder="ÐÑÐ±ÐµÑÐ¸ÑÐµ Ð¿Ð°ÑÑÐ¸Ñ" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        }
      />

      {aqlSignoffGateChecks.length > 0 ? (
        <Workshop2GateChecksBlock
          checks={aqlSignoffGateChecks}
          title="AQL sign-off gate"
          testId="workshop2-aql-signoff-gate-checks"
          collectionId={ref.collectionId}
          articleUrlSegment={String(ref.articleId)}
        />
      ) : null}

      <div className="relative mt-4">
        <div className="pointer-events-none absolute right-4 top-0 z-10 hidden opacity-90 md:block">
          <div
            className={cn(
              'rotate-12 rounded-lg border-4 px-6 py-2 text-4xl font-bold uppercase tracking-widest',
              isFail
                ? 'border-red-500 bg-red-50/50 text-red-500'
                : 'border-emerald-500 bg-emerald-50/50 text-emerald-500'
            )}
          >
            {isFail ? 'ÐÐ ÐÐ' : 'ÐÐ ÐÐÐ¯Ð¢Ð'}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <Label className="text-text-secondary">Ð Ð°Ð·Ð¼ÐµÑ Ð¿Ð°ÑÑÐ¸Ð¸ (ÑÑ.)</Label>
            <Input
              type="number"
              value={orderQty}
              onChange={(e) => handleOrderQtyChange(Number(e.target.value))}
              min={1}
              className="font-mono text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">Ð£ÑÐ¾Ð²ÐµÐ½Ñ AQL</Label>
            <Select value={aqlLevel} onValueChange={setAqlLevel}>
              <SelectTrigger className="font-mono text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5 (Ð¶ÑÑÑÐºÐ¸Ð¹)</SelectItem>
                <SelectItem value="2.5">2.5 (ÑÑÐ°Ð½Ð´Ð°ÑÑ)</SelectItem>
                <SelectItem value="4.0">4.0 (ÑÐ¼ÑÐ³ÑÑÐ½Ð½ÑÐ¹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">ÐÐ±ÑÑÐ¼ Ð²ÑÐ±Ð¾ÑÐºÐ¸</Label>
            <div className="text-text-primary font-mono text-3xl font-bold">{sampleSize}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">ÐÑÐ¾Ð³</Label>
            <div className="mt-1 flex items-center gap-2">
              {isFail ? (
                <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
                  <XCircle className="h-6 w-6" /> ÐÐµ Ð¿ÑÐ¸Ð½ÑÑÐ¾
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg font-semibold text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" /> ÐÑÐ¸Ð½ÑÑÐ¾
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-border-subtle overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-bg-surface2">
              <TableRow>
                <TableHead className="w-[200px]">Ð¢Ð¸Ð¿ Ð´ÐµÑÐµÐºÑÐ°</TableHead>
                <TableHead>ÐÐ¾ÑÐ¾Ð³Ð¸ (Ð¿ÑÐ¸Ð½ÑÑÑ / Ð¾ÑÐºÐ»Ð¾Ð½Ð¸ÑÑ)</TableHead>
                <TableHead>ÐÐ°Ð¹Ð´ÐµÐ½Ð¾</TableHead>
                <TableHead>Ð¡ÑÐ°ÑÑÑ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-red-600">ÐÑÐ¸ÑÐ¸ÑÐµÑÐºÐ¸Ð¹</TableCell>
                <TableCell className="font-mono">0 / 1</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={criticalFound}
                    onChange={(e) => setCriticalFound(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {criticalFound > 0 ? (
                    <Badge variant="destructive">ÐÑÐ°Ðº</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      ÐÐ¾ÑÐ¼Ð°
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-amber-600">ÐÐ½Ð°ÑÐ¸ÑÐµÐ»ÑÐ½ÑÐ¹</TableCell>
                <TableCell className="font-mono">
                  {majorAqlPlan.acceptLimit} / {majorAqlPlan.rejectLimit}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={majorFound}
                    onChange={(e) => handleMajorFoundChange(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {majorFound >= majorAqlPlan.rejectLimit ? (
                    <Badge variant="destructive">ÐÑÐ°Ðº</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      ÐÐ¾ÑÐ¼Ð°
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-blue-600">ÐÐµÐ·Ð½Ð°ÑÐ¸ÑÐµÐ»ÑÐ½ÑÐ¹</TableCell>
                <TableCell className="font-mono">
                  {minorAqlPlan.acceptLimit} / {minorAqlPlan.rejectLimit}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={minorFound}
                    onChange={(e) => setMinorFound(Number(e.target.value))}
                    min={0}
                    className="w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  {minorFound >= minorAqlPlan.rejectLimit ? (
                    <Badge variant="destructive">ÐÑÐ°Ðº</Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      ÐÐ¾ÑÐ¼Ð°
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Workshop2OperationalPanelShell>
  );
}
