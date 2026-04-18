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
        'border-border-default/90 from-bg-surface2/95 to-accent-primary/10 flex flex-col gap-2 rounded-xl border bg-gradient-to-r px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-1',
        className
      )}
      role="region"
      aria-label="Контекст производства"
    >
      <div className="text-text-primary flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
        <span className="text-text-muted shrink-0 font-black uppercase tracking-wider">
          Контекст
        </span>
        <span className="min-w-0">
          <span className="text-text-secondary">Коллекция:</span>{' '}
          <strong className="text-text-primary">{collectionLabel}</strong>
          {collectionId ? (
            <code className="text-text-secondary border-border-subtle ml-1 rounded border bg-white/80 px-1 py-0.5 text-[9px]">
              {collectionId}
            </code>
          ) : null}
        </span>
        {stagesSkuId ? (
          <span className="border-border-default min-w-0 border-l pl-3">
            <span className="text-text-secondary">SKU в URL:</span>{' '}
            <strong className="text-accent-primary font-mono">
              {stagesSkuLine ?? stagesSkuId}
            </strong>
          </span>
        ) : (
          <span className="text-text-muted border-border-default border-l pl-3">
            SKU в URL не задан
          </span>
        )}
        {stagesStepId ? (
          <span className="border-border-default min-w-0 max-w-[min(100%,14rem)] border-l pl-3 sm:max-w-xs">
            <span className="text-text-secondary">Этап (stagesStep):</span>{' '}
            <strong className="text-text-primary line-clamp-2">
              {stagesStepTitle ?? stagesStepId}
            </strong>
          </span>
        ) : null}
        {skuCatalogStageTitle ? (
          <span className="border-border-default min-w-0 max-w-[min(100%,18rem)] border-l pl-3 sm:max-w-sm">
            <span className="text-text-secondary">В каталоге коллекции:</span>{' '}
            {skuCatalogStagePhase ? (
              <span className="text-text-secondary">{skuCatalogStagePhase} · </span>
            ) : null}
            <strong className="line-clamp-2 text-emerald-900">{skuCatalogStageTitle}</strong>
            {skuCatalogPositionLabel ? (
              <span className="ml-1 font-mono text-[9px] font-bold text-emerald-700/85">
                ({skuCatalogPositionLabel})
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
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
        <span className="text-text-secondary text-[10px]">
          Вкладка: <strong className="text-text-primary">{currentTabTitle}</strong>
        </span>
        {!onStages ? (
          <Link
            href={stagesTabHref}
            className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 inline-flex items-center gap-1 rounded-lg border bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm transition-colors"
          >
            <ListTree className="h-3 w-3 shrink-0" aria-hidden />К этапам
          </Link>
        ) : (
          <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
            Вы на этапах
          </span>
        )}
      </div>
    </div>
  );
}
