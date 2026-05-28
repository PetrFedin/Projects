/**
 * Always-On Cart (RepSpark-style).
 * Корзина сохраняется между сессиями и устройствами через localStorage.
 * Ключ включает brandId/retailerId при наличии для мультитенантности.
 */

import type { CartItem } from '@/lib/types';

const STORAGE_PREFIX = 'b2b_cart_v1';

function getStorageKey(brandId?: string, retailerId?: string): string {
  const parts = [STORAGE_PREFIX];
  if (brandId) parts.push(brandId);
  if (retailerId) parts.push(retailerId);
  return parts.join('__');
}

/** Загрузить корзину из localStorage */
export function loadCartFromStorage(brandId?: string, retailerId?: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getStorageKey(brandId, retailerId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Сохранить корзину в localStorage */
export function saveCartToStorage(cart: CartItem[], brandId?: string, retailerId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(brandId, retailerId);
    window.localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    // ignore
  }
}
