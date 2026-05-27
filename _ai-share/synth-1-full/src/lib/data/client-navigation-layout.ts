'use client';

/**
 * Лёгкие хелперы для client cabinet shell — breadcrumbs без client-navigation (lucide).
 */
import { clientMainNavLabelByValue, clientNavPathCandidates } from './client-navigation-path-index';

export function getClientSectionLabel(pathname: string): string {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const sorted = [...clientNavPathCandidates].sort((a, b) => b.href.length - a.href.length);
  const hit = sorted.find((c) => {
    const nh = c.href.replace(/\/$/, '') || '/';
    if (nh === '/client')
      return normalizedPath === '/client' || normalizedPath.startsWith('/client/');
    if (nh === '/orders')
      return normalizedPath === '/orders' || normalizedPath.startsWith('/orders/');
    if (nh === '/wallet')
      return normalizedPath === '/wallet' || normalizedPath.startsWith('/wallet/');
    if (nh === '/academy')
      return normalizedPath === '/academy' || normalizedPath.startsWith('/academy/');
    return normalizedPath === nh || normalizedPath.startsWith(`${nh}/`);
  });
  if (hit) return clientMainNavLabelByValue[hit.value] ?? hit.label;
  return 'Главная';
}
