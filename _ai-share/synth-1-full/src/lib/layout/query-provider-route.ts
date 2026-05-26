import { isCabinetPathname } from '@/lib/layout/cabinet-route-match';

/**
 * React Query сейчас используется только brand profile data hooks.
 * Остальные маршруты не тянут `@tanstack/react-query` chunk в dev.
 */
export function shouldMountQueryProvider(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized === '/brand' || normalized.startsWith('/brand/');
}
