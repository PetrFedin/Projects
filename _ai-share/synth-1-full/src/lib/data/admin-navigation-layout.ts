'use client';

/**
 * Лёгкие хелперы admin layout — breadcrumbs без admin-navigation-data (lucide).
 */
import { ADMIN_HOME, adminNavPathCandidates } from './admin-navigation-path-index';

export function getAdminGroupLabel(pathname: string): string {
  const hit = resolveAdminNavHit(pathname);
  return hit?.groupLabel ?? 'Контроль';
}

export function getAdminActiveLinkLabel(pathname: string): string | undefined {
  return resolveAdminNavHit(pathname)?.label;
}

function resolveAdminNavHit(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const sorted = [...adminNavPathCandidates].sort((a, b) => b.href.length - a.href.length);
  return sorted.find((c) => {
    const nh = c.href.replace(/\/$/, '') || '/';
    if (nh === ADMIN_HOME.replace(/\/$/, '') || nh === '/admin') {
      return normalizedPath === ADMIN_HOME.replace(/\/$/, '') || normalizedPath === '/admin';
    }
    return normalizedPath === nh || normalizedPath.startsWith(`${nh}/`);
  });
}
