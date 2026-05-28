/**
 * Проверяет: каждый id из `*_CORE_GROUP_ORDER` в syntha-nav-clusters представлен
 * в соответствующем массиве навигации с `clusterId: 'syntha-cores'`.
 * Иначе HubSidebar сортирует по порядку, но группа отсутствует — «дырявое» ядро.
 *
 * Запуск: npm run validate:syntha-core-groups
 */
import {
  BRAND_CORE_GROUP_ORDER,
  DISTRIBUTOR_CORE_GROUP_ORDER,
  FACTORY_MFR_CORE_GROUP_ORDER,
  FACTORY_SUP_CORE_GROUP_ORDER,
  SHOP_CORE_GROUP_ORDER,
} from '../src/lib/data/syntha-nav-clusters';
import { brandNavGroups } from '../src/lib/data/brand-navigation';
import { shopNavGroups } from '../src/lib/data/shop-navigation-normalized';
import { distributorNavGroups } from '../src/lib/data/distributor-navigation';
import { manufacturerNavGroups, supplierNavGroups } from '../src/lib/data/factory-navigation';

type NavGroup = { id: string; clusterId?: string };

function collectSynthaCoreIds(groups: NavGroup[]): Set<string> {
  return new Set(
    groups.filter((g) => g.clusterId === 'syntha-cores').map((g) => g.id)
  );
}

function validateProfile(
  label: string,
  order: readonly string[],
  groups: NavGroup[]
): string[] {
  const coreIds = collectSynthaCoreIds(groups);
  const errors: string[] = [];
  for (const id of order) {
    if (!coreIds.has(id)) {
      errors.push(
        `${label}: в навигации нет группы id="${id}" с clusterId syntha-cores (ожидается по ${label}_CORE_GROUP_ORDER)`
      );
    }
  }
  return errors;
}

function main(): void {
  const errors: string[] = [
    ...validateProfile('BRAND', BRAND_CORE_GROUP_ORDER, brandNavGroups as NavGroup[]),
    ...validateProfile('SHOP', SHOP_CORE_GROUP_ORDER, shopNavGroups as NavGroup[]),
    ...validateProfile('DISTRIBUTOR', DISTRIBUTOR_CORE_GROUP_ORDER, distributorNavGroups as NavGroup[]),
    ...validateProfile('MANUFACTURER', FACTORY_MFR_CORE_GROUP_ORDER, manufacturerNavGroups as NavGroup[]),
    ...validateProfile('SUPPLIER', FACTORY_SUP_CORE_GROUP_ORDER, supplierNavGroups as NavGroup[]),
  ];

  if (errors.length) {
    console.error('validate-syntha-core-groups: FAIL\n');
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(
    'validate-syntha-core-groups: OK (все id из *_CORE_GROUP_ORDER есть в syntha-cores).'
  );
}

main();
