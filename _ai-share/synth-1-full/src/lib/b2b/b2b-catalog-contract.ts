/**
 * Fashion Cloud: атрибуты и медиа как контракт для B2B.
 * Обязательные поля для публикации в каталог байера: размерная сетка, состав, уход, EAN, медиа.
 * Валидация перед публикацией.
 */

import type { Product } from '@/lib/types';
import { formatProductComposition } from '@/lib/b2b/format-product-composition';

export { formatProductComposition } from '@/lib/b2b/format-product-composition';

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

/** PIM/B2B поля, которых нет в базовом `Product`, но встречаются в выгрузках */
type ProductB2BExtras = Product & {
  careInstructions?: string;
  care?: string;
  sizeChart?: string;
  size_grid?: string;
  ean?: string;
  gtin?: string;
};

function attrString(attrs: Product['attributes'], key: string): string | undefined {
  if (!attrs || typeof attrs !== 'object') return undefined;
  const v = (attrs as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : undefined;
}

function getComposition(p: Product): string | undefined {
  const s = formatProductComposition(p.composition);
  return s.length > 0 ? s : undefined;
}

function getCare(p: Product): string | undefined {
  const x = p as ProductB2BExtras;
  return x.careInstructions ?? x.care ?? attrString(p.attributes, 'care');
}

function getSizeChart(p: Product): string | undefined {
  const x = p as ProductB2BExtras;
  return x.sizeChart ?? x.size_grid ?? attrString(p.attributes, 'sizeChart');
}

function getEan(p: Product): string | undefined {
  const x = p as ProductB2BExtras;
  return x.ean ?? x.gtin ?? attrString(p.attributes, 'ean') ?? attrString(p.attributes, 'gtin');
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
    const sku = p.sku ?? p.id;
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
