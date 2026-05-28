'use client';

/**
 * Breadcrumbs и active tab brand layout — без brand-navigation (lucide) в initial chunk.
 */
import { brandNavMetaByValue, brandNavPathCandidates } from './brand-navigation-path-index';

function pathOnly(href: string) {
  return (href.split('?')[0] || '').replace(/\/$/, '') || '/';
}

/** Активный value пункта навигации по URL (логика как в brand layout). */
export function getBrandNavTabValue(pathname: string | null | undefined): string {
  const safePathname = pathname || '/';
  const normalizedPath = safePathname.replace(/\/$/, '') || '/';
  const sorted = [...brandNavPathCandidates].sort(
    (a, b) => pathOnly(b.href).length - pathOnly(a.href).length
  );
  const hit = sorted.find((link) => {
    const normalizedLink = pathOnly(link.href);
    if (normalizedLink === '/brand' || normalizedLink === '/brand/profile') {
      return normalizedPath === '/brand' || normalizedPath === '/brand/profile';
    }
    return normalizedPath === normalizedLink || normalizedPath.startsWith(`${normalizedLink}/`);
  });
  return hit?.value ?? 'dashboard';
}

export function getBrandNavLinkMeta(pathname: string | null | undefined) {
  const value = getBrandNavTabValue(pathname);
  const meta = brandNavMetaByValue[value];
  if (!meta) return undefined;
  return { value, ...meta };
}

/** Заголовок секции для breadcrumbs brand layout. */
export function getBrandSectionLabel(pathname: string | null | undefined): string {
  const hubPath = (pathname || '').replace(/\/$/, '');
  if (hubPath === '/brand' || hubPath === '/brand/profile') return 'Профиль';
  return getBrandNavLinkMeta(pathname)?.label ?? 'Раздел';
}
