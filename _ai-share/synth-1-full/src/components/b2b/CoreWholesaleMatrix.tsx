'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  fetchWorkshop2CartSession,
  mapWorkshop2CartLinesToCartItems,
  syncLegacyCartToWorkshop2,
  upsertWorkshop2CartLine,
} from '@/lib/b2b/workshop2-cart-bridge';
import {
  WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE,
  fetchWorkshop2MatrixProducts,
} from '@/lib/b2b/workshop2-b2b-matrix-catalog';
import {
  ROUTES,
  shopB2bCheckoutCollectionHref,
  shopB2bOrderHref,
  shopB2bOrdersCollectionRegistryHref,
  shopMessagesWorkshop2ArticleContextHref,
} from '@/lib/routes';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import type { Product } from '@/lib/types';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { shopCoreBuyerLabelRu } from '@/lib/order/shop-core-buyer-context';
import { ShopProductInventoryBadges } from '@/components/integrations/ShopProductInventoryBadges';
import { useMatrixIntegrationInventory } from '@/hooks/use-matrix-integration-inventory';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';
import { ShopCoSeasonMatrixStrip } from '@/components/shop/b2b/ShopCoSeasonMatrixStrip';
import { ShopCoMatrixSpinePeerStrip } from '@/components/platform/ShopCoMatrixSpinePeerStrip';
import { ShopScMatrixEntryHonestStrip } from '@/components/platform/ShopScMatrixEntryHonestStrip';
import { ShopScMatrixEntryCoPeerStrip } from '@/components/platform/ShopScMatrixEntryCoPeerStrip';
import { ShopScCabinetGoldenPathStrip } from '@/components/platform/ShopScCabinetGoldenPathStrip';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { cn } from '@/lib/utils';
import {
  buildCartItemsFromPrepackBreakdown,
  buildPrepackBreakdownForApply,
  prepackApplyBatchRequestKey,
  normalizeShopMatrixPrepackApply,
  type ShopMatrixPrepackApplyRequest,
} from '@/lib/b2b/shop-matrix-prepack-apply';
import { fetchShopMatrixSizeCurveView } from '@/lib/b2b/shop-matrix-size-curve-client';
import { useShopMatrixTierPricing } from '@/hooks/use-shop-matrix-tier-pricing';

const MATRIX_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

type Props = {
  collectionId: string;
  buyerId?: string;
  buyerName?: string;
  focusArticleId?: string;
  onOpenArticleInspector?: (articleId: string) => void;
  prepackApply?: ShopMatrixPrepackApplyRequest | ShopMatrixPrepackApplyRequest[];
  /** Workspace chrome already renders golden path — hide duplicate strip inside matrix. */
  hideCabinetGoldenPath?: boolean;
};

export function CoreWholesaleMatrix({
  collectionId,
  buyerId: buyerIdProp,
  buyerName: buyerNameProp,
  focusArticleId,
  onOpenArticleInspector,
  prepackApply,
  hideCabinetGoldenPath = false,
}: Props) {
  const router = useRouter();
  const { buyerId: contextBuyerId } = useShopCoreBuyerId();
  const buyerId = buyerIdProp ?? contextBuyerId;
  const buyerName = buyerNameProp ?? shopCoreBuyerLabelRu(buyerId);
  const platformCore = isPlatformCoreMode();
  const { activeOrderId: spineOrderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: '',
    resolveFrom: ['operational', 'allocation'],
    actorRole: 'shop',
  });
  const { b2bCart, setB2bCart } = useB2BState();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cartSyncing, setCartSyncing] = useState(false);
  const [cartSessionId, setCartSessionId] = useState<string | undefined>();
  const cartHydratedRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prepackAppliedRef = useRef('');
  const [prepackAppliedNote, setPrepackAppliedNote] = useState<string | null>(null);
  const { tierLabel, cartTier, pricingSource, storageMode, resolveUnitPrice, applyToCartItem } =
    useShopMatrixTierPricing(collectionId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    void fetchWorkshop2MatrixProducts(collectionId).then((rows) => {
      if (cancelled) return;
      setProducts(rows);
      setLoading(false);
      if (rows.length === 0) {
        setLoadError('Нет опубликованных артикулов. Опубликуйте витрину в разработке коллекции.');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  useEffect(() => {
    cartHydratedRef.current = false;
    setCartSessionId(undefined);
  }, [collectionId, buyerId]);

  useEffect(() => {
    if (!platformCore || loading || products.length === 0 || cartHydratedRef.current) return;
    let cancelled = false;
    void (async () => {
      const session = await fetchWorkshop2CartSession();
      if (cancelled || !session.ok) return;
      cartHydratedRef.current = true;
      if (session.sessionId) setCartSessionId(session.sessionId);
      const hydrated = mapWorkshop2CartLinesToCartItems(session.lines, products, collectionId);
      if (hydrated.length > 0) setB2bCart(hydrated);
    })();
    return () => {
      cancelled = true;
    };
  }, [platformCore, loading, products, collectionId, setB2bCart]);

  useEffect(() => {
    const articleId = focusArticleId?.trim();
    if (!articleId || loading || products.length === 0) return;
    const row = document.querySelector(
      `[data-testid="shop-co-matrix-row-${articleId}"], [data-testid="shop-b2b-matrix-row-${articleId}"]`
    );
    row?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focusArticleId, loading, products]);

  useEffect(() => {
    const requests = normalizeShopMatrixPrepackApply(prepackApply);
    if (requests.length === 0 || loading || products.length === 0) return;
    const key = prepackApplyBatchRequestKey(requests);
    if (prepackAppliedRef.current === key) return;

    let cancelled = false;
    void (async () => {
      const notes: string[] = [];

      for (const request of requests) {
        const product = products.find((p) => p.id === request.articleId);
        if (!product) continue;

        const curveRes = await fetchShopMatrixSizeCurveView({
          collectionId,
          articleId: request.articleId,
        });
        if (cancelled) return;

        const breakdown = buildPrepackBreakdownForApply({
          packCount: request.packCount,
          curveView: curveRes.ok ? curveRes.view : null,
        });
        const lines = buildCartItemsFromPrepackBreakdown(product, breakdown.bySize);

        setB2bCart((prev) => [...prev.filter((item) => item.id !== product.id), ...lines]);
        notes.push(`Pre-pack ×${request.packCount}: ${breakdown.totalUnits} ед. · ${product.name}`);

        if (platformCore) {
          for (const line of lines) {
            await upsertWorkshop2CartLine({
              item: applyToCartItem(line),
              collectionId,
              buyerId,
              tier: cartTier,
              sessionId: cartSessionId,
            }).then((r) => {
              if (r.sessionId) setCartSessionId(r.sessionId);
            });
          }
        }

        document
          .querySelector(`[data-testid="shop-co-matrix-row-${product.id}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (cancelled || notes.length === 0) return;
      prepackAppliedRef.current = key;
      setPrepackAppliedNote(notes.join(' · '));
    })();

    return () => {
      cancelled = true;
    };
  }, [
    prepackApply,
    loading,
    products,
    collectionId,
    setB2bCart,
    platformCore,
    buyerId,
    cartSessionId,
    applyToCartItem,
    cartTier,
  ]);

  const setLineQty = useCallback(
    (product: Product, size: string, quantity: number) => {
      setB2bCart((prev) => {
        const idx = prev.findIndex((item) => item.id === product.id && item.selectedSize === size);
        if (quantity > 0) {
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity };
            return next;
          }
          return [...prev, { ...product, quantity, selectedSize: size }];
        }
        if (idx >= 0) return prev.filter((_, i) => i !== idx);
        return prev;
      });
      if (!platformCore) return;
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = setTimeout(() => {
        void upsertWorkshop2CartLine({
          item: applyToCartItem({ ...product, quantity, selectedSize: size }),
          collectionId,
          buyerId,
          tier: cartTier,
          sessionId: cartSessionId,
        }).then((r) => {
          if (r.sessionId) setCartSessionId(r.sessionId);
        });
      }, 400);
    },
    [setB2bCart, platformCore, collectionId, buyerId, cartSessionId, applyToCartItem, cartTier]
  );

  const totals = useMemo(
    () =>
      b2bCart.reduce(
        (acc, item) => {
          const unit = resolveUnitPrice(item.price ?? 0).unitPrice;
          return {
            units: acc.units + item.quantity,
            amount: acc.amount + item.quantity * unit,
          };
        },
        { units: 0, amount: 0 }
      ),
    [b2bCart, resolveUnitPrice]
  );

  const checkoutHref = shopB2bCheckoutCollectionHref(collectionId);
  const showroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const productSkus = useMemo(
    () => products.map((p) => p.sku?.trim() || p.id).filter(Boolean),
    [products]
  );
  const { bySku: nuorderAtsBySku } = useMatrixIntegrationInventory('nuorder', productSkus);
  const { bySku: joorAtsBySku } = useMatrixIntegrationInventory('joor', productSkus);
  const { bySku: aimsOtsBySku } = useMatrixIntegrationInventory('aims360', productSkus);
  const { bySku: amAtsBySku } = useMatrixIntegrationInventory('apparel_magic', productSkus);
  const focusArticle = focusArticleId?.trim() || '';
  const showroomArticleHref = focusArticle
    ? `${showroomHref}&article=${encodeURIComponent(focusArticle)}`
    : showroomHref;

  const goCheckout = () => {
    if (b2bCart.length === 0 || cartSyncing) return;
    void (async () => {
      setCartSyncing(true);
      setLoadError(null);
      try {
        const sync = await syncLegacyCartToWorkshop2({
          items: b2bCart.map(applyToCartItem),
          collectionId,
          buyerId,
          tier: cartTier,
          sessionId: cartSessionId,
        });
        if (!sync.ok) {
          setLoadError(sync.messageRu);
          return;
        }
        const href = sync.sessionId
          ? `${checkoutHref}${checkoutHref.includes('?') ? '&' : '?'}cartSession=${encodeURIComponent(sync.sessionId)}`
          : checkoutHref;
        router.push(href);
        // Hard navigation fallback — client router can stall after async cart sync (e2e / cold compile).
        window.setTimeout(() => {
          if (!window.location.pathname.startsWith(ROUTES.shop.b2bCheckout)) {
            window.location.assign(href);
          }
        }, 600);
      } catch {
        setLoadError('Не удалось синхронизировать корзину перед оформлением.');
      } finally {
        setCartSyncing(false);
      }
    })();
  };

  if (loading) {
    return (
      <p
        className="text-text-secondary text-sm"
        data-testid="shop-co-matrix-shell"
        data-audit-legacy="shop-b2b-matrix-shell"
      >
        Загрузка матрицы…
      </p>
    );
  }

  if (loadError) {
    const isFw27 = collectionId.trim().toUpperCase() === 'FW27';
    return (
      <Card data-testid="shop-co-matrix-shell" data-audit-legacy="shop-b2b-matrix-shell">
        <CardContent
          className="py-6 text-center text-sm text-amber-950"
          data-testid={isFw27 ? 'shop-co-matrix-fw27-dev-notice' : undefined}
        >
          {isFw27 ? (
            <div className="space-y-2">
              <p className="font-medium">FW27 — dev-only превью коллекции</p>
              <p className="text-text-secondary text-xs">
                Для investor golden path и clean PG checkout используйте SS27 — опубликованные артикулы
                и сквозной B2B-заказ без seed pin.
              </p>
              <Link
                href={`${ROUTES.shop.b2bMatrix}?collection=SS27`}
                className="text-accent-primary text-xs font-semibold hover:underline"
                data-testid="shop-co-matrix-fw27-ss27-link"
              >
                Открыть матрицу SS27 →
              </Link>
            </div>
          ) : (
            loadError
          )}
        </CardContent>
      </Card>
    );
  }

  if (!collectionId?.trim()) {
    return (
      <Card data-testid="shop-sc-matrix-no-collection-banner">
        <CardContent className="py-6 text-sm text-amber-950">
          Укажите коллекцию в URL (<code className="text-xs">?collection=SS27</code>) — иначе
          матрица не связана с витриной (столп 2 → 3).
          <div className="mt-2">
            <Link
              href={`${ROUTES.shop.b2bMatrix}?collection=SS27`}
              className="text-accent-primary font-medium hover:underline"
            >
              Открыть SS27
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="space-y-4"
      {...(focusArticle ? { 'data-testid': 'shop-sc-matrix-entry-panel' } : {})}
    >
      <div className="space-y-4" data-testid="shop-co-matrix-panel">
        <ShopCoSeasonMatrixStrip activeCollectionId={collectionId} />
        {!focusArticle ? (
          <ShopCoMatrixSpinePeerStrip collectionId={collectionId} orderId={spineOrderId || undefined} />
        ) : null}
        {prepackAppliedNote ? (
          <div
            className="border-border-subtle bg-accent-primary/10 text-text-primary rounded-lg border px-4 py-2 text-xs"
            data-testid="shop-co-matrix-prepack-applied-banner"
          >
            {prepackAppliedNote}
          </div>
        ) : null}
        {focusArticle && !hideCabinetGoldenPath ? (
          <div className={hubGadget.goldenPath} data-testid="shop-sc-matrix-entry-strip">
            <span className="text-text-muted text-[10px]">← {focusArticle}</span>
            <Link
              href={showroomArticleHref}
              data-testid="shop-sc-matrix-entry-showroom-back-link"
              className={hubGadget.goldenLink}
            >
              Витрина
            </Link>
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={shopB2bOrdersCollectionRegistryHref()}
              data-testid="shop-co-matrix-registry-link"
              className={hubGadget.goldenLink}
            >
              Реестр
            </Link>
            {spineOrderId ? (
              <>
                <span className={hubGadget.goldenSep} aria-hidden>
                  ·
                </span>
                <Link
                  href={shopB2bOrderHref(spineOrderId)}
                  data-testid="shop-co-matrix-active-order-link"
                  className={hubGadget.goldenLink}
                >
                  Заказ
                </Link>
              </>
            ) : null}
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
            <Link
              href={checkoutHref}
              data-testid="shop-co-matrix-checkout-link"
              className={hubGadget.goldenLink}
            >
              Checkout
            </Link>
            <ShopScMatrixEntryHonestStrip
              collectionId={collectionId}
              articleId={focusArticle}
              orderId={spineOrderId || undefined}
            />
            <ShopScMatrixEntryCoPeerStrip collectionId={collectionId} orderId={spineOrderId || undefined} />
          </div>
        ) : null}
        {!hideCabinetGoldenPath && !focusArticle ? (
          <ShopScCabinetGoldenPathStrip
            collectionId={collectionId}
            activeOrderId={spineOrderId}
            omitStep="matrix"
          />
        ) : null}
        <div
          className="space-y-4"
          data-testid="shop-co-matrix-shell"
          data-audit-legacy="shop-b2b-matrix-shell"
        >
          <div
            className={cn(
              'border-border-subtle bg-bg-surface2/50 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3',
              platformCore && cn(hubCabinet.workspaceStickyHead, 'sticky top-0 z-20')
            )}
            data-testid="shop-co-matrix-header"
          >
            <div>
              <p className="text-sm font-semibold">Матрица · {collectionId}</p>
              <p className="text-text-secondary text-xs">
                {platformCore
                  ? `Партнёр: ${buyerName} · tier ${tierLabel}`
                  : `Артикулы коллекции · наличие: B2B-каталог, Партнёрская сеть, ERP · закупки, Склад · партнёр: ${buyerName}`}
              </p>
              <Badge
                variant="outline"
                className="mt-1 text-[10px]"
                data-testid={`shop-co-matrix-tier-pricing-source-${pricingSource}`}
              >
                {pricingSource === 'pg-tier-sync' ? `PG tier · ${storageMode}` : 'Default tier'}
              </Badge>
              {platformCore ? (
                <Badge
                  variant="secondary"
                  className="ml-1 mt-1 text-[10px]"
                  data-testid={`shop-co-matrix-cart-tier-${cartTier}`}
                >
                  Cart · {cartTier}
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right text-xs">
                <p className="text-text-muted">Итого</p>
                <p className="font-semibold tabular-nums">
                  {totals.amount.toLocaleString('ru-RU')} ₽ · {totals.units} ед.
                </p>
              </div>
              <Button
                disabled={b2bCart.length === 0 || cartSyncing}
                data-testid="shop-co-matrix-to-checkout"
                data-audit-legacy="shop-b2b-matrix-to-checkout"
                className={cn(platformCore && 'min-h-11')}
                onClick={goCheckout}
              >
                {cartSyncing ? 'Синхронизация…' : 'К оформлению'}
              </Button>
              {!platformCore ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={showroomHref} data-testid="shop-co-matrix-header-showroom-link">
                    Шоурум
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className={cn(platformCore && hubCabinet.workspaceCardGrid)}>
          {products.map((product) => {
            const moq = (product as Product & { moq?: number }).moq ?? 1;
            const lineUnits = b2bCart
              .filter((item) => item.id === product.id)
              .reduce((s, item) => s + item.quantity, 0);
            const moqOk = lineUnits === 0 || lineUnits >= moq;
            return (
              <Card
                key={product.id}
                data-testid={`shop-co-matrix-row-${product.id}`}
                data-audit-legacy={`shop-b2b-matrix-row-${product.id}`}
              >
                {platformCore ? (
                  <CardContent className="p-0">
                    <div
                      className={cn(hubCabinet.workspaceTableScroll, 'flex min-h-[5.5rem]')}
                      data-testid={`shop-co-matrix-size-scroll-${product.id}`}
                    >
                      <div
                        className={cn(
                          hubCabinet.workspaceStickyCol,
                          'flex w-[9.5rem] shrink-0 gap-2 p-3 sm:w-44'
                        )}
                      >
                        <img
                          src={product.images?.[0]?.url || WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold leading-tight">{product.name}</p>
                          <p className="text-text-muted line-clamp-2 text-[10px]">
                            {product.id}
                            {product.sku ? ` · ${product.sku}` : ''}
                          </p>
                          <p className="text-[10px] font-medium tabular-nums">
                            {resolveUnitPrice(product.price ?? 0).unitPrice.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                      <div className="min-w-[12rem] flex-1 p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <Badge variant={moqOk ? 'secondary' : 'destructive'} className="text-[10px]">
                            {lineUnits > 0 ? `${lineUnits} ед.` : 'Количество'}
                          </Badge>
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={shopMessagesWorkshop2ArticleContextHref(collectionId, product.id)}
                              data-testid={`shop-co-matrix-article-chat-${product.id}`}
                              data-audit-legacy={`shop-b2b-matrix-article-chat-${product.id}`}
                              className="text-accent-primary text-[10px] font-medium hover:underline"
                            >
                              Чат
                            </Link>
                            {onOpenArticleInspector ? (
                              <button
                                type="button"
                                className="text-accent-primary text-[10px] font-medium hover:underline"
                                data-testid={`shop-co-matrix-article-inspector-${product.id}`}
                                onClick={() => onOpenArticleInspector(product.id)}
                              >
                                Inspector
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <div className="grid min-w-[16rem] grid-cols-3 gap-2 sm:min-w-0 sm:grid-cols-6">
                          {MATRIX_SIZES.map((size) => {
                            const cartItem = b2bCart.find(
                              (item) => item.id === product.id && item.selectedSize === size
                            );
                            const quantity = cartItem?.quantity ?? 0;
                            return (
                              <div key={size} className="space-y-1">
                                <span className="text-text-muted block text-center text-[10px] font-semibold uppercase">
                                  {size}
                                </span>
                                <Input
                                  type="number"
                                  min={0}
                                  inputMode="numeric"
                                  className="h-9 text-center text-sm"
                                  value={quantity || ''}
                                  data-testid={`shop-co-matrix-qty-${product.id}-${size}`}
                                  data-audit-legacy={`shop-b2b-matrix-qty-${product.id}-${size}`}
                                  onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                    setLineQty(product, size, val);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {!moqOk ? (
                          <p className="mt-2 text-xs text-destructive">
                            Минимальная партия по артикулу: {moq} ед.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 pb-2">
                  <div className="flex gap-3">
                    <img
                      src={product.images?.[0]?.url || WORKSHOP2_B2B_MATRIX_FALLBACK_IMAGE}
                      alt=""
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div>
                      <CardTitle className="text-sm">{product.name}</CardTitle>
                      <p className="text-text-muted text-xs">
                        {product.id}
                        {product.sku ? ` · ${product.sku}` : ''}
                      </p>
                      <p className="text-xs font-medium tabular-nums">
                        {resolveUnitPrice(product.price ?? 0).unitPrice.toLocaleString('ru-RU')} ₽ опт
                        {moq > 1 ? ` · мин. ${moq} ед.` : ''}
                      </p>
                      <ShopProductInventoryBadges
                        sku={product.sku?.trim() || product.id}
                        variant="matrix"
                        nuorderBySku={nuorderAtsBySku}
                        joorBySku={joorAtsBySku}
                        aimsBySku={aimsOtsBySku}
                        amBySku={amAtsBySku}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={moqOk ? 'secondary' : 'destructive'} className="text-[10px]">
                      {lineUnits > 0 ? `${lineUnits} ед.` : 'Количество'}
                    </Badge>
                    <Link
                      href={shopMessagesWorkshop2ArticleContextHref(collectionId, product.id)}
                      data-testid={`shop-co-matrix-article-chat-${product.id}`}
                      data-audit-legacy={`shop-b2b-matrix-article-chat-${product.id}`}
                      className="text-accent-primary text-[10px] font-medium hover:underline"
                    >
                      Чат · артикул
                    </Link>
                    {onOpenArticleInspector ? (
                      <button
                        type="button"
                        className="text-accent-primary text-[10px] font-medium hover:underline"
                        data-testid={`shop-co-matrix-article-inspector-${product.id}`}
                        onClick={() => onOpenArticleInspector(product.id)}
                      >
                        Inspector
                      </button>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={cn(platformCore && hubCabinet.workspaceTableScroll)}>
                    <div className="grid min-w-[16rem] grid-cols-3 gap-2 sm:min-w-0 sm:grid-cols-6">
                    {MATRIX_SIZES.map((size) => {
                      const cartItem = b2bCart.find(
                        (item) => item.id === product.id && item.selectedSize === size
                      );
                      const quantity = cartItem?.quantity ?? 0;
                      return (
                        <div key={size} className="space-y-1">
                          <span className="text-text-muted block text-center text-[10px] font-semibold uppercase">
                            {size}
                          </span>
                          <Input
                            type="number"
                            min={0}
                            inputMode="numeric"
                            className="h-9 text-center text-sm"
                            value={quantity || ''}
                            data-testid={`shop-co-matrix-qty-${product.id}-${size}`}
                            data-audit-legacy={`shop-b2b-matrix-qty-${product.id}-${size}`}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                              setLineQty(product, size, val);
                            }}
                          />
                        </div>
                      );
                    })}
                    </div>
                  </div>
                  {!moqOk ? (
                    <p className="mt-2 text-xs text-destructive">
                      Минимальная партия по артикулу: {moq} ед.
                    </p>
                  ) : null}
                </CardContent>
                  </>
                )}
              </Card>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
