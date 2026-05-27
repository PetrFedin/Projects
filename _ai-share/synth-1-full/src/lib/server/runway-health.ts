import fs from 'node:fs';
import path from 'node:path';
import type { Product } from '@/lib/types';
import {
  filterScrollVideoProducts,
  validateScrollVideoContent,
} from '@/lib/product-scroll-switcher';
import { resolveRunwayDataSource } from '@/lib/runway/runway-data-source';
import {
  normalizeScrollExperienceConfig,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from '@/lib/runway/scroll-experience-schema';
import { resolveRunwayRateLimitBackend } from '@/lib/server/runway-rate-limit';

export type RunwayHealthCheckStatus = 'ok' | 'warn' | 'fail';

export interface RunwayHealthChecks {
  catalog: RunwayHealthCheckStatus;
  assets: RunwayHealthCheckStatus;
  analytics: RunwayHealthCheckStatus;
  config: RunwayHealthCheckStatus;
}

export interface RunwayHealthSnapshot {
  healthy: boolean;
  scrollVideoProductCount: number;
  assetsValid: boolean;
  assetIssueCount: number;
  analyticsStoreWritable: boolean;
  configLoaded: boolean;
  featuredProductSlug: string | null;
  dataSource: ReturnType<typeof resolveRunwayDataSource>;
  checks: RunwayHealthChecks;
  issues: string[];
  rateLimitBackend: 'memory' | 'redis';
}

function loadProductsFromDisk(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'public/data/products.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Product[];
  } catch {
    return [];
  }
}

function loadScrollExperienceConfig() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/scroll-experience.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
  } catch {
    return null;
  }
}

function resolveAnalyticsStorePath(): string {
  const fromEnv = process.env.RUNWAY_ANALYTICS_STORE_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'runway-analytics-events.json');
}

/** Проверка записи в analytics store — touch без изменения содержимого. */
export function checkRunwayAnalyticsStoreWritable(
  storePath = resolveAnalyticsStorePath()
): boolean {
  try {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    if (!fs.existsSync(storePath)) {
      fs.writeFileSync(
        storePath,
        JSON.stringify({ events: [], updatedAt: new Date().toISOString() }, null, 2),
        'utf8'
      );
    }
    fs.accessSync(storePath, fs.constants.R_OK | fs.constants.W_OK);
    const fd = fs.openSync(storePath, 'a');
    fs.closeSync(fd);
    return true;
  } catch {
    return false;
  }
}

/** Проверка локальных asset-путей scroll-video секций (public/). */
export function validateRunwayAssetsOnDisk(products: Product[]): {
  assetsValid: boolean;
  assetIssueCount: number;
  issues: string[];
} {
  const scrollProducts = filterScrollVideoProducts(products);
  const issues: string[] = [];

  for (const product of scrollProducts) {
    for (const msg of validateScrollVideoContent(product)) {
      issues.push(msg);
    }
  }

  return {
    assetsValid: issues.length === 0,
    assetIssueCount: issues.length,
    issues,
  };
}

/** Агрегированный health runway для GET /api/runway/health. */
export function evaluateRunwayHealth(options?: {
  products?: Product[];
  analyticsStoreWritable?: boolean;
  config?: ReturnType<typeof loadScrollExperienceConfig>;
}): RunwayHealthSnapshot {
  const products = options?.products ?? loadProductsFromDisk();
  const scrollProducts = filterScrollVideoProducts(products);
  const assetReport = validateRunwayAssetsOnDisk(products);
  const config = options?.config !== undefined ? options.config : loadScrollExperienceConfig();
  const analyticsStoreWritable =
    options?.analyticsStoreWritable ?? checkRunwayAnalyticsStoreWritable();

  const checks: RunwayHealthChecks = {
    catalog: scrollProducts.length > 0 ? 'ok' : 'fail',
    assets: assetReport.assetsValid ? 'ok' : scrollProducts.length > 0 ? 'warn' : 'fail',
    analytics: analyticsStoreWritable ? 'ok' : 'fail',
    config: config ? 'ok' : 'fail',
  };

  const healthy =
    checks.catalog === 'ok' &&
    checks.analytics === 'ok' &&
    checks.config === 'ok' &&
    assetReport.assetsValid;

  return {
    healthy,
    scrollVideoProductCount: scrollProducts.length,
    assetsValid: assetReport.assetsValid,
    assetIssueCount: assetReport.assetIssueCount,
    analyticsStoreWritable,
    configLoaded: config != null,
    featuredProductSlug: config?.featuredProductSlug ?? null,
    dataSource: resolveRunwayDataSource(),
    checks,
    issues: assetReport.issues.slice(0, 20),
    rateLimitBackend: resolveRunwayRateLimitBackend(),
  };
}
