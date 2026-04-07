/**
 * NuORDER: Available-to-Sell (ATS) / сток в реальном времени (или по слоту).
 * Связь с матрицей заказа, Quick Order и B2B каталогом — единый источник для «доступно к продаже».
 * При API — запрос к инвентарю по productId/size/drop.
 */

/** ATS по продукту и размеру. Опционально по дропу (окну доставки). */
export function getATS(
  productId: string,
  size: string,
  /** Метка дропа, например "Drop 1: Июль 2026". При API — слот. */
  dropLabel?: string
): number {
  // Мок: разные остатки по продукту и размеру. В проде — вызов API инвентаря.
  const key = `${productId}-${size}`;
  const mockByKey: Record<string, number> = {
    'p1-XS': 8, 'p1-S': 24, 'p1-M': 42, 'p1-L': 38, 'p1-XL': 12, 'p1-XXL': 6,
    '1-XS': 10, '1-S': 30, '1-M': 50, '1-L': 45, '1-XL': 20, '1-XXL': 8,
    '2-XS': 5, '2-S': 18, '2-M': 28, '2-L': 22, '2-XL': 10, '2-XXL': 4,
    '3-XS': 14, '3-S': 20, '3-M': 35, '3-L': 40, '3-XL': 15, '3-XXL': 7,
    '4-XS': 6, '4-S': 16, '4-M': 25, '4-L': 30, '4-XL': 12, '4-XXL': 5,
    '5-XS': 9, '5-S': 22, '5-M': 32, '5-L': 28, '5-XL': 11, '5-XXL': 3,
  };
  const fallback = 42;
  return mockByKey[key] ?? fallback;
}

/** Проверка: запрошенное количество превышает ATS. Для предупреждения в матрице и Quick Order. */
export function isOverATS(productId: string, size: string, quantity: number, dropLabel?: string): boolean {
  if (quantity <= 0) return false;
  return quantity > getATS(productId, size, dropLabel);
}
