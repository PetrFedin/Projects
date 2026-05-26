import { isCabinetPathname } from '@/lib/layout/cabinet-route-match';

/** Mount NuqsAdapter только на public shell (не cabinet, не embed runway). */
export function shouldMountNuqsProvider(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  if (pathname.startsWith('/embed/runway')) return false;
  return !isCabinetPathname(pathname);
}
