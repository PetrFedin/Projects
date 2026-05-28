/**
 * Опционально: проверяет, что pathname каждого href навигации кабинетов входит в множество
 * путей из `ROUTES` (рекурсивный обход объекта). Query/hash игнорируются.
 *
 * Не входит в `validate:cabinet-nav` по умолчанию — из‑за легитимных путей с `?group=`,
 * динамических сегментов и черновых страниц. Запуск вручную:
 *   npm run validate:cabinet-nav-routes
 *
 * При необходимости расширьте `ALLOWLIST_PREFIXES` или сгенерируйте полный список путей codegen‑ом.
 */
import { ROUTES } from '../src/lib/routes';
import { shopNavGroups } from '../src/lib/data/shop-navigation-normalized';
import { brandNavGroups } from '../src/lib/data/brand-navigation';
import { distributorNavGroups } from '../src/lib/data/distributor-navigation';
import { manufacturerNavGroups, supplierNavGroups } from '../src/lib/data/factory-navigation';

const ALLOWLIST_PREFIXES = [
  '/brand?',
  '/shop?',
  '/client?',
  '/factory?',
  '/distributor?',
  '/supplier?',
  '/admin?',
] as const;

function flattenRoutes(obj: unknown, out: Set<string>): void {
  if (typeof obj === 'string') {
    try {
      const u = new URL(obj, 'http://local');
      out.add(u.pathname);
    } catch {
      if (obj.startsWith('/')) out.add(obj.split('?')[0].split('#')[0]);
    }
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj as Record<string, unknown>)) {
      flattenRoutes(v, out);
    }
  }
}

type LinkLike = { href?: string; subsections?: readonly { href?: string }[] };
type GroupLike = { id: string; links: readonly LinkLike[] };

function collectHrefs(groups: readonly GroupLike[]): string[] {
  const out: string[] = [];
  for (const g of groups) {
    for (const l of g.links) {
      if (typeof l.href === 'string') out.push(l.href);
      if (Array.isArray(l.subsections)) {
        for (const s of l.subsections) {
          if (typeof s.href === 'string') out.push(s.href);
        }
      }
    }
  }
  return out;
}

function pathnameOnly(href: string): string {
  const q = href.indexOf('?');
  const h = href.indexOf('#');
  const cut = [q >= 0 ? q : href.length, h >= 0 ? h : href.length].reduce((a, b) => Math.min(a, b));
  return href.slice(0, cut);
}

function main(): void {
  const routePaths = new Set<string>();
  flattenRoutes(ROUTES, routePaths);
  // Функции в ROUTES (динамические сегменты) — типовые slug из навигации / данных
  if (typeof ROUTES.shop?.b2bBudgetSeason === 'function') {
    for (const slug of ['FW26', 'SS27']) {
      routePaths.add(pathnameOnly(ROUTES.shop.b2bBudgetSeason(slug)));
    }
  }

  const checks: { name: string; groups: readonly GroupLike[] }[] = [
    { name: 'shop', groups: shopNavGroups as readonly GroupLike[] },
    { name: 'brand', groups: brandNavGroups as readonly GroupLike[] },
    { name: 'distributor', groups: distributorNavGroups as readonly GroupLike[] },
    { name: 'manufacturer', groups: manufacturerNavGroups as readonly GroupLike[] },
    { name: 'supplier', groups: supplierNavGroups as readonly GroupLike[] },
  ];

  const errors: string[] = [];
  for (const { name, groups } of checks) {
    for (const raw of collectHrefs(groups)) {
      const path = pathnameOnly(raw);
      if (!path.startsWith('/')) {
        errors.push(`${name}: не относительный путь: ${JSON.stringify(raw)}`);
        continue;
      }
      if (routePaths.has(path)) continue;
      const allowlisted = ALLOWLIST_PREFIXES.some((p) => raw.startsWith(p));
      if (allowlisted) continue;
      errors.push(`${name}: href pathname не найден в ROUTES: ${path} (из ${JSON.stringify(raw)})`);
    }
  }

  if (errors.length) {
    console.error('validate-cabinet-nav-routes: FAIL (опциональная проверка)\n');
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(
    `validate-cabinet-nav-routes: OK (${routePaths.size} путей из ROUTES, ${checks.length} профилей навигации).`
  );
}

main();
