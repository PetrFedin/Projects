'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type {
  CollectionSkuFlowDoc,
  MatrixStepStatus,
  SkuStageDetail,
} from '@/lib/production/unified-sku-flow-store';
import {
  evaluateStageDataFill,
  STAGE_FILL_EDIT_TAB_LABELS,
  type StageFillEditTab,
  type StageFillEvaluationItem,
} from '@/lib/production/stage-data-fill-spec';
import { STAGES_SKU_PANEL_TAB_VALUES, type StagesSkuPanelTab } from '@/lib/production/stages-url';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, LayoutPanelLeft, Lock, Plus, Send, Trash2 } from 'lucide-react';
import { subscribeUnifiedSkuFlowSaved } from '@/lib/production/sku-flow-sync';

const STAGE_FILL_TAB_ORDER = [...STAGES_SKU_PANEL_TAB_VALUES] as StageFillEditTab[];

function catalogStepIndex(steps: readonly { id: string }[], stepId: string): number {
  return steps.findIndex((s) => s.id === stepId);
}

/** Необязательные / с отложенной фиксацией / «не начато не блокирует» — можно вести контекст параллельно основному контуру. */
function stepAllowsParallelContext(step: CollectionStep): boolean {
  if (!step.mandatory) return true;
  if (step.canSkipForNow) return true;
  if (step.relaxesWhenNotStarted) return true;
  return false;
}

function skuStepExpandable(
  step: CollectionStep,
  row: SkuStageDetail,
  stepIdx: number,
  curIdx: number
): boolean {
  const s = row.status;
  const isFuture = stepIdx > curIdx;
  const isPast = stepIdx < curIdx;
  const isCurrent = stepIdx === curIdx;

  if (s === 'done' || s === 'skipped') return true;
  if (s === 'in_progress' || s === 'blocked') return true;
  if (isPast) return true;
  if (isCurrent) return true;
  if (isFuture && stepAllowsParallelContext(step)) return true;
  return false;
}

/** Ссылка в модуль этапа: пройдено, в работе / блок, текущий или прошлый узел каталога, либо параллельный допустимый этап. */
function skuStepShowWorkLink(
  step: CollectionStep,
  row: SkuStageDetail,
  stepIdx: number,
  curIdx: number
): boolean {
  const s = row.status;
  const isPast = stepIdx < curIdx;
  const isCurrent = stepIdx === curIdx;
  const isFuture = stepIdx > curIdx;

  if (s === 'done' || s === 'skipped' || s === 'in_progress' || s === 'blocked') return true;
  if (isPast || isCurrent) return true;
  if (isFuture && stepAllowsParallelContext(step)) return true;
  return false;
}

/** Как buildTransitionUrl в матрице/доске; для collectionScoped — только контекст коллекции (без stagesSku). */
function workTabHrefForStep(
  step: CollectionStep,
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string,
  floorHref: (tab: ProductionFloorTabId) => string,
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string,
  collectionQuery?: string
): string | null {
  const collectionScoped =
    Boolean(step.collectionScopedModuleNav) &&
    mergeCollectionQuery &&
    collectionQuery !== undefined;
  if (collectionScoped) {
    if (step.productionFloorTab)
      return mergeCollectionQuery(floorHref(step.productionFloorTab), collectionQuery);
    if (step.href) return mergeCollectionQuery(step.href, collectionQuery);
    return null;
  }
  if (step.productionFloorTab) return mergeModuleHref(floorHref(step.productionFloorTab), step.id);
  if (step.href) return mergeModuleHref(step.href, step.id);
  return null;
}

function crossLinkHrefForStep(
  step: CollectionStep,
  href: string,
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string,
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string,
  collectionQuery?: string
): string {
  const collectionScoped =
    Boolean(step.collectionScopedModuleNav) &&
    mergeCollectionQuery &&
    collectionQuery !== undefined;
  if (collectionScoped) return mergeCollectionQuery(href, collectionQuery);
  return mergeModuleHref(href, step.id);
}

const STATUS_OPTS: { v: MatrixStepStatus | 'blocked' | 'skipped'; l: string }[] = [
  { v: 'not_started', l: 'Не начато' },
  { v: 'in_progress', l: 'В работе' },
  { v: 'done', l: 'Готово' },
  { v: 'blocked', l: 'Заблокировано' },
  { v: 'skipped', l: 'Пропуск' },
];

type DetailSection = 'process' | 'people' | 'costs' | 'outputs';
type StageDialogTab = DetailSection | 'history' | 'files';

/** Как на «Доске этапов» (оперативка): 4 колонки в ряд. */
const SKU_BOARD_STAGES_PER_ROW = 4;

/** Совпадает с шапкой колонки доски в StagesDependenciesTabContent */
const SKU_BOARD_COL_HEADER = 'min-h-[92px]';

function chunkSkuBoardRows<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size) as T[]);
  return out;
}

function StageDataFillBar({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn('bg-border-subtle h-1.5 w-full overflow-hidden rounded-full', className)}>
      <div
        className="bg-accent-primary h-full rounded-full transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

type Props = {
  skuId: string;
  skuLabel: string;
  /** Текущий этап артикула в каталоге коллекции — граница «уже прошли / сейчас / ещё впереди». */
  currentStageId: string;
  doc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  onPatch: (stepId: string, patch: Partial<SkuStageDetail>) => void;
  /** Сборка ссылок в модули цеха / внешние экраны с тем же контекстом артикула, что и у кнопок матрицы. */
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  floorHref: (tab: ProductionFloorTabId) => string;
  /** Для этапов с collectionScopedModuleNav — только query коллекции, без привязки к артикулу в URL. */
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string;
  collectionQuery?: string;
  /** Журнал: уведомление ответственному и т.п. без изменения полей этапа. */
  onAppendAuditLine?: (stepId: string, line: { summary: string; by?: string }) => void;
  /** Ключ коллекции в unified flow (как на странице производства) — для индикатора «сохранено». */
  collectionFlowKey?: string;
  /** Из URL `stagesSkuPanel`: один раз открыть панель этапа. */
  pendingOpenPanelStepId?: string | null;
  /** Из URL `stagesSkuPanelTab`: блок формы при открытии панели. */
  pendingOpenPanelTab?: StagesSkuPanelTab | null;
  /** После обработки `pendingOpenPanelStepId` снять параметр из URL. */
  onConsumedOpenPanelRequest?: () => void;
};

export function SkuProcessDetailPanel({
  skuId,
  skuLabel,
  currentStageId,
  doc,
  steps,
  onPatch,
  mergeModuleHref,
  floorHref,
  mergeCollectionQuery,
  collectionQuery,
  onAppendAuditLine,
  collectionFlowKey,
  pendingOpenPanelStepId,
  pendingOpenPanelTab,
  onConsumedOpenPanelRequest,
}: Props) {
  const [activeDetail, setActiveDetail] = useState<{
    stepId: string;
    defaultTab: StageDialogTab;
  } | null>(null);
  const [savePulseAt, setSavePulseAt] = useState<number | null>(null);
  const pendingHandledRef = useRef<string | null>(null);
  const entry = doc.skus[skuId];

  useEffect(() => {
    setActiveDetail(null);
    pendingHandledRef.current = null;
  }, [skuId]);

  useEffect(() => {
    if (!collectionFlowKey) return;
    return subscribeUnifiedSkuFlowSaved(({ collectionKey }) => {
      if (collectionKey === collectionFlowKey) setSavePulseAt(Date.now());
    });
  }, [collectionFlowKey]);

  useEffect(() => {
    if (!pendingOpenPanelStepId?.trim()) {
      pendingHandledRef.current = null;
      return;
    }
    const stepId = pendingOpenPanelStepId.trim();
    const tabForOpen: StageDialogTab = pendingOpenPanelTab ?? 'process';
    const openKey = `${stepId}:${tabForOpen}`;
    if (!entry) {
      onConsumedOpenPanelRequest?.();
      return;
    }
    if (pendingHandledRef.current === openKey) return;
    pendingHandledRef.current = openKey;

    const stepIdx = catalogStepIndex(steps, stepId);
    if (stepIdx < 0) {
      onConsumedOpenPanelRequest?.();
      return;
    }
    const step = steps[stepIdx]!;
    const row = entry.stages[stepId] ?? { status: 'not_started' as const };
    const curIdxRaw = catalogStepIndex(steps, currentStageId);
    const curIdx = curIdxRaw >= 0 ? curIdxRaw : 0;
    if (skuStepExpandable(step, row, stepIdx, curIdx)) {
      setActiveDetail({ stepId, defaultTab: tabForOpen });
    }
    onConsumedOpenPanelRequest?.();
  }, [
    pendingOpenPanelStepId,
    pendingOpenPanelTab,
    entry,
    steps,
    currentStageId,
    onConsumedOpenPanelRequest,
  ]);

  const rows = useMemo(() => {
    return steps.map((st) => ({
      step: st,
      row: entry?.stages[st.id] ?? { status: 'not_started' as const },
    }));
  }, [steps, entry]);

  const boardRowChunks = useMemo(() => chunkSkuBoardRows(rows, SKU_BOARD_STAGES_PER_ROW), [rows]);

  if (!entry) {
    return (
<<<<<<< HEAD
      <p className="py-4 text-xs text-slate-500">
=======
      <p className="text-text-secondary py-4 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
        Нет данных по артикулу в едином процессе — обновите страницу.
      </p>
    );
  }

  return (
    <Card className="border-accent-primary/20 bg-white/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-tight">Артикул: {skuLabel}</CardTitle>
        {/* div вместо CardDescription: внутри несколько <p>, а CardDescription рендерит <p> — недопустимая вложенность */}
<<<<<<< HEAD
        <div className="space-y-1.5 text-[13px] text-xs text-muted-foreground">
          <p className="leading-relaxed">
            Сетка как на <strong className="text-slate-800">«Доске этапов»</strong> (4 колонки в
            ряд). В каждой колонке — <strong className="text-slate-800">% заполнения</strong> и две
            кнопки: <strong className="text-slate-800">панель этапа</strong> (чеклист и правки в
            окне) и <strong className="text-slate-800">таб этапа</strong> (модуль цеха / внешний
            экран с тем же контекстом коллекции).
          </p>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Подвкладки{' '}
            <strong className="text-slate-700">Оперативка / Процесс / По артикулам</strong>{' '}
            переключайте в шапке блока «Контроль коллекции» выше — дублирующие ссылки здесь убраны
            намеренно.
          </p>
          <p className="text-[10px] leading-relaxed text-slate-500">
=======
        <div className="space-y-1.5 text-[13px] text-muted-foreground">
          <p className="leading-relaxed">
            Сетка как на <strong className="text-text-primary">«Доске этапов»</strong> (4 колонки в
            ряд). В каждой колонке — <strong className="text-text-primary">% заполнения</strong> и
            две кнопки: <strong className="text-text-primary">панель этапа</strong> (чеклист и
            правки в окне) и <strong className="text-text-primary">таб этапа</strong> (модуль цеха /
            внешний экран с тем же контекстом коллекции).
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            Подвкладки{' '}
            <strong className="text-text-primary">Оперативка / Процесс / По артикулам</strong>{' '}
            переключайте в шапке блока «Контроль коллекции» выше — дублирующие ссылки здесь убраны
            намеренно.
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
            Все этапы из каталога коллекции представлены в сетке; для каждого заданы чеклисты (см.
            «Панель этапа»). Без API поля процесса сохраняются в браузере вместе с матрицей этапов.
          </p>
          {savePulseAt ? (
<<<<<<< HEAD
            <p className="text-[10px] font-semibold text-emerald-700" key={savePulseAt}>
=======
            <p className="text-xs font-semibold text-emerald-700" key={savePulseAt}>
>>>>>>> recover/cabinet-wip-from-stash
              Записано локально (
              {new Date(savePulseAt).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
<<<<<<< HEAD
              ). Дальше — слой <strong className="text-slate-700">ProductionDataPort</strong> / API.
=======
              ). Дальше — слой <strong className="text-text-primary">ProductionDataPort</strong> /
              API.
>>>>>>> recover/cabinet-wip-from-stash
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="-mx-1 max-h-[min(78vh,720px)] space-y-3 overflow-y-auto px-1">
        {boardRowChunks.map((chunk, rowIdx) => (
          <div
            key={`sku-board-${rowIdx}`}
<<<<<<< HEAD
            className="grid min-h-[240px] grid-cols-2 items-stretch gap-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 md:grid-cols-4"
=======
            className="border-border-default bg-bg-surface2/80 grid min-h-[240px] grid-cols-2 items-stretch gap-0 overflow-hidden rounded-xl border md:grid-cols-4"
>>>>>>> recover/cabinet-wip-from-stash
          >
            {chunk.map(({ step, row }, colIdxInRow) => {
              const globalColIdx = rowIdx * SKU_BOARD_STAGES_PER_ROW + colIdxInRow;
              const curIdxRaw = catalogStepIndex(steps, currentStageId);
              const curIdx = curIdxRaw >= 0 ? curIdxRaw : 0;
              const stepIdx = catalogStepIndex(steps, step.id);
              const expandable = skuStepExpandable(step, row, stepIdx, curIdx);
              const showLink = skuStepShowWorkLink(step, row, stepIdx, curIdx);
              const workHref = showLink
                ? workTabHrefForStep(
                    step,
                    mergeModuleHref,
                    floorHref,
                    mergeCollectionQuery,
                    collectionQuery
                  )
                : null;
              const lockHint =
                'Этап ещё не в контуре артикула. Плитки откроются после прохождения предыдущих шагов или для параллельных этапов каталога.';

              const stLabel = STATUS_OPTS.find((o) => o.v === row.status)?.l ?? row.status;

              const openStageDialog = (defaultTab: StageDialogTab) => {
                if (!expandable) return;
                setActiveDetail({ stepId: step.id, defaultTab });
              };

              const isCurrentStage = step.id === currentStageId;
              const dataFill = evaluateStageDataFill(step.id, row);
              const tileShortcutTabs = STAGE_FILL_TAB_ORDER.filter(
                (t) => t !== 'process' && dataFill.items.some((i) => i.editTab === t)
              );

              return (
                <div
                  key={step.id}
                  className={cn(
<<<<<<< HEAD
                    'flex min-w-0 flex-col border-l border-slate-200 bg-white/90 first:rounded-l-xl first:border-l-0 last:rounded-r-xl',
=======
                    'border-border-default flex min-w-0 flex-col border-l bg-white/90 first:rounded-l-xl first:border-l-0 last:rounded-r-xl',
>>>>>>> recover/cabinet-wip-from-stash
                    isCurrentStage &&
                      'z-[1] border-emerald-200/90 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] ring-2 ring-inset ring-emerald-500/45'
                  )}
                >
                  <div
                    className={cn(
                      'border-border-subtle flex flex-col justify-between border-b px-2.5 pb-2 pt-2.5 text-left',
                      SKU_BOARD_COL_HEADER,
                      !expandable && 'opacity-80'
                    )}
                  >
                    <div>
                      <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
                        Этап {globalColIdx + 1}
                      </p>
<<<<<<< HEAD
                      <p className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-900">
=======
                      <p className="text-text-primary line-clamp-2 text-sm font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {step.title}
                      </p>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {expandable ? (
                        <span className="inline-flex shrink-0" title="Доступно">
                          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0" title={lockHint}>
                          <Lock className="text-text-muted size-3" aria-hidden />
                        </span>
                      )}
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="h-5 border-slate-200 px-1.5 text-[8px] font-bold"
=======
                        className="border-border-default h-5 px-1.5 text-[8px] font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {stLabel}
                      </Badge>
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="h-5 border-slate-200 px-1 py-0 text-[8px]"
=======
                        className="border-border-default h-5 px-1 py-0 text-[8px]"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {step.area}
                      </Badge>
                    </div>
                    <div className="border-border-subtle/90 mt-2 w-full space-y-1 border-t pt-2">
                      <div className="flex items-center justify-between gap-1">
<<<<<<< HEAD
                        <span className="text-[7px] font-bold uppercase tracking-wide text-slate-500">
                          Данные
                        </span>
                        <span className="text-[10px] font-black tabular-nums text-indigo-700">
=======
                        <span className="text-text-secondary text-[7px] font-bold uppercase tracking-wide">
                          Данные
                        </span>
                        <span className="text-accent-primary text-xs font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                          {dataFill.percent}%
                        </span>
                      </div>
                      <StageDataFillBar percent={dataFill.percent} />
<<<<<<< HEAD
                      <p className="text-[7px] leading-tight text-slate-400">
=======
                      <p className="text-text-muted text-[7px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        Обяз.: {dataFill.requiredFilled}/{dataFill.requiredTotal} · Доп.:{' '}
                        {dataFill.optionalFilled}/{dataFill.optionalTotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col justify-end gap-1 px-2 py-1.5">
                    <div className="flex flex-row items-stretch gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!expandable}
                        title={
                          expandable ? 'Окно: чеклист, поля этапа, журнал, вложения' : lockHint
                        }
                        className="h-7 min-w-0 flex-1 gap-0.5 px-1.5 text-[8px] font-black uppercase tracking-wide"
                        onClick={() => openStageDialog('process')}
                      >
                        <LayoutPanelLeft className="size-3 shrink-0" aria-hidden />
                        Панель этапа
                      </Button>
                      {workHref ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 min-w-0 flex-1 gap-0.5 px-1.5 text-[8px] font-black uppercase tracking-wide"
                          asChild
                        >
                          <Link
                            href={workHref}
                            title="Вкладка цеха или модуль этапа с контекстом коллекции"
                          >
<<<<<<< HEAD
                            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
=======
                            <ExternalLink className="size-3 shrink-0" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
                            Таб этапа
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                    {!workHref ? (
                      <p
<<<<<<< HEAD
                        className="px-0.5 text-center text-[7px] leading-tight text-slate-400"
=======
                        className="text-text-muted px-0.5 text-center text-[7px] leading-tight"
>>>>>>> recover/cabinet-wip-from-stash
                        title={lockHint}
                      >
                        Прямой таб не задан — только панель
                      </p>
                    ) : null}
                    {expandable && tileShortcutTabs.length > 0 ? (
                      <div
                        className="border-border-subtle/80 flex flex-wrap justify-center gap-0.5 border-t pt-1"
                        role="group"
                        aria-label="Блоки формы этапа"
                      >
                        {tileShortcutTabs.map((t) => (
                          <button
                            key={t}
                            type="button"
<<<<<<< HEAD
                            className="h-5 min-w-[1.1rem] rounded border border-slate-200 bg-white px-1 text-[7px] font-black text-slate-600 hover:border-indigo-200 hover:bg-indigo-50"
=======
                            className="border-border-default text-text-secondary hover:border-accent-primary/30 hover:bg-accent-primary/10 h-5 min-w-[1.1rem] rounded border bg-white px-1 text-[7px] font-black"
>>>>>>> recover/cabinet-wip-from-stash
                            title={`${STAGE_FILL_EDIT_TAB_LABELS[t]} — окно панели`}
                            onClick={() => openStageDialog(t)}
                          >
                            {t === 'people'
                              ? 'Л'
                              : t === 'costs'
                                ? '₽'
                                : t === 'outputs'
                                  ? 'В'
                                  : 'Ф'}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>

      {activeDetail ? (
        <SkuStageDetailDialog
          open
          skuLabel={skuLabel}
          defaultTab={activeDetail.defaultTab}
          activeStepId={activeDetail.stepId}
          onOpenChange={(o) => !o && setActiveDetail(null)}
          rows={rows}
          onPatch={onPatch}
          onAppendAuditLine={onAppendAuditLine}
          mergeModuleHref={mergeModuleHref}
          floorHref={floorHref}
          mergeCollectionQuery={mergeCollectionQuery}
          collectionQuery={collectionQuery}
        />
      ) : null}
    </Card>
  );
}

function StageAuditLogPanel({ row }: { row: SkuStageDetail }) {
  if (!row.auditLog?.length) {
    return (
<<<<<<< HEAD
      <p className="text-xs text-slate-500">
=======
      <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
        Записей пока нет. Правки полей ниже и действия в блоке ответственных добавляют строки в
        журнал.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {[...(row.auditLog ?? [])].reverse().map((e, i) => (
        <li
          key={`${e.at}-${i}`}
<<<<<<< HEAD
          className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs"
        >
          <p className="text-[10px] text-slate-400">
=======
          className="border-border-subtle bg-bg-surface2/80 rounded-lg border px-3 py-2 text-xs"
        >
          <p className="text-text-muted text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            {new Date(e.at).toLocaleString('ru-RU')}
            {e.by ? ` · ${e.by}` : ''}
          </p>
          <p className="text-text-primary mt-0.5">{e.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function StageDetailEditorSection({
  editTab,
  step,
  row,
  onPatch,
  workHref,
  copyModuleUrl,
  onAppendAuditLine,
}: {
  editTab: StageFillEditTab;
  step: CollectionStep;
  row: SkuStageDetail;
  onPatch: (stepId: string, patch: Partial<SkuStageDetail>) => void;
  workHref: string | null;
  copyModuleUrl: () => void;
  onAppendAuditLine?: (stepId: string, line: { summary: string; by?: string }) => void;
}) {
  switch (editTab) {
    case 'process':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">Статус</p>
              <Select
                value={row.status}
                onValueChange={(v) => onPatch(step.id, { status: v as SkuStageDetail['status'] })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTS.map((o) => (
                    <SelectItem key={o.v} value={o.v} className="text-xs">
                      {o.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">Кто обновил</p>
              <Input
                className="h-8 text-xs"
                placeholder="ФИО"
                value={row.updatedBy ?? ''}
                onChange={(e) => onPatch(step.id, { updatedBy: e.target.value })}
              />
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">Задержка (дн.)</p>
              <Input
                className="h-8 text-xs"
                type="number"
                min={0}
                value={row.delayDays ?? ''}
                onChange={(e) =>
                  onPatch(step.id, {
                    delayDays: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
          <div>
<<<<<<< HEAD
            <p className="mb-1 text-[9px] font-bold uppercase text-slate-400">
=======
            <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              Причина задержки / комментарий
            </p>
            <Textarea
              className="min-h-[72px] text-xs"
              value={row.delayReason ?? row.notes ?? ''}
              onChange={(e) =>
                onPatch(step.id, { delayReason: e.target.value, notes: e.target.value })
              }
            />
          </div>
        </div>
      );
    case 'people':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">Ответственный</p>
              <Input
                className="h-8 text-xs"
                placeholder="ФИО"
                value={row.assignee ?? ''}
                onChange={(e) => onPatch(step.id, { assignee: e.target.value })}
              />
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">Роль в этапе</p>
              <Input
                className="h-8 text-xs"
                placeholder="Дизайн, закупка, тех…"
                value={row.role ?? ''}
                onChange={(e) => onPatch(step.id, { role: e.target.value })}
              />
            </div>
          </div>
<<<<<<< HEAD
          <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-[10px] text-slate-600">
=======
          <div className="border-border-subtle bg-bg-surface2/80 text-text-secondary rounded-lg border px-3 py-2 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            Если вы не ответственный за этап: зафиксируйте запрос в журнале и передайте ссылку в
            модуль — ответственный увидит данные в своём табе при открытии того же артикула и
            коллекции (после появления API — push-уведомление).
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={!workHref}
              onClick={() => {
                copyModuleUrl();
                onAppendAuditLine?.(step.id, {
                  summary: workHref
                    ? 'Скопирована ссылка на модуль этапа для передачи ответственному (демо).'
                    : '—',
                  by: row.updatedBy,
                });
              }}
            >
              <Send className="size-3.5 shrink-0" aria-hidden />
              Ссылка ответственному
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              onClick={() =>
                onAppendAuditLine?.(step.id, {
                  summary:
                    'Запрос согласования / комментарий ответственному зафиксирован (демо; далее — API и уведомления).',
                  by: row.updatedBy,
                })
              }
            >
              Запрос в журнал
            </Button>
          </div>
          <ApprovalsEditor
            items={row.approvals ?? []}
            onChange={(approvals) => onPatch(step.id, { approvals })}
          />
        </div>
      );
    case 'costs':
      return (
        <CostLinesEditor
          lines={row.costLines ?? []}
          onChange={(costLines) => onPatch(step.id, { costLines })}
        />
      );
    case 'outputs':
      return (
        <OutputsEditor
          outputs={row.outputs ?? []}
          onChange={(outputs) => onPatch(step.id, { outputs })}
        />
      );
    case 'files':
      return (
        <div className="space-y-2">
<<<<<<< HEAD
          <p className="text-[10px] text-slate-500">
=======
          <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            Пока нет загрузки файлов — опишите ссылки, ID в DAM или пути; позже сюда попадут
            вложения этапа.
          </p>
          <div>
<<<<<<< HEAD
            <p className="mb-1 text-[9px] font-bold uppercase text-slate-400">
=======
            <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              Текстом (ссылки, артефакты)
            </p>
            <Textarea
              className="min-h-[100px] text-xs"
              placeholder="https://… · файл в общем диске · номер образца…"
              value={row.attachmentsNotes ?? ''}
              onChange={(e) => onPatch(step.id, { attachmentsNotes: e.target.value || undefined })}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}

function sortStageFillEvaluationItems(
  items: readonly StageFillEvaluationItem[]
): StageFillEvaluationItem[] {
  const rank = (it: StageFillEvaluationItem) => {
    if (it.required && !it.filled) return 0;
    if (it.required && it.filled) return 1;
    if (!it.required && !it.filled) return 2;
    return 3;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

function SkuStageDetailDialog({
  open,
  onOpenChange,
  skuLabel,
  defaultTab,
  activeStepId,
  rows,
  onPatch,
  onAppendAuditLine,
  mergeModuleHref,
  floorHref,
  mergeCollectionQuery,
  collectionQuery,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuLabel: string;
  defaultTab: StageDialogTab;
  activeStepId: string;
  rows: { step: CollectionStep; row: SkuStageDetail }[];
  onPatch: (stepId: string, patch: Partial<SkuStageDetail>) => void;
  onAppendAuditLine?: (stepId: string, line: { summary: string; by?: string }) => void;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery?: (href: string, collectionQuery: string) => string;
  collectionQuery?: string;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<'form' | 'history'>('form');
  const [blockFilter, setBlockFilter] = useState<StageFillEditTab | 'all'>('all');

  const ctx = useMemo(() => {
    const hit = rows.find((r) => r.step.id === activeStepId);
    if (!hit) return null;
    return { step: hit.step, row: hit.row };
  }, [activeStepId, rows]);

  const fillEval = useMemo(() => (ctx ? evaluateStageDataFill(ctx.step.id, ctx.row) : null), [ctx]);
  const sortedFillItems = useMemo(
    () => (fillEval ? sortStageFillEvaluationItems(fillEval.items) : []),
    [fillEval]
  );

  const tabsPresent = useMemo(() => {
    const s = new Set(sortedFillItems.map((i) => i.editTab));
    return STAGE_FILL_TAB_ORDER.filter((t) => s.has(t));
  }, [sortedFillItems]);

  const visibleFillItems = useMemo(() => {
    if (blockFilter === 'all') return sortedFillItems;
    return sortedFillItems.filter((i) => i.editTab === blockFilter);
  }, [sortedFillItems, blockFilter]);

  const stepId = ctx?.step.id ?? null;

  useEffect(() => {
    if (!open || !ctx || stepId == null) return;
    const sorted = sortStageFillEvaluationItems(evaluateStageDataFill(ctx.step.id, ctx.row).items);
    if (defaultTab === 'history') {
      setPanelMode('history');
      setBlockFilter('all');
      setSelectedItemId(sorted[0]?.id ?? null);
      return;
    }
    setPanelMode('form');
    const dt = defaultTab as StageFillEditTab;
    const isBlockTab =
      dt === 'process' || dt === 'people' || dt === 'costs' || dt === 'outputs' || dt === 'files';
    if (isBlockTab) {
      setBlockFilter(dt);
      const pool = sortStageFillEvaluationItems(sorted.filter((it) => it.editTab === dt));
      setSelectedItemId(pool[0]?.id ?? sorted[0]?.id ?? null);
    } else {
      setBlockFilter('all');
      const hit = sorted.find((it) => it.editTab === dt);
      setSelectedItemId((hit ?? sorted[0])?.id ?? null);
    }
    // Без ctx.row в зависимостях: не сбрасывать выбранную строку при каждом патче полей.
  }, [open, activeStepId, defaultTab, stepId]);

  const workHref = ctx
    ? workTabHrefForStep(
        ctx.step,
        mergeModuleHref,
        floorHref,
        mergeCollectionQuery,
        collectionQuery
      )
    : null;

  const copyModuleUrl = useCallback(() => {
    if (!workHref || typeof window === 'undefined') return;
    const full = new URL(workHref, window.location.origin).href;
    void navigator.clipboard?.writeText(full).catch(() => {});
  }, [workHref]);

  if (!ctx) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md" ariaTitle="Этап">
          <DialogHeader>
            <DialogTitle className="text-sm">Этап недоступен</DialogTitle>
            <DialogDescription className="text-xs">
              Обновите список этапов или закройте окно.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" size="sm" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const { step, row } = ctx;
  const fe = fillEval!;
  const selectedFillItem =
    visibleFillItems.find((it) => it.id === selectedItemId) ?? visibleFillItems[0] ?? null;
  const moduleAxis =
    step.externalAxisLabel ??
    (step.productionFloorTab
      ? `Вкладка цеха «${step.productionFloorTab}»`
      : 'Модуль по ссылке этапа');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(88vh,760px)] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-xl"
        ariaTitle={`${step.title} — ${skuLabel}`}
      >
<<<<<<< HEAD
        <DialogHeader className="space-y-1 border-b border-slate-100 px-4 pb-3 pt-4 text-left">
          <DialogTitle className="pr-8 text-base leading-snug">{step.title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Артикул <strong className="text-slate-800">{skuLabel}</strong>. Ниже подсветка:{' '}
            <strong className="text-amber-800">обязательное не заполнено</strong>,{' '}
            <strong className="text-emerald-800">обязательное готово</strong>,{' '}
            <strong className="text-slate-600">дополнительно пусто</strong>,{' '}
            <strong className="text-sky-800">дополнительно заполнено</strong>. Клик по строке
            подсвечивает её и открывает форму ниже для заполнения и правок. Ось UI:{' '}
            <strong className="text-slate-800">{moduleAxis}</strong>. Сохранение без API — в{' '}
            <strong className="text-slate-800">localStorage</strong> (единый flow коллекции).
          </DialogDescription>
          <p className="pt-1 text-[11px] leading-snug text-slate-600">{step.description}</p>
=======
        <DialogHeader className="border-border-subtle space-y-1 border-b px-4 pb-3 pt-4 text-left">
          <DialogTitle className="pr-8 text-base leading-snug">{step.title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Артикул <strong className="text-text-primary">{skuLabel}</strong>. Ниже подсветка:{' '}
            <strong className="text-amber-800">обязательное не заполнено</strong>,{' '}
            <strong className="text-emerald-800">обязательное готово</strong>,{' '}
            <strong className="text-text-secondary">дополнительно пусто</strong>,{' '}
            <strong className="text-sky-800">дополнительно заполнено</strong>. Клик по строке
            подсвечивает её и открывает форму ниже для заполнения и правок. Ось UI:{' '}
            <strong className="text-text-primary">{moduleAxis}</strong>. Сохранение без API — в{' '}
            <strong className="text-text-primary">localStorage</strong> (единый flow коллекции).
          </DialogDescription>
          <p className="text-text-secondary pt-1 text-sm leading-snug">{step.description}</p>
>>>>>>> recover/cabinet-wip-from-stash
          {step.crossLinks?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {step.crossLinks.map((l) => (
                <Link
                  key={`${l.label}-${l.href}`}
                  href={crossLinkHrefForStep(
                    step,
                    l.href,
                    mergeModuleHref,
                    mergeCollectionQuery,
                    collectionQuery
                  )}
<<<<<<< HEAD
                  className="text-[10px] font-semibold text-indigo-600 hover:underline"
=======
                  className="text-accent-primary text-xs font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={() => onOpenChange(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}
        </DialogHeader>

        <div className="border-accent-primary/20 bg-accent-primary/10 border-b px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
<<<<<<< HEAD
              <p className="text-[9px] font-black uppercase tracking-wide text-slate-600">
                Заполненность данных этапа
              </p>
              <p className="truncate text-[10px] text-slate-600" title={moduleAxis}>
                Чеклист под {moduleAxis}
              </p>
            </div>
            <p className="shrink-0 text-xl font-black tabular-nums text-indigo-900">
=======
              <p className="text-text-secondary text-[9px] font-black uppercase tracking-wide">
                Заполненность данных этапа
              </p>
              <p className="text-text-secondary truncate text-xs" title={moduleAxis}>
                Чеклист под {moduleAxis}
              </p>
            </div>
            <p className="text-accent-primary shrink-0 text-xl font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
              {fe.percent}%
            </p>
          </div>
          <StageDataFillBar percent={fe.percent} className="mt-2" />
<<<<<<< HEAD
          <p className="mt-1 text-[9px] text-slate-500">
=======
          <p className="text-text-secondary mt-1 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
            Обязательные: {fe.requiredFilled}/{fe.requiredTotal} · Дополнительные:{' '}
            {fe.optionalFilled}/{fe.optionalTotal} · Форма под списком соответствует выбранной
            строке.
          </p>
          <div className="text-text-secondary mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[8px]">
            <span>
              <span
<<<<<<< HEAD
                className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-500 align-middle"
=======
                className="mr-1 inline-block size-2 rounded-sm bg-amber-500 align-middle"
>>>>>>> recover/cabinet-wip-from-stash
                aria-hidden
              />{' '}
              обяз. пусто
            </span>
            <span>
              <span
<<<<<<< HEAD
                className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500 align-middle"
=======
                className="mr-1 inline-block size-2 rounded-sm bg-emerald-500 align-middle"
>>>>>>> recover/cabinet-wip-from-stash
                aria-hidden
              />{' '}
              обяз. есть
            </span>
            <span>
              <span
<<<<<<< HEAD
                className="mr-1 inline-block h-2 w-2 rounded-sm border border-dashed border-slate-400 bg-slate-100 align-middle"
=======
                className="border-border-strong bg-bg-surface2 mr-1 inline-block size-2 rounded-sm border border-dashed align-middle"
>>>>>>> recover/cabinet-wip-from-stash
                aria-hidden
              />{' '}
              доп. пусто
            </span>
            <span>
              <span
<<<<<<< HEAD
                className="mr-1 inline-block h-2 w-2 rounded-sm bg-sky-400 align-middle"
=======
                className="mr-1 inline-block size-2 rounded-sm bg-sky-400 align-middle"
>>>>>>> recover/cabinet-wip-from-stash
                aria-hidden
              />{' '}
              доп. есть
            </span>
          </div>
          {tabsPresent.length > 0 ? (
            <div
<<<<<<< HEAD
              className="mt-2 flex flex-wrap gap-1"
              role="tablist"
              aria-label="Блок формы (фильтр чеклиста)"
            >
=======
              className={cn(cabinetSurface.groupTabList, 'mt-2 h-auto min-h-9 flex-wrap')}
              role="tablist"
              aria-label="Блок формы (фильтр чеклиста)"
            >
              {/* cabinetSurface v1 */}
>>>>>>> recover/cabinet-wip-from-stash
              <button
                type="button"
                role="tab"
                aria-selected={blockFilter === 'all'}
                className={cn(
                  cabinetSurface.groupTabButton,
                  'border border-transparent px-2 py-1 text-[9px] font-bold uppercase tracking-wide',
                  blockFilter === 'all'
                    ? cn(
                        cabinetSurface.groupTabButtonActive,
                        'border-accent-primary/40 bg-accent-primary/15 text-accent-primary ring-accent-primary/30 shadow-sm'
                      )
                    : 'border-border-default/80 text-text-secondary hover:bg-bg-surface2 bg-white/90'
                )}
                onClick={() => {
                  setBlockFilter('all');
                  setPanelMode('form');
                  setSelectedItemId((prev) => {
                    if (prev && sortedFillItems.some((i) => i.id === prev)) return prev;
                    return sortedFillItems[0]?.id ?? null;
                  });
                }}
              >
                Все строки
              </button>
              {tabsPresent.map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={blockFilter === tabId}
                  className={cn(
                    cabinetSurface.groupTabButton,
                    'border border-transparent px-2 py-1 text-[9px] font-bold uppercase tracking-wide',
                    blockFilter === tabId
                      ? cn(
                          cabinetSurface.groupTabButtonActive,
                          'border-accent-primary/40 bg-accent-primary/15 text-accent-primary ring-accent-primary/30 shadow-sm'
                        )
                      : 'border-border-default/80 text-text-secondary hover:bg-bg-surface2 bg-white/90'
                  )}
                  onClick={() => {
                    setBlockFilter(tabId);
                    setPanelMode('form');
                    setSelectedItemId((prev) => {
                      const pool = sortStageFillEvaluationItems(
                        sortedFillItems.filter((i) => i.editTab === tabId)
                      );
                      if (prev && pool.some((i) => i.id === prev)) return prev;
                      return pool[0]?.id ?? null;
                    });
                  }}
                >
                  {STAGE_FILL_EDIT_TAB_LABELS[tabId]}
                </button>
              ))}
            </div>
          ) : null}
          <p className="text-text-secondary mt-1.5 text-[8px]">
            Процент и счётчики выше — по всему этапу; табы ниже только сужают список для правок.
          </p>
          <ul className="border-border-default/80 mt-2 max-h-[min(28vh,240px)] space-y-1.5 overflow-y-auto rounded-lg border bg-white/90 p-1.5">
            {visibleFillItems.map((it) => {
              const tabLabel = STAGE_FILL_EDIT_TAB_LABELS[it.editTab];
              const rowStyle = cn(
<<<<<<< HEAD
                'flex w-full gap-2 rounded-md px-2 py-2 text-left text-[10px] leading-snug transition-colors border border-transparent',
=======
                'flex w-full gap-2 rounded-md border border-transparent p-2 text-left text-xs leading-snug transition-colors',
>>>>>>> recover/cabinet-wip-from-stash
                it.required &&
                  !it.filled &&
                  'border-amber-300/90 bg-amber-50/95 ring-1 ring-amber-200/80',
                it.required && it.filled && 'border-emerald-200/90 bg-emerald-50/70',
                !it.required &&
                  !it.filled &&
                  'border-dashed border-border-default/80 bg-bg-surface2/80',
                !it.required && it.filled && 'border-sky-200/80 bg-sky-50/50',
                selectedItemId === it.id &&
                  panelMode === 'form' &&
<<<<<<< HEAD
                  'ring-2 ring-indigo-400/85 ring-offset-1'
=======
                  'ring-2 ring-accent-primary/85 ring-offset-1'
>>>>>>> recover/cabinet-wip-from-stash
              );
              const markClass = cn(
                'flex size-6 shrink-0 items-center justify-center rounded-md text-sm font-black leading-none',
                it.required && !it.filled && 'bg-amber-200 text-amber-950',
                it.required && it.filled && 'bg-emerald-500 text-white',
                !it.required &&
                  !it.filled &&
<<<<<<< HEAD
                  'border border-dashed border-slate-300 bg-white text-slate-400',
=======
                  'border border-dashed border-border-default bg-white text-text-muted',
>>>>>>> recover/cabinet-wip-from-stash
                !it.required && it.filled && 'bg-sky-500 text-white'
              );
              const markChar = it.filled ? '✓' : it.required ? '!' : '○';
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    className={rowStyle}
                    onClick={() => {
                      setSelectedItemId(it.id);
                      setPanelMode('form');
                    }}
                    title={`Показать форму ниже: ${it.label} (блок «${tabLabel}»)`}
                  >
                    <span className={markClass} aria-hidden>
                      {markChar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span
                          className={cn(
                            'font-semibold',
<<<<<<< HEAD
                            it.required ? 'text-slate-900' : 'text-slate-700'
=======
                            it.required ? 'text-text-primary' : 'text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {it.label}
                        </span>
                        {it.required ? (
                          <Badge
                            variant="outline"
                            className="h-4 border-amber-300/70 bg-amber-50/50 px-1 text-[7px] font-bold text-amber-950"
                          >
                            Обязательно
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
<<<<<<< HEAD
                            className="h-4 border-slate-200 bg-white px-1 text-[7px] font-semibold text-slate-600"
=======
                            className="border-border-default text-text-secondary h-4 bg-white px-1 text-[7px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Дополнительно
                          </Badge>
                        )}
                      </div>
                      <p className="text-accent-primary mt-0.5 text-[9px] font-medium">
                        Форма ниже — блок «{tabLabel}»
                      </p>
                      {it.moduleHint ? (
<<<<<<< HEAD
                        <span className="mt-0.5 block text-[8px] text-slate-500">
=======
                        <span className="text-text-secondary mt-0.5 block text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                          В модуле: {it.moduleHint}
                        </span>
                      ) : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-border-subtle flex min-h-0 flex-1 flex-col border-t">
          <div className="border-border-subtle bg-bg-surface2/40 flex flex-wrap gap-1.5 border-b px-3 py-2">
            <Button
              type="button"
              variant={panelMode === 'form' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setPanelMode('form')}
            >
              Поля этапа
            </Button>
            <Button
              type="button"
              variant={panelMode === 'history' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setPanelMode('history')}
            >
              Журнал
            </Button>
          </div>
          <div className="max-h-[min(52vh,420px)] overflow-y-auto px-4 py-3">
            {panelMode === 'history' ? (
              <StageAuditLogPanel row={row} />
            ) : selectedFillItem ? (
              <div className="space-y-3">
<<<<<<< HEAD
                <div className="rounded-lg border border-indigo-100/80 bg-indigo-50/40 px-3 py-2">
                  <p className="text-[10px] font-semibold text-slate-800">
                    {selectedFillItem.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px] text-indigo-800">
=======
                <div className="border-accent-primary/20 bg-accent-primary/10 rounded-lg border px-3 py-2">
                  <p className="text-text-primary text-xs font-semibold">
                    {selectedFillItem.label}
                  </p>
                  <div className="text-accent-primary flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                    <span>Блок: {STAGE_FILL_EDIT_TAB_LABELS[selectedFillItem.editTab]}</span>
                    {selectedFillItem.required ? (
                      <Badge variant="outline" className="h-4 border-amber-300/70 px-1 text-[7px]">
                        обязательно
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border-default h-4 px-1 text-[7px]"
                      >
                        дополнительно
                      </Badge>
                    )}
                  </div>
                </div>
                <StageDetailEditorSection
                  editTab={selectedFillItem.editTab}
                  step={step}
                  row={row}
                  onPatch={onPatch}
                  workHref={workHref}
                  copyModuleUrl={copyModuleUrl}
                  onAppendAuditLine={onAppendAuditLine}
                />
              </div>
            ) : (
              <p className="text-text-secondary text-xs">Выберите строку в чеклисте выше.</p>
            )}
          </div>
        </div>

        <DialogFooter className="border-border-subtle bg-bg-surface2/80 flex flex-col gap-2 border-t px-4 py-3">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {workHref ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 shrink-0 text-[10px]"
=======
                  className="h-8 shrink-0 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                  asChild
                >
                  <Link href={workHref} onClick={() => onOpenChange(false)}>
                    К данным этапа в модуле →
                  </Link>
                </Button>
              ) : (
<<<<<<< HEAD
                <span className="text-[10px] text-slate-400">
                  Прямой модуль в каталоге не задан — правки только здесь.
                </span>
              )}
              <p className="min-w-0 text-[10px] text-slate-500">
=======
                <span className="text-text-muted text-xs">
                  Прямой модуль в каталоге не задан — правки только здесь.
                </span>
              )}
              <p className="text-text-secondary min-w-0 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                Сохранение — в объекте процесса (localStorage на демо-странице производства).
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Закрыть
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CostLinesEditor({
  lines,
  onChange,
}: {
  lines: NonNullable<SkuStageDetail['costLines']>;
  onChange: (v: NonNullable<SkuStageDetail['costLines']>) => void;
}) {
  const add = () => onChange([...lines, { label: '', amountRub: 0, paid: false }]);
  const upd = (i: number, patch: Partial<(typeof lines)[0]>) => {
    const next = lines.map((l, j) => (j === i ? { ...l, ...patch } : l));
    onChange(next);
  };
  const del = (i: number) => onChange(lines.filter((_, j) => j !== i));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
        <p className="text-[9px] font-bold uppercase text-slate-400">Затраты (₽)</p>
=======
        <p className="text-text-muted text-[9px] font-bold uppercase">Затраты (₽)</p>
>>>>>>> recover/cabinet-wip-from-stash
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[9px]"
          onClick={add}
        >
<<<<<<< HEAD
          <Plus className="mr-1 h-3 w-3" /> строка
=======
          <Plus className="mr-1 size-3" /> строка
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>
      <div className="space-y-1.5">
        {lines.length === 0 ? (
          <p className="text-text-muted text-xs">Сырьё, фурнитура, пошив, логистика…</p>
        ) : (
          lines.map((l, i) => (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              <Input
<<<<<<< HEAD
                className="h-7 min-w-[100px] flex-1 text-[10px]"
=======
                className="h-7 min-w-[100px] flex-1 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="Статья"
                value={l.label}
                onChange={(e) => upd(i, { label: e.target.value })}
              />
              <Input
<<<<<<< HEAD
                className="h-7 w-24 text-[10px]"
=======
                className="h-7 w-24 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                type="number"
                placeholder="₽"
                value={l.amountRub || ''}
                onChange={(e) => upd(i, { amountRub: Number(e.target.value) || 0 })}
              />
<<<<<<< HEAD
              <label className="flex shrink-0 items-center gap-1 text-[9px] text-slate-600">
=======
              <label className="text-text-secondary flex shrink-0 items-center gap-1 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                <input
                  type="checkbox"
                  checked={!!l.paid}
                  onChange={(e) => upd(i, { paid: e.target.checked })}
                />
                опл.
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
<<<<<<< HEAD
                className="h-7 w-7 shrink-0"
                onClick={() => del(i)}
              >
                <Trash2 className="h-3 w-3 text-slate-400" />
=======
                className="size-7 shrink-0"
                onClick={() => del(i)}
              >
                <Trash2 className="text-text-muted size-3" />
>>>>>>> recover/cabinet-wip-from-stash
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ApprovalsEditor({
  items,
  onChange,
}: {
  items: NonNullable<SkuStageDetail['approvals']>;
  onChange: (v: NonNullable<SkuStageDetail['approvals']>) => void;
}) {
  const add = () =>
    onChange([...items, { role: '', name: '', at: new Date().toISOString().slice(0, 16) }]);
  const upd = (i: number, patch: Partial<(typeof items)[0]>) => {
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };
  const del = (i: number) => onChange(items.filter((_, j) => j !== i));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
        <p className="text-[9px] font-bold uppercase text-slate-400">Подтверждения</p>
=======
        <p className="text-text-muted text-[9px] font-bold uppercase">Подтверждения</p>
>>>>>>> recover/cabinet-wip-from-stash
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[9px]"
          onClick={add}
        >
<<<<<<< HEAD
          <Plus className="mr-1 h-3 w-3" /> запись
=======
          <Plus className="mr-1 size-3" /> запись
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-text-muted text-xs">Кто и когда согласовал этап.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((a, i) => (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              <Input
<<<<<<< HEAD
                className="h-7 w-28 text-[10px]"
=======
                className="h-7 w-28 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="Роль"
                value={a.role}
                onChange={(e) => upd(i, { role: e.target.value })}
              />
              <Input
<<<<<<< HEAD
                className="h-7 min-w-[80px] flex-1 text-[10px]"
=======
                className="h-7 min-w-12 flex-1 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="ФИО"
                value={a.name}
                onChange={(e) => upd(i, { name: e.target.value })}
              />
              <Input
<<<<<<< HEAD
                className="h-7 w-36 text-[10px]"
=======
                className="h-7 w-36 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                type="datetime-local"
                value={a.at}
                onChange={(e) => upd(i, { at: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
<<<<<<< HEAD
                className="h-7 w-7"
                onClick={() => del(i)}
              >
                <Trash2 className="h-3 w-3 text-slate-400" />
=======
                className="size-7"
                onClick={() => del(i)}
              >
                <Trash2 className="text-text-muted size-3" />
>>>>>>> recover/cabinet-wip-from-stash
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OutputsEditor({
  outputs,
  onChange,
}: {
  outputs: NonNullable<SkuStageDetail['outputs']>;
  onChange: (v: NonNullable<SkuStageDetail['outputs']>) => void;
}) {
  const add = () => onChange([...outputs, { kind: '', ref: '' }]);
  const upd = (i: number, patch: Partial<(typeof outputs)[0]>) => {
    onChange(outputs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };
  const del = (i: number) => onChange(outputs.filter((_, j) => j !== i));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
<<<<<<< HEAD
        <p className="text-[9px] font-bold uppercase text-slate-400">
=======
        <p className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
          Выходы (модель, акт, партия)
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[9px]"
          onClick={add}
        >
<<<<<<< HEAD
          <Plus className="mr-1 h-3 w-3" /> строка
=======
          <Plus className="mr-1 size-3" /> строка
>>>>>>> recover/cabinet-wip-from-stash
        </Button>
      </div>
      {outputs.length === 0 ? (
        <p className="text-text-muted text-xs">Что получили на выходе этапа.</p>
      ) : (
        <div className="space-y-1.5">
          {outputs.map((o, i) => (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              <Input
<<<<<<< HEAD
                className="h-7 w-32 text-[10px]"
=======
                className="h-7 w-32 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="Тип"
                value={o.kind}
                onChange={(e) => upd(i, { kind: e.target.value })}
              />
              <Input
<<<<<<< HEAD
                className="h-7 min-w-[100px] flex-1 text-[10px]"
=======
                className="h-7 min-w-[100px] flex-1 text-xs"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="Ссылка / ID / файл"
                value={o.ref}
                onChange={(e) => upd(i, { ref: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
<<<<<<< HEAD
                className="h-7 w-7"
                onClick={() => del(i)}
              >
                <Trash2 className="h-3 w-3 text-slate-400" />
=======
                className="size-7"
                onClick={() => del(i)}
              >
                <Trash2 className="text-text-muted size-3" />
>>>>>>> recover/cabinet-wip-from-stash
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
