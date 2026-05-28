/**
 * Проверяет строковые href в данных навигации кабинетов: непустые, начинаются с `/`,
 * без `//` в начале (ошибочный protocol-relative).
 * Подразделы (`subsections`) учитываются.
 *
 * Запуск: npm run validate:cabinet-nav-hrefs
 */
import { shopNavGroups } from '../src/lib/data/shop-navigation-normalized';
import { brandNavGroups } from '../src/lib/data/brand-navigation';
import { distributorNavGroups } from '../src/lib/data/distributor-navigation';
import { manufacturerNavGroups, supplierNavGroups } from '../src/lib/data/factory-navigation';

type LinkLike = {
  href?: string;
  subsections?: readonly { href?: string }[];
};

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

function validateHrefs(profile: string, hrefs: string[]): string[] {
  const errors: string[] = [];
  for (const h of hrefs) {
    const t = h.trim();
    if (!t) {
      errors.push(`${profile}: пустой href`);
      continue;
    }
    if (!t.startsWith('/')) {
      errors.push(`${profile}: href не относительный путь: ${JSON.stringify(t)}`);
    }
    if (t.startsWith('//')) {
      errors.push(`${profile}: href выглядит как protocol-relative: ${JSON.stringify(t)}`);
    }
  }
  return errors;
}

function main(): void {
  const checks: { name: string; groups: readonly GroupLike[] }[] = [
    { name: 'shop', groups: shopNavGroups as readonly GroupLike[] },
    { name: 'brand', groups: brandNavGroups as readonly GroupLike[] },
    { name: 'distributor', groups: distributorNavGroups as readonly GroupLike[] },
    { name: 'manufacturer', groups: manufacturerNavGroups as readonly GroupLike[] },
    { name: 'supplier', groups: supplierNavGroups as readonly GroupLike[] },
  ];

  const errors: string[] = [];
  for (const { name, groups } of checks) {
    errors.push(...validateHrefs(name, collectHrefs(groups)));
  }

  if (errors.length) {
    console.error('validate-cabinet-nav-hrefs: FAIL\n');
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(
    `validate-cabinet-nav-hrefs: OK (${checks.length} профилей, ${checks.reduce((s, c) => s + collectHrefs(c.groups as GroupLike[]).length, 0)} href).`
  );
}

main();
