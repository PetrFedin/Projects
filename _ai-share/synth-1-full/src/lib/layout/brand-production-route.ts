/** Маршруты brand hub, где нужен ProductionDataPort / production chrome. */
export function isBrandProductionPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized === '/brand/production' || normalized.startsWith('/brand/production/');
}
