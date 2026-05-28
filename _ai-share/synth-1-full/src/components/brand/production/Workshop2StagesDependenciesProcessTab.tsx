'use client';

import React, { Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MATRIX_GRID,
  MatrixLinkStrip,
  aggregateMatrixStepLinkRow,
  buildStagesCommLinkQuery,
  buildStagesNotesLinkQuery,
} from '@/components/brand/production/stages-dependencies-matrix-link-strip';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  getProductionStageDisplayMode,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import {
  aggregateSkuProgressLine,
  type CollectionSkuFlowDoc,
  type MatrixStepStatus,
} from '@/lib/production/unified-sku-flow-store';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Crosshair,
  Info,
  Lock,
  MinusCircle,
  Package,
} from 'lucide-react';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import {
  DEPS_SCHEMA_CHUNK,
  statusLabel,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import {
  StagesHelpHover,
  StagesHelpIconTrigger,
  StagesHelpWhyBlock,
} from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesCollapsePinBar } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';
import { DepsRowTurnConnector } from '@/components/brand/production/stages-dependencies-tab-deps-row-turn-connector';
import type { StagesSkuPanelTab } from '@/lib/production/stages-url';

/** Same grid as parent — snake layout for dependency schema. */
const DEPS_SCHEMA_FULL_ROW_GRID =
  'minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr)';

export type Workshop2StagesDependenciesProcessTabProps = {
  depsPinned: boolean;
  onDepsPinnedChange: (pinned: boolean) => void;
  depsOpen: boolean;
  onDepsOpenChange: (open: boolean) => void;
  depsExpanded: boolean;
  focusArticle: StagesTabArticle | null;
  chainFocusStepId: string;
  steps: CollectionStep[];
  toggleChainFocus: (stepId: string) => void;
  viewArticles: StagesTabArticle[];
  depsSchemaChunks: CollectionStep[][];
  productionProfileId: ProductionFlowProfileId;
  onOpenDepsNodeInfo: (stepId: string) => void;
  matrixPinned: boolean;
  onMatrixPinnedChange: (pinned: boolean) => void;
  matrixOpen: boolean;
  onMatrixOpenChange: (open: boolean) => void;
  matrixExpanded: boolean;
  matrixStageFilterQ: string;
  onMatrixSearchChange: (value: string) => void;
  clearMatrixFilters: () => void;
  matrixPhaseParam: string;
  matrixTextQParam: string;
  scrollToCurrentMatrixStage: () => void;
  matrixPhaseOptions: string[];
  setMatrixPhaseFilter: (phase: string | null) => void;
  focusSkuMatrixPhase: string;
  aggregateStatus: Record<string, MatrixStepStatus>;
  isBlocked: (step: CollectionStep) => boolean;
  matrixStepsFiltered: CollectionStep[];
  flowDoc: CollectionSkuFlowDoc;
  effectiveSkuIds: string[];
  markStatus: (id: string, next: MatrixStepStatus) => void;
  openSkuPanelForStep: (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => void;
  routerPush: (href: string) => void;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  navigateToStageModule: (step: CollectionStep, targetHref: string) => void;
};

export function Workshop2StagesDependenciesProcessTab(
  props: Workshop2StagesDependenciesProcessTabProps
) {
  const {
    depsPinned,
    onDepsPinnedChange,
    depsOpen,
    onDepsOpenChange,
    depsExpanded,
    focusArticle,
    chainFocusStepId,
    steps,
    toggleChainFocus,
    viewArticles,
    depsSchemaChunks,
    productionProfileId,
    onOpenDepsNodeInfo,
    matrixPinned,
    onMatrixPinnedChange,
    matrixOpen,
    onMatrixOpenChange,
    matrixExpanded,
    matrixStageFilterQ,
    onMatrixSearchChange,
    clearMatrixFilters,
    matrixPhaseParam,
    matrixTextQParam,
    scrollToCurrentMatrixStage,
    matrixPhaseOptions,
    setMatrixPhaseFilter,
    focusSkuMatrixPhase,
    aggregateStatus,
    isBlocked,
    matrixStepsFiltered,
    flowDoc,
    effectiveSkuIds,
    markStatus,
    openSkuPanelForStep,
    routerPush,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    mergeModuleHref,
    getProductionFloorTabTitle,
    navigateToStageModule,
  } = props;

  return (
    <>
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-1">
              <div className="min-w-0 flex-1 pr-1">
                <CardTitle className="text-sm uppercase tracking-tight">
                  Схема зависимостей
                </CardTitle>
                <p className="text-text-secondary mt-1 text-xs leading-snug">
                  Перечень SKU · клик по узлу сужает список и доску «Оперативка»
                </p>
              </div>
              <StagesCollapsePinBar
                pinned={depsPinned}
                onPinnedChange={onDepsPinnedChange}
                open={depsOpen}
                onOpenChange={onDepsOpenChange}
                collapseAriaLabel="Свернуть или развернуть «Схему зависимостей»"
              />
            </div>
            <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
              <StagesHelpHover
                align="end"
                wide
                title="Схема зависимостей — справка"
                trigger={
                  <StagesHelpIconTrigger aria-label="Справка: схема зависимостей, счётчики на узлах" />
                }
              >
                <StagesHelpWhyBlock title="Схема и клики">
                  <p>
                    Быстро увидеть, на каких этапах «лежит» перечень SKU, и сузить контекст кликом
                    по узлу (список и доска «Оперативка»).
                  </p>
                  <p className="mt-1.5">
                    У каждого узла справа сверху — иконка{' '}
                    <strong className="text-text-primary">i</strong>: список артикулов перечня на
                    этом этапе и подсказка, что сделать, чтобы двигаться дальше по контуру. Если на
                    узле 0 SKU, сначала закройте предшественников в матрице или расширьте срез.
                  </p>
                  <p className="mt-1.5">
                    Числа на узлах — по <strong className="text-text-primary">перечню SKU</strong>{' '}
                    (срез слева + чекбоксы). Узлы в 5 колонок и змейка; стрелки — визуальный
                    порядок, не полный граф (полный — в матрице ниже).
                  </p>
                  <p className="mt-1.5">
                    Узлы с артикулами перечня —{' '}
                    <strong className="text-emerald-800">зелёная рамка</strong>. Активный фильтр
                    узла — <strong className="text-accent-primary">индиго</strong>.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Счётчики «арт. здесь» и контекст">
                  <p>
                    «Арт. здесь» = сколько SKU из{' '}
                    <strong className="text-text-primary">пула среза</strong> имеют{' '}
                    <strong className="text-text-primary">текущий этап</strong> на этом узле (поле
                    контура коллекции).
                  </p>
                  <p className="mt-1.5">
                    Рабочий контекст — один артикул (
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code>); доска и матрица
                    показывают его только если этап SKU совпадает с выбранным узлом схемы (или узел
                    не включён).
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Следующий этап по SKU">
                  <p>
                    Текущий и следующий этап — из данных коллекции и каталога; зависимости
                    следующего шага сверяются со статусами в матрице (включая «не начато — не
                    блокирует», если задано в каталоге).
                  </p>
                  <p className="mt-1.5">
                    Статусы меняются в{' '}
                    <strong className="text-text-primary">«Матрице этапов»</strong>; текст по
                    конкретному артикулу — в окне узла (кнопка{' '}
                    <strong className="text-text-primary">i</strong> на карточке этапа), без
                    дублирования здесь.
                  </p>
                </StagesHelpWhyBlock>
              </StagesHelpHover>
            </div>
          </div>
        </CardHeader>
        {depsExpanded && (
          <CardContent className="max-w-full overflow-x-hidden pb-4">
            <div className="mb-3 space-y-1.5">
              <div className="border-border-default/90 flex flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2.5 shadow-sm">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="bg-accent-primary/15 text-accent-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Package className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-text-primary text-[11px] font-bold leading-tight">
                      {focusArticle
                        ? `В фокусе: ${stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season)}`
                        : 'Нет артикула в фокусе'}
                    </p>
                    <p className="text-text-secondary mt-0.5 text-[10px] leading-snug">
                      Счётчики на узлах — по пулу среза; доска и матрица следуют одному SKU и узлу
                      схемы · подробности — в справке у «Схема зависимостей»
                    </p>
                  </div>
                </div>
              </div>
              {chainFocusStepId ? (
                <p className="text-text-secondary text-[10px]" aria-live="polite">
                  Узел «
                  <strong>
                    {steps.find((s) => s.id === chainFocusStepId)?.title ?? chainFocusStepId}
                  </strong>
                  »: этап выбранного SKU{' '}
                  {viewArticles.length > 0
                    ? 'совпадает с узлом — доска и матрица активны'
                    : 'не на этом узле — доска и матрица пусты, пока не смените артикул или узел'}
                  .{' '}
                  <button
                    type="button"
                    className="text-accent-primary font-semibold hover:underline"
                    onClick={() => toggleChainFocus(chainFocusStepId)}
                  >
                    Снять фильтр узла
                  </button>
                </p>
              ) : (
                <p className="text-text-secondary text-[10px]">
                  Клик по узлу цепочки — сузить список, доску и матрицу до артикулов с текущим
                  этапом на узле; на карточке узла всегда видно число «арт.: N», в т.ч. 0.
                </p>
              )}
            </div>
            <div
              className="w-full max-w-full space-y-0 py-1"
              role="list"
              aria-label="Цепочка этапов: змейка по 5 узлов в строке"
            >
              {depsSchemaChunks.map((chunk, rowIdx) => {
                const isEvenRow = rowIdx % 2 === 0;
                const ordered = isEvenRow ? chunk : [...chunk].reverse();
                const paddedSlots: (CollectionStep | null)[] = Array.from(
                  { length: DEPS_SCHEMA_CHUNK },
                  (_, i) => ordered[i] ?? null
                );
                return (
                  <Fragment key={`deps-row-${rowIdx}`}>
                    <div
                      className="grid min-h-[62px] w-full min-w-0 items-stretch"
                      style={{ gridTemplateColumns: DEPS_SCHEMA_FULL_ROW_GRID }}
                    >
                      {paddedSlots.map((step, i) => {
                        const cellKey = step?.id ?? `deps-empty-${rowIdx}-${i}`;
                        if (!step) {
                          return (
                            <Fragment key={cellKey}>
                              <div
                                className="min-h-[52px] min-w-0 rounded-lg border border-transparent bg-transparent"
                                aria-hidden
                              />
                              {i < DEPS_SCHEMA_CHUNK - 1 ? (
                                <div
                                  className="relative flex min-w-0 items-center justify-center opacity-25"
                                  aria-hidden
                                >
                                  <span className="bg-border-subtle pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" />
                                  {isEvenRow ? (
                                    <ArrowRight
                                      className="text-text-muted relative z-[1] h-3 w-3"
                                      strokeWidth={2.5}
                                    />
                                  ) : (
                                    <ArrowLeft
                                      className="text-text-muted relative z-[1] h-3 w-3"
                                      strokeWidth={2.5}
                                    />
                                  )}
                                </div>
                              ) : null}
                            </Fragment>
                          );
                        }
                        const articlesHere = viewArticles.filter(
                          (a) => a.currentStageId === step.id
                        );
                        const count = articlesHere.length;
                        const active = chainFocusStepId === step.id;
                        const hasArticlesHere = count > 0;
                        const hasNextNode = i < DEPS_SCHEMA_CHUNK - 1 && paddedSlots[i + 1] != null;
                        const profileNa =
                          getProductionStageDisplayMode(step.id, productionProfileId) ===
                          'not_applicable';
                        return (
                          <Fragment key={cellKey}>
                            <div
                              role="listitem"
                              className={cn(
                                'relative flex h-full min-w-0 flex-col rounded-lg border transition-colors',
                                profileNa &&
                                  'border-border-default/90 bg-bg-surface2/50 border-dashed opacity-70',
                                active
                                  ? 'border-accent-primary bg-accent-primary/10 ring-accent-primary/40 z-[1] shadow-sm ring-2'
                                  : hasArticlesHere
                                    ? 'border-2 border-emerald-500 bg-emerald-50/45 shadow-[0_0_0_1px_rgba(16,185,129,0.12)] hover:border-emerald-600 hover:bg-emerald-50/70'
                                    : 'border-border-default bg-bg-surface2/90 hover:border-border-default border hover:bg-white'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => toggleChainFocus(step.id)}
                                title={
                                  active
                                    ? 'Снять фильтр'
                                    : hasArticlesHere
                                      ? `На этапе ${count} арт. — показать только их`
                                      : 'На этом этапе нет артикулов в перечне'
                                }
                                className="flex min-h-[48px] flex-1 flex-col justify-center px-1.5 py-1 pr-5 text-left"
                              >
                                <p className="text-text-secondary line-clamp-2 text-[7px] font-bold leading-tight">
                                  {step.title}
                                </p>
                                {profileNa ? (
                                  <p className="text-text-muted mt-0.5 text-[7px] font-semibold uppercase tracking-wide">
                                    вне профиля
                                  </p>
                                ) : null}
                                <p className="text-text-secondary mt-0.5 text-[8px] tabular-nums">
                                  арт. на узле: <strong>{count}</strong>
                                </p>
                                {active ? (
                                  <p className="text-accent-primary mt-0.5 text-[7px] font-semibold tabular-nums">
                                    узел выбран · {count} SKU
                                  </p>
                                ) : null}
                              </button>
                              <button
                                type="button"
                                className="text-accent-primary/90 hover:text-accent-primary absolute right-0.5 top-0.5 z-[2] flex h-5 w-5 items-center justify-center rounded-md shadow-sm hover:bg-white"
                                aria-label={`Артикулы и следующий шаг: ${step.title}`}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDepsNodeInfo(step.id);
                                }}
                              >
                                <Info className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                              </button>
                            </div>
                            {i < DEPS_SCHEMA_CHUNK - 1 ? (
                              <div
                                className={cn(
                                  'relative flex min-w-0 items-center justify-center',
                                  !hasNextNode && 'opacity-25'
                                )}
                                aria-hidden
                              >
                                <span
                                  className={cn(
                                    'pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full',
                                    hasNextNode
                                      ? 'from-accent-primary/20 via-accent-primary to-accent-primary/20 bg-gradient-to-r opacity-95'
                                      : 'bg-border-subtle'
                                  )}
                                />
                                {isEvenRow ? (
                                  <ArrowRight
                                    className={cn(
                                      'relative z-[1] h-3 w-3 stroke-[2.5] drop-shadow-sm',
                                      hasNextNode ? 'text-accent-primary' : 'text-text-muted'
                                    )}
                                  />
                                ) : (
                                  <ArrowLeft
                                    className={cn(
                                      'relative z-[1] h-3 w-3 stroke-[2.5] drop-shadow-sm',
                                      hasNextNode ? 'text-accent-primary' : 'text-text-muted'
                                    )}
                                  />
                                )}
                              </div>
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </div>
                    {rowIdx < depsSchemaChunks.length - 1 ? (
                      <DepsRowTurnConnector
                        column={
                          isEvenRow
                            ? chunk.length === 1
                              ? 3
                              : Math.min(chunk.length, DEPS_SCHEMA_CHUNK)
                            : 1
                        }
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-sm uppercase tracking-tight">Матрица этапов</CardTitle>
              <CardDescription className="text-xs">
                Один артикул в фокусе (<code className="text-[10px]">stagesSku</code>) и при
                необходимости узел схемы: агрегат и массовые кнопки по этому SKU; детальная карточка
                процесса — на «По артикулам». Чеклист заполнения и правки по каждому этапу — кнопка
                «Панель данных»; без API всё сохраняется в браузере (единый flow коллекции).
              </CardDescription>
            </div>
            <StagesCollapsePinBar
              pinned={matrixPinned}
              onPinnedChange={onMatrixPinnedChange}
              open={matrixOpen}
              onOpenChange={onMatrixOpenChange}
              collapseAriaLabel="Свернуть или развернуть «Матрицу этапов»"
            />
            <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
              <StagesHelpHover
                align="end"
                wide
                title="Матрица этапов"
                trigger={
                  <StagesHelpIconTrigger aria-label="Справка: матрица этапов, статусы и колонка «Связь»" />
                }
              >
                <StagesHelpWhyBlock title="Зачем">
                  <p>
                    Статусы по этапам для{' '}
                    <strong className="text-text-primary">одного артикула в фокусе</strong> (и узла
                    схемы, если включён); блокировки из каталога, пока предшественники не закрыты.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Срез и фокус">
                  <p>
                    Пул артикулов задаёт срез слева; в URL фиксируется{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code>. Узел схемы может
                    скрыть строки матрицы, если этап SKU не на этом узле — смените артикул или
                    снимите узел.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Колонка «Связь»">
                  <p>
                    Четыре иконки сеткой 2×2 (сверху:{' '}
                    <strong className="text-text-primary">чат</strong>,{' '}
                    <strong className="text-text-primary">задачи</strong>; снизу:{' '}
                    <strong className="text-text-primary">календарь</strong>,{' '}
                    <strong className="text-text-primary">заметки</strong>) — компактнее, чтобы не
                    заезжать на кнопку «В модуль». Наведение на{' '}
                    <strong className="text-text-primary">конкретную</strong> иконку показывает
                    сводку только по этому каналу. Серый контур — нет активности; янтарь — ждём
                    ответ / открытые задачи / слот без «проведено»; зелёный — контур закрыт; заметки
                    при наличии — нейтральная заливка. Чат/задачи/заметки не для этапов «впереди»
                    текущего SKU; календарь — текущий и следующий этап.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Как пользоваться">
                  <p>
                    «По арт.» — прогресс выбранного SKU по этапу. «В работе / Готово» и «Сброс» —
                    для этого же артикула в контексте узла схемы (если узел включён).
                  </p>
                  <p className="mt-1.5">
                    Поле <strong className="text-text-primary">Поиск этапа</strong> сужает список по
                    названию, фазе, id или зоне (локально); запрос синхронизируется с URL{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesMatrixQ</code> (debounce
                    ~0,4 с). Чипы <strong className="text-text-primary">фаз</strong> пишут фильтр в
                    URL (<code className="bg-bg-surface2 rounded px-1">stagesMatrixPhase</code>) —
                    удобно шарить ссылку. Зелёное кольцо на чипе — фаза текущего этапа SKU в фокусе.
                    «Сброс фильтра матрицы» очищает чип, поле и параметр в адресе.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Переходы и связи">
                  <p>
                    Кнопки ведут во вкладку цеха или внешний модуль с тем же{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code> в URL (без
                    мульти-перечня). Свод «сколько SKU на каком этапе» по коллекции — отдельный
                    сценарий в бэклоге, не смешивается с этим рабочим контекстом.
                  </p>
                </StagesHelpWhyBlock>
                <p className="text-text-secondary text-[10px]">
                  Схема зависимостей выше задаёт фильтр узла; число артикулов на узле всегда на
                  карточке, в т.ч. 0.
                </p>
              </StagesHelpHover>
            </div>
          </div>
        </CardHeader>
        {matrixExpanded ? (
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="border-border-default bg-bg-surface2/80 min-w-0 flex-1 rounded-lg border px-3 py-2.5">
                <p className="text-text-secondary text-[9px] font-black uppercase tracking-wider">
                  Перечень для матрицы
                </p>
                <p className="text-text-secondary mt-1 text-[10px] leading-snug">
                  Артикул в фокусе — справа в «Срез и артикул»
                  {chainFocusStepId ? (
                    <>
                      {' '}
                      · узел схемы «
                      {steps.find((s) => s.id === chainFocusStepId)?.title ?? chainFocusStepId}»
                    </>
                  ) : null}
                  . Матрица и кнопки — для этого SKU
                  {viewArticles.length === 0 && focusArticle
                    ? ' (сейчас этап SKU не на узле — снимите узел или смените артикул)'
                    : ''}
                  .
                </p>
              </div>
              <div className="w-full shrink-0 space-y-1.5 sm:w-[14rem]">
                <label
                  htmlFor="stages-matrix-stage-filter"
                  className="text-text-muted mb-1 block text-[8px] font-bold uppercase tracking-wide"
                >
                  Поиск этапа
                </label>
                <Input
                  id="stages-matrix-stage-filter"
                  className="h-8 text-xs"
                  placeholder="Название, фаза, зона…"
                  value={matrixStageFilterQ}
                  onChange={(e) => onMatrixSearchChange(e.target.value)}
                  aria-label="Фильтр строк матрицы этапов"
                />
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[9px]"
                    onClick={clearMatrixFilters}
                    disabled={!matrixPhaseParam && !matrixStageFilterQ.trim() && !matrixTextQParam}
                  >
                    Сброс фильтра матрицы
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 px-2 text-[9px]"
                    onClick={scrollToCurrentMatrixStage}
                    disabled={!focusArticle?.currentStageId}
                    title="Вкладка «Процесс», раскрыть матрицу и прокрутить к строке текущего этапа SKU"
                  >
                    <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К этапу SKU
                  </Button>
                </div>
              </div>
            </div>

            {matrixPhaseOptions.length > 0 ? (
              <div className="border-border-default/90 rounded-lg border bg-white/80 px-2.5 py-2">
                <p className="text-text-muted mb-1.5 text-[8px] font-black uppercase tracking-wider">
                  Фазы каталога (фильтр в URL)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    variant={!matrixPhaseParam ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-[9px]"
                    onClick={() => setMatrixPhaseFilter(null)}
                  >
                    Все фазы
                  </Button>
                  {matrixPhaseOptions.map((ph) => {
                    const isFocusSkuPhase = Boolean(
                      focusSkuMatrixPhase && ph === focusSkuMatrixPhase
                    );
                    return (
                      <Button
                        key={ph}
                        type="button"
                        variant={matrixPhaseParam === ph ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          'h-7 max-w-[min(100%,14rem)] truncate px-2 text-[9px]',
                          matrixPhaseParam === ph && 'bg-accent-primary hover:bg-accent-primary',
                          isFocusSkuPhase &&
                            matrixPhaseParam !== ph &&
                            'ring-2 ring-emerald-500/55 ring-offset-1 ring-offset-white'
                        )}
                        title={
                          isFocusSkuPhase && matrixPhaseParam !== ph
                            ? `${ph} — фаза текущего этапа SKU в фокусе`
                            : ph
                        }
                        onClick={() => setMatrixPhaseFilter(matrixPhaseParam === ph ? null : ph)}
                      >
                        {ph}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {!focusArticle ? (
              <p className="text-text-secondary text-xs">
                Нет артикула в фокусе — расширьте срез или выберите строку справа.
              </p>
            ) : viewArticles.length === 0 ? (
              <p className="text-text-secondary text-xs">
                Этап выбранного SKU не совпадает с узлом схемы — снимите узел или выберите другой
                артикул.
              </p>
            ) : (
              <>
                <div
                  className={cn(
                    'text-text-secondary border-border-subtle hidden items-center border-b pb-2 text-[10px] font-bold md:grid',
                    MATRIX_GRID
                  )}
                >
                  <span>Ось UI</span>
                  <span>Этап</span>
                  <span>Зона</span>
                  <span>Обяз.</span>
                  <span>Статус</span>
                  <span>По арт.</span>
                  <span className="text-text-secondary flex items-center gap-1 font-semibold normal-case">
                    Связь
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-text-muted hover:bg-bg-surface2 hover:text-text-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded"
                          aria-label="Легенда: чат, задачи, календарь, заметки"
                        >
                          <span className="text-[10px] font-bold leading-none">?</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="border-border-default text-text-primary max-w-xs border bg-white text-[10px] leading-snug"
                      >
                        Иконки связи — сетка 2×2: чат и задачи сверху, календарь и заметки снизу.
                        Наведение на иконку — сводка только по этому каналу; клик — переход в
                        модуль.
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span>Переходы и связи</span>
                </div>
                <div className="space-y-2">
                  {matrixStepsFiltered.length === 0 ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
                      Нет этапов по текущим фильтрам
                      {matrixPhaseParam ? <> (фаза «{matrixPhaseParam}»)</> : null}
                      {matrixStageFilterQ.trim() ? (
                        <> и запросу «{matrixStageFilterQ.trim()}»</>
                      ) : null}
                      . Нажмите «Сброс фильтра матрицы» или смените чип фазы.
                    </p>
                  ) : null}
                  {matrixStepsFiltered.map((step, stepIdx) => {
                    const prevPhase =
                      stepIdx > 0 ? matrixStepsFiltered[stepIdx - 1]?.phase : undefined;
                    const showPhaseHeader = Boolean(step.phase && step.phase !== prevPhase);
                    const s = aggregateStatus[step.id] ?? 'not_started';
                    const blocked = isBlocked(step);
                    const profileNa =
                      getProductionStageDisplayMode(step.id, productionProfileId) ===
                      'not_applicable';
                    const skuProgressLine = aggregateSkuProgressLine(
                      flowDoc,
                      effectiveSkuIds,
                      step.id
                    );
                    const icon =
                      s === 'done' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : profileNa ? (
                        <MinusCircle className="text-text-muted h-4 w-4" aria-hidden />
                      ) : blocked ? (
                        <Lock className="text-text-muted h-4 w-4" />
                      ) : (
                        <CircleDot className="h-4 w-4 text-amber-500" />
                      );
                    const label = statusLabel(s, blocked, profileNa);
                    const statusColor = profileNa
                      ? 'text-text-secondary'
                      : s === 'done'
                        ? 'text-emerald-700'
                        : blocked
                          ? 'text-text-secondary'
                          : s === 'in_progress'
                            ? 'text-amber-700'
                            : 'text-text-secondary';

                    const commQuery = buildStagesCommLinkQuery(viewArticles, step.id);
                    const notesQuery = buildStagesNotesLinkQuery(viewArticles, step.id);
                    const linkRow = aggregateMatrixStepLinkRow(
                      viewArticles,
                      step.id,
                      steps,
                      flowDoc
                    );

                    return (
                      <Fragment key={step.id}>
                        {showPhaseHeader && step.phase ? (
                          <div className="border-border-default/80 bg-bg-surface2/90 text-text-primary rounded-lg border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                            {step.phase}
                          </div>
                        ) : null}
                        <div
                          id={`stages-matrix-row-${step.id}`}
                          title={
                            profileNa
                              ? 'Этап не относится к выбранному профилю контура (готовый товар / дропшип и т.д.)'
                              : undefined
                          }
                          className={cn(
                            MATRIX_GRID,
                            'scroll-mt-4 items-start rounded-xl border p-2.5 sm:p-3',
                            profileNa && 'border-border-default/95 bg-bg-surface2/75 border-dashed',
                            focusArticle && step.id === focusArticle.currentStageId
                              ? 'border-emerald-300/90 bg-emerald-50/35 ring-1 ring-emerald-400/40'
                              : !profileNa && 'border-border-subtle bg-white/60'
                          )}
                        >
                          <div className="space-y-1">
                            <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider md:hidden">
                              Ось UI
                            </span>
                            {step.productionFloorTab ? (
                              <>
                                <Badge className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-[8px] font-black uppercase tracking-wider">
                                  Вкладка цеха
                                </Badge>
                                <button
                                  type="button"
                                  disabled={!focusArticle && !step.collectionScopedModuleNav}
                                  className="text-accent-primary block w-full text-left text-[10px] font-bold leading-snug hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                                  onClick={() => {
                                    const tab = step.productionFloorTab;
                                    if (!tab) return;
                                    if (step.collectionScopedModuleNav) {
                                      routerPush(
                                        mergeCollectionQuery(floorHref(tab), collectionQuery)
                                      );
                                      return;
                                    }
                                    if (!focusArticle) return;
                                    routerPush(mergeModuleHref(floorHref(tab), step.id));
                                  }}
                                >
                                  {getProductionFloorTabTitle(step.productionFloorTab)}
                                </button>
                              </>
                            ) : step.href ? (
                              <>
                                <Badge
                                  variant="outline"
                                  className="border-border-default text-text-secondary text-[8px] font-black uppercase tracking-wider"
                                >
                                  Вне цеха
                                </Badge>
                                <button
                                  type="button"
                                  disabled={!focusArticle && !step.collectionScopedModuleNav}
                                  title={
                                    step.collectionScopedModuleNav
                                      ? 'Открыть модуль этапа с контекстом коллекции (без SKU в URL)'
                                      : 'Открыть основной модуль этапа с тем же артикулом в URL'
                                  }
                                  className="text-accent-primary block w-full text-left text-[10px] font-bold leading-snug hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                                  onClick={() => {
                                    if (step.collectionScopedModuleNav && step.href) {
                                      routerPush(mergeCollectionQuery(step.href, collectionQuery));
                                      return;
                                    }
                                    if (!focusArticle) return;
                                    routerPush(mergeModuleHref(step.href!, step.id));
                                  }}
                                >
                                  {step.externalAxisLabel ?? 'Модуль этапа'}
                                </button>
                              </>
                            ) : (
                              <>
                                <Badge
                                  variant="outline"
                                  className="border-border-default text-text-secondary text-[8px] font-black uppercase tracking-wider"
                                >
                                  Вне цеха
                                </Badge>
                                <span className="text-text-secondary block text-[10px] leading-snug">
                                  Ссылка в каталоге не задана
                                </span>
                              </>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider md:hidden">
                              Этап
                            </span>
                            <div className="flex flex-wrap items-start gap-1.5">
                              {icon}
                              <span className="text-text-primary min-w-0 text-[11px] font-semibold leading-snug">
                                {step.title}
                              </span>
                              {profileNa ? (
                                <Badge
                                  variant="outline"
                                  className="text-text-secondary h-5 shrink-0 border-dashed px-1 text-[7px]"
                                >
                                  вне профиля
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-text-secondary line-clamp-3 text-[10px] leading-snug">
                              {step.description}
                            </p>
                          </div>
                          <div className="text-text-secondary flex items-center justify-between text-[10px] md:justify-start">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              Зона
                            </span>
                            <Badge variant="outline" className="border-border-default text-[9px]">
                              {step.area}
                            </Badge>
                          </div>
                          <div className="flex flex-col justify-between gap-0.5 text-[10px] md:justify-start">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              Обяз.
                            </span>
                            <span
                              className={cn(
                                'shrink-0 font-semibold',
                                step.mandatory ? 'text-rose-600' : 'text-text-secondary'
                              )}
                            >
                              {step.mandatory ? 'Да' : 'Нет'}
                            </span>
                            {!step.mandatory || step.canSkipForNow ? (
                              <p className="text-text-secondary max-w-[11rem] text-[8px] leading-tight">
                                {!step.mandatory
                                  ? 'Необязателен в каталоге — статус можно отложить.'
                                  : 'К закрытию обязателен; отметку в матрице можно позже.'}
                              </p>
                            ) : null}
                          </div>
                          <div className="space-y-1">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              Статус
                            </span>
                            <span
                              className={cn(
                                'flex items-center gap-1 text-[10px] font-semibold',
                                statusColor
                              )}
                            >
                              {label}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                disabled={blocked || profileNa}
                                title={
                                  profileNa
                                    ? 'Этап вне профиля — массовые статусы отключены'
                                    : undefined
                                }
                                onClick={() => markStatus(step.id, 'in_progress')}
                              >
                                В работе
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[9px]"
                                disabled={blocked || profileNa}
                                title={
                                  profileNa
                                    ? 'Этап вне профиля — массовые статусы отключены'
                                    : undefined
                                }
                                onClick={() => markStatus(step.id, 'done')}
                              >
                                Готово
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-muted h-6 px-2 text-[9px]"
                                onClick={() => markStatus(step.id, 'not_started')}
                              >
                                Сброс
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              По арт.
                            </span>
                            <span className="text-text-primary text-[9px] font-semibold">
                              {skuProgressLine}
                            </span>
                            {focusArticle ? (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-6 px-2 text-[9px] font-semibold"
                                title="Чеклист этапа, люди, затраты, выходы — сохранение в localStorage"
                                onClick={() => openSkuPanelForStep(focusArticle.id, step.id)}
                              >
                                Панель данных
                              </Button>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              Связь
                            </span>
                            <MatrixLinkStrip
                              row={linkRow}
                              commQuery={commQuery}
                              notesQuery={notesQuery}
                              mergeCollectionQuery={mergeCollectionQuery}
                              collectionQuery={collectionQuery}
                            />
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                              Переходы
                            </span>
                            {step.href ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[9px]"
                                disabled={!focusArticle && !step.collectionScopedModuleNav}
                                title={
                                  step.collectionScopedModuleNav
                                    ? 'Модуль этапа коллекции: collectionId в URL, без stagesSku'
                                    : 'Тот же переход, что по клику в колонке «Ось UI» — с контекстом коллекции и SKU'
                                }
                                onClick={() =>
                                  navigateToStageModule(
                                    step,
                                    mergeCollectionQuery(step.href!, collectionQuery)
                                  )
                                }
                              >
                                В модуль
                                <ArrowRight className="ml-1 inline h-3 w-3" />
                              </Button>
                            ) : (
                              <span className="text-text-muted text-[10px]">
                                Без основной ссылки
                              </span>
                            )}
                            {step.crossLinks && step.crossLinks.length > 0 ? (
                              <div className="border-border-subtle max-h-28 w-full space-y-1 overflow-y-auto border-t pt-2">
                                <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
                                  Связи
                                </p>
                                <div className="flex flex-col gap-1 pr-0.5">
                                  {step.crossLinks.map((cl) => (
                                    <button
                                      key={`${step.id}-${cl.label}-${cl.href}`}
                                      type="button"
                                      disabled={!focusArticle && !step.collectionScopedModuleNav}
                                      className="text-accent-primary text-left text-[9px] font-medium hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                                      onClick={() =>
                                        navigateToStageModule(
                                          step,
                                          mergeCollectionQuery(cl.href, collectionQuery)
                                        )
                                      }
                                    >
                                      {cl.label} →
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
