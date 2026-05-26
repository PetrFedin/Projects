import { isBrandAcademyPathname } from '@/lib/layout/brand-academy-route';

/** BrandSectionHeaderBlock не нужен на home/profile и academy (свой layout). */
export function shouldMountBrandSectionHeader(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (isBrandAcademyPathname(pathname)) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized !== '/brand' && normalized !== '/brand/profile';
}
