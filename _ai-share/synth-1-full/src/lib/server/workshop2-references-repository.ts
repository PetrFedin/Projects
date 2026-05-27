import 'server-only';
import { getWorkshop2ColorMasterPalette } from '@/lib/production/workshop2-color-master';
import {
  bustWorkshop2ReferencesCache,
  getWorkshop2ReferencesCached,
  setWorkshop2ReferencesCached,
} from '@/lib/server/workshop2-references-cache';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { getResolvedLeafProductionProfile } from '@/lib/production/category-leaf-production';
import {
  getWorkshop2MaterialsLibrarySeed,
  getWorkshop2PomTemplatesForLeaf,
  type Workshop2MaterialLibraryRow,
  type Workshop2PomTemplateRow,
} from '@/lib/production/workshop2-reference-seeds';
import {
  getWorkshop2SuppliersSeed,
  type Workshop2SupplierRow,
} from '@/lib/production/workshop2-suppliers-seed';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { isWorkshop2PostgresEnabled, getWorkshop2PgPool } from '@/lib/server/workshop2-pg-pool';
import { getHandbookCategoryLeaves } from '@/lib/production/category-handbook-leaves';
import { getAttributeCatalog } from '@/lib/production/attribute-catalog';
import {
  buildWorkshop2SizeScalePgRowsFromReport,
  validateWorkshop2SizeScaleCsv,
  type Workshop2SizeScaleImportReport,
} from '@/lib/server/workshop2-size-scales-import';

export type Workshop2RefColorRow = {
  code: string;
  name: string;
  hex: string;
  pantone?: string;
};

export type Workshop2RefTnvedRow = {
  code: string;
  label: string;
  leafId?: string;
  chapterHint?: string;
};

export type Workshop2ReferencesSource = 'postgres' | 'static';

function staticColors(): Workshop2RefColorRow[] {
  return getWorkshop2ColorMasterPalette().map((c) => ({
    code: c.code,
    name: c.name,
    hex: c.hex,
    ...(c.pantone ? { pantone: c.pantone } : {}),
  }));
}

function loadTnvedSeedRows(): Workshop2RefTnvedRow[] {
  try {
    const fs = require('node:fs') as typeof import('node:fs');
    const path = require('node:path') as typeof import('node:path');
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'data/workshop2/tnved-codes.seed.json'),
      'utf8'
    );
    const seed = JSON.parse(raw) as {
      codes?: { code: string; description: string; chapter?: string; leafId?: string | null }[];
    };
    return (seed.codes ?? []).map((c) => ({
      code: c.code.replace(/\D/g, '').slice(0, 10),
      label: `${c.code} — ${c.description}`,
      ...(c.leafId ? { leafId: c.leafId } : {}),
      ...(c.chapter ? { chapterHint: c.chapter } : {}),
    }));
  } catch {
    return [];
  }
}

function staticTnvedForLeaf(leafId: string | undefined): Workshop2RefTnvedRow[] {
  const out: Workshop2RefTnvedRow[] = [];
  const seen = new Set<string>();
  const push = (code: string, label: string, meta?: { leafId?: string; chapterHint?: string }) => {
    const c = code.replace(/\D/g, '').slice(0, 10);
    if (c.length < 4 || seen.has(c)) return;
    seen.add(c);
    out.push({ code: c, label, ...meta });
  };
  for (const row of loadTnvedSeedRows()) {
    if (!leafId || !row.leafId || row.leafId === leafId) push(row.code, row.label, row);
  }
  if (leafId) {
    const leaf = findHandbookLeafById(leafId);
    if (leaf) {
      const profile = getResolvedLeafProductionProfile(leaf);
      const chapter = profile.externalClassifiers?.tnvedEaEuChapterHint;
      for (const hint of profile.externalClassifiers?.tnvedEaEuCodeHints ?? []) {
        const digits = hint.replace(/\D/g, '');
        const code =
          digits.length >= 10 ? digits.slice(0, 10) : `${digits.padEnd(4, '0')}000000`.slice(0, 10);
        push(code, `${code} (${leaf.l3Name})`, { leafId, chapterHint: chapter });
      }
    }
  }
  if (!out.length) {
    push('6202110000', '6202.11.000.0 — пальто шерстяные');
    push('6109100000', '6109.10.000.0 — футболки хлопок');
    push('6404110000', '6404.11.000.0 — обувь текстильная');
  }
  return out;
}

export async function listWorkshop2RefColors(seasonId = 'SS27'): Promise<{
  source: Workshop2ReferencesSource;
  items: Workshop2RefColorRow[];
}> {
  const cacheKey = `colors:${seasonId}`;
  const cached = getWorkshop2ReferencesCached<{
    source: Workshop2ReferencesSource;
    items: Workshop2RefColorRow[];
  }>(cacheKey);
  if (cached) return cached;

  if (!isWorkshop2PostgresEnabled()) {
    const payload = { source: 'static' as const, items: staticColors() };
    setWorkshop2ReferencesCached(cacheKey, payload);
    return payload;
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      code: string;
      name: string;
      hex: string;
      pantone: string | null;
    }>(
      `SELECT code, name, hex, pantone FROM workshop2_colors
       WHERE season_id = $1 ORDER BY code`,
      [seasonId]
    );
    if (res.rowCount && res.rowCount > 0) {
      const payload = {
        source: 'postgres' as const,
        items: res.rows.map((r) => ({
          code: r.code,
          name: r.name,
          hex: r.hex,
          ...(r.pantone ? { pantone: r.pantone } : {}),
        })),
      };
      setWorkshop2ReferencesCached(cacheKey, payload);
      return payload;
    }
  } catch {
    /* fallback */
  }
  const payload = { source: 'static' as const, items: staticColors() };
  setWorkshop2ReferencesCached(cacheKey, payload);
  return payload;
}

export async function listWorkshop2RefTnved(leafId?: string): Promise<{
  source: Workshop2ReferencesSource;
  leafId?: string;
  items: Workshop2RefTnvedRow[];
}> {
  const lid = leafId?.trim() || undefined;
  if (!isWorkshop2PostgresEnabled()) {
    return { source: 'static', ...(lid ? { leafId: lid } : {}), items: staticTnvedForLeaf(lid) };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = lid
      ? await getWorkshop2PgPool().query<{
          code: string;
          description: string;
          leaf_id: string | null;
          chapter: string | null;
        }>(
          `SELECT code, description, leaf_id, chapter FROM workshop2_tnved_codes
           WHERE leaf_id = $1 OR leaf_id IS NULL
           ORDER BY code`,
          [lid]
        )
      : await getWorkshop2PgPool().query<{
          code: string;
          description: string;
          leaf_id: string | null;
          chapter: string | null;
        }>(`SELECT code, description, leaf_id, chapter FROM workshop2_tnved_codes ORDER BY code`);
    if (res.rowCount && res.rowCount > 0) {
      return {
        source: 'postgres',
        ...(lid ? { leafId: lid } : {}),
        items: res.rows.map((r) => ({
          code: r.code.replace(/\D/g, '').slice(0, 10),
          label: `${r.code} — ${r.description}`,
          ...(r.leaf_id ? { leafId: r.leaf_id } : {}),
          ...(r.chapter ? { chapterHint: r.chapter } : {}),
        })),
      };
    }
  } catch {
    /* fallback */
  }
  return { source: 'static', ...(lid ? { leafId: lid } : {}), items: staticTnvedForLeaf(lid) };
}

function parseMaterialMetadata(
  metadata: Record<string, unknown> | null | undefined
): Pick<Workshop2MaterialLibraryRow, 'priceUsd' | 'certCode' | 'supplierSku'> {
  if (!metadata || typeof metadata !== 'object') return {};
  const priceRaw = metadata.priceUsd ?? metadata.price_usd;
  const priceUsd =
    typeof priceRaw === 'number' && Number.isFinite(priceRaw)
      ? priceRaw
      : typeof priceRaw === 'string' && priceRaw.trim()
        ? Number(priceRaw)
        : undefined;
  const certRaw = metadata.certCode ?? metadata.cert_code;
  const certCode = typeof certRaw === 'string' && certRaw.trim() ? certRaw.trim() : undefined;
  const skuRaw = metadata.supplierSku ?? metadata.supplier_sku;
  const supplierSku = typeof skuRaw === 'string' && skuRaw.trim() ? skuRaw.trim() : undefined;
  return {
    ...(typeof priceUsd === 'number' && Number.isFinite(priceUsd) ? { priceUsd } : {}),
    ...(certCode ? { certCode } : {}),
    ...(supplierSku ? { supplierSku } : {}),
  };
}

function mapWorkshop2MaterialPgRow(r: {
  id: string;
  name: string;
  role: string;
  supplier: string | null;
  composition: string | null;
  gsm: number | null;
  metadata?: Record<string, unknown> | null;
}): Workshop2MaterialLibraryRow {
  const seed = getWorkshop2MaterialsLibrarySeed().find((m) => m.id === r.id);
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    ...(r.supplier ? { supplier: r.supplier } : {}),
    ...(r.composition ? { composition: r.composition } : {}),
    ...(r.gsm != null ? { gsm: r.gsm } : {}),
    ...(seed?.supplierSku ? { supplierSku: seed.supplierSku } : {}),
    ...parseMaterialMetadata(r.metadata ?? null),
  };
}

export async function listWorkshop2RefMaterials(): Promise<{
  source: Workshop2ReferencesSource;
  items: Workshop2MaterialLibraryRow[];
}> {
  if (!isWorkshop2PostgresEnabled()) {
    return { source: 'static', items: getWorkshop2MaterialsLibrarySeed() };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      id: string;
      name: string;
      role: string;
      supplier: string | null;
      composition: string | null;
      gsm: number | null;
      metadata: Record<string, unknown> | null;
    }>(
      `SELECT id, name, role, supplier, composition, gsm, metadata
       FROM workshop2_materials_library ORDER BY name`
    );
    if (res.rowCount && res.rowCount > 0) {
      return {
        source: 'postgres',
        items: res.rows.map((r) => mapWorkshop2MaterialPgRow(r)),
      };
    }
  } catch {
    /* fallback */
  }
  return { source: 'static', items: getWorkshop2MaterialsLibrarySeed() };
}

export async function listWorkshop2RefPomTemplates(leafId?: string): Promise<{
  source: Workshop2ReferencesSource;
  leafId?: string;
  items: Workshop2PomTemplateRow[];
}> {
  const lid = leafId?.trim() || undefined;
  if (!isWorkshop2PostgresEnabled()) {
    const items = lid ? getWorkshop2PomTemplatesForLeaf(lid) : [];
    return { source: 'static', ...(lid ? { leafId: lid } : {}), items };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = lid
      ? await getWorkshop2PgPool().query<{
          leaf_id: string;
          label: string;
          dimension_labels: string[];
        }>(
          `SELECT leaf_id, label, dimension_labels FROM workshop2_pom_templates WHERE leaf_id = $1`,
          [lid]
        )
      : await getWorkshop2PgPool().query<{
          leaf_id: string;
          label: string;
          dimension_labels: string[];
        }>(`SELECT leaf_id, label, dimension_labels FROM workshop2_pom_templates`);
    if (res.rowCount && res.rowCount > 0) {
      return {
        source: 'postgres',
        ...(lid ? { leafId: lid } : {}),
        items: res.rows.map((r) => ({
          leafId: r.leaf_id,
          label: r.label,
          dimensionLabels: Array.isArray(r.dimension_labels) ? r.dimension_labels : [],
        })),
      };
    }
  } catch {
    /* fallback */
  }
  const items = lid ? getWorkshop2PomTemplatesForLeaf(lid) : [];
  return { source: 'static', ...(lid ? { leafId: lid } : {}), items };
}

export async function upsertWorkshop2RefMaterial(input: {
  id: string;
  name: string;
  role: string;
  supplier?: string;
  supplierSku?: string;
  composition?: string;
  gsm?: number;
  priceUsd?: number;
  certCode?: string;
}): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'db_error' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const id = input.id.trim();
  const name = input.name.trim();
  const role = input.role.trim();
  if (!id || !name || !role) return { ok: false, reason: 'db_error' };
  try {
    await ensureWorkshop2PgSchema();
    const metadata: Record<string, unknown> = {};
    if (typeof input.priceUsd === 'number' && Number.isFinite(input.priceUsd)) {
      metadata.priceUsd = input.priceUsd;
    }
    if (input.certCode?.trim()) metadata.certCode = input.certCode.trim();
    if (input.supplierSku?.trim()) metadata.supplierSku = input.supplierSku.trim();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_materials_library (id, name, role, supplier, composition, gsm, metadata, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         supplier = EXCLUDED.supplier,
         composition = EXCLUDED.composition,
         gsm = EXCLUDED.gsm,
         metadata = workshop2_materials_library.metadata || EXCLUDED.metadata,
         updated_at = NOW()`,
      [
        id,
        name,
        role,
        input.supplier?.trim() || null,
        input.composition?.trim() || null,
        typeof input.gsm === 'number' && Number.isFinite(input.gsm) ? Math.round(input.gsm) : null,
        JSON.stringify(metadata),
      ]
    );
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}

export async function deleteWorkshop2RefMaterial(
  id: string
): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'db_error' | 'not_found' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const mid = id.trim();
  if (!mid) return { ok: false, reason: 'db_error' };
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query(
      `DELETE FROM workshop2_materials_library WHERE id = $1`,
      [mid]
    );
    if (!res.rowCount) return { ok: false, reason: 'not_found' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}

/** Upsert строки ТН ВЭД (только PG). */
export async function upsertWorkshop2RefTnved(input: {
  code: string;
  description: string;
  leafId?: string;
  chapter?: string;
}): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'db_error' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const code = input.code.replace(/\D/g, '').slice(0, 10);
  const description = input.description.trim();
  if (code.length !== 10 || !description) return { ok: false, reason: 'db_error' };
  try {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_tnved_codes (code, description, leaf_id, chapter, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (code) DO UPDATE SET
         description = EXCLUDED.description,
         leaf_id = EXCLUDED.leaf_id,
         chapter = EXCLUDED.chapter,
         updated_at = NOW()`,
      [code, description, input.leafId?.trim() || null, input.chapter?.trim() || null]
    );
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}

/** DELETE строки ТН ВЭД по 10-значному коду. */
export async function deleteWorkshop2RefTnved(
  code: string
): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'db_error' | 'not_found' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const normalized = code.replace(/\D/g, '').slice(0, 10);
  if (normalized.length !== 10) return { ok: false, reason: 'db_error' };
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query(
      `DELETE FROM workshop2_tnved_codes WHERE code = $1`,
      [normalized]
    );
    if (!res.rowCount) return { ok: false, reason: 'not_found' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}

export async function listWorkshop2RefSuppliers(): Promise<{
  source: Workshop2ReferencesSource;
  items: Workshop2SupplierRow[];
}> {
  return { source: 'static', items: getWorkshop2SuppliersSeed() };
}

export async function getWorkshop2ReferencesStatus(): Promise<{
  postgres: 'ok' | 'down' | 'disabled';
  directories: {
    colors: Workshop2ReferencesSource;
    tnved: Workshop2ReferencesSource;
    materials: Workshop2ReferencesSource;
    pomTemplates: Workshop2ReferencesSource;
    suppliers: Workshop2ReferencesSource;
    sizeScales: Workshop2ReferencesSource;
    categoryLeaves: Workshop2ReferencesSource;
  };
}> {
  let postgres: 'ok' | 'down' | 'disabled' = 'disabled';
  if (isWorkshop2PostgresEnabled()) {
    try {
      await ensureWorkshop2PgSchema();
      await getWorkshop2PgPool().query('SELECT 1');
      postgres = 'ok';
    } catch {
      postgres = 'down';
    }
  }
  const [colors, tnved, materials, pom, suppliers, sizeScales, categoryLeaves] = await Promise.all([
    listWorkshop2RefColors(),
    listWorkshop2RefTnved(),
    listWorkshop2RefMaterials(),
    listWorkshop2RefPomTemplates(),
    listWorkshop2RefSuppliers(),
    listWorkshop2RefSizeScales(),
    listWorkshop2CategoryLeavesSource(),
  ]);
  return {
    postgres,
    directories: {
      colors: colors.source,
      tnved: tnved.source,
      materials: materials.source,
      pomTemplates: pom.source,
      suppliers: suppliers.source,
      sizeScales: sizeScales.source,
      categoryLeaves: categoryLeaves.source,
    },
  };
}

const DEFAULT_COLOR_SEASON = 'SS27';

export type Workshop2CategoryLeafMeta = {
  leafId: string;
  pathLabel: string;
  l1?: string;
  l2?: string;
  l3?: string;
  defaultAudienceHint?: string;
  productionProfile?: Record<string, unknown>;
};

/** Одна строка палитры (upsert по code). */
export async function upsertWorkshop2RefColor(input: {
  code: string;
  name: string;
  hex: string;
  pantone?: string;
  seasonId?: string;
}): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'db_error' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const code = input.code.trim();
  const name = input.name.trim();
  const hex = input.hex.trim();
  if (!code || !name || !hex) return { ok: false, reason: 'db_error' };
  try {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_colors (code, name, hex, pantone, season_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (code) DO UPDATE SET
         name = EXCLUDED.name,
         hex = EXCLUDED.hex,
         pantone = EXCLUDED.pantone,
         season_id = EXCLUDED.season_id,
         updated_at = NOW()`,
      [
        code,
        name,
        hex,
        input.pantone?.trim() || null,
        input.seasonId?.trim() || DEFAULT_COLOR_SEASON,
      ]
    );
    bustWorkshop2ReferencesCache('colors:');
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}

export type Workshop2ColorCsvRow = {
  code: string;
  name: string;
  hex: string;
  pantone?: string;
};

/** Парсинг CSV: code,name,hex,pantone (заголовок опционален). */
export function parseWorkshop2ColorCsv(text: string): Workshop2ColorCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0]!.toLowerCase();
  const startIdx = first.includes('code') && first.includes('hex') ? 1 : 0;
  const out: Workshop2ColorCsvRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i]!.split(/[,;]/).map((p) => p.trim());
    if (parts.length < 3) continue;
    const [code, name, hex, pantone] = parts;
    if (!code || !name || !hex) continue;
    out.push({ code, name, hex, ...(pantone ? { pantone } : {}) });
  }
  return out;
}

export async function importWorkshop2ColorsCsv(
  text: string,
  seasonId = DEFAULT_COLOR_SEASON
): Promise<{ ok: true; imported: number } | { ok: false; reason: string }> {
  const rows = parseWorkshop2ColorCsv(text);
  if (!rows.length) return { ok: false, reason: 'empty_csv' };
  let imported = 0;
  for (const row of rows) {
    const r = await upsertWorkshop2RefColor({ ...row, seasonId });
    if (r.ok) imported += 1;
  }
  bustWorkshop2ReferencesCache('colors:');
  return { ok: true, imported };
}

function categoryLeafFromHandbook(leafId: string): Workshop2CategoryLeafMeta | null {
  const leaf = findHandbookLeafById(leafId);
  if (!leaf) return null;
  const profile = getResolvedLeafProductionProfile(leaf);
  return {
    leafId: leaf.leafId,
    pathLabel: `${leaf.l1Name} › ${leaf.l2Name} › ${leaf.l3Name}`,
    l1: leaf.l1Name,
    l2: leaf.l2Name,
    l3: leaf.l3Name,
    defaultAudienceHint: profile.defaultAudienceId,
    productionProfile: profile as unknown as Record<string, unknown>,
  };
}

/** Метаданные L3: PG seed или снимок справочника категорий. */
export async function getWorkshop2CategoryLeafMeta(
  leafId: string
): Promise<{ source: Workshop2ReferencesSource; item: Workshop2CategoryLeafMeta | null }> {
  const lid = leafId.trim();
  if (!lid) return { source: 'static', item: null };
  if (!isWorkshop2PostgresEnabled()) {
    return { source: 'static', item: categoryLeafFromHandbook(lid) };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      leaf_id: string;
      path_label: string;
      l1: string | null;
      l2: string | null;
      l3: string | null;
      production_profile: Record<string, unknown> | null;
    }>(
      `SELECT leaf_id, path_label, l1, l2, l3, production_profile
       FROM workshop2_category_leaves WHERE leaf_id = $1`,
      [lid]
    );
    if (res.rowCount && res.rows[0]) {
      const r = res.rows[0];
      const profile = r.production_profile ?? {};
      return {
        source: 'postgres',
        item: {
          leafId: r.leaf_id,
          pathLabel: r.path_label,
          ...(r.l1 ? { l1: r.l1 } : {}),
          ...(r.l2 ? { l2: r.l2 } : {}),
          ...(r.l3 ? { l3: r.l3 } : {}),
          defaultAudienceHint:
            typeof profile.defaultAudienceId === 'string'
              ? profile.defaultAudienceId
              : typeof profile.defaultAudienceHint === 'string'
                ? profile.defaultAudienceHint
                : undefined,
          productionProfile: profile,
        },
      };
    }
  } catch {
    /* fallback */
  }
  return { source: 'static', item: categoryLeafFromHandbook(lid) };
}

export type Workshop2RefSizeScaleRow = {
  scaleKey: string;
  label: string;
  rows: string[];
  catL1: string;
  audience?: string;
};

export async function listWorkshop2RefSizeScales(): Promise<{
  source: Workshop2ReferencesSource;
  items: Workshop2RefSizeScaleRow[];
}> {
  if (!isWorkshop2PostgresEnabled()) {
    return { source: 'static', items: [] };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      scale_key: string;
      label: string;
      rows: string[] | unknown;
      cat_l1: string;
      audience: string | null;
    }>(
      `SELECT scale_key, label, rows, cat_l1, audience
       FROM workshop2_size_scales ORDER BY cat_l1, scale_key`
    );
    if (res.rowCount && res.rowCount > 0) {
      return {
        source: 'postgres',
        items: res.rows.map((r) => ({
          scaleKey: r.scale_key,
          label: r.label,
          rows: Array.isArray(r.rows) ? (r.rows as string[]) : [],
          catL1: r.cat_l1,
          ...(r.audience ? { audience: r.audience } : {}),
        })),
      };
    }
  } catch {
    /* fallback */
  }
  return { source: 'static', items: [] };
}

async function listWorkshop2CategoryLeavesSource(): Promise<{
  source: Workshop2ReferencesSource;
  count: number;
}> {
  if (!isWorkshop2PostgresEnabled()) {
    return { source: 'static', count: getHandbookCategoryLeaves().length };
  }
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{ c: string }>(
      `SELECT COUNT(*)::text AS c FROM workshop2_category_leaves`
    );
    const count = Number(res.rows[0]?.c ?? 0);
    return { source: count > 0 ? 'postgres' : 'static', count };
  } catch {
    return { source: 'static', count: getHandbookCategoryLeaves().length };
  }
}

export async function importWorkshop2SizeScalesCsv(csv: string): Promise<
  | {
      ok: true;
      mode: 'postgres' | 'validate_only';
      report: Workshop2SizeScaleImportReport;
      upserted: number;
      message: string;
    }
  | { ok: false; reason: string; report?: Workshop2SizeScaleImportReport; message: string }
> {
  const report = validateWorkshop2SizeScaleCsv(csv);
  if (!report.totalLines) {
    return {
      ok: false,
      reason: 'no_rows',
      message: 'В файле нет распознанных строк catL1Id,scaleId.',
    };
  }
  if (report.valid === 0) {
    return {
      ok: false,
      reason: 'all_invalid',
      report,
      message: `Ни одна из ${report.totalLines} строк не прошла валидацию.`,
    };
  }

  if (!isWorkshop2PostgresEnabled()) {
    return {
      ok: true,
      mode: 'validate_only',
      report,
      upserted: 0,
      message:
        report.invalid === 0
          ? `Все ${report.valid} строк соответствуют production-params. PostgreSQL не настроен — только проверка.`
          : `Валидно ${report.valid} из ${report.totalLines}; ошибок: ${report.invalid}. PG недоступен — только проверка.`,
    };
  }

  const pgRows = buildWorkshop2SizeScalePgRowsFromReport(report);
  let upserted = 0;
  try {
    await ensureWorkshop2PgSchema();
    for (const row of pgRows) {
      await getWorkshop2PgPool().query(
        `INSERT INTO workshop2_size_scales (scale_key, label, rows, audience, cat_l1, updated_at)
         VALUES ($1, $2, $3::jsonb, $4, $5, NOW())
         ON CONFLICT (scale_key) DO UPDATE SET
           label = EXCLUDED.label,
           rows = EXCLUDED.rows,
           audience = EXCLUDED.audience,
           cat_l1 = EXCLUDED.cat_l1,
           updated_at = NOW()`,
        [row.scaleKey, row.label, JSON.stringify(row.rows), row.audience ?? null, row.catL1]
      );
      upserted += 1;
    }
  } catch {
    return {
      ok: false,
      reason: 'db_error',
      report,
      message: 'Ошибка записи в PostgreSQL.',
    };
  }

  return {
    ok: true,
    mode: 'postgres',
    report,
    upserted,
    message:
      report.invalid === 0
        ? `Импортировано в PG: ${upserted} шкал.`
        : `В PG записано ${upserted} шкал; ошибок валидации: ${report.invalid}.`,
  };
}

/** Идемпотентная синхронизация 133 листьев handbook → workshop2_category_leaves. */
export async function syncWorkshop2CategoriesFromHandbook(): Promise<
  | { ok: true; upserted: number; total: number; source: 'postgres' }
  | { ok: false; reason: 'pg_disabled' | 'db_error'; message: string }
> {
  if (!isWorkshop2PostgresEnabled()) {
    return {
      ok: false,
      reason: 'pg_disabled',
      message: 'PostgreSQL не настроен — синхронизация категорий недоступна.',
    };
  }
  const leaves = getHandbookCategoryLeaves();
  try {
    await ensureWorkshop2PgSchema();
    for (const leaf of leaves) {
      const profile = getResolvedLeafProductionProfile(leaf);
      await getWorkshop2PgPool().query(
        `INSERT INTO workshop2_category_leaves (leaf_id, path_label, l1, l2, l3, production_profile, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
         ON CONFLICT (leaf_id) DO UPDATE SET
           path_label = EXCLUDED.path_label,
           l1 = EXCLUDED.l1,
           l2 = EXCLUDED.l2,
           l3 = EXCLUDED.l3,
           production_profile = EXCLUDED.production_profile,
           updated_at = NOW()`,
        [
          leaf.leafId,
          `${leaf.l1Name} › ${leaf.l2Name} › ${leaf.l3Name}`,
          leaf.l1Name,
          leaf.l2Name,
          leaf.l3Name,
          JSON.stringify(profile),
        ]
      );
    }
    return { ok: true, upserted: leaves.length, total: leaves.length, source: 'postgres' };
  } catch {
    return { ok: false, reason: 'db_error', message: 'Ошибка записи категорий в PostgreSQL.' };
  }
}

export type Workshop2RefAttributeRow = {
  attributeId: string;
  name: string;
  groupId: string;
  requiredForPhase1: boolean;
  hasOverride: boolean;
  /** Только если задано в PG (для hydrate runtime). */
  overrideLabel?: string;
};

async function loadWorkshop2AttributeOverrideMap(): Promise<
  Map<string, { label: string | null; requiredForPhase1: boolean | null }>
> {
  const map = new Map<string, { label: string | null; requiredForPhase1: boolean | null }>();
  if (!isWorkshop2PostgresEnabled()) return map;
  try {
    await ensureWorkshop2PgSchema();
    const res = await getWorkshop2PgPool().query<{
      attribute_id: string;
      label: string | null;
      required_for_phase1: boolean | null;
    }>(`SELECT attribute_id, label, required_for_phase1 FROM workshop2_attribute_overrides`);
    for (const r of res.rows) {
      map.set(r.attribute_id, {
        label: r.label,
        requiredForPhase1: r.required_for_phase1,
      });
    }
  } catch {
    /* table may be missing before migration */
  }
  return map;
}

export async function listWorkshop2RefAttributes(): Promise<{
  source: Workshop2ReferencesSource;
  items: Workshop2RefAttributeRow[];
}> {
  const catalog = getAttributeCatalog();
  const overrides = await loadWorkshop2AttributeOverrideMap();
  const source: Workshop2ReferencesSource =
    overrides.size > 0 && isWorkshop2PostgresEnabled() ? 'postgres' : 'static';
  const items = catalog.attributes
    .filter((a) => !a.retiredFromWorkshop)
    .map((a) => {
      const ov = overrides.get(a.attributeId);
      const requiredForPhase1 =
        typeof ov?.requiredForPhase1 === 'boolean'
          ? ov.requiredForPhase1
          : Boolean(a.requiredForPhase1);
      const name = ov?.label?.trim() || a.name;
      return {
        attributeId: a.attributeId,
        name,
        groupId: a.groupId,
        requiredForPhase1,
        hasOverride: Boolean(ov),
        ...(ov?.label?.trim() ? { overrideLabel: ov.label.trim() } : {}),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return { source, items };
}

export async function upsertWorkshop2AttributeOverride(input: {
  attributeId: string;
  label?: string;
  requiredForPhase1?: boolean;
}): Promise<{ ok: true } | { ok: false; reason: 'pg_disabled' | 'not_found' | 'db_error' }> {
  if (!isWorkshop2PostgresEnabled()) return { ok: false, reason: 'pg_disabled' };
  const attributeId = input.attributeId.trim();
  if (!getAttributeCatalog().attributes.some((a) => a.attributeId === attributeId)) {
    return { ok: false, reason: 'not_found' };
  }
  try {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_attribute_overrides (attribute_id, label, required_for_phase1, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (attribute_id) DO UPDATE SET
         label = COALESCE(EXCLUDED.label, workshop2_attribute_overrides.label),
         required_for_phase1 = COALESCE(EXCLUDED.required_for_phase1, workshop2_attribute_overrides.required_for_phase1),
         updated_at = NOW()`,
      [
        attributeId,
        input.label?.trim() || null,
        typeof input.requiredForPhase1 === 'boolean' ? input.requiredForPhase1 : null,
      ]
    );
    return { ok: true };
  } catch {
    return { ok: false, reason: 'db_error' };
  }
}
