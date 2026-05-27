'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  STAGES_PRODUCTION_SITES,
  stagesArticleDisplayLabel,
} from '@/lib/production/stages-tab-facets';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type {
  StagesFacetSetBundle,
  StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import {
  StagesHelpHover,
  StagesHelpIconTrigger,
  StagesHelpWhyBlock,
} from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesCollapsePinBar } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';

const SLICE_PANEL_HEIGHT_CLASS = 'h-[min(22rem,52vh)] min-h-[260px]';

type HandbookAudienceOption = { id: string; name: string };
type ProductionSiteOption = (typeof STAGES_PRODUCTION_SITES)[number];

export type Workshop2StagesDependenciesSlicePanelProps = {
  slicePinned: boolean;
  onSlicePinnedChange: (pinned: boolean) => void;
  sliceOpen: boolean;
  onSliceOpenChange: (open: boolean) => void;
  sliceExpanded: boolean;
  focusArticle: StagesTabArticle | null;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  onClearAllFacets: () => void;
  pickerQ: string;
  onPickerQChange: (value: string) => void;
  facetBundle: StagesFacetSetBundle;
  audienceFacetChoices: HandbookAudienceOption[];
  seasonFacetChoices: string[];
  l1FacetChoices: string[];
  l2FacetChoices: string[];
  l3FacetChoices: string[];
  fabFacetChoices: ProductionSiteOption[];
  onToggleFacetValue: (
    param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
    value: string
  ) => void;
  articlesForPickerList: StagesTabArticle[];
  steps: CollectionStep[];
  resolvedFocusId: string;
  expandedPickDetailIds: ReadonlySet<string>;
  onTogglePickDetailRow: (id: string) => void;
  onSetFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
};

export function Workshop2StagesDependenciesSlicePanel(
  props: Workshop2StagesDependenciesSlicePanelProps
) {
  const {
    slicePinned,
    onSlicePinnedChange,
    sliceOpen,
    onSliceOpenChange,
    sliceExpanded,
    focusArticle,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    mergeModuleHref,
    onClearAllFacets,
    pickerQ,
    onPickerQChange,
    facetBundle,
    audienceFacetChoices,
    seasonFacetChoices,
    l1FacetChoices,
    l2FacetChoices,
    l3FacetChoices,
    fabFacetChoices,
    onToggleFacetValue,
    articlesForPickerList,
    steps,
    resolvedFocusId,
    expandedPickDetailIds,
    onTogglePickDetailRow,
    onSetFocusSku,
  } = props;

  return (
    <>
      <Card className="border-accent-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-sm uppercase tracking-tight">Срез и артикул</CardTitle>
              <CardDescription className="text-xs">
                Слева оси (OR), между осями AND. Справа — перечень пула; строка задаёт один SKU в
                фокусе.
              </CardDescription>
            </div>
            <StagesCollapsePinBar
              pinned={slicePinned}
              onPinnedChange={onSlicePinnedChange}
              open={sliceOpen}
              onOpenChange={onSliceOpenChange}
              collapseAriaLabel="Свернуть или развернуть блок «Срез и перечень»"
            />
            <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
              <StagesHelpHover
                align="end"
                wide
                title="Срез и артикул"
                trigger={
                  <StagesHelpIconTrigger
                    aria-label="Справка: срез коллекции и выбор артикула"
                    className="shrink-0"
                  />
                }
              >
                <StagesHelpWhyBlock title="Как это работает">
                  <p>
                    Слева — оси среза коллекции; справа — список артикулов пула. Клик по строке
                    задаёт{' '}
                    <strong className="text-text-primary">единственный артикул в фокусе</strong> (
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code>): схема, доска,
                    матрица и переходы считаются только в его контексте. Свод по всей коллекции без
                    выбора строки — отдельный сценарий (бэклог).
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="Зачем">
                  <p>
                    Меньше когнитивной нагрузки: всегда ясно, с каким стилем ведёте работу на этом
                    экране.
                  </p>
                </StagesHelpWhyBlock>
                <StagesHelpWhyBlock title="URL и ссылки">
                  <p>
                    <code className="bg-bg-surface2 rounded px-1">stagesSku</code> — id артикула в
                    URL. Чтобы снять привязку к узлу схемы, удалите из адреса{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesChainFocus</code>; при
                    необходимости уберите устаревшие{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesPick</code> /{' '}
                    <code className="bg-bg-surface2 rounded px-1">stagesWorkSku</code>.
                  </p>
                  <p className="mt-2">
                    Подробности по строке — по стрелке.{' '}
                    <strong className="text-text-primary">Ткань и площадка</strong> — в модулях:
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>
                      <Link
                        href={
                          focusArticle
                            ? mergeModuleHref(ROUTES.brand.materials, focusArticle.currentStageId)
                            : mergeCollectionQuery(ROUTES.brand.materials, collectionQuery)
                        }
                        className="text-accent-primary font-semibold hover:underline"
                      >
                        Материалы
                      </Link>
                      {focusArticle ? (
                        <span className="text-text-muted"> (с контекстом артикула в URL)</span>
                      ) : null}
                    </li>
                    <li>
                      <Link
                        href={
                          focusArticle
                            ? mergeModuleHref(floorHref('workshop'), focusArticle.currentStageId)
                            : mergeCollectionQuery(floorHref('workshop'), collectionQuery)
                        }
                        className="text-accent-primary font-semibold hover:underline"
                      >
                        Коллекция в цеху
                      </Link>
                    </li>
                  </ul>
                </StagesHelpWhyBlock>
              </StagesHelpHover>
            </div>
          </div>
        </CardHeader>

        {sliceExpanded ? (
          <CardContent className="space-y-3 pb-4 pt-0">
            <div
              className={cn(
                'border-border-default/90 bg-bg-surface2/90 flex min-h-0 flex-col gap-3 rounded-xl border p-2 sm:flex-row',
                SLICE_PANEL_HEIGHT_CLASS
              )}
            >
              <aside className="sm:border-border-default/80 flex max-h-[min(13rem,46vh)] min-h-0 w-full shrink-0 flex-col gap-2 overflow-y-auto sm:max-h-none sm:w-[12.5rem] sm:max-w-[13rem] sm:border-r sm:pr-2.5">
                <p className="text-text-muted text-[7px] font-bold uppercase tracking-wide">
                  Фильтры
                </p>
                <p className="text-text-secondary text-[9px] leading-snug">
                  Варианты в каждом блоке — из коллекции с учётом остальных выбранных осей.
                </p>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 text-[9px]"
                    onClick={onClearAllFacets}
                  >
                    Сбросить срез
                  </Button>
                  <Input
                    className="h-8 min-w-0 flex-1 basis-[8rem] text-xs sm:min-w-[6rem]"
                    placeholder="Поиск по артикулу…"
                    value={pickerQ}
                    onChange={(e) => onPickerQChange(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">Аудитория</span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {audienceFacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      audienceFacetChoices.map((o) => {
                        const fid = `facet-aud-${o.id}`;
                        return (
                          <label
                            key={o.id}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.audience.has(o.id)}
                              onCheckedChange={() => onToggleFacetValue('stagesAudience', o.id)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {o.name}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">Сезон</span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {seasonFacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      seasonFacetChoices.map((s) => {
                        const fid = `facet-sea-${encodeURIComponent(s)}`;
                        return (
                          <label
                            key={s}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.season.has(s)}
                              onCheckedChange={() => onToggleFacetValue('stagesSeason', s)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {s}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">L1</span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {l1FacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      l1FacetChoices.map((s) => {
                        const fid = `facet-l1-${encodeURIComponent(s)}`;
                        return (
                          <label
                            key={s}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.l1.has(s)}
                              onCheckedChange={() => onToggleFacetValue('stagesL1', s)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {s}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">L2</span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {l2FacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      l2FacetChoices.map((s) => {
                        const fid = `facet-l2-${encodeURIComponent(s)}`;
                        return (
                          <label
                            key={s}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.l2.has(s)}
                              onCheckedChange={() => onToggleFacetValue('stagesL2', s)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {s}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">L3</span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {l3FacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      l3FacetChoices.map((s) => {
                        const fid = `facet-l3-${encodeURIComponent(s)}`;
                        return (
                          <label
                            key={s}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.l3.has(s)}
                              onCheckedChange={() => onToggleFacetValue('stagesL3', s)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {s}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-text-muted text-[7px] font-bold uppercase">
                    Производство
                  </span>
                  <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                    {fabFacetChoices.length === 0 ? (
                      <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
                    ) : (
                      fabFacetChoices.map((o) => {
                        const fid = `facet-fab-${o.id}`;
                        return (
                          <label
                            key={o.id}
                            htmlFor={fid}
                            className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
                          >
                            <Checkbox
                              id={fid}
                              className="h-3.5 w-3.5 shrink-0"
                              checked={facetBundle.fab.has(o.id)}
                              onCheckedChange={() => onToggleFacetValue('stagesFab', o.id)}
                            />
                            <span className="text-text-primary truncate text-[10px] leading-tight">
                              {o.label}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </aside>

              <div className="border-border-default min-h-0 min-w-0 flex-1 overflow-y-auto rounded-lg border bg-white p-2">
                {articlesForPickerList.length === 0 ? (
                  <p className="text-text-muted col-span-full py-2 text-[10px]">
                    Нет артикулов в пуле.
                  </p>
                ) : (
                  articlesForPickerList.map((a) => {
                    const st = steps.find((s) => s.id === a.currentStageId);
                    const pathLine =
                      a.categoryPathLabel ??
                      `${a.audienceLabel ?? '—'} › ${a.categoryL1 ?? '—'} › ${a.categoryL2 ?? '—'} › ${a.categoryL3 ?? '—'}`;
                    const expanded = expandedPickDetailIds.has(a.id);
                    const active = resolvedFocusId === a.id;
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          'flex flex-col gap-0.5 rounded border px-1 py-1 text-[10px] transition-colors',
                          active
                            ? 'border-accent-primary/40 bg-accent-primary/10 shadow-sm'
                            : 'hover:bg-bg-surface2 hover:border-border-subtle border-transparent'
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <button
                            type="button"
                            className="text-text-primary min-w-0 flex-1 cursor-pointer truncate text-left font-medium"
                            onClick={() => onSetFocusSku(a.id)}
                          >
                            {stagesArticleDisplayLabel(a.sku, a.season)}
                          </button>
                          <button
                            type="button"
                            className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/15 shrink-0 rounded p-0.5 transition-colors"
                            aria-expanded={expanded}
                            aria-controls={`stages-pick-detail-${a.id}`}
                            title={expanded ? 'Скрыть подробности' : 'Категория, сезон, этап'}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onTogglePickDetailRow(a.id);
                            }}
                          >
                            <ChevronDown
                              className={cn(
                                'h-3.5 w-3.5 transition-transform duration-200',
                                expanded && 'rotate-180'
                              )}
                              aria-hidden
                            />
                          </button>
                        </div>
                        {expanded ? (
                          <div
                            id={`stages-pick-detail-${a.id}`}
                            className="text-text-secondary border-border-subtle/90 mt-0.5 space-y-1 border-t pl-1 pt-1 text-[8px] leading-snug"
                          >
                            <p className="text-text-secondary line-clamp-4">{pathLine}</p>
                            <p className="text-text-secondary">
                              <span className="text-text-secondary font-semibold">Сезон:</span>{' '}
                              {a.season ?? '—'}
                              <span className="text-text-muted"> · </span>
                              <span className="text-text-secondary font-semibold">Этап:</span>{' '}
                              {st?.title ?? a.currentStageId}
                            </p>
                            <p className="text-text-muted text-[7px] leading-snug">
                              Ткань и поставщики —{' '}
                              <Link
                                href={mergeModuleHref(
                                  ROUTES.brand.materials,
                                  a.currentStageId,
                                  a.id
                                )}
                                className="text-accent-primary font-medium hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Материалы
                              </Link>
                              . Площадка производства —{' '}
                              <Link
                                href={mergeModuleHref(
                                  floorHref('workshop'),
                                  a.currentStageId,
                                  a.id
                                )}
                                className="text-accent-primary font-medium hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Коллекция в цеху
                              </Link>
                              .
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </>
  );
}
