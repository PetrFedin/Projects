import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { BrandCrmSegmentObject, BrandCrmSegmentQuery } from '@/lib/b2b/brand-crm-segment-object';
import type { CustomerGroup } from '@/lib/b2b/customer-groups';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const DEFAULT_SEED: Omit<BrandCrmSegmentObject, 'id' | 'updatedAt'>[] = [
  {
    segmentKey: 'retail',
    nameRu: 'Розница',
    customerGroupId: 'retail',
    query: { tiers: ['retail_a'], regions: ['RU-MOW', 'RU-SPB'], matchMode: 'any' },
    defaultPriceTier: 'retail_a',
    defaultNetTermDays: 14,
    firstOrderDiscountPct: 5,
    vatExempt: false,
  },
  {
    segmentKey: 'wholesale',
    nameRu: 'Опт',
    customerGroupId: 'wholesale',
    query: { minLifetimeOrderRub: 500_000, tiers: ['retail_b'] },
    defaultPriceTier: 'retail_b',
    defaultNetTermDays: 30,
    firstOrderDiscountPct: 8,
    vatExempt: false,
  },
  {
    segmentKey: 'distribution',
    nameRu: 'Дистрибуция',
    customerGroupId: 'distribution',
    query: { tags: ['distributor', 'multi-door'], minLifetimeOrderRub: 2_000_000 },
    defaultPriceTier: 'retail_b',
    defaultNetTermDays: 60,
    vatExempt: true,
  },
  {
    segmentKey: 'franchise',
    nameRu: 'Франшиза',
    customerGroupId: 'franchise',
    query: { tags: ['franchise'], regions: ['RU-KZ'] },
    defaultPriceTier: 'retail_a',
    defaultNetTermDays: 30,
    firstOrderDiscountPct: 10,
    vatExempt: true,
  },
];

const memoryRows = new Map<string, BrandCrmSegmentObject>();
const STORE_FILE = path.join(process.cwd(), 'data', 'brand-crm-segments.json');
let fileHydrated = false;

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test';
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) as BrandCrmSegmentObject[];
    if (Array.isArray(parsed)) {
      for (const row of parsed) memoryRows.set(row.segmentKey, row);
    }
  } catch {
    /* ignore */
  }
}

function persistFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify([...memoryRows.values()], null, 2));
  } catch {
    /* ignore */
  }
}

function newSegmentId(key: string): string {
  return `crm-seg-${key}`;
}

function mapPgRow(row: {
  id: string;
  segment_key: string;
  name_ru: string;
  customer_group_id: string | null;
  query: BrandCrmSegmentQuery | string;
  default_price_tier: string;
  default_net_term_days: number;
  first_order_discount_pct: string | number | null;
  vat_exempt: boolean;
  updated_at: Date;
}): BrandCrmSegmentObject {
  const queryRaw = row.query;
  const query =
    typeof queryRaw === 'string'
      ? (JSON.parse(queryRaw) as BrandCrmSegmentQuery)
      : (queryRaw ?? {});
  return {
    id: row.id,
    segmentKey: row.segment_key,
    nameRu: row.name_ru,
    customerGroupId: row.customer_group_id ?? undefined,
    query,
    defaultPriceTier: row.default_price_tier,
    defaultNetTermDays: row.default_net_term_days,
    firstOrderDiscountPct:
      row.first_order_discount_pct != null ? Number(row.first_order_discount_pct) : undefined,
    vatExempt: row.vat_exempt,
    updatedAt: row.updated_at.toISOString(),
  };
}

async function seedDefaultsPg(org: string): Promise<void> {
  if (!isWorkshop2PostgresEnabled()) return;
  await ensureWorkshop2PgSchema();
  for (const seed of DEFAULT_SEED) {
    await getWorkshop2PgPool().query(
      `INSERT INTO brand_crm_segments
         (id, organization_id, segment_key, name_ru, customer_group_id, query,
          default_price_tier, default_net_term_days, first_order_discount_pct, vat_exempt)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10)
       ON CONFLICT (organization_id, segment_key) DO NOTHING`,
      [
        newSegmentId(seed.segmentKey),
        org,
        seed.segmentKey,
        seed.nameRu,
        seed.customerGroupId ?? null,
        JSON.stringify(seed.query),
        seed.defaultPriceTier,
        seed.defaultNetTermDays,
        seed.firstOrderDiscountPct ?? null,
        seed.vatExempt,
      ]
    );
  }
}

function seedDefaultsMemory(): void {
  hydrateFileIfNeeded();
  if (memoryRows.size) return;
  const now = new Date().toISOString();
  for (const seed of DEFAULT_SEED) {
    memoryRows.set(seed.segmentKey, { ...seed, id: newSegmentId(seed.segmentKey), updatedAt: now });
  }
  persistFile();
}

export function clearBrandCrmSegmentsMemoryForTests(): void {
  memoryRows.clear();
  fileHydrated = false;
}

export async function listBrandCrmSegmentsServer(input?: {
  organizationId?: string;
}): Promise<{ segments: BrandCrmSegmentObject[]; storageMode: 'pg' | 'file' | 'memory' | 'demo' }> {
  const org = input?.organizationId ?? 'org-brand-001';

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    let res = await getWorkshop2PgPool().query(
      `SELECT id, segment_key, name_ru, customer_group_id, query, default_price_tier,
              default_net_term_days, first_order_discount_pct, vat_exempt, updated_at
       FROM brand_crm_segments
       WHERE organization_id = $1
       ORDER BY segment_key ASC`,
      [org]
    );
    if (!res.rows.length) {
      await seedDefaultsPg(org);
      res = await getWorkshop2PgPool().query(
        `SELECT id, segment_key, name_ru, customer_group_id, query, default_price_tier,
                default_net_term_days, first_order_discount_pct, vat_exempt, updated_at
         FROM brand_crm_segments
         WHERE organization_id = $1
         ORDER BY segment_key ASC`,
        [org]
      );
    }
    return {
      segments: res.rows.map((row) => mapPgRow(row as Parameters<typeof mapPgRow>[0])),
      storageMode: 'pg',
    };
  }

  seedDefaultsMemory();
  return {
    segments: [...memoryRows.values()].sort((a, b) => a.segmentKey.localeCompare(b.segmentKey)),
    storageMode: canUseDiskPersistence() ? 'file' : 'memory',
  };
}

export function brandCrmSegmentToCustomerGroup(segment: BrandCrmSegmentObject): CustomerGroup {
  return {
    id: (segment.customerGroupId ?? segment.segmentKey) as CustomerGroup['id'],
    name: segment.segmentKey,
    nameRu: segment.nameRu,
    defaultPriceTier: segment.defaultPriceTier,
    defaultNetTermDays: segment.defaultNetTermDays,
    firstOrderDiscountPercent: segment.firstOrderDiscountPct,
    vatExempt: segment.vatExempt,
  };
}

export async function patchBrandCrmSegmentServer(input: {
  segmentKey: string;
  defaultNetTermDays?: number;
  firstOrderDiscountPct?: number | null;
  organizationId?: string;
}): Promise<{ segment: BrandCrmSegmentObject | null; storageMode: 'pg' | 'file' | 'memory' | 'demo' }> {
  const org = input.organizationId ?? 'org-brand-001';
  const key = input.segmentKey.trim();
  const listed = await listBrandCrmSegmentsServer({ organizationId: org });
  const existing = listed.segments.find((s) => s.segmentKey === key);
  if (!existing) return { segment: null, storageMode: listed.storageMode };

  const next: BrandCrmSegmentObject = {
    ...existing,
    defaultNetTermDays:
      input.defaultNetTermDays !== undefined ? input.defaultNetTermDays : existing.defaultNetTermDays,
    firstOrderDiscountPct:
      input.firstOrderDiscountPct !== undefined
        ? input.firstOrderDiscountPct ?? undefined
        : existing.firstOrderDiscountPct,
    updatedAt: new Date().toISOString(),
  };

  if (listed.storageMode === 'pg') {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `UPDATE brand_crm_segments SET
         default_net_term_days = $3,
         first_order_discount_pct = $4,
         updated_at = NOW()
       WHERE organization_id = $1 AND segment_key = $2`,
      [org, key, next.defaultNetTermDays, next.firstOrderDiscountPct ?? null]
    );
    return { segment: next, storageMode: 'pg' };
  }

  memoryRows.set(key, next);
  persistFile();
  return {
    segment: next,
    storageMode: listed.storageMode === 'demo' ? 'memory' : listed.storageMode,
  };
}
