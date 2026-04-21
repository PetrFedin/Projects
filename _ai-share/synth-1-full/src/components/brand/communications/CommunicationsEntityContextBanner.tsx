'use client';

/**
 * Единый баннер контекста для сообщений и календаря (ядро №3): B2B-заказ + опционально коллекция/артикул/этап (ядро №1).
 */

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Factory, MessageSquare, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { operationalLayoutContract as o } from '@/lib/ui/operational-layout-contract';
import {
  brandB2bOrderHref,
  brandProductsMatrixB2bOrderContextHref,
  brandProductionOperationsB2bOrderContextHref,
  brandWorkshop2ArticleCardHref,
  shopB2bOrderHref,
  shopB2bMatrixOrderContextHref,
  shopB2bSelectionBuilderOrderContextHref,
  shopB2bWhiteboardOrderContextHref,
  brandProductionFloorHref,
} from '@/lib/routes';
import {
  brandCalendarTasksSynthaOverlayHref,
  brandMessagesSynthaOverlayHref,
  parseSynthaOverlayContext,
  shopCalendarTasksSynthaOverlayHref,
  shopMessagesSynthaOverlayHref,
} from '@/lib/communications/syntha-overlay-context';
import { buildStagesMatrixHrefForArticle } from '@/lib/production/stages-url';
import { CommunicationsArtifactPolicyStrip } from '@/components/brand/communications/CommunicationsArtifactPolicyStrip';
import { COLLECTION_DEV_HUB_TITLE_RU } from '@/lib/production/collection-development-labels';

export function CommunicationsEntityContextBanner({
  variant,
  className,
  showWorkspaceShortcuts = true,
  showArtifactPolicy = true,
}: {
  variant: 'brand' | 'shop';
  className?: string;
  showWorkspaceShortcuts?: boolean;
  /** Политика «чат не заменяет ТЗ/PO» под баннером. */
  showArtifactPolicy?: boolean;
}) {
  const searchParams = useSearchParams();
  const ctx = parseSynthaOverlayContext(searchParams);
  const orderId = ctx.orderId ?? '';
  const hasProduction =
    variant === 'brand' &&
    Boolean(ctx.collectionId?.trim() && ctx.articleId?.trim());

  if (!orderId && !hasProduction) {
    return showArtifactPolicy ? (
      <CommunicationsArtifactPolicyStrip className={cn('-mx-1 mt-2 rounded-lg', className)} />
    ) : null;
  }

  const orderHref = variant === 'brand' ? brandB2bOrderHref(orderId) : shopB2bOrderHref(orderId);
  const overlayPayload = {
    orderId: orderId || undefined,
    collectionId: ctx.collectionId,
    articleId: ctx.articleId,
    catalogStageId: ctx.catalogStageId,
    poRef: ctx.poRef,
    skuCode: ctx.skuCode,
  };
  const msgHref =
    variant === 'brand'
      ? brandMessagesSynthaOverlayHref(overlayPayload)
      : shopMessagesSynthaOverlayHref(overlayPayload);
  const calHref =
    variant === 'brand'
      ? brandCalendarTasksSynthaOverlayHref(overlayPayload)
      : shopCalendarTasksSynthaOverlayHref(overlayPayload);

  const matrixBrandHref = brandProductsMatrixB2bOrderContextHref(orderId);
  const prodOpsHref = brandProductionOperationsB2bOrderContextHref(orderId);
  const matrixShopHref = shopB2bMatrixOrderContextHref(orderId);
  const selectionHref = shopB2bSelectionBuilderOrderContextHref(orderId);
  const whiteboardHref = shopB2bWhiteboardOrderContextHref(orderId);

  const collectionId = ctx.collectionId?.trim() ?? '';
  const articleSeg = ctx.articleId?.trim() ?? '';
  const stagesStep = ctx.catalogStageId?.trim() ?? '';
  const matrixArticleHref =
    collectionId && articleSeg
      ? buildStagesMatrixHrefForArticle(collectionId, articleSeg, stagesStep || undefined)
      : null;
  const workshop2Href =
    collectionId && articleSeg ? brandWorkshop2ArticleCardHref(collectionId, articleSeg) : null;
  const floorStagesHref =
    collectionId && articleSeg
      ? brandProductionFloorHref('stages', { collectionId, stagesSku: articleSeg })
      : collectionId
        ? brandProductionFloorHref('stages', { collectionId })
        : null;

  return (
    <div className={cn('space-y-2', className)}>
      {orderId ? (
        <div
          className={cn(
            o.panel,
            'flex flex-col gap-2 border-border-default/80 px-3 py-2 shadow-sm',
            !hasProduction && 'rounded-lg'
          )}
          data-testid="b2b-order-url-context-banner"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <Package className="text-accent-primary size-4 shrink-0" aria-hidden />
              <div className="min-w-0">
                <div className="text-text-muted text-[9px] font-black uppercase tracking-[0.18em]">
                  Контекст B2B-заказа
                </div>
                <div className="text-text-primary truncate font-mono text-[11px] font-semibold">
                  {orderId}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={orderHref}
                className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
              >
                <Package className="size-3 opacity-70" aria-hidden />
                Карточка
              </Link>
              <Link
                href={msgHref}
                className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
              >
                <MessageSquare className="size-3 opacity-70" aria-hidden />
                Чат
              </Link>
              <Link
                href={calHref}
                className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
              >
                <Calendar className="size-3 opacity-70" aria-hidden />
                Задачи
              </Link>
            </div>
          </div>
          {showWorkspaceShortcuts ? (
            <div
              className="flex max-w-full flex-wrap gap-x-2 gap-y-0.5 border-t border-border-default/60 pt-2 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
              data-testid="b2b-order-url-context-workspace-shortcuts"
            >
              {variant === 'brand' ? (
                <>
                  <Link href={matrixBrandHref} className="hover:text-foreground underline-offset-2 hover:underline">
                    Матрица SKU
                  </Link>
                  <span className="text-border-default" aria-hidden>
                    ·
                  </span>
                  <Link href={prodOpsHref} className="hover:text-foreground underline-offset-2 hover:underline">
                    Операции цеха
                  </Link>
                </>
              ) : (
                <>
                  <Link href={matrixShopHref} className="hover:text-foreground underline-offset-2 hover:underline">
                    Матрица
                  </Link>
                  <span className="text-border-default" aria-hidden>
                    ·
                  </span>
                  <Link href={selectionHref} className="hover:text-foreground underline-offset-2 hover:underline">
                    Подборки
                  </Link>
                  <span className="text-border-default" aria-hidden>
                    ·
                  </span>
                  <Link href={whiteboardHref} className="hover:text-foreground underline-offset-2 hover:underline">
                    Доска
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {hasProduction ? (
        <div
          className={cn(o.panel, 'flex flex-col gap-2 border-border-default/80 px-3 py-2 shadow-sm')}
          data-testid="communications-production-context-banner"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <Factory className="text-accent-primary size-4 shrink-0" aria-hidden />
              <div className="min-w-0">
                <div className="text-text-muted text-[9px] font-black uppercase tracking-[0.18em]">
                  Ядро №1 · коллекция и артикул
                </div>
                <div className="text-text-primary truncate text-[11px] font-semibold">
                  <span className="font-mono">{collectionId}</span>
                  {' · '}
                  <span className="font-mono">{articleSeg}</span>
                  {stagesStep ? (
                    <>
                      {' '}
                      · этап <span className="font-mono">{stagesStep}</span>
                    </>
                  ) : null}
                  {ctx.poRef ? (
                    <>
                      {' '}
                      · PO <span className="font-mono">{ctx.poRef}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={brandMessagesSynthaOverlayHref({
                  collectionId: ctx.collectionId,
                  articleId: ctx.articleId,
                  catalogStageId: ctx.catalogStageId,
                  poRef: ctx.poRef,
                  skuCode: ctx.skuCode,
                })}
                className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
              >
                <MessageSquare className="size-3 opacity-70" aria-hidden />
                Чат
              </Link>
              <Link
                href={brandCalendarTasksSynthaOverlayHref({
                  collectionId: ctx.collectionId,
                  articleId: ctx.articleId,
                  catalogStageId: ctx.catalogStageId,
                  poRef: ctx.poRef,
                  skuCode: ctx.skuCode,
                })}
                className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
              >
                <Calendar className="size-3 opacity-70" aria-hidden />
                Задачи
              </Link>
              {matrixArticleHref ? (
                <Link
                  href={matrixArticleHref}
                  className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
                >
                  Матрица
                </Link>
              ) : null}
              {workshop2Href ? (
                <Link
                  href={workshop2Href}
                  className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
                >
                  {COLLECTION_DEV_HUB_TITLE_RU}
                </Link>
              ) : null}
              {floorStagesHref ? (
                <Link
                  href={floorStagesHref}
                  className="text-text-primary hover:bg-bg-surface2 border-border-subtle inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:text-accent-primary"
                >
                  Пол цеха
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {showArtifactPolicy ? (
        <CommunicationsArtifactPolicyStrip className="-mx-1 rounded-lg" />
      ) : null}
    </div>
  );
}
