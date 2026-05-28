'use client';

/**
 * Показывает контекст B2B-заказа при переходе с `?order=` / `?orderId=` — связка ядер: заказ ↔ рабочее место.
 */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, MessageSquare, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { operationalLayoutContract as o } from '@/lib/ui/operational-layout-contract';
import {
  brandB2bOrderHref,
  brandProductsMatrixB2bOrderContextHref,
  brandProductionOperationsB2bOrderContextHref,
  shopB2bOrderHref,
  shopB2bMatrixOrderContextHref,
  shopB2bSelectionBuilderOrderContextHref,
  shopB2bWhiteboardOrderContextHref,
} from '@/lib/routes';
import {
  brandCalendarTasksSynthaOverlayHref,
  brandMessagesSynthaOverlayHref,
  parseSynthaOverlayContext,
  shopCalendarTasksSynthaOverlayHref,
  shopMessagesSynthaOverlayHref,
} from '@/lib/communications/syntha-overlay-context';

export function B2bOrderUrlContextBanner({
  variant,
  className,
  showWorkspaceShortcuts = true,
}: {
  variant: 'brand' | 'shop';
  className?: string;
  /** Матрица · подборки · доска (shop) или матрица · операции цеха (brand). */
  showWorkspaceShortcuts?: boolean;
}) {
  const searchParams = useSearchParams();
  const overlayCtx = parseSynthaOverlayContext(searchParams);
  const orderId = overlayCtx.orderId?.trim() ?? '';

  if (!orderId) return null;

  const orderHref = variant === 'brand' ? brandB2bOrderHref(orderId) : shopB2bOrderHref(orderId);
  const overlayPayload = {
    orderId,
    collectionId: overlayCtx.collectionId,
    articleId: overlayCtx.articleId,
    catalogStageId: overlayCtx.catalogStageId,
    poRef: overlayCtx.poRef,
    skuCode: overlayCtx.skuCode,
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

  return (
    <div
      className={cn(
        o.panel,
        'border-border-default/80 flex flex-col gap-2 px-3 py-2 shadow-sm',
        className
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
            className="text-text-primary hover:bg-bg-surface2 border-border-subtle hover:text-accent-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors"
          >
            <Package className="size-3 opacity-70" aria-hidden />
            Карточка
          </Link>
          <Link
            href={msgHref}
            className="text-text-primary hover:bg-bg-surface2 border-border-subtle hover:text-accent-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors"
          >
            <MessageSquare className="size-3 opacity-70" aria-hidden />
            Чат
          </Link>
          <Link
            href={calHref}
            className="text-text-primary hover:bg-bg-surface2 border-border-subtle hover:text-accent-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-semibold transition-colors"
          >
            <Calendar className="size-3 opacity-70" aria-hidden />
            Задачи
          </Link>
        </div>
      </div>
      {showWorkspaceShortcuts ? (
        <div
          className="border-border-default/60 flex max-w-full flex-wrap gap-x-2 gap-y-0.5 border-t pt-2 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
          data-testid="b2b-order-url-context-workspace-shortcuts"
        >
          {variant === 'brand' ? (
            <>
              <Link
                href={matrixBrandHref}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                Матрица SKU
              </Link>
              <span className="text-border-default" aria-hidden>
                ·
              </span>
              <Link
                href={prodOpsHref}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                Операции цеха
              </Link>
            </>
          ) : (
            <>
              <Link
                href={matrixShopHref}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                Матрица
              </Link>
              <span className="text-border-default" aria-hidden>
                ·
              </span>
              <Link
                href={selectionHref}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                Подборки
              </Link>
              <span className="text-border-default" aria-hidden>
                ·
              </span>
              <Link
                href={whiteboardHref}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                Доска
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
