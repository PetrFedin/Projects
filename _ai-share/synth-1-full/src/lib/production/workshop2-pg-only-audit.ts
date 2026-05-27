/**
 * Wave 8 P0: аудит read/write путей Workshop2 при WORKSHOP2_PG_ONLY — без silent localStorage primary write.
 */
import {
  evaluateWorkshop2HubInventoryMirrorPersistOutcome,
  isWorkshop2PgOnlyMode,
  shouldWorkshop2PgOnlySkipFileFallback,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import { shouldWorkshop2HubSkipLocalPrimaryWrite } from '@/lib/production/workshop2-hub-dossier-map';

export type Workshop2PgOnlyAuditSurface =
  | 'hub_list'
  | 'references'
  | 'setup'
  | 'inspector'
  | 'showroom'
  | 'purchase_orders';

export type Workshop2PgOnlyPathAudit = {
  surface: Workshop2PgOnlyAuditSurface;
  labelRu: string;
  readPrimary: 'postgres' | 'postgres_with_ls_read_on_miss' | 'api_route';
  writePrimary: 'postgres_fail_closed' | 'postgres_api_only';
  localStorageRole:
    | 'read_on_miss_cache_only'
    | 'last_read_markers_only'
    | 'forbidden_primary_write';
  apiRoutes: readonly string[];
  clientModules: readonly string[];
};

/** Каталог путей Wave 8 — контракт для регрессионных тестов и investor probes. */
export function buildWorkshop2PgOnlyAuditCatalog(): Workshop2PgOnlyPathAudit[] {
  return [
    {
      surface: 'hub_list',
      labelRu: 'Хаб коллекций / карточки артикулов',
      readPrimary: 'postgres_with_ls_read_on_miss',
      writePrimary: 'postgres_fail_closed',
      localStorageRole: 'read_on_miss_cache_only',
      apiRoutes: [
        '/api/workshop2/articles/[collectionId]/[articleId]/dossier',
        '/api/workshop2/articles/sku-availability',
      ],
      clientModules: ['workshop2-hub-dossier-map.ts', 'Workshop2ArticleFlatHub.tsx'],
    },
    {
      surface: 'references',
      labelRu: 'Справочники setup / references',
      readPrimary: 'api_route',
      writePrimary: 'postgres_api_only',
      localStorageRole: 'forbidden_primary_write',
      apiRoutes: [
        '/api/workshop2/references/pom-templates',
        '/api/workshop2/references/suppliers',
        '/api/workshop2/references/colors',
      ],
      clientModules: ['workshop2-api-client.ts'],
    },
    {
      surface: 'setup',
      labelRu: 'Setup health / onboarding mirror',
      readPrimary: 'postgres_with_ls_read_on_miss',
      writePrimary: 'postgres_fail_closed',
      localStorageRole: 'read_on_miss_cache_only',
      apiRoutes: ['/api/workshop2/articles/[collectionId]/[articleId]/dossier'],
      clientModules: [
        'workshop2-hub-onboarding-dossier-persist.ts',
        'workshop2-hub-pg-only-policy.ts',
      ],
    },
    {
      surface: 'inspector',
      labelRu: 'Мобильный инспектор (QC checklist)',
      readPrimary: 'api_route',
      writePrimary: 'postgres_api_only',
      localStorageRole: 'read_on_miss_cache_only',
      apiRoutes: ['/api/workshop2/articles/[collectionId]/[articleId]/inspector-report/[orderId]'],
      clientModules: ['workshop2-inspector-report-client.ts'],
    },
    {
      surface: 'showroom',
      labelRu: 'Showroom publish / linesheet',
      readPrimary: 'api_route',
      writePrimary: 'postgres_api_only',
      localStorageRole: 'forbidden_primary_write',
      apiRoutes: [
        '/api/workshop2/articles/[collectionId]/[articleId]/showroom',
        '/api/workshop2/articles/[collectionId]/[articleId]/showroom/linesheet',
      ],
      clientModules: ['workshop2-showroom-publish-gate.ts'],
    },
    {
      surface: 'purchase_orders',
      labelRu: 'Purchase orders + ERP mirror',
      readPrimary: 'api_route',
      writePrimary: 'postgres_api_only',
      localStorageRole: 'forbidden_primary_write',
      apiRoutes: [
        '/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders',
        '/api/workshop2/articles/[collectionId]/[articleId]/purchase-orders/erp-mirror-sync',
      ],
      clientModules: ['workshop2-purchase-orders.ts'],
    },
  ];
}

export type Workshop2PgOnlyAuditCompliance = {
  pgOnlyEnabled: boolean;
  compliant: boolean;
  violations: string[];
  surfaces: Workshop2PgOnlyAuditSurface[];
  catalogCount: number;
};

/** Проверка инвариантов PG-only без обращения к браузеру. */
export function evaluateWorkshop2PgOnlyAuditCompliance(
  env?: Record<string, string | undefined>
): Workshop2PgOnlyAuditCompliance {
  const pgOnlyEnabled = isWorkshop2PgOnlyMode(env);
  const violations: string[] = [];
  const catalog = buildWorkshop2PgOnlyAuditCatalog();

  if (pgOnlyEnabled) {
    if (!shouldWorkshop2PgOnlySkipFileFallback(env)) {
      violations.push('shouldWorkshop2PgOnlySkipFileFallback=false при PG-only');
    }
    if (!shouldWorkshop2HubSkipLocalPrimaryWrite()) {
      violations.push('shouldWorkshop2HubSkipLocalPrimaryWrite=false при PG-only');
    }
    const invOutcome = evaluateWorkshop2HubInventoryMirrorPersistOutcome({
      backendStatus: 'server',
      apiOk: false,
      apiReason: 'postgres_disabled',
    });
    if (invOutcome.silentLocalSuccess) {
      violations.push('inventory mirror допускает silentLocalSuccess при PG-only');
    }
    for (const row of catalog) {
      if (
        row.localStorageRole === 'forbidden_primary_write' &&
        row.writePrimary !== 'postgres_api_only'
      ) {
        violations.push(`${row.surface}: writePrimary должен быть postgres_api_only`);
      }
    }
  }

  return {
    pgOnlyEnabled,
    compliant: violations.length === 0,
    violations,
    surfaces: catalog.map((c) => c.surface),
    catalogCount: catalog.length,
  };
}

export function summarizeWorkshop2PgOnlyAuditHintRu(
  compliance: Workshop2PgOnlyAuditCompliance
): string {
  if (!compliance.pgOnlyEnabled) {
    return 'PG-only выключен — localStorage primary write разрешён для offline dev.';
  }
  if (compliance.compliant) {
    return `PG-only audit OK: ${compliance.catalogCount} поверхностей без silent LS primary write.`;
  }
  return `PG-only audit: ${compliance.violations.length} нарушений — ${compliance.violations.join('; ')}`;
}
