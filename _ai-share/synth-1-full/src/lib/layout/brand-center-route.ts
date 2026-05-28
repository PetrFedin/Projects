/** Brand center state (recent/favorites) — только кабинет бренда. */
export function shouldMountBrandCenterProvider(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === '/brand' || pathname.startsWith('/brand/');
}
