'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StagesHelpHover } from '@/components/brand/production/stages-dependencies-tab-content-stages-help';
import { StagesLocalInventoryToolbar } from '@/components/brand/production/stages-dependencies-tab-local-inventory-toolbar';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import {
  PRODUCTION_FLOW_PROFILES,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import type {
  StagesLocalInventoryTools,
  StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { Crosshair, Info } from 'lucide-react';

const LOCAL_MODE_HELP_TEXT =
  'Срез, статусы этапов и черновики коллекции хранятся в браузере (localStorage / sessionStorage). Синхронизации с сервером пока нет: не очищайте данные сайта без нужды и периодически делайте экспорт JSON («Коллекция и данные») перед сменой устройства или браузера. Дальше тот же контракт подключится через ProductionDataPort / API.';

export type FocusSkuContourGuidance = {
  cur?: CollectionStep;
  next?: CollectionStep;
  blockedDeps: { id: string; title: string }[];
  atEnd: boolean;
  narrative: string;
  label: string;
};

export type Workshop2StagesDependenciesPreTabsChromeProps = {
  sliceEmptyBanner: null | { totalArticlesInCollection: number };
  onClearSliceFilters: () => void;
  profilePanelOpen: boolean;
  onProfilePanelOpen: () => void;
  onProfilePanelClose: () => void;
  productionProfileLabel: string;
  productionProfileHint: string;
  productionProfileId: ProductionFlowProfileId;
  onProductionProfileChange: (id: ProductionFlowProfileId) => void;
  mergedLocalInventoryTools: StagesLocalInventoryTools | null;
  localInventoryOpen: boolean;
  onToggleLocalInventoryOpen: () => void;
  focusArticle: StagesTabArticle | null;
  steps: CollectionStep[];
  focusSkuContourGuidance: FocusSkuContourGuidance | null;
  onJumpToMatrixRow: (stepId: string) => void;
};

export function Workshop2StagesDependenciesPreTabsChrome(
  props: Workshop2StagesDependenciesPreTabsChromeProps
) {
  const {
    sliceEmptyBanner,
    onClearSliceFilters,
    profilePanelOpen,
    onProfilePanelOpen,
    onProfilePanelClose,
    productionProfileLabel,
    productionProfileHint,
    productionProfileId,
    onProductionProfileChange,
    mergedLocalInventoryTools,
    localInventoryOpen,
    onToggleLocalInventoryOpen,
    focusArticle,
    steps,
    focusSkuContourGuidance,
    onJumpToMatrixRow,
  } = props;

  return (
    <>
      {sliceEmptyBanner ? (
        <div className="border-accent-primary/25 bg-accent-primary/10 text-text-primary flex flex-col gap-2 rounded-lg border px-3 py-2.5 text-[10px] sm:flex-row sm:items-center">
          <p className="flex-1 leading-snug">
            В коллекции есть <strong>{sliceEmptyBanner.totalArticlesInCollection}</strong> SKU, но{' '}
            <strong>срез и узел схемы</strong> их отфильтровали — доска и матрица пусты.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 shrink-0 text-[10px]"
            onClick={onClearSliceFilters}
          >
            Сбросить фильтры среза
          </Button>
        </div>
      ) : null}
      <div className="border-accent-primary/30 bg-accent-primary/10 rounded-lg border px-3 py-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {!profilePanelOpen ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-accent-primary/85 shrink-0 text-[9px] font-black uppercase tracking-wider">
                    Профиль контура
                  </span>
                  <span className="text-text-primary text-[10px] font-semibold leading-snug">
                    {productionProfileLabel}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 shrink-0 text-[10px] sm:self-center"
                  onClick={onProfilePanelOpen}
                >
                  Изменить профиль
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-accent-primary/85 text-[9px] font-black uppercase tracking-wider">
                      Профиль контура производства
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-text-secondary h-7 shrink-0 text-[10px]"
                      onClick={onProfilePanelClose}
                    >
                      Свернуть
                    </Button>
                  </div>
                  <p className="text-text-secondary text-[9px] leading-snug">
                    {productionProfileHint}
                  </p>
                  <p className="text-text-secondary text-[8px]">
                    Хранится в документе коллекции (
                    <code className="rounded bg-white/80 px-0.5">productionProfileId</code>) через{' '}
                    <strong className="text-text-primary">ProductionDataPort</strong> (сейчас
                    localStorage; с API — тот же контракт). Меняет{' '}
                    <strong className="text-text-primary">блокировки</strong> и подсветку этапов
                    «вне профиля», не названия модулей.
                  </p>
                </div>
                <Select value={productionProfileId} onValueChange={onProductionProfileChange}>
                  <SelectTrigger
                    className="h-8 w-full shrink-0 bg-white text-[10px] sm:w-[min(100%,22rem)]"
                    aria-label="Профиль контура производства"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTION_FLOW_PROFILES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-[11px]">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="border-accent-primary/30 flex shrink-0 flex-row items-center justify-end gap-2 border-t pt-2 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <StagesHelpHover
              title="Локальный режим без API"
              trigger={
                <button
                  type="button"
                  className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm"
                  aria-label="Справка: локальные данные в браузере"
                >
                  <Info className="h-4 w-4 shrink-0" aria-hidden />
                </button>
              }
            >
              <p className="text-text-primary max-w-sm text-[11px] leading-relaxed">
                {LOCAL_MODE_HELP_TEXT}
              </p>
            </StagesHelpHover>
            {mergedLocalInventoryTools ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-accent-primary/30 h-8 bg-white text-[10px]"
                onClick={onToggleLocalInventoryOpen}
              >
                {localInventoryOpen ? 'Скрыть коллекцию' : 'Коллекция и данные'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {localInventoryOpen && mergedLocalInventoryTools ? (
        <StagesLocalInventoryToolbar tools={mergedLocalInventoryTools} layout="plain" />
      ) : null}
      {focusArticle ? (
        <div
          className="space-y-2 rounded-xl border border-emerald-200/85 bg-gradient-to-r from-emerald-50/90 to-white px-3 py-2.5 text-[10px] text-emerald-950 shadow-sm"
          role="status"
        >
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
            <span className="font-black uppercase tracking-wider text-emerald-800/90">
              Контур SKU
            </span>
            <span className="text-text-muted"> · </span>
            <span className="text-text-primary font-semibold">
              {stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season)}
            </span>
            {(() => {
              const st = steps.find((s) => s.id === focusArticle.currentStageId);
              const idx = steps.findIndex((s) => s.id === focusArticle.currentStageId);
              if (!st) return null;
              return (
                <>
                  <span className="text-text-muted"> — </span>
                  {st.phase ? <span className="text-text-secondary">{st.phase} · </span> : null}
                  <strong className="text-emerald-950">{st.title}</strong>
                  {idx >= 0 ? (
                    <span className="ml-1 font-mono text-[9px] font-bold text-emerald-700/80">
                      {idx + 1}/{steps.length}
                    </span>
                  ) : null}
                </>
              );
            })()}
          </div>
          {focusSkuContourGuidance ? (
            <div className="space-y-2 border-t border-emerald-200/50 pt-2">
              <p className="text-text-primary text-[9px] leading-relaxed">
                {focusSkuContourGuidance.narrative}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {focusSkuContourGuidance.next && !focusSkuContourGuidance.atEnd ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 px-2 text-[9px]"
                    onClick={() => onJumpToMatrixRow(focusSkuContourGuidance.next!.id)}
                    title="Откроется вкладка «Процесс и правила» и прокрутка к строке этапа в матрице"
                  >
                    <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К следующему в матрице
                  </Button>
                ) : null}
                {focusSkuContourGuidance.blockedDeps.length > 0
                  ? focusSkuContourGuidance.blockedDeps.map((d) => (
                      <Button
                        key={d.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 max-w-[12rem] truncate px-2 text-[9px]"
                        onClick={() => onJumpToMatrixRow(d.id)}
                        title="Откроется вкладка «Процесс и правила» и прокрутка к этапу в матрице"
                      >
                        К «{d.title}»
                      </Button>
                    ))
                  : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
