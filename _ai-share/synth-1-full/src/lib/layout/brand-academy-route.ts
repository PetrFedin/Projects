/** Маршруты brand hub «Академия» — свой layout chrome, без KPI strip в шапке хаба. */
export function isBrandAcademyPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized === '/brand/academy' || normalized.startsWith('/brand/academy/');
}
