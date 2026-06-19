'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ROUTES,
  shopB2bOrderHref,
  shopB2bOrdersCollectionRegistryHref,
} from '@/lib/routes';
import { resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { PlatformCoreWmsReserveStrip } from '@/components/platform/PlatformCoreWmsReserveStrip';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';
import { invalidateClientChainOverviewCache } from '@/components/platform/usePlatformCoreChainOverview';
import { useB2BState } from '@/providers/b2b-state';
import { tid } from '@/lib/ui/test-ids';
import {
  checkoutWorkshop2Cart,
  syncLegacyCartToWorkshop2,
} from '@/lib/b2b/workshop2-cart-bridge';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { useShopMatrixTierPricing } from '@/hooks/use-shop-matrix-tier-pricing';
import { ShopCoreBuyerSwitcher } from '@/components/shop/ShopCoreBuyerSwitcher';
import { ShopCoCheckoutMonetizationPeerStrip } from '@/components/platform/ShopCoCheckoutMonetizationPeerStrip';
import { useSpineActiveWholesaleOrderId } from '@/hooks/use-spine-active-wholesale-order-id';

function readB2bCartSessionCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)b2b_cart_session=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]).trim() : undefined;
}

export function ShopB2bCheckoutCorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buyerId } = useShopCoreBuyerId();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const { activeOrderId: spineOrderId } = useSpineActiveWholesaleOrderId({
    fallbackOrderId: '',
    collectionId,
    resolveFrom: ['w2_registry', 'operational', 'allocation'],
    actorRole: 'shop',
    buyerId,
  });
  const showroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const [cartSessionFromCookie, setCartSessionFromCookie] = useState<string | undefined>();
  useEffect(() => {
    setCartSessionFromCookie(readB2bCartSessionCookie());
  }, []);
  const cartSession =
    searchParams.get('cartSession')?.trim() || cartSessionFromCookie || undefined;
  const { b2bCart = [] } = useB2BState();
  const { cartTier, tierLabel, applyToCartItem } = useShopMatrixTierPricing(collectionId);
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}`;
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);
  const canConfirm = b2bCart.length > 0 || Boolean(cartSession);
  const total = b2bCart.reduce(
    (acc: number, item: { price?: number; quantity?: number }) => {
      const priced = applyToCartItem(item as Parameters<typeof applyToCartItem>[0]);
      return acc + (priced.price ?? 0) * (priced.quantity ?? 1);
    },
    0
  );

  const handleConfirm = () => {
    if (!canConfirm || checkingOut) return;
    void (async () => {
      setCheckingOut(true);
      setCheckoutMsg(null);
      try {
        const sync =
          b2bCart.length > 0
            ? await syncLegacyCartToWorkshop2({
                items: b2bCart.map(applyToCartItem),
                collectionId,
                buyerId,
                tier: cartTier,
              })
            : { ok: Boolean(cartSession), sessionId: cartSession, synced: 0, failed: 0, messageRu: '' };
        const result = await checkoutWorkshop2Cart({
          sessionId: sync.sessionId ?? cartSession,
          buyerId,
        });
        setCheckoutMsg(result.messageRu);
        if (result.ok && result.orderId) {
          invalidateClientChainOverviewCache(collectionId);
          router.push(
            `${shopB2bOrderHref(result.orderId)}?collection=${encodeURIComponent(collectionId)}`
          );
        }
      } catch {
        setCheckoutMsg('Ошибка сети при оформлении заказа.');
      } finally {
        setCheckingOut(false);
      }
    })();
  };

  return (
    <CabinetPageContent
      maxWidth="2xl"
      className="space-y-6 max-md:pb-28"
      data-testid={tid.page('shop-b2b-checkout')}
    >
      <PlatformCoreListChrome highlightRole="shop" pillarId="collection_order">
      <div className="min-w-0" data-testid="shop-co-checkout-panel">
      <div
        className={hubGadget.goldenPath + ' mb-3'}
        data-testid="shop-co-checkout-context-strip"
      >
        <Link
          href={matrixHref}
          data-testid="shop-co-checkout-matrix-link"
          className={hubGadget.goldenLink}
        >
          Матрица
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link
          href={showroomHref}
          data-testid="shop-co-checkout-showroom-link"
          className={hubGadget.goldenLink}
        >
          Витрина
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link
          href={shopB2bOrdersCollectionRegistryHref()}
          data-testid="shop-co-checkout-registry-link"
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
              data-testid="shop-co-checkout-active-order-link"
              className={hubGadget.goldenLink}
            >
              Заказ
            </Link>
          </>
        ) : null}
      </div>
      <ShopCoCheckoutMonetizationPeerStrip collectionId={collectionId} orderId={spineOrderId || undefined} />
      <div
        className="mb-3 flex flex-wrap items-center gap-2"
        data-testid="shop-co-checkout-buyer-picker"
      >
        <span className="text-text-muted text-xs" data-testid="shop-co-checkout-buyer-label">
          Партнёр · checkout:
        </span>
        <ShopCoreBuyerSwitcher />
        <span
          className="border-border-subtle bg-bg-surface2 text-text-muted rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase"
          data-testid={`shop-co-checkout-cart-tier-${cartTier}`}
        >
          {tierLabel} · cart {cartTier}
        </span>
      </div>
      <Card
        className="mb-6"
        data-testid="shop-co-checkout-form"
        data-audit-legacy="shop-b2b-checkout-form"
      >
        <CardContent className="pt-6">
          {b2bCart.length === 0 ? (
            <p className="text-text-secondary text-sm">
              {cartSession ? (
                <>
                  Корзина синхронизирована с матрицы (сессия W2). Подтвердите заказ или вернитесь в{' '}
                  <Link
                    href={matrixHref}
                    data-testid="shop-co-checkout-empty-matrix-link"
                    className="text-accent-primary hover:underline"
                  >
                    матрицу
                  </Link>
                  .
                </>
              ) : (
                <>
                  Корзина пуста. Добавьте товары в{' '}
                  <Link
                    href={matrixHref}
                    data-testid="shop-co-checkout-empty-matrix-link"
                    className="text-accent-primary hover:underline"
                  >
                    матрице заказа
                  </Link>
                  .
                </>
              )}
            </p>
          ) : (
            <ul className="space-y-2">
              {b2bCart.map((item: { id?: string; name?: string; sku?: string; quantity?: number; price?: number }, i: number) => {
                const priced = applyToCartItem(item as Parameters<typeof applyToCartItem>[0]);
                return (
                <li
                  key={`${item.id ?? item.sku}-${i}`}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2"
                >
                  <span className="text-text-primary min-w-0 text-sm leading-snug">
                    {item.name ?? item.sku} × {priced.quantity ?? 1}
                  </span>
                  <span className="text-text-primary shrink-0 text-sm font-medium tabular-nums sm:text-right">
                    {((priced.price ?? 0) * (priced.quantity ?? 1)).toLocaleString('ru-RU')} ₽
                  </span>
                </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 font-semibold">Итого: {total.toLocaleString('ru-RU')} ₽</p>
          <PlatformCoreWmsReserveStrip variant="checkout" />
        </CardContent>
      </Card>
      {checkoutMsg ? (
        <p
          className="text-text-secondary text-sm"
          role="status"
          data-testid="shop-co-checkout-message"
        >
          {checkoutMsg}
        </p>
      ) : null}
      <div
        className={cn('mt-6', hubCabinet.workspaceStickyActions)}
        data-testid="shop-co-checkout-actions"
      >
        <Button
          disabled={!canConfirm || checkingOut}
          onClick={handleConfirm}
          data-testid="shop-co-checkout-confirm"
          data-audit-legacy="shop-b2b-checkout-confirm"
          className={hubCabinet.workspacePrimaryBtn}
        >
          {checkingOut ? 'Оформление…' : 'Подтвердить заказ'}
        </Button>
        <Button variant="outline" asChild className={hubCabinet.workspacePrimaryBtn}>
          <Link href={matrixHref} data-testid="shop-co-checkout-back-matrix-link">
            В матрицу
          </Link>
        </Button>
      </div>
      </div>
      </PlatformCoreListChrome>
    </CabinetPageContent>
  );
}
