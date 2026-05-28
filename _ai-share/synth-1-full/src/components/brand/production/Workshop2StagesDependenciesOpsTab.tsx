'use client';

import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  getProductionStageDisplayMode,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import type {
  CollectionSkuFlowDoc,
  MatrixStepStatus,
} from '@/lib/production/unified-sku-flow-store';
import {
  evaluateStageDataFill,
  STAGE_FILL_EDIT_TAB_LABELS,
} from '@/lib/production/stage-data-fill-spec';
import { STAGES_SKU_PANEL_TAB_VALUES, type StagesSkuPanelTab } from '@/lib/production/stages-url';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import {
  BOARD_STAGES_PER_ROW,
  statusLabel,
  type StagesSubTab,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  StagesHelpHover,
  StagesHelpIconTrigger,
  StagesHelpWhyBlock,
} from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesCollapsePinBar } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';

/** Same as parent — board column header height. */
const BOARD_COL_HEADER_H = 'min-h-[118px]';

export type Workshop2StagesDependenciesBoardColumnStat = {
  step: CollectionStep;
  here: StagesTabArticle[];
  done: number;
  prog: number;
  block: number;
  line: string;
};

export type Workshop2StagesDependenciesOpsTabProps = {
  boardPinned: boolean;
  onBoardPinnedChange: (pinned: boolean) => void;
  boardOpen: boolean;
  onBoardOpenChange: (open: boolean) => void;
  boardExpanded: boolean;
  boardStepRows: CollectionStep[][];
  columnStats: Workshop2StagesDependenciesBoardColumnStat[];
  isBlocked: (step: CollectionStep) => boolean;
  productionProfileId: ProductionFlowProfileId;
  aggregateStatus: Record<string, MatrixStepStatus>;
  focusArticle: StagesTabArticle | null;
  flowDoc: CollectionSkuFlowDoc;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  navigateToStageModule: (step: CollectionStep, targetHref: string) => void;
  openSkuPanelForStep: (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => void;
  routerPush: (href: string) => void;
  buildTransitionUrl: (targetHref: string, chosenArticleId: string, stepId: string) => string;
  onSetSubTab: (tab: StagesSubTab) => void;
  onSetFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
};

export function Workshop2StagesDependenciesOpsTab(props: Workshop2StagesDependenciesOpsTabProps) {
  const {
    boardPinned,
    onBoardPinnedChange,
    boardOpen,
    onBoardOpenChange,
    boardExpanded,
    boardStepRows,
    columnStats,
    isBlocked,
    productionProfileId,
    aggregateStatus,
    focusArticle,
    flowDoc,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule,
    openSkuPanelForStep,
    routerPush,
    buildTransitionUrl,
    onSetSubTab,
    onSetFocusSku,
  } = props;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-sm uppercase tracking-tight">Доска этапов</CardTitle>
              <CardDescription className="text-xs">
                Колонки — этапы коллекции; артикул в фокусе — карточка в колонке текущего этапа. В
                шапке каждой колонки —{' '}
                <strong className="text-text-primary">% заполнения данных</strong> для этого этапа и
                SKU (обязательные и доп. поля под модуль этапа, не прогресс «можно ли идти дальше»).
              </CardDescription>
            </div>
            <StagesCollapsePinBar
              pinned={boardPinned}
              onPinnedChange={onBoardPinnedChange}
              open={boardOpen}
              onOpenChange={onBoardOpenChange}
              collapseAriaLabel="Свернуть или развернуть «Доску этапов»"
            />
            <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
              <StagesHelpHover
                align="end"
                wide
                title="Доска этапов"
                trigger={<StagesHelpIconTrigger aria-label="Справка: доска этапов и колонки" />}
              >
                <StagesHelpWhyBlock title="Зачем">
                  <p>
                    Визуальный Kanban по коллекции: видно текущий этап выбранного SKU и локальные
                    статусы по шагам.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Подробно">
                  <p>
                    Карточка артикула стоит в колонке его{' '}
                    <strong className="text-text-primary">текущего</strong> этапа. Этапы — сеткой по
                    четыре колонки в ряд; сводка в шапке колонки — по артикулу в фокусе (
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code>). Колонка с
                    карточкой SKU подсвечена. Кнопка{' '}
                    <strong className="text-text-primary">«К данным этапа»</strong> в шапке колонки
                    открывает модуль этапа с этим SKU в URL для любой колонки (не только текущей).
                    Клик по карточке SKU ведёт на вкладку цеха / модуль этого этапа (заполнение
                    данных) с тем же артикулом в URL; если у этапа нет ссылки — открывается «По
                    артикулам». Больше двух карточек в колонке — прокрутка.
                  </p>
                  <p className="mt-1.5">
                    <strong className="text-text-primary">Процент в шапке колонки</strong> —
                    заполненность полей карточки процесса под модуль этого этапа (бриф, PIM, бюджет,
                    материалы… — разный чеклист). Это не то же самое, что статус «готово» в цепочке
                    этапов. Без артикула в фокусе процент не показывается.
                  </p>
                </StagesHelpWhyBlock>
                <p className="text-text-secondary text-[10px]">
                  Массовые статусы по этапам — в «Матрице этапов» ниже; схема зависимостей — для
                  фильтра узла и обзора цифр.
                </p>
              </StagesHelpHover>
            </div>
          </div>
        </CardHeader>
        {boardExpanded ? (
          <CardContent className="-mx-1 space-y-3 px-1 pb-2">
            {boardStepRows.map((rowSteps, rowIdx) => (
              <div
                key={`board-row-${rowIdx}`}
                className="border-border-default bg-bg-surface2/80 grid min-h-[280px] grid-cols-2 items-stretch gap-0 overflow-hidden rounded-xl border md:grid-cols-4"
              >
                {rowSteps.map((step, colIdxInRow) => {
                  const globalColIdx = rowIdx * BOARD_STAGES_PER_ROW + colIdxInRow;
                  const stat = columnStats.find((c) => c.step.id === step.id);
                  const here = stat?.here ?? [];
                  const blocked = isBlocked(step);
                  const profileNa =
                    getProductionStageDisplayMode(step.id, productionProfileId) ===
                    'not_applicable';
                  const s = aggregateStatus[step.id] ?? 'not_started';
                  const focusStageFill =
                    focusArticle != null
                      ? evaluateStageDataFill(
                          step.id,
                          flowDoc.skus[focusArticle.id]?.stages[step.id] ?? {
                            status: 'not_started' as const,
                          }
                        )
                      : null;
                  /** Переход в модуль этапа доступен при выбранном SKU всегда (не только для «текущей» колонки / «готово»). */
                  const boardNavHref: string | null =
                    focusArticle != null && (step.productionFloorTab || step.href)
                      ? step.productionFloorTab
                        ? mergeCollectionQuery(floorHref(step.productionFloorTab), collectionQuery)
                        : mergeCollectionQuery(step.href!, collectionQuery)
                      : null;
                  const boardFillShortcuts =
                    focusStageFill != null
                      ? STAGES_SKU_PANEL_TAB_VALUES.filter(
                          (t) =>
                            t !== 'process' && focusStageFill.items.some((i) => i.editTab === t)
                        )
                      : [];
                  const headerShell = cn(
                    'px-2.5 pt-2.5 pb-2 border-b border-border-subtle flex flex-col justify-between transition-colors',
                    BOARD_COL_HEADER_H
                  );
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'border-border-default flex min-w-0 flex-col border-l bg-white/90 first:rounded-l-xl first:border-l-0 last:rounded-r-xl',
                        profileNa && 'bg-bg-surface2/95 opacity-[0.72]',
                        here.length > 0 &&
                          'z-[1] border-emerald-200/90 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] ring-2 ring-inset ring-emerald-500/50'
                      )}
                    >
                      <div className={headerShell}>
                        <div>
                          <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
                            Этап {globalColIdx + 1}
                          </p>
                          <p className="text-text-primary line-clamp-2 text-[11px] font-bold leading-tight">
                            {step.title}
                          </p>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {profileNa ? (
                            <Badge
                              variant="outline"
                              className="border-border-default text-text-secondary h-5 border-dashed px-1 py-0 text-[7px]"
                            >
                              Вне профиля
                            </Badge>
                          ) : null}
                          <Badge
                            variant="outline"
                            className="border-border-default h-5 px-1 py-0 text-[8px]"
                          >
                            {step.area}
                          </Badge>
                          <span className="text-text-secondary text-[8px]">
                            {stat?.line ?? '—'}
                          </span>
                        </div>
                        {focusStageFill ? (
                          <div className="mt-2 w-full space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-text-secondary text-[7px] font-bold uppercase tracking-wide">
                                Данные SKU
                              </span>
                              <span className="text-accent-primary text-[10px] font-black tabular-nums">
                                {focusStageFill.percent}%
                              </span>
                            </div>
                            <div className="bg-border-subtle h-1 w-full overflow-hidden rounded-full">
                              <div
                                className="bg-accent-primary h-full rounded-full"
                                style={{ width: `${focusStageFill.percent}%` }}
                              />
                            </div>
                            <p className="text-text-muted text-[7px] leading-tight">
                              Обяз. {focusStageFill.requiredFilled}/{focusStageFill.requiredTotal} ·
                              Доп. {focusStageFill.optionalFilled}/{focusStageFill.optionalTotal}
                            </p>
                          </div>
                        ) : (
                          <p className="text-text-muted mt-2 text-[7px] leading-tight">
                            Выберите артикул в фокусе — покажем % заполнения по этапу.
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {boardNavHref && (focusArticle || step.collectionScopedModuleNav) ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-[8px] font-semibold"
                              title={
                                step.collectionScopedModuleNav
                                  ? 'Модуль этапа коллекции: только collectionId в URL, без привязки к SKU'
                                  : 'Вкладка цеха или внешний модуль этапа с артикулом в фокусе (stagesSku, stagesStep в URL)'
                              }
                              onClick={() => navigateToStageModule(step, boardNavHref)}
                            >
                              К данным этапа →
                            </Button>
                          ) : boardNavHref && !focusArticle && !step.collectionScopedModuleNav ? (
                            <span className="text-text-muted text-[7px] leading-tight">
                              Выберите артикул справа в срезе — откроются переходы по этапам
                            </span>
                          ) : focusArticle &&
                            !boardNavHref &&
                            !step.productionFloorTab &&
                            !step.href ? (
                            <span className="text-text-muted text-[7px] leading-tight">
                              Нет маршрута этапа — только «Панель данных»
                            </span>
                          ) : null}
                          {focusArticle ? (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-6 px-2 text-[8px] font-semibold"
                              title="Открыть панель заполнения этапа на вкладке «По артикулам»"
                              onClick={() => openSkuPanelForStep(focusArticle.id, step.id)}
                            >
                              Панель данных
                            </Button>
                          ) : null}
                        </div>
                        {focusArticle && boardFillShortcuts.length > 0 ? (
                          <div
                            className="border-border-subtle/90 mt-1.5 flex flex-col gap-0.5 border-t pt-1.5"
                            role="group"
                            aria-label="Блоки формы в панели этапа"
                          >
                            <span className="text-text-muted text-[6px] font-bold uppercase tracking-wider">
                              Блоки
                            </span>
                            <div className="flex flex-wrap gap-0.5">
                              {boardFillShortcuts.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  className="border-border-default text-text-secondary hover:bg-accent-primary/10 hover:border-accent-primary/30 h-5 min-w-[1.1rem] rounded border bg-white px-1 text-[7px] font-black"
                                  title={`Панель данных · ${STAGE_FILL_EDIT_TAB_LABELS[t]}`}
                                  onClick={() => openSkuPanelForStep(focusArticle.id, step.id, t)}
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
                          </div>
                        ) : null}
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col gap-2 px-2 py-2">
                        <div className="bg-bg-surface2/80 text-text-secondary shrink-0 space-y-0.5 rounded-md px-2 py-1.5 text-[9px]">
                          <p>
                            <strong className="text-text-primary">В колонке:</strong> {here.length}{' '}
                            арт.
                          </p>
                          <p>
                            Готово: {stat?.done ?? 0} · В работе: {stat?.prog ?? 0}
                            {(stat?.block ?? 0) > 0 ? ` · Блок: ${stat?.block}` : ''}
                          </p>
                          <p className="text-text-secondary">
                            Матрица:{' '}
                            <strong className="text-text-primary">
                              {statusLabel(s, blocked, profileNa)}
                            </strong>
                          </p>
                        </div>
                        {here.length === 0 ? (
                          <p className="text-text-muted py-6 text-center text-[9px]">
                            Нет артикулов
                          </p>
                        ) : (
                          <div
                            className={cn(
                              'min-h-0 space-y-2',
                              here.length > 2 &&
                                'max-h-[min(15rem,40vh)] flex-1 overflow-y-auto overflow-x-hidden'
                            )}
                          >
                            {here.map((a) => {
                              const row = flowDoc.skus[a.id]?.stages[step.id] ?? {
                                status: 'not_started' as const,
                              };
                              const assignee = row.assignee?.trim();
                              const cardNavHref = step.productionFloorTab
                                ? mergeCollectionQuery(
                                    floorHref(step.productionFloorTab),
                                    collectionQuery
                                  )
                                : step.href
                                  ? mergeCollectionQuery(step.href, collectionQuery)
                                  : null;
                              const goCardPrimary = () => {
                                if (cardNavHref) {
                                  if (step.collectionScopedModuleNav) {
                                    routerPush(cardNavHref);
                                  } else {
                                    routerPush(buildTransitionUrl(cardNavHref, a.id, step.id));
                                  }
                                  return;
                                }
                                onSetSubTab('sku');
                                onSetFocusSku(a.id, { preserveChain: true });
                              };
                              return (
                                <div
                                  key={a.id}
                                  className="border-border-subtle w-full space-y-1.5 rounded-lg border bg-white p-2 text-left shadow-sm"
                                >
                                  <button
                                    type="button"
                                    className="hover:bg-accent-primary/10 focus-visible:ring-accent-primary -m-0.5 w-full space-y-1 rounded-md p-0.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2"
                                    title={
                                      cardNavHref
                                        ? step.collectionScopedModuleNav
                                          ? 'Этап коллекции: переход в модуль без привязки к этому SKU в URL'
                                          : 'Перейти к заполнению данных по этому этапу (вкладка цеха или модуль) с этим артикулом'
                                        : 'Нет прямой ссылки этапа — открыть карточку процесса «По артикулам»'
                                    }
                                    onClick={goCardPrimary}
                                  >
                                    <p className="text-text-primary truncate text-[10px] font-bold">
                                      {stagesArticleDisplayLabel(a.sku, a.season)}
                                    </p>
                                    <p className="text-text-secondary truncate text-[8px]">
                                      {a.productionSiteLabel ?? '—'}
                                    </p>
                                    {a.fabricStockNote ? (
                                      <p className="line-clamp-2 text-[7px] leading-snug text-amber-900/80">
                                        {a.fabricStockNote}
                                      </p>
                                    ) : null}
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      <Badge variant="secondary" className="h-5 px-1 text-[8px]">
                                        {row.status === 'done' || row.status === 'skipped'
                                          ? 'Готово'
                                          : row.status === 'in_progress'
                                            ? 'В работе'
                                            : row.status === 'blocked'
                                              ? 'Блок'
                                              : 'Не начато'}
                                      </Badge>
                                    </div>
                                    <p className="text-text-secondary text-[8px]">
                                      <span className="text-text-secondary font-semibold">
                                        Кто:
                                      </span>{' '}
                                      {assignee || '—'}
                                    </p>
                                    {row.notes?.trim() ? (
                                      <p className="text-text-secondary line-clamp-2 text-[8px]">
                                        {row.notes}
                                      </p>
                                    ) : null}
                                    <p className="text-accent-primary pt-0.5 text-[7px] font-bold uppercase tracking-wide">
                                      {cardNavHref ? 'К работе по этапу →' : 'По артикулам →'}
                                    </p>
                                  </button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-full text-[8px] font-semibold"
                                    onClick={() => openSkuPanelForStep(a.id, step.id)}
                                  >
                                    Панель данных
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
