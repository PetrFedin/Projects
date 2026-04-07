'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Copy, ListTree } from 'lucide-react';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
  collectionLabel: string;
  /** Пусто = режим «по умолчанию» */
  collectionId: string;
  stagesSkuId: string;
  stagesSkuLine?: string;
  /** Этап из stagesStep (контур коллекции) */
  stagesStepId?: string;
  stagesStepTitle?: string;
  /** Текущий этап артикула в каталоге COLLECTION_STEPS (по currentStageId), если SKU в URL найден в коллекции */
  skuCatalogStageTitle?: string;
  skuCatalogStagePhase?: string;
  /** Напр. «12/22» */
  skuCatalogPositionLabel?: string;
  /** Путь с query (напр. `/brand/production?…`) или уже абсолютный URL — в буфер уходит абсолютный адрес */
  fullPageUrl: string;
  stagesTabHref: string;
  currentTab: ProductionFloorTabId;
  currentTabTitle: string;
  className?: string;
};

export function ProductionFloorContextBar({
  collectionLabel,
  collectionId,
  stagesSkuId,
  stagesSkuLine,
  stagesStepId,
  stagesStepTitle,
  skuCatalogStageTitle,
  skuCatalogStagePhase,
  skuCatalogPositionLabel,
  fullPageUrl,
  stagesTabHref,
  currentTab,
  currentTabTitle,
  className,
}: Props) {
  const onStages = currentTab === 'stages';
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback(() => {
    if (!fullPageUrl) return;
    const toCopy =
      fullPageUrl.startsWith('http://') || fullPageUrl.startsWith('https://')
        ? fullPageUrl
        : `${typeof window !== 'undefined' ? window.location.origin : ''}${fullPageUrl.startsWith('/') ? fullPageUrl : `/${fullPageUrl}`}`;
    if (!toCopy) return;
    void navigator.clipboard?.writeText(toCopy).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }, [fullPageUrl]);

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50/95 to-indigo-50/30 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1',
        className
      )}
      role="region"
      aria-label="Контекст производства"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-700 min-w-0">
        <span className="shrink-0 font-black uppercase tracking-wider text-slate-400">Контекст</span>
        <span className="min-w-0">
          <span className="text-slate-500">Коллекция:</span>{' '}
          <strong className="text-slate-900">{collectionLabel}</strong>
          {collectionId ? (
            <code className="ml-1 rounded bg-white/80 px-1 py-0.5 text-[9px] text-slate-600 border border-slate-100">
              {collectionId}
            </code>
          ) : null}
        </span>
        {stagesSkuId ? (
          <span className="min-w-0 border-l border-slate-200 pl-3">
            <span className="text-slate-500">SKU в URL:</span>{' '}
            <strong className="font-mono text-indigo-900">{stagesSkuLine ?? stagesSkuId}</strong>
          </span>
        ) : (
          <span className="text-slate-400 border-l border-slate-200 pl-3">SKU в URL не задан</span>
        )}
        {stagesStepId ? (
          <span className="min-w-0 border-l border-slate-200 pl-3 max-w-[min(100%,14rem)] sm:max-w-xs">
            <span className="text-slate-500">Этап (stagesStep):</span>{' '}
            <strong className="text-slate-900 line-clamp-2">{stagesStepTitle ?? stagesStepId}</strong>
          </span>
        ) : null}
        {skuCatalogStageTitle ? (
          <span className="min-w-0 border-l border-slate-200 pl-3 max-w-[min(100%,18rem)] sm:max-w-sm">
            <span className="text-slate-500">В каталоге коллекции:</span>{' '}
            {skuCatalogStagePhase ? (
              <span className="text-slate-600">{skuCatalogStagePhase} · </span>
            ) : null}
            <strong className="text-emerald-900 line-clamp-2">{skuCatalogStageTitle}</strong>
            {skuCatalogPositionLabel ? (
              <span className="ml-1 font-mono text-[9px] font-bold text-emerald-700/85">({skuCatalogPositionLabel})</span>
            ) : null}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 px-2 text-[9px] font-bold uppercase tracking-wide"
          onClick={copyUrl}
          disabled={!fullPageUrl}
          title="Скопировать полный URL с query (демо, шаринг)"
        >
          <Copy className="h-3 w-3 shrink-0" aria-hidden />
          {copied ? 'Скопировано' : 'Ссылка'}
        </Button>
        <span className="text-[10px] text-slate-500">
          Вкладка: <strong className="text-slate-800">{currentTabTitle}</strong>
        </span>
        {!onStages ? (
          <Link
            href={stagesTabHref}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <ListTree className="h-3 w-3 shrink-0" aria-hidden />
            К этапам
          </Link>
        ) : (
          <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-700">Вы на этапах</span>
        )}
      </div>
    </div>
  );
}
