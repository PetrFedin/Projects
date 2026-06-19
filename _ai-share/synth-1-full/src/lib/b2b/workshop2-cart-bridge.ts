import type { CartItem, Product } from '@/lib/types';

export type LegacyCartBridgeLine = {
  collectionId: string;
  articleId: string;
  colorCode: string;
  size: string;
  qty: number;
  wholesalePriceRub?: number;
  deliveryDate?: string;
  lineNote?: string;
};

type CartLineResponse = {
  ok?: boolean;
  session?: { sessionId: string };
  messageRu?: string;
};

type CheckoutResponse = {
  ok?: boolean;
  order?: { id: string };
  messageRu?: string;
};

export type Workshop2CartSessionLine = {
  collectionId: string;
  articleId: string;
  colorCode: string;
  size: string;
  qty: number;
  wholesalePriceRub?: number;
};

type CartSessionGetResponse = {
  ok?: boolean;
  session?: {
    sessionId: string;
    lines: Workshop2CartSessionLine[];
  };
};

/** GET session из cookie `b2b_cart_session` или явного sessionId. */
export async function fetchWorkshop2CartSession(sessionId?: string): Promise<{
  ok: boolean;
  sessionId?: string;
  lines: Workshop2CartSessionLine[];
}> {
  const qs = sessionId?.trim() ? `?sessionId=${encodeURIComponent(sessionId.trim())}` : '';
  try {
    const res = await fetch(`/api/shop/b2b/cart/lines${qs}`);
    const json = (await res.json()) as CartSessionGetResponse;
    if (!res.ok || !json.ok) return { ok: false, lines: [] };
    return {
      ok: true,
      sessionId: json.session?.sessionId,
      lines: json.session?.lines ?? [],
    };
  } catch {
    return { ok: false, lines: [] };
  }
}

/** Строки W2 session → legacy CartItem для UI матрицы. */
export function mapWorkshop2CartLinesToCartItems(
  lines: Workshop2CartSessionLine[],
  products: Product[],
  collectionId: string
): CartItem[] {
  const collKey = collectionId.trim().toUpperCase();
  const out: CartItem[] = [];
  for (const line of lines) {
    if (line.collectionId.trim().toUpperCase() !== collKey || line.qty <= 0) continue;
    const articleId = line.articleId.trim();
    const product =
      products.find((p) => p.id === articleId || p.sku?.trim() === articleId) ??
      ({
        id: articleId,
        name: articleId,
        sku: articleId,
        price: line.wholesalePriceRub ?? 0,
        images: [],
        category: 'apparel',
      } as Product);
    const colorCode = line.colorCode?.trim();
    out.push({
      ...product,
      quantity: line.qty,
      selectedSize: line.size?.trim() || 'M',
      price: line.wholesalePriceRub ?? product.price ?? 0,
      ...(colorCode && colorCode !== 'default'
        ? { color: colorCode, selectedColor: colorCode }
        : {}),
    } as CartItem);
  }
  return out;
}

/** Одна строка → POST upsert (persist между refresh до checkout). */
export async function upsertWorkshop2CartLine(input: {
  item: CartItem;
  collectionId: string;
  buyerId?: string;
  sessionId?: string;
  tier?: 'standard' | 'vip' | 'prebook';
}): Promise<{ ok: boolean; sessionId?: string }> {
  if (!input.item.quantity || input.item.quantity <= 0) {
    return { ok: true, sessionId: input.sessionId };
  }
  const line = mapLegacyB2bCartLine(input.item, input.collectionId);
  try {
    const res = await fetch('/api/shop/b2b/cart/lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upsert',
        sessionId: input.sessionId,
        buyerId: input.buyerId ?? 'buyer-demo',
        tier: input.tier ?? 'standard',
        line: { ...line, qty: input.item.quantity },
      }),
    });
    const json = (await res.json()) as CartLineResponse;
    return {
      ok: Boolean(res.ok && json.ok),
      sessionId: json.session?.sessionId ?? input.sessionId,
    };
  } catch {
    return { ok: false, sessionId: input.sessionId };
  }
}

const SS27_ARTICLE_ID_RE = /^demo-ss27-\d{2}$/i;

/** Нормализует id корзины → W2 articleId (SS27 demo / явный articleId). */
export function resolveWorkshop2CartArticleId(
  item: CartItem,
  collectionId: string
): string {
  const ext = item as CartItem & { articleId?: string; sku?: string };
  const fromField = ext.articleId?.trim() || ext.sku?.trim();
  if (fromField) return fromField;
  const id = item.id?.trim() ?? '';
  if (SS27_ARTICLE_ID_RE.test(id)) return id;
  if (collectionId.trim().toUpperCase() === 'SS27' && id.startsWith('demo-ss27')) return id;
  return id || 'demo-ss27-01';
}

export function mapLegacyB2bCartLine(item: CartItem, collectionId: string): LegacyCartBridgeLine {
  const ext = item as CartItem & {
    articleId?: string;
    sku?: string;
    selectedColor?: string;
    color?: string;
  };
  const articleId = resolveWorkshop2CartArticleId(item, collectionId);
  const rawColor = ext.selectedColor?.trim() || ext.color?.trim() || 'default';
  const colorCode = rawColor === 'Core' ? 'default' : rawColor;
  const extPrice = item as CartItem & { wholesalePriceRub?: number; originalPrice?: number };
  const priceRub = extPrice.wholesalePriceRub ?? item.price ?? extPrice.originalPrice;
  return {
    collectionId,
    articleId,
    colorCode,
    size: item.selectedSize?.trim() || 'M',
    qty: Math.max(1, Math.round(item.quantity ?? 1)),
    wholesalePriceRub: priceRub != null && priceRub > 0 ? Math.round(priceRub) : undefined,
    deliveryDate: item.deliveryDate?.trim() || undefined,
  };
}

/** Синхронизирует legacy NuOrder-корзину в W2 session (`/api/shop/b2b/cart/lines`). */
export async function syncLegacyCartToWorkshop2(input: {
  items: CartItem[];
  collectionId?: string;
  buyerId?: string;
  tier?: 'standard' | 'vip' | 'prebook';
  sessionId?: string;
}): Promise<{ ok: boolean; synced: number; failed: number; messageRu: string; sessionId?: string }> {
  const collectionId = input.collectionId?.trim() || 'SS27';
  let synced = 0;
  let failed = 0;
  let sessionId = input.sessionId;

  for (const item of input.items) {
    if (!item.quantity || item.quantity <= 0) continue;
    const line = mapLegacyB2bCartLine(item, collectionId);
    try {
      const res = await fetch('/api/shop/b2b/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert',
          sessionId,
          buyerId: input.buyerId ?? 'buyer-demo',
          tier: input.tier ?? 'standard',
          line,
        }),
      });
      const json = (await res.json()) as CartLineResponse;
      if (res.ok && json.ok) {
        synced += 1;
        sessionId = json.session?.sessionId ?? sessionId;
      } else {
        failed += 1;
      }
    } catch {
      failed += 1;
    }
  }

  return {
    ok: synced > 0,
    synced,
    failed,
    sessionId,
    messageRu: synced
      ? `Синхронизировано ${synced} строк в W2-корзину${failed ? `, ${failed} пропущено` : ''}.`
      : 'Не удалось синхронизировать корзину с Workshop2.',
  };
}

export async function checkoutWorkshop2Cart(input: {
  sessionId?: string;
  buyerId?: string;
  orderId?: string;
}): Promise<{ ok: boolean; orderId?: string; messageRu: string }> {
  const res = await fetch('/api/shop/b2b/cart/lines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'checkout',
      sessionId: input.sessionId,
      buyerId: input.buyerId ?? 'buyer-demo',
      orderId: input.orderId,
    }),
  });
  const json = (await res.json()) as CheckoutResponse;
  return {
    ok: Boolean(res.ok && json.ok),
    orderId: json.order?.id,
    messageRu: json.messageRu ?? (json.ok ? 'Заказ создан.' : 'Ошибка оформления.'),
  };
}
