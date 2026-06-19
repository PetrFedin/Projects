'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePillarSnapshot } from '@/hooks/use-pillar-snapshot';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { getPlatformCoreCollectionLabel } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';
import { ShopDevelopmentBridgeGreenfieldCrmStrip } from '@/components/platform/ShopDevelopmentBridgeGreenfieldCrmStrip';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { RolePillarCrossRoleLinks } from '@/components/platform/RolePillarCrossRoleLinks';
import { platformCoreW2PrefetchHandlers } from '@/lib/platform-core-w2-prefetch';
import { WORKSHOP2_COL_PARAM } from '@/lib/production/workshop2-url';
import { PlatformCoreStepProgressStrip } from '@/components/platform/PlatformCoreStepProgressStrip';
import { PLATFORM_CORE_PG_UNAVAILABLE_RU } from '@/lib/platform-core-user-messages';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';

export default function ShopDevelopmentBridge({
  demo,
  hideLead = true,
  embedCrossRole = false,
}: {
  demo: PlatformCoreDemoContext;
  hideLead?: boolean;
  embedCrossRole?: boolean;
}) {
  const { collectionId } = demo;
  const [previewOpen, setPreviewOpen] = useState(false);
  const devSnap = usePillarSnapshot({
    collectionId,
    pillarId: 'development',
    roleId: 'shop',
  });
  const sampleSnap = usePillarSnapshot({
    collectionId,
    pillarId: 'sample_collection',
    roleId: 'shop',
  });
  const devStatus =
    devSnap.snapshot?.pillarId === 'development' && 'development' in devSnap.snapshot
      ? devSnap.snapshot.development.status
      : null;
  const sampleStatus =
    sampleSnap.snapshot?.pillarId === 'sample_collection' &&
    'sampleCollection' in sampleSnap.snapshot
      ? sampleSnap.snapshot.sampleCollection.status
      : null;
  const loadState =
    devSnap.loading || sampleSnap.loading
      ? ('loading' as const)
      : devSnap.error && sampleSnap.error
        ? ('error' as const)
        : ('ready' as const);
  const devSteps = devStatus?.steps ?? [];
  const articleCount = devStatus?.articleCount ?? null;
  const readyForBuyers = sampleStatus?.readyForBuyers ?? null;

  const brandW2Href =
    devStatus?.workshop2Href ??
    `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${encodeURIComponent(collectionId)}`;
  const shopShowroomHref =
    sampleStatus?.shopShowroomHref ??
    `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const shopMonetization = buildShopShowroomBuySession({ collectionId });
  const colLabel = getPlatformCoreCollectionLabel(collectionId);

  return (
    <section data-testid="shop-development-bridge" className="min-w-0 space-y-2">
      <Card className={cn(hubGadget.pillarCard, 'border-sky-200/60')}>
        <CardContent className={cn(hubGadget.pillarBody, 'space-y-2 text-xs')}>
          {hideLead ? null : (
            <p className="font-semibold">Разработка ведёт бренд · {colLabel}</p>
          )}
          {loadState === 'loading' ? (
            <p className="text-text-muted">Загрузка…</p>
          ) : loadState === 'error' ? (
            <p className="text-text-muted">{PLATFORM_CORE_PG_UNAVAILABLE_RU}</p>
          ) : (
            <>
              {articleCount != null ? (
                <p className="text-text-secondary">
                  {articleCount} артикул(ов) в разработке
                  {readyForBuyers ? (
                    <Badge variant="secondary" className="ml-1.5 text-[10px]">
                      Коллекция для байеров
                    </Badge>
                  ) : null}
                </p>
              ) : null}
              {devSteps.length > 0 ? (
                <PlatformCoreStepProgressStrip
                  steps={devSteps}
                  testId="shop-development-bridge-steps"
                  variant="horizontal"
                />
              ) : null}
            </>
          )}
          <div className={cn(hubGadget.ctaRow, 'min-w-0')}>
            <Button
              type="button"
              variant="link"
              className={cn(hubGadget.ctaLink, 'min-h-11 justify-start md:min-h-0')}
              data-testid="shop-development-bridge-brand-w2-preview"
              onClick={() => setPreviewOpen(true)}
            >
              Превью техпака →
            </Button>
            <Link
              href={brandW2Href}
              data-testid="shop-development-bridge-brand-w2"
              className={cn(hubGadget.ctaLink, 'min-h-11 items-center md:min-h-0')}
              {...platformCoreW2PrefetchHandlers}
            >
              Техпак бренда →
            </Link>
            <Link
              href={shopShowroomHref}
              data-testid="shop-development-bridge-showroom"
              className={cn(hubGadget.ctaLink, 'min-h-11 items-center md:min-h-0')}
              {...platformCoreW2PrefetchHandlers}
            >
              Витрина · {colLabel} →
            </Link>
            {readyForBuyers ? (
              <>
                <Link
                  href={shopMonetization.matrixHref}
                  data-testid="shop-development-bridge-matrix"
                  className={cn(hubGadget.ctaLink, 'min-h-11 items-center md:min-h-0')}
                >
                  Матрица →
                </Link>
                <Link
                  href={shopMonetization.checkoutHref}
                  data-testid="shop-development-bridge-checkout"
                  className={cn(hubGadget.ctaLink, 'min-h-11 items-center md:min-h-0')}
                >
                  Checkout →
                </Link>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className="max-w-md"
          data-testid="shop-development-bridge-dossier-preview-dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-sm">Техпак бренда · {colLabel}</DialogTitle>
            <DialogDescription className="text-xs">
              Read-only превью прогресса разработки. Редактирование ТЗ доступно только бренду.
            </DialogDescription>
          </DialogHeader>
          {loadState === 'loading' ? (
            <p className="text-text-muted text-xs">Загрузка…</p>
          ) : loadState === 'error' ? (
            <p className="text-text-muted text-xs">{PLATFORM_CORE_PG_UNAVAILABLE_RU}</p>
          ) : (
            <div className="space-y-2">
              {articleCount != null ? (
                <p className="text-text-secondary text-xs">
                  {articleCount} артикул(ов) ·{' '}
                  {readyForBuyers ? 'опубликовано для байеров' : 'ещё не для витрины'}
                </p>
              ) : null}
              {devSteps.length > 0 ? (
                <PlatformCoreStepProgressStrip
                  steps={devSteps}
                  testId="shop-development-bridge-preview-steps"
                  variant="vertical"
                />
              ) : (
                <p className="text-text-muted text-xs">Нет шагов development-status для коллекции.</p>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-wrap gap-2 sm:justify-start">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={brandW2Href} {...platformCoreW2PrefetchHandlers}>
                Открыть W2 бренда
              </Link>
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={shopMonetization.checkoutHref}>Checkout</Link>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ShopDevelopmentBridgeGreenfieldCrmStrip collectionId={collectionId} />

      {embedCrossRole ? null : (
        <RolePillarCrossRoleLinks roleId="shop" pillarId="development" variant="compact" />
      )}
    </section>
  );
}
