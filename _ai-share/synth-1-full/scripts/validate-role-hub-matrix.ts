/**
 * Проверяет: каждая строка в ROLE_HUB_MATRIX.clustersByRole[role] входит в
 * CABINET_SIDEBAR_CLUSTERS_FULL[role] (имена кластеров = канон сайдбара).
 *
 * Семантику «area ↔ сценарий» и nav-details (тема+роль) скрипт не проверяет — только строковое
 * членство кластеров. Запуск: npm run validate:role-hub-matrix
 */
import {
  CABINET_SIDEBAR_CLUSTERS_FULL,
  ROLE_HUB_MATRIX,
  type RoleHubId,
} from '../src/lib/data/role-hub-matrix';

const ROLES: RoleHubId[] = [
  'admin',
  'brand',
  'shop',
  'distributor',
  'manufacturer',
  'supplier',
];

function main(): void {
  const errors: string[] = [];
  for (const row of ROLE_HUB_MATRIX) {
    for (const roleId of ROLES) {
      const clusters = row.clustersByRole[roleId];
      const allowed = new Set(CABINET_SIDEBAR_CLUSTERS_FULL[roleId]);
      for (const c of clusters) {
        if (!allowed.has(c)) {
          errors.push(`${row.id} [${roleId}]: кластер "${c}" отсутствует в CABINET_SIDEBAR_CLUSTERS_FULL`);
        }
      }
    }
  }
  if (errors.length) {
    console.error('validate-role-hub-matrix: FAIL\n');
    for (const e of errors) console.error(e);
    process.exit(1);
  }
  console.log(
    `validate-role-hub-matrix: OK (${ROLE_HUB_MATRIX.length} строк × роли, все кластеры из канона сайдбара).`
  );
}

main();
