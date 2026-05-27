'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SkuProcessDetailPanel } from '@/components/brand/production/SkuProcessDetailPanel';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { CollectionSkuFlowDoc, SkuStageDetail } from '@/lib/production/unified-sku-flow-store';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type {
  StagesSubTab,
  StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import type { StagesSkuPanelTab } from '@/lib/production/stages-url';
import {
  StagesHelpHover,
  StagesHelpIconTrigger,
  StagesHelpWhyBlock,
} from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesCollapsePinBar } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';
import { Crosshair, LayoutGrid, ListTree } from 'lucide-react';

export type Workshop2StagesDependenciesSkuTabProps = {
  skuPanelPinned: boolean;
  onSkuPanelPinnedChange: (pinned: boolean) => void;
  skuPanelOpen: boolean;
  onSkuPanelOpenChange: (open: boolean) => void;
  skuPanelExpanded: boolean;
  poolArticles: StagesTabArticle[];
  collectionArticles: StagesTabArticle[];
  resolvedFocusId: string;
  skuSelectArticles: StagesTabArticle[];
  focusArticle: StagesTabArticle | null;
  onSetFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
  onSetSubTab: (tab: StagesSubTab) => void;
  onJumpToMatrixRow: (stepId: string) => void;
  onClearAllFacets: () => void;
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  onPatchSkuStage: (stepId: string, patch: Partial<SkuStageDetail>) => void;
  onAppendSkuAuditLine: (stepId: string, line: { summary: string; by?: string }) => void;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  collectionFlowKey: string;
  stagesSkuPanelParam: string;
  stagesSkuPanelTabParsed: StagesSkuPanelTab | null;
  onConsumedOpenPanelRequest: () => void;
};

export function Workshop2StagesDependenciesSkuTab(props: Workshop2StagesDependenciesSkuTabProps) {
  const {
    skuPanelPinned,
    onSkuPanelPinnedChange,
    skuPanelOpen,
    onSkuPanelOpenChange,
    skuPanelExpanded,
    poolArticles,
    collectionArticles,
    resolvedFocusId,
    skuSelectArticles,
    focusArticle,
    onSetFocusSku,
    onSetSubTab,
    onJumpToMatrixRow,
    onClearAllFacets,
    flowDoc,
    steps,
    onPatchSkuStage,
    onAppendSkuAuditLine,
    mergeModuleHref,
    floorHref,
    mergeCollectionQuery,
    collectionQuery,
    collectionFlowKey,
    stagesSkuPanelParam,
    stagesSkuPanelTabParsed,
    onConsumedOpenPanelRequest,
  } = props;

  return (
    <>
      <Card className="border-accent-primary/20 bg-accent-primary/10">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-sm uppercase tracking-tight">
                По артикулам: процесс, ответственные, затраты, выходы
              </CardTitle>
              <CardDescription className="text-xs">
                Один SKU из пула среза; в URL — <code className="text-[10px]">stagesSku</code>.
              </CardDescription>
            </div>
            <StagesCollapsePinBar
              pinned={skuPanelPinned}
              onPinnedChange={onSkuPanelPinnedChange}
              open={skuPanelOpen}
              onOpenChange={onSkuPanelOpenChange}
              collapseAriaLabel="Свернуть или развернуть блок «По артикулам»"
            />
            <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
              <StagesHelpHover
                align="end"
                wide
                title="По артикулам"
                trigger={
                  <StagesHelpIconTrigger aria-label="Справка: вкладка по артикулам, окно этапа и модуль цеха" />
                }
              >
                <StagesHelpWhyBlock title="Две кнопки в колонке">
                  <p>
                    <strong className="text-text-primary">Панель этапа</strong> — окно: чеклист
                    обязательно/дополнительно, под ним форма выбранной строки (редактирование) и
                    отдельно «Журнал». <strong className="text-text-primary">Таб этапа</strong> —
                    переход во вкладку цеха или внешний модуль с контекстом коллекции (если маршрут
                    задан в каталоге).
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Зачем">
                  <p>
                    По одному артикулу: проверить и поправить всё по каждому этапу в одном месте —
                    не только перейти в модуль, но и увидеть заполненное и пустое, историю правок и
                    зафиксировать запрос ответственному.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Как связано с матрицей">
                  <p>
                    Тот же <code className="bg-bg-surface2 rounded px-1">stagesSku</code>, что и на
                    «Процесс и правила»; матрица — сводка, здесь — доска этапов с панелью и табом
                    этапа.
                  </p>
                </StagesHelpWhyBlock>
              </StagesHelpHover>
            </div>
          </div>
        </CardHeader>
        {skuPanelExpanded ? (
          <CardContent className="space-y-4">
            {poolArticles.length > 0 ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-text-secondary shrink-0 text-[10px] font-bold uppercase">
                    Артикул
                  </span>
                  <Select
                    value={resolvedFocusId}
                    onValueChange={(id) => onSetFocusSku(id, { preserveChain: true })}
                  >
                    <SelectTrigger className="h-9 max-w-xl text-xs">
                      <SelectValue placeholder="Выберите артикул" />
                    </SelectTrigger>
                    <SelectContent>
                      {skuSelectArticles.map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-xs">
                          {stagesArticleDisplayLabel(a.sku, a.season)}
                          {a.categoryPathLabel ? ` · ${a.categoryPathLabel}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {focusArticle ? (
                  <div className="border-border-default/90 flex flex-wrap items-center gap-2 rounded-lg border bg-white/80 px-2 py-2">
                    <span className="text-text-muted shrink-0 text-[9px] font-bold uppercase tracking-wide">
                      Связь экранов
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-[9px]"
                      title="Вкладка «Оперативка»: доска этапов"
                      onClick={() => onSetSubTab('ops')}
                    >
                      <LayoutGrid className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                      Доска
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-[9px]"
                      title="Вкладка «Процесс»: схема зависимостей и матрица"
                      onClick={() => onSetSubTab('process')}
                    >
                      <ListTree className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                      Схема и матрица
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 gap-1 text-[9px]"
                      title="Переключить на «Процесс», раскрыть матрицу и прокрутить к этапу"
                      onClick={() => onJumpToMatrixRow(focusArticle.currentStageId)}
                    >
                      <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К этапу в матрице
                    </Button>
                  </div>
                ) : null}
                {focusArticle ? (
                  <SkuProcessDetailPanel
                    skuId={resolvedFocusId}
                    skuLabel={stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season)}
                    currentStageId={focusArticle.currentStageId}
                    doc={flowDoc}
                    steps={steps}
                    onPatch={(stepId, patch) => onPatchSkuStage(stepId, patch)}
                    onAppendAuditLine={(stepId, line) => onAppendSkuAuditLine(stepId, line)}
                    mergeModuleHref={mergeModuleHref}
                    floorHref={floorHref}
                    mergeCollectionQuery={mergeCollectionQuery}
                    collectionQuery={collectionQuery}
                    collectionFlowKey={collectionFlowKey}
                    pendingOpenPanelStepId={stagesSkuPanelParam || null}
                    pendingOpenPanelTab={stagesSkuPanelTabParsed}
                    onConsumedOpenPanelRequest={onConsumedOpenPanelRequest}
                  />
                ) : null}
              </>
            ) : collectionArticles.length === 0 ? (
              <p className="text-text-secondary text-xs">
                В этой коллекции пока нет артикулов — нажмите «Коллекция и данные» (справа у профиля
                контура), добавьте SKU или переключите коллекцию.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-text-secondary text-xs leading-relaxed">
                  В коллекции <strong>{collectionArticles.length}</strong> SKU, но в{' '}
                  <strong>текущем срезе</strong> (фильтры слева и узел схемы) ни одного не осталось.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-[10px]"
                  onClick={onClearAllFacets}
                >
                  Сбросить фильтры среза
                </Button>
              </div>
            )}
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
