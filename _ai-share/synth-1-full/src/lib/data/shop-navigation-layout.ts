'use client';

/**
 * Лёгкие хелперы для shop layout — breadcrumbs и active tab без импорта
 * shop-navigation-data (lucide + полный shopNavGroups).
 */
import { shopMainNavLabelByValue, shopNavPathCandidates } from './shop-navigation-path-index';

export type ShopNavDisplayMode = 'full' | 'mvp';

/** Режим `mvp`: скрыть пункты с `navTier: 'phase2'`. Задаётся `NEXT_PUBLIC_SHOP_NAV_MVP=1`. */
export function getShopNavDisplayMode(): ShopNavDisplayMode {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHOP_NAV_MVP === '1') return 'mvp';
  return 'full';
}

/** Активный пункт верхнего уровня кабинета `/shop/*` по URL (path-index, без lucide). */
export function getMainShopNavTabValue(pathname: string): string {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const sorted = [...shopNavPathCandidates].sort((a, b) => b.href.length - a.href.length);
  const hit = sorted.find((c) => {
    const nh = c.href.replace(/\/$/, '') || '/';
    if (nh === '/shop') return normalizedPath === '/shop';
    return normalizedPath === nh || normalizedPath.startsWith(`${nh}/`);
  });
  return hit?.value ?? 'dashboard';
}

/** Заголовок секции для breadcrumbs в shop layout. */
export function getShopSectionLabel(pathname: string): string {
  const value = getMainShopNavTabValue(pathname);
  return shopMainNavLabelByValue[value] ?? 'Дашборд';
}
