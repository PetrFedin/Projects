/**
 * Проверяет, что у shop / distributor / manufacturer / supplier есть ровно одна группа
 * верхнего уровня с id `comms` (Связь: сообщения + календарь) — см. CROSS_ROLE_FLOWS.md.
 * Запуск: npm run validate:comms-group-ids
 */
import { shopNavGroups } from '../src/lib/data/shop-navigation-normalized';
import { distributorNavGroups } from '../src/lib/data/distributor-navigation';
import { manufacturerNavGroups, supplierNavGroups } from '../src/lib/data/factory-navigation';

type NavGroup = { id: string; clusterId?: string };

function countCommsCore(groups: NavGroup[]): number {
  return groups.filter((g) => g.id === 'comms' && g.clusterId === 'syntha-cores').length;
}

function main(): void {
  const checks: { name: string; count: number }[] = [
    { name: 'shop', count: countCommsCore(shopNavGroups as NavGroup[]) },
    { name: 'distributor', count: countCommsCore(distributorNavGroups as NavGroup[]) },
    { name: 'manufacturer', count: countCommsCore(manufacturerNavGroups as NavGroup[]) },
    { name: 'supplier', count: countCommsCore(supplierNavGroups as NavGroup[]) },
  ];

  const bad = checks.filter((c) => c.count !== 1);
  if (bad.length) {
    console.error('validate-comms-group-ids: FAIL');
    for (const b of bad) {
      console.error(`  ${b.name}: ожидалась ровно 1 группа comms в syntha-cores, найдено ${b.count}`);
    }
    process.exit(1);
  }
  console.log('validate-comms-group-ids: OK (shop, distributor, manufacturer, supplier — по одному `comms`).');
}

main();
