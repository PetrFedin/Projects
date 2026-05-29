import { isPublicShellPathname } from '@/lib/layout/public-shell-route';

/**
 * RouteGuard pulls `useAuth` + RBAC tables — skip on public retail shell where guard is a no-op.
 * Cabinets and cross-cabinet inventory paths still mount RouteGuard (see route-guard.tsx).
 */
export function shouldMountRouteGuard(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (pathname.startsWith('/embed/runway')) return false;
  return !isPublicShellPathname(pathname);
}
