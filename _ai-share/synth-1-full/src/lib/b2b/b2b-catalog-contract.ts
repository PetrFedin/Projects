/**
 * Fashion Cloud: атрибуты и медиа как контракт для B2B.
 * Обязательные поля для публикации в каталог байера: размерная сетка, состав, уход, EAN, медиа.
 * Валидация перед публикацией.
 */

import type { Product } from '@/lib/types';

/** Обязательные поля B2B-каталога (контракт PIM → каталог байера) */
export const B2B_REQUIRED_FIELDS = [
  'sizeChart',
  'composition',
  'care',
  'ean',
  'mainImage',
] as const;

export type B2BRequiredFieldId = (typeof B2B_REQUIRED_FIELDS)[number];

export const B2B_FIELD_LABELS: Record<B2BRequiredFieldId, string> = {
  sizeChart: 'Размерная сетка',
  composition: 'Состав',
  care: 'Уход',
  ean: 'EAN',
  mainImage: 'Главное фото',
};

export interface B2BValidationResult {
  valid: boolean;
  errors: { field: B2BRequiredFieldId; message: string }[];
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function getComposition(p: Product): string | undefined {
  const c = (p as any).composition;
  if (typeof c === 'string') return c;
  if (Array.isArray(c) && c.length > 0)
    return c.map((x: any) => `${x.material ?? x} ${x.percentage ?? ''}%`).join(', ');
  return undefined;
}

function getCare(p: Product): string | undefined {
  return (p as any).careInstructions ?? (p as any).care ?? (p.attributes as any)?.care;
}

function getSizeChart(p: Product): string | undefined {
  return (p as any).sizeChart ?? (p as any).size_grid ?? (p.attributes as any)?.sizeChart;
}

function getEan(p: Product): string | undefined {
  return (
    (p as any).ean ?? (p as any).gtin ?? (p.attributes as any)?.ean ?? (p.attributes as any)?.gtin
  );
}

/** Валидация продукта для публикации в B2B-каталог. */
export function validateProductForB2B(p: Product): B2BValidationResult {
  const errors: { field: B2BRequiredFieldId; message: string }[] = [];

  if (!getSizeChart(p) || !hasNonEmptyString(getSizeChart(p))) {
    errors.push({ field: 'sizeChart', message: 'Не заполнена размерная сетка' });
  }
  if (!getComposition(p) || !hasNonEmptyString(getComposition(p))) {
    errors.push({ field: 'composition', message: 'Не указан состав' });
  }
  if (!getCare(p) || !hasNonEmptyString(getCare(p))) {
    errors.push({ field: 'care', message: 'Не указаны инструкции по уходу' });
  }
  const ean = getEan(p);
  if (!ean || !hasNonEmptyString(ean)) {
    errors.push({ field: 'ean', message: 'Не указан EAN' });
  } else if (!/^\d{8,14}$/.test(String(ean).trim())) {
    errors.push({ field: 'ean', message: 'EAN должен быть 8–14 цифр' });
  }
  if (!p.images?.length || !p.images[0]?.url) {
    errors.push({ field: 'mainImage', message: 'Нет главного изображения' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/** Валидация списка продуктов, возврат списка с ошибками по SKU. */
export function validateProductsForB2B(products: Product[]): {
  validSkus: string[];
  skuErrors: {
    sku: string;
    productId: string;
    name: string;
    errors: { field: B2BRequiredFieldId; message: string }[];
  }[];
} {
  const validSkus: string[] = [];
  const skuErrors: {
    sku: string;
    productId: string;
    name: string;
    errors: { field: B2BRequiredFieldId; message: string }[];
  }[] = [];
  products.forEach((p) => {
    const sku = (p as any).sku ?? p.id;
    const result = validateProductForB2B(p);
    if (result.valid) {
      validSkus.push(p.id);
    } else {
      skuErrors.push({
        sku,
        productId: p.id,
        name: p.name ?? 'Unnamed',
        errors: result.errors,
      });
    }
  });
  return { validSkus, skuErrors };
}
