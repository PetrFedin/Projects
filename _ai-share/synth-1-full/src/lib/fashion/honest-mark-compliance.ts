import type { HonestMarkRequirementV1 } from './types';

/** Инфраструктура для управления Честным Знаком и требованиями ЕАЭС. */
export function getHonestMarkStatus(skus: string[]): HonestMarkRequirementV1[] {
  return skus.map(sku => ({
    sku,
    status: (sku.includes('101') || sku.includes('102')) ? 'ready' : 'pending',
    codesRequired: 100, // Based on order draft quantity in real app
    ean: `46${Math.floor(Math.random() * 100000000000)}`,
    declarationEaeu: `RU Д-CN.АБ${Math.floor(Math.random() * 100)}.В.${Math.floor(Math.random() * 10000)}`,
  }));
}

export function validateCodesAvailable(sku: string, qty: number): boolean {
  // In a real app: check Honest Mark code pool
  return qty < 500;
}
