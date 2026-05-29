/**
 * Маршруты с собственным cabinet chrome — без global Header/Footer и B2C overlay.
 * Префиксы дублируют `ROUTES.*.home` / `ROUTES.academyPlatform` — без импорта `@/lib/routes`
 * (dev-perf: layout gates typecheck не тянет workshop2 через routes.ts).
 */
/** Префиксы path; `/brand` — весь хаб (`/brand/profile` уже внутри). */
export const CABINET_PATH_PREFIXES = [
  '/brand',
  '/admin',
  '/shop',
  '/factory',
  '/distributor',
  '/client',
  '/orders',
  '/academy',
  '/wallet',
] as const;

export function isCabinetPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return CABINET_PATH_PREFIXES.some((prefix) => {
    const root = prefix.replace(/\/$/, '') || '/';
    return normalized === root || normalized.startsWith(`${root}/`);
  });
}
