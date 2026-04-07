import type { CartItem, CartOutfitLineRef, Product, SavedCartOutfit } from './types';

export function cartItemColor(item: CartItem): string | undefined {
  const c = (item as { color?: string }).color ?? item.color;
  return c || undefined;
}

/** Стабильный ключ строки корзины (как в cart-sheet). */
export function cartLineKey(item: CartItem): string {
  const color = cartItemColor(item) || 'none';
  return `${item.id}-${item.selectedSize || 'default'}-${color}`;
}

export function wishlistProductToLineRef(product: Product): CartOutfitLineRef {
  const color = (product as { color?: string }).color ?? product.color;
  return {
    productId: product.id,
    selectedSize: 'One Size',
    color: color || undefined,
    slug: product.slug,
    snapshotPriceRub: product.price,
  };
}

export function cartItemToLineRef(item: CartItem, withSnapshot = false): CartOutfitLineRef {
  const base: CartOutfitLineRef = {
    productId: item.id,
    selectedSize: item.selectedSize || 'default',
    color: cartItemColor(item),
    slug: item.slug,
  };
  if (withSnapshot) base.snapshotPriceRub = item.price;
  return base;
}

/** Ключ линии без привязки к CartItem (для удаления из образа). */
export function lineRefKey(ref: CartOutfitLineRef): string {
  const color = (ref.color || 'none').toLowerCase();
  return `${ref.productId}-${ref.selectedSize || 'default'}-${color}`;
}

export function sameCartLine(a: CartItem, b: CartItem): boolean {
  return cartLineKey(a) === cartLineKey(b);
}

export function missingOutfitLineRefs(outfit: SavedCartOutfit, cart: CartItem[]): CartOutfitLineRef[] {
  if (!outfit?.lineRefs?.length) return [];
  return outfit.lineRefs.filter((ref) => !cart.some((item) => lineRefMatchesCartItem(ref, item)));
}

export function lineRefPriceChanged(ref: CartOutfitLineRef, product: Product | undefined): boolean {
  if (ref.snapshotPriceRub == null || !product) return false;
  return Math.round(product.price) !== Math.round(ref.snapshotPriceRub);
}

/** Эвристика «нет в наличии» по полю availability каталога. */
export function productLooksUnavailable(product: Product | undefined): boolean {
  if (!product) return true;
  return product.availability === 'out_of_stock';
}

function normColor(c?: string) {
  return (c || 'none').toLowerCase();
}

export function lineRefMatchesCartItem(ref: CartOutfitLineRef, item: CartItem): boolean {
  if (ref.productId !== item.id) return false;
  const itemSize = item.selectedSize || 'default';
  const refSize = ref.selectedSize || 'default';
  if (itemSize !== refSize) return false;
  return normColor(ref.color) === normColor(cartItemColor(item));
}

export function cartItemsMatchingOutfit(cart: CartItem[], outfit: SavedCartOutfit | null | undefined): CartItem[] {
  if (!outfit?.lineRefs?.length) return [];
  return cart.filter((item) => outfit.lineRefs.some((ref) => lineRefMatchesCartItem(ref, item)));
}

export function sortCartByActiveOutfit(cart: CartItem[], outfit: SavedCartOutfit | null | undefined): CartItem[] {
  if (!outfit?.lineRefs?.length) return [...cart];
  const match = (item: CartItem) => outfit.lineRefs.some((ref) => lineRefMatchesCartItem(ref, item));
  const yes: CartItem[] = [];
  const no: CartItem[] = [];
  for (const item of cart) {
    (match(item) ? yes : no).push(item);
  }
  return [...yes, ...no];
}

export function subtotalForItems(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
}

const OUTFIT_SHARE_VERSION = 1;

export type OutfitSharePayload = {
  v: typeof OUTFIT_SHARE_VERSION;
  name: string;
  lineRefs: CartOutfitLineRef[];
};

export function encodeOutfitSharePayload(outfit: SavedCartOutfit): string {
  if (typeof window === 'undefined' || typeof btoa === 'undefined') return '';
  const payload: OutfitSharePayload = {
    v: OUTFIT_SHARE_VERSION,
    name: outfit.name,
    lineRefs: outfit.lineRefs.map((r) => ({ ...r })),
  };
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeOutfitSharePayload(b64: string): OutfitSharePayload | null {
  if (typeof window === 'undefined' || typeof atob === 'undefined') return null;
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const o = JSON.parse(json) as OutfitSharePayload;
    if (o?.v !== OUTFIT_SHARE_VERSION || !o.name || !Array.isArray(o.lineRefs)) return null;
    return o;
  } catch {
    return null;
  }
}
