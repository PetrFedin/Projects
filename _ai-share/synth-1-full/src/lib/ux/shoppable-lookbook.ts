/**
 * JOOR: Shoppable Lookbooks — заказ прямо из lookbook.
 * Look = изображение с hotspots (продукты), клик → добавление в корзину.
 */

export interface ShoppableLookProduct {
  productId: string;
  sku: string;
  name: string;
  price: number;
  /** Позиция hotspot на изображении (проценты 0–100) */
  x: number;
  y: number;
  color?: string;
  size?: string;
}

export interface ShoppableLook {
  id: string;
  lookbookId: string;
  /** URL изображения look'а */
  imageUrl: string;
  title?: string;
  products: ShoppableLookProduct[];
}

/** Демо: lookup продуктов для lookbook */
export const DEMO_SHOPPABLE_LOOKS: ShoppableLook[] = [
  {
    id: 'look-1',
    lookbookId: 'lb-fw26-1',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    title: 'Look 1 — Casual',
    products: [
      { productId: 'p1', sku: 'FW26-JKT-01', name: 'Куртка оверсайз', price: 12900, x: 35, y: 45 },
      { productId: 'p2', sku: 'FW26-TEE-02', name: 'Футболка базовая', price: 2900, x: 48, y: 55 },
      { productId: 'p3', sku: 'FW26-PNT-01', name: 'Брюки широкие', price: 5900, x: 42, y: 78 },
    ],
  },
  {
    id: 'look-2',
    lookbookId: 'lb-fw26-1',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    title: 'Look 2 — Office',
    products: [
      { productId: 'p4', sku: 'FW26-BLZ-01', name: 'Блейзер', price: 14900, x: 40, y: 40 },
      { productId: 'p5', sku: 'FW26-SKN-01', name: 'Юбка миди', price: 6900, x: 50, y: 75 },
    ],
  },
];

export function getShoppableLooksByLookbookId(lookbookId: string): ShoppableLook[] {
  return DEMO_SHOPPABLE_LOOKS.filter((l) => l.lookbookId === lookbookId);
}
