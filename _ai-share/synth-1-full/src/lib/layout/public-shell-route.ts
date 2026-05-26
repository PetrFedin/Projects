import { isCabinetPathname } from '@/lib/layout/cabinet-route-match';

/** Public retail shell (не cabinet, не embed runway) — для lazy chrome / analytics. */
export function isPublicShellPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  if (pathname.startsWith('/embed/runway')) return false;
  return !isCabinetPathname(pathname);
}
