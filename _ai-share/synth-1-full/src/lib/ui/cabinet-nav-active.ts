/**
 * Единая логика «текущий пункт» для сайдбара кабинетов (метка раздела + бейдж в `CabinetHubSectionBar`).
 * Поддерживает `subsections` у пунктов (shop, admin, distributor): наследуются description/icon родителя.
 */
import type { LucideIcon } from 'lucide-react';

export type CabinetNavLink = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  subsections?: { href: string; label: string }[];
};

export function normalizePath(p: string) {
  return (p || '').replace(/\/$/, '') || '/';
}

/** Путь без query — для сравнения с пунктами меню. */
function hrefPath(href: string) {
  return normalizePath((href.split('?')[0] || '').trim());
}

function flattenNavLinks<T extends CabinetNavLink>(groups: { links: T[] }[]): T[] {
  const out: T[] = [];
  for (const g of groups) {
    for (const link of g.links) {
      out.push(link);
      if (link.subsections?.length) {
        for (const sub of link.subsections) {
          out.push({
            ...link,
            href: sub.href,
            label: sub.label,
            subsections: undefined,
          } as T);
        }
      }
    }
  }
  return out;
}

/**
 * Самый длинный подходящий пункт: точное совпадение или префикс сегмента.
 * Корни хабов `/client`, `/shop`, `/admin` — только точное совпадение, без префикса на дочерние.
 */
export function resolveCabinetActiveNavLink<T extends CabinetNavLink>(
  pathname: string | null | undefined,
  groups: { links: T[] }[]
): T | undefined {
  const p = normalizePath(pathname ?? '');
  const flat = flattenNavLinks(groups);
  const sorted = [...flat].sort((a, b) => hrefPath(b.href).length - hrefPath(a.href).length);
  return sorted.find((l) => {
    const h = hrefPath(l.href);
    if (h === '/client' || h === '/shop' || h === '/admin') return p === h;
    return p === h || p.startsWith(`${h}/`);
  });
}

export function getCabinetNavSectionLabel(
  pathname: string | null | undefined,
  groups: { links: CabinetNavLink[] }[],
  fallback: string
): string {
  return resolveCabinetActiveNavLink(pathname, groups)?.label ?? fallback;
}
