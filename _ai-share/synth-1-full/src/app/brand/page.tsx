import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Каноничный профиль бренда живёт в `/brand/profile` (RegistryPageShell + cabinetSurface v1).
 * Старый монолитный `/brand` дублировал экран с устаревшими классами — редирект сохраняет query (?group=&tab=).
 */
export default async function BrandIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (val === undefined) continue;
    if (Array.isArray(val)) val.forEach((v) => qs.append(key, v));
    else qs.set(key, val);
  }
  const s = qs.toString();
  redirect(s ? `/brand/profile?${s}` : '/brand/profile');
}
