'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, FileText } from 'lucide-react';
import {
  ROUTES,
  brandMessagesWorkshop2ArticleContextHref,
  shopB2bCheckoutCollectionHref,
  shopB2bOrdersCollectionRegistryHref,
  shopMessagesWorkshop2ArticleContextHref,
} from '@/lib/routes';
import {
  getPlatformCoreCollectionLabel,
  PLATFORM_CORE_COLLECTION_PRESETS,
} from '@/lib/platform-core-hub-matrix';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE } from '@/lib/b2b/workshop2-b2b-matrix-catalog';
import { ShowroomArticleEligibleBadge } from '@/components/integrations/ShowroomArticleEligibleBadge';
import { ShowroomArticlePxmMediaBadge } from '@/components/integrations/ShowroomArticlePxmMediaBadge';
import { ShopArticleInventoryBadges } from '@/components/integrations/ShopArticleInventoryBadges';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { useB2BState } from '@/providers/b2b-state';
import type { CartItem } from '@/lib/types';
import { upsertWorkshop2CartLine } from '@/lib/b2b/workshop2-cart-bridge';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { PlatformCorePublishedCountSyncBadge } from '@/components/platform/PlatformCorePublishedCountSyncBadge';
import { ShopScCabinetGoldenPathStrip } from '@/components/platform/ShopScCabinetGoldenPathStrip';
import { ShopShowroomCoverHeroStrip } from '@/components/shop/b2b/ShopShowroomCoverHeroStrip';
import { ShopShowroomInlineQtyControl } from '@/components/shop/b2b/ShopShowroomInlineQtyControl';
import { resolveShopShowroomCoverHero } from '@/lib/b2b/shop-showroom-cover-hero';
import { BrandScCabinetGoldenPathStrip } from '@/components/brand/sample/BrandScCabinetGoldenPathStrip';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';
import { useWorkshop2PublishedArticleCount } from '@/hooks/use-workshop2-published-article-count';

function cartUnitsForArticle(cart: CartItem[], articleId: string): number {
  return cart
    .filter((item) => {
      const ext = item as CartItem & { articleId?: string };
      const id = item.id?.trim() ?? '';
      return id === articleId || ext.articleId?.trim() === articleId;
    })
    .reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

function shopShowroomMatrixHref(collectionId: string, articleId: string): string {
  return `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`;
}

export type PublishedShowroomArticle = {
  collectionId: string;
  articleId: string;
  name: string;
  wholesalePriceRub: number;
  moq?: number;
  heroImageUrl?: string;
  sku?: string;
  pxmSource?: boolean;
  pxmAssetCount?: number;
};

type Props = {
  variant: 'brand' | 'shop';
  collectionId: string;
};

export function PlatformCorePublishedShowroom({ variant, collectionId }: Props) {
  const slimChrome = isPlatformCoreMode();
  const router = useRouter();
  const { buyerId } = useShopCoreBuyerId();
  const { b2bCart, setB2bCart } = useB2BState();
  const [publishedArticles, setPublishedArticles] = useState<PublishedShowroomArticle[]>([]);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const { count: livePublishedCount, loading: liveCountLoading } =
    useWorkshop2PublishedArticleCount(collectionId);
  const cartQtyByArticle = useMemo(() => {
    if (variant !== 'shop') return new Map<string, number>();
    return new Map(
      publishedArticles.map((article) => [
        article.articleId,
        cartUnitsForArticle(b2bCart, article.articleId),
      ])
    );
  }, [b2bCart, publishedArticles, variant]);

  const setShopCartQty = useCallback(
    (article: PublishedShowroomArticle, qty: number) => {
      setB2bCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.id === article.articleId && item.selectedSize === 'M'
        );
        const cartItem: CartItem = {
          id: article.articleId,
          slug: article.articleId,
          name: article.name,
          brand: article.collectionId,
          price: article.wholesalePriceRub,
          description: article.name,
          category: 'apparel',
          sustainability: [],
          sku: article.articleId,
          color: '',
          season: article.collectionId,
          quantity: qty,
          selectedSize: 'M',
          images: article.heroImageUrl
            ? [
                {
                  id: `${article.articleId}-hero`,
                  url: article.heroImageUrl,
                  alt: article.name,
                  hint: '',
                },
              ]
            : [],
        };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: qty };
          return next;
        }
        return [...prev, cartItem];
      });
    },
    [setB2bCart]
  );

  const shopCollectionCoverHero = useMemo(() => {
    if (variant !== 'shop') return null;
    const dossierHero = publishedArticles.find((a) => a.heroImageUrl?.trim())?.heroImageUrl;
    return resolveShopShowroomCoverHero({ dossierHeroUrl: dossierHero });
  }, [publishedArticles, variant]);

  const load = useCallback(() => {
    let cancelled = false;
    setLoadState('loading');
    void (async () => {
      try {
        const res = await fetch(
          `/api/workshop2/collections/${encodeURIComponent(collectionId)}/published-articles`,
          { headers: buildWorkshop2ApiRequestHeaders(), cache: 'no-store' }
        );
        const json = (await res.json()) as {
          ok?: boolean;
          articles?: PublishedShowroomArticle[];
        };
        if (cancelled) return;
        if (json.ok && Array.isArray(json.articles)) {
          setPublishedArticles(json.articles);
          setLoadState('ready');
        } else {
          setPublishedArticles([]);
          setLoadState('error');
        }
      } catch {
        if (!cancelled) {
          setPublishedArticles([]);
          setLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  useEffect(() => {
    return load();
  }, [load]);

  const collectionHref = (id: string) =>
    variant === 'shop'
      ? `${ROUTES.shop.b2bShowroom}?collection=${id}`
      : `${ROUTES.brand.showroom}?collection=${id}`;

  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}`;
  const linesheetHref = `/brand/linesheets?collection=${encodeURIComponent(collectionId)}`;
  const brandShowroomHref = `${ROUTES.brand.showroom}?collection=${encodeURIComponent(collectionId)}`;
  const shopShowroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const sectionPrefix = variant === 'shop' ? 'shop-sc-showroom' : 'brand-sc-showroom';
  const panelTestId = `${sectionPrefix}-panel`;
  const missingCollection = !collectionId?.trim();

  return (
    <div
      className="space-y-4"
      data-testid={panelTestId}
      data-audit-legacy={`${variant}-showroom-core`}
    >
      {variant === 'shop' && missingCollection ? (
        <Card className="border-border-subtle bg-bg-surface2/80" data-testid="shop-sc-showroom-no-collection-banner">
          <CardContent className="py-3 text-[11px] text-text-secondary">
            Нужен параметр <code className="text-[10px]">collection</code>.
            <Link href={`${ROUTES.shop.b2bShowroom}?collection=SS27`} className="text-accent-primary ml-2 font-medium hover:underline">
              SS27
            </Link>
          </CardContent>
        </Card>
      ) : null}
      {variant === 'shop' && loadState !== 'loading' ? (
        <div
          className={cn(hubGadget.goldenPath, 'items-center')}
          data-testid="shop-sc-showroom-context-strip"
        >
          <Badge variant="outline" className={hubGadget.chip} data-testid="shop-sc-showroom-mode-label">
            Витрина
          </Badge>
          <ShopScCabinetGoldenPathStrip collectionId={collectionId} omitStep="showroom" />
          {slimChrome
            ? PLATFORM_CORE_COLLECTION_PRESETS.filter((p) => p.available).map((preset) => (
                <Link
                  key={preset.id}
                  href={collectionHref(preset.id)}
                  className={
                    collectionId === preset.id
                      ? 'text-accent-primary text-[10px] font-semibold'
                      : 'text-text-muted text-[10px] font-medium hover:underline'
                  }
                  data-testid={`shop-sc-showroom-season-${preset.id}`}
                >
                  {preset.label}
                </Link>
              ))
            : null}
          <PlatformCorePublishedCountSyncBadge
            liveCount={livePublishedCount}
            referenceCount={publishedArticles.length}
            loading={liveCountLoading}
            testId="shop-sc-showroom-published-sync"
          />
        </div>
      ) : null}
      {variant === 'shop' && slimChrome && shopCollectionCoverHero ? (
        <ShopShowroomCoverHeroStrip
          hero={shopCollectionCoverHero}
          testId="shop-sc-showroom-cover-hero"
          heightClass="h-14 md:h-20"
        />
      ) : null}
      {variant === 'brand' && loadState !== 'loading' ? (
        <div
          className={cn(hubGadget.goldenPath, 'items-center')}
          data-testid="brand-sc-unified-audit-path"
          data-audit-legacy="brand-sc-showroom-context-strip"
        >
          <Badge variant="outline" className={hubGadget.chip} data-testid="brand-sc-showroom-mode-label">
            Витрина
          </Badge>
          <BrandScCabinetGoldenPathStrip collectionId={collectionId} omitStep="showroom" />
          {slimChrome
            ? PLATFORM_CORE_COLLECTION_PRESETS.filter((p) => p.available).map((preset) => (
                <Link
                  key={preset.id}
                  href={collectionHref(preset.id)}
                  className={
                    collectionId === preset.id
                      ? 'text-accent-primary text-[10px] font-semibold'
                      : 'text-text-muted text-[10px] font-medium hover:underline'
                  }
                  data-testid={`brand-sc-showroom-season-${preset.id}`}
                >
                  {preset.label}
                </Link>
              ))
            : null}
          <PlatformCorePublishedCountSyncBadge
            liveCount={livePublishedCount}
            referenceCount={publishedArticles.length}
            loading={liveCountLoading}
            testId="brand-sc-showroom-published-sync"
            compact
          />
        </div>
      ) : null}
      {!slimChrome ? (
      <Card
        className="mb-2"
        data-testid={`${sectionPrefix}-collection-chip`}
        data-audit-legacy={`${variant}-showroom-core-collection`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {getPlatformCoreCollectionLabel(collectionId)}
          </CardTitle>
          <CardDescription className="text-text-muted text-[11px]">
            Опубликованные артикулы коллекции.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {PLATFORM_CORE_COLLECTION_PRESETS.filter((p) => p.available).map((preset) => (
            <Button
              key={preset.id}
              variant={collectionId === preset.id ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg text-[10px] font-semibold"
              asChild
            >
              <Link href={collectionHref(preset.id)}>{preset.label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
      ) : null}

      {loadState === 'loading' ? (
        <p
          className="text-text-secondary text-center text-sm"
          data-testid={`${sectionPrefix}-loading`}
        >
          Загрузка витрины…
        </p>
      ) : null}
      {loadState === 'error' ? (
        <Card
          className="p-8 text-center"
          data-testid={`${sectionPrefix}-error`}
          data-audit-legacy={`${variant}-showroom-core-error`}
        >
          <p className="text-text-secondary text-sm">
            Витрина коллекции пока пуста или ещё не опубликована брендом.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-4"
            data-testid={`${sectionPrefix}-retry`}
            onClick={() => {
              load();
            }}
          >
            Повторить
          </Button>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {publishedArticles.map((article) => (
          <Card
            key={`${article.collectionId}:${article.articleId}`}
            data-testid={`${sectionPrefix}-article-${article.articleId}`}
            data-audit-legacy={`${variant}-showroom-article-${article.articleId}`}
            className="border-border-subtle overflow-hidden"
          >
            <div className="bg-bg-surface2 relative aspect-[4/3] w-full">
              <Image
                src={article.heroImageUrl?.trim() || WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE}
                alt={article.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-testid={`${sectionPrefix}-hero-${article.articleId}`}
                data-audit-legacy={`${variant}-showroom-hero-${article.articleId}`}
                unoptimized={Boolean(article.heroImageUrl?.startsWith('data:'))}
              />
            </div>
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[9px] font-semibold">
                  {article.articleId}
                </Badge>
                <ShowroomArticleEligibleBadge
                  collectionId={article.collectionId}
                  articleId={article.articleId}
                  variant={variant}
                />
                <ShowroomArticlePxmMediaBadge
                  pxmSource={article.pxmSource}
                  pxmAssetCount={article.pxmAssetCount}
                />
                {variant === 'shop' && article.sku ? (
                  <ShopArticleInventoryBadges sku={article.sku} />
                ) : null}
              </div>
              <CardTitle className="text-base font-semibold tracking-tight">
                {article.name}
              </CardTitle>
              <CardDescription>
                Опт {article.wholesalePriceRub.toLocaleString('ru-RU')} ₽
                {article.moq ? (
                  <span
                    data-testid={`shop-sc-showroom-moq-${article.articleId}`}
                    data-audit-legacy={`shop-showroom-moq-${article.articleId}`}
                  >
                    {` · мин. заказ ${article.moq} шт.`}
                  </span>
                ) : null}
                {variant === 'shop' && (cartQtyByArticle.get(article.articleId) ?? 0) > 0 ? (
                  <span
                    className="text-accent-primary font-semibold"
                    data-testid={`shop-sc-showroom-cart-qty-${article.articleId}`}
                    data-audit-legacy={`shop-showroom-cart-qty-${article.articleId}`}
                  >
                    {` · в корзине ${cartQtyByArticle.get(article.articleId)} ед.`}
                  </span>
                ) : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4 pt-0">
              {variant === 'shop' ? (
                <ShopShowroomInlineQtyControl
                  article={article}
                  buyerId={buyerId}
                  cartQty={cartQtyByArticle.get(article.articleId) ?? 0}
                  matrixHref={shopShowroomMatrixHref(article.collectionId, article.articleId)}
                  onCartQtyChange={(qty) => setShopCartQty(article, qty)}
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
              {variant === 'shop' ? (
                <>
                  <Button size="sm" className="min-h-11 rounded-lg text-[10px] font-black" asChild>
                    <Link
                      href={shopShowroomMatrixHref(article.collectionId, article.articleId)}
                      data-testid={`shop-sc-matrix-entry-link-${article.articleId}`}
                      data-audit-legacy={`shop-sc-showroom-matrix-link-${article.articleId} shop-showroom-matrix-link-${article.articleId}`}
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Матрица заказа
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-lg text-[10px] font-black"
                    data-testid={`shop-sc-showroom-matrix-quick-add-${article.articleId}`}
                    data-audit-legacy={`shop-showroom-matrix-quick-add-${article.articleId}`}
                    onClick={() => {
                      const qty = Math.max(1, article.moq ?? 1);
                      const matrixHref = shopShowroomMatrixHref(
                        article.collectionId,
                        article.articleId
                      );
                      const cartItem = {
                        id: article.articleId,
                        slug: article.articleId,
                        name: article.name,
                        brand: article.collectionId,
                        price: article.wholesalePriceRub,
                        description: article.name,
                        category: 'apparel',
                        sustainability: [],
                        sku: article.articleId,
                        color: '',
                        season: article.collectionId,
                        quantity: qty,
                        selectedSize: 'M',
                        images: article.heroImageUrl
                          ? [
                              {
                                id: `${article.articleId}-hero`,
                                url: article.heroImageUrl,
                                alt: article.name,
                                hint: '',
                              },
                            ]
                          : [],
                      } satisfies CartItem;
                      setB2bCart((prev) => {
                        const idx = prev.findIndex(
                          (item) =>
                            item.id === article.articleId && item.selectedSize === 'M'
                        );
                        if (idx >= 0) {
                          const next = [...prev];
                          next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
                          return next;
                        }
                        return [...prev, cartItem];
                      });
                      void upsertWorkshop2CartLine({
                        item: cartItem,
                        collectionId: article.collectionId,
                        buyerId,
                      }).finally(() => {
                        router.push(matrixHref);
                      });
                    }}
                  >
                    + в матрицу
                  </Button>
                  <Button size="sm" variant="outline" className="min-h-11 rounded-lg text-[10px] font-black" asChild>
                    <Link
                      href={shopB2bOrdersCollectionRegistryHref()}
                      data-testid={`shop-sc-showroom-orders-link-${article.articleId}`}
                    >
                      Оптовые заказы
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="min-h-11 rounded-lg text-[10px] font-black" asChild>
                    <Link
                      href={shopMessagesWorkshop2ArticleContextHref(
                        article.collectionId,
                        article.articleId
                      )}
                      data-testid={`shop-sc-showroom-article-chat-link-${article.articleId}`}
                      data-audit-legacy={`shop-showroom-article-chat-link-${article.articleId}`}
                    >
                      Вопрос по артикулу
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" className="min-h-11 rounded-lg text-[10px] font-black" asChild>
                    <Link href={`/brand/linesheets?collection=${article.collectionId}`}>
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> Лайншит
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link
                      href={`${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(article.collectionId)}`}
                      data-testid={`brand-sc-showroom-matrix-link-${article.articleId}`}
                      data-audit-legacy={`brand-showroom-matrix-link-${article.articleId}`}
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Матрица магазина
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[10px] font-black"
                    asChild
                  >
                    <Link
                      href={brandMessagesWorkshop2ArticleContextHref(
                        article.collectionId,
                        article.articleId
                      )}
                      data-testid={`brand-sc-showroom-article-chat-link-${article.articleId}`}
                      data-audit-legacy={`brand-showroom-article-chat-link-${article.articleId}`}
                    >
                      Чат артикула
                    </Link>
                  </Button>
                </>
              )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loadState === 'ready' && publishedArticles.length === 0 ? (
        <Card
          className="p-8 text-center"
          data-testid={`${sectionPrefix}-empty-state`}
          data-audit-legacy={`${variant}-showroom-empty-state`}
        >
          {variant === 'shop' ? (
            <div
              className="mx-auto max-w-md space-y-3 text-left"
              data-testid="shop-sc-showroom-empty-onboarding"
            >
              <p className="text-text-primary text-sm font-medium">
                Коллекция {getPlatformCoreCollectionLabel(collectionId)} пока не открыта
              </p>
              <p className="text-text-secondary text-xs leading-relaxed">
                Артикулы появятся после публикации брендом. Пока можно подключить партнёра или
                перейти в матрицу другой коллекции — без ручного seed.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <Button asChild size="sm" className="h-8 text-[10px] font-bold uppercase">
                  <Link
                    href={ROUTES.shop.b2bPartnersDiscover}
                    data-testid="shop-sc-showroom-empty-partners-link"
                  >
                    Каталог партнёров
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase">
                  <Link
                    href={`${ROUTES.shop.b2bMatrix}?collection=SS27`}
                    data-testid="shop-sc-showroom-empty-matrix-link"
                  >
                    Матрица SS27
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase">
                  <Link
                    href={`${ROUTES.shop.b2bShowroom}?collection=SS27`}
                    data-testid="shop-sc-showroom-empty-showroom-link"
                  >
                    Витрина SS27
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">
              Нет опубликованных артикулов для {getPlatformCoreCollectionLabel(collectionId)}.
            </p>
          )}
        </Card>
      ) : null}

      {!isPlatformCoreMode() ? (
      <div
        className="flex flex-wrap gap-2"
        data-testid={`${sectionPrefix}-footer-cta`}
      >
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`${ROUTES.shop.b2bMatrix}?collection=${collectionId}`}
            data-testid={`${sectionPrefix}-footer-matrix-link`}
          >
            {variant === 'shop' ? 'Матрица' : 'Матрица магазина'}
          </Link>
        </Button>
        {variant === 'shop' ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={shopB2bCheckoutCollectionHref(collectionId)}
              data-testid="shop-sc-showroom-footer-checkout-link"
            >
              Checkout
            </Link>
          </Button>
        ) : null}
        {variant === 'brand' ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/brand/linesheets?collection=${collectionId}`}
              data-testid="brand-sc-showroom-footer-linesheets-link"
            >
              Лайншиты
            </Link>
          </Button>
        ) : null}
      </div>
      ) : null}
    </div>
  );
}
