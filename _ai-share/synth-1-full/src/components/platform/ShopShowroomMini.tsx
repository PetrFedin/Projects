'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import type { PlatformCoreDemoContext } from '@/lib/platform-core-hub-matrix';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { ROUTES } from '@/lib/routes';
import { useShopB2bPartnerships } from '@/hooks/use-shop-b2b-partnerships';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE } from '@/lib/b2b/workshop2-b2b-matrix-catalog';
import { resolveShopShowroomCoverHero } from '@/lib/b2b/shop-showroom-cover-hero';
import { ShopShowroomCoverHeroStrip } from '@/components/shop/b2b/ShopShowroomCoverHeroStrip';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShowroomArticleEligibleBadge } from '@/components/integrations/ShowroomArticleEligibleBadge';
import { ShopProductInventoryBadges } from '@/components/integrations/ShopProductInventoryBadges';
import { useMatrixIntegrationInventory } from '@/hooks/use-matrix-integration-inventory';
import { useWorkshop2PublishedArticleCount } from '@/hooks/use-workshop2-published-article-count';
import { PlatformCorePublishedCountSyncBadge } from '@/components/platform/PlatformCorePublishedCountSyncBadge';
import { ShopScCabinetGoldenPathStrip } from '@/components/platform/ShopScCabinetGoldenPathStrip';
import { ShopScCabinetB2bPeerStrip } from '@/components/platform/ShopScCabinetB2bPeerStrip';
import { ShopScCabinetFullShowroomHonestStrip } from '@/components/platform/ShopScCabinetFullShowroomHonestStrip';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { PillarInsightHeader } from '@/components/platform/PillarInsightPrimitives';
import { PlatformCorePillarInsightSkeleton } from '@/components/platform/PlatformCorePillarInsightSkeleton';

const B2b3dStreamPanel = dynamic(
  () => import('@/components/shop/b2b/B2b3dStreamPanel').then((m) => ({ default: m.B2b3dStreamPanel })),
  { ssr: false }
);

/** Магазин · sample_collection — hub-гаджет. */
export function ShopShowroomMini({
  demo,
  compact = false,
}: {
  demo: PlatformCoreDemoContext;
  compact?: boolean;
}) {
  const { collectionId, demoArticleId } = demo;
  const coreMode = isPlatformCoreMode();
  const { buyerId } = useShopCoreBuyerId();
  const [sampleBusy, setSampleBusy] = useState(false);
  const [sampleHint, setSampleHint] = useState<string | null>(null);
  const { partnerships, source: partnersSource, loadState: partnersLoadState } = useShopB2bPartnerships({
    enabled: true,
    collectionId,
  });
  const partner =
    partnerships.find((p) => p.status === 'connected') ?? partnerships[0] ?? null;
  const [publishedCount, setPublishedCount] = useState<number | null>(null);
  const { count: livePublishedCount, loading: liveCountLoading } =
    useWorkshop2PublishedArticleCount(collectionId);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const matrixSku = demoArticleId?.trim() || 'SS27-M-COAT-01';
  const inventorySkus = [matrixSku];
  const { bySku: nuorderBySku } = useMatrixIntegrationInventory('nuorder', inventorySkus);
  const { bySku: joorBySku } = useMatrixIntegrationInventory('joor', inventorySkus);
  const { bySku: zedonkBySku } = useMatrixIntegrationInventory('zedonk', inventorySkus);
  const { bySku: aimsBySku } = useMatrixIntegrationInventory('aims360', inventorySkus);
  const coverHero = resolveShopShowroomCoverHero({
    dossierHeroUrl: heroPreviewUrl,
    partnerCoverUrl: partner?.coverImage,
    partnerLogoUrl: partner?.logo,
    fallbackUrl: WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE,
  });
  const showroom3dHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=3d-stream`;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(collectionId)}/published-articles`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as {
          ok?: boolean;
          articles?: Array<{ heroImageUrl?: string }>;
        };
        if (!cancelled && json.ok && Array.isArray(json.articles)) {
          setPublishedCount(json.articles.length);
          const firstHero = json.articles.find((a) => a.heroImageUrl?.trim())?.heroImageUrl?.trim();
          setHeroPreviewUrl(firstHero ?? null);
        }
      } catch {
        if (!cancelled) {
          setPublishedCount(null);
          setHeroPreviewUrl(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  return (
    <div className={hubGadget.root} data-testid="shop-sc-cabinet-panel" data-audit-legacy="shop-showroom-mini">
      {!compact || coreMode ? (
        <>
          <ShopScCabinetGoldenPathStrip collectionId={collectionId} />
          {coreMode ? <ShopScCabinetB2bPeerStrip collectionId={collectionId} /> : null}
        </>
      ) : null}
      {compact ? <ShopScCabinetFullShowroomHonestStrip collectionId={collectionId} /> : null}
      <div className={hubGadget.card}>
        {coverHero ? (
          <ShopShowroomCoverHeroStrip
            hero={coverHero}
            testId="shop-sc-cabinet-hero"
          />
        ) : null}
        <div className={hubGadget.cardBody}>
          {compact && partnersLoadState === 'loading' ? (
            <PlatformCorePillarInsightSkeleton testId="shop-sc-cabinet-loading" />
          ) : null}
          {compact && partnersLoadState !== 'loading' ? (
            <PillarInsightHeader
              icon={ShoppingBag}
              title="Витрина коллекции"
              subtitle="Партнёр-бренд и опубликованные артикулы перед матрицей."
            />
          ) : null}
          {partner ? (
            <div className={hubGadget.statRow} data-testid="shop-sc-cabinet-partner" data-audit-legacy="shop-showroom-mini-partner">
              {partner.logo?.trim() ? (
                <Image
                  src={partner.logo}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-full border object-cover"
                  data-testid="shop-sc-cabinet-partner-logo"
                  data-audit-legacy="shop-showroom-mini-partner-logo"
                />
              ) : null}
              <span className={`${hubGadget.stat} min-w-0 truncate`}>{partner.name}</span>
              {partnersSource === 'pg' ? (
                <Badge variant="outline" className={hubGadget.metaBadge} data-testid="shop-sc-cabinet-partner-live" data-audit-legacy="shop-showroom-mini-partner-live">
                  PG
                </Badge>
              ) : partnersSource === 'fallback' || partnersLoadState === 'error' ? (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-[9px] text-amber-900"
                  data-testid="shop-sc-cabinet-partner-fallback"
                  data-audit-legacy="shop-showroom-mini-partner-fallback"
                >
                  {partnersLoadState === 'error' ? 'API · каталог' : 'Каталог'}
                </Badge>
              ) : null}
            </div>
          ) : null}
          {publishedCount != null ? (
            publishedCount === 0 ? (
              <p className={hubGadget.muted} data-testid="shop-sc-cabinet-empty" data-audit-legacy="shop-showroom-mini-empty">
                Витрина пуста.
              </p>
            ) : (
              <div className={hubGadget.statRow}>
                <span className={hubGadget.stat}>
                  <strong>{publishedCount}</strong> арт.
                </span>
                <PlatformCorePublishedCountSyncBadge
                  liveCount={livePublishedCount}
                  referenceCount={publishedCount}
                  loading={liveCountLoading}
                  testId="shop-sc-cabinet-published-sync"
                  compact
                />
              </div>
            )
          ) : (
            <p className={hubGadget.muted}>Загрузка…</p>
          )}
        </div>
      </div>
      <div
        className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-2"
        data-testid="shop-sc-catalog-signals"
      >
        <ShowroomArticleEligibleBadge collectionId={collectionId} articleId={demoArticleId} variant="shop" />
        <ShopProductInventoryBadges
          sku={matrixSku}
          variant="showroom"
          nuorderBySku={nuorderBySku}
          joorBySku={joorBySku}
          aimsBySku={aimsBySku}
          zedonkBySku={zedonkBySku}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px] font-semibold uppercase"
          disabled={sampleBusy || !demoArticleId?.trim()}
          data-testid="shop-sc-sample-request-cta"
          onClick={() => {
            setSampleBusy(true);
            setSampleHint(null);
            void fetch('/api/shop/b2b/sample-request', {
              method: 'POST',
              headers: {
                ...buildWorkshop2ApiRequestHeaders(),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                collectionId,
                articleId: demoArticleId,
                buyerId,
              }),
            })
              .then(async (res) => {
                const json = (await res.json()) as { ok?: boolean; messageRu?: string };
                setSampleHint(
                  json.messageRu ??
                    (json.ok ? 'Запрос образца отправлен бренду.' : 'Не удалось отправить запрос.')
                );
              })
              .catch(() => setSampleHint('Сеть недоступна — повторите позже.'))
              .finally(() => setSampleBusy(false));
          }}
        >
          {sampleBusy ? '…' : 'Запрос образца'}
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] font-semibold uppercase"
        >
          <Link href={showroom3dHref} data-testid="shop-sc-3d-stream-cta">
            3D showroom
          </Link>
        </Button>
        {sampleHint ? (
          <span className="text-text-muted text-[10px]" data-testid="shop-sc-sample-request-hint">
            {sampleHint}
          </span>
        ) : null}
      </div>
      {!compact ? (
        <div
          id="shop-sc-3d-showroom"
          className="border-t border-border-subtle pt-3"
          data-testid="shop-sc-cabinet-3d-panel"
        >
          <B2b3dStreamPanel collectionId={collectionId} articleId={demoArticleId} />
        </div>
      ) : null}
    </div>
  );
}
