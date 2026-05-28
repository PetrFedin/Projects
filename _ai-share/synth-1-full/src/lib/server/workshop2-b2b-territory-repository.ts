import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2B2bCreditAccount } from '@/lib/production/workshop2-b2b-credit-hold';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

export type Workshop2B2bTerritoryRow = Workshop2B2bCreditAccount & {
  id: string;
  labelRu: string;
  active: boolean;
};

const FILE_STORE = path.join(process.cwd(), 'data', 'workshop2-b2b-territories.json');
const DEFAULT_TERRITORIES: Workshop2B2bTerritoryRow[] = [
  {
    id: 'terr-ru-mow',
    territoryId: 'RU-MOW',
    labelRu: 'Москва и МО',
    creditLimitRub: 5_000_000,
    openOrdersRub: 4_850_000,
    customerName: 'Demo Retail MOW',
    active: true,
  },
  {
    id: 'terr-ru-spb',
    territoryId: 'RU-SPB',
    labelRu: 'Санкт-Петербург',
    creditLimitRub: 2_000_000,
    openOrdersRub: 500_000,
    customerName: 'Demo Retail SPB',
    active: true,
  },
  {
    id: 'terr-kz-ala',
    territoryId: 'KZ-ALA',
    labelRu: 'Алматы',
    creditLimitRub: 1_000_000,
    openOrdersRub: 200_000,
    customerName: 'Demo KZ',
    active: true,
  },
];

function readFileTerritories(): Workshop2B2bTerritoryRow[] {
  try {
    if (!fs.existsSync(FILE_STORE)) return [...DEFAULT_TERRITORIES];
    const parsed = JSON.parse(fs.readFileSync(FILE_STORE, 'utf8')) as Workshop2B2bTerritoryRow[];
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_TERRITORIES];
  } catch {
    return [...DEFAULT_TERRITORIES];
  }
}

function writeFileTerritories(rows: Workshop2B2bTerritoryRow[]): void {
  if (process.env.NODE_ENV === 'test') return;
  fs.mkdirSync(path.dirname(FILE_STORE), { recursive: true });
  fs.writeFileSync(FILE_STORE, JSON.stringify(rows, null, 2), 'utf8');
}

export async function listWorkshop2B2bTerritories(
  organizationId = 'org-brand-001'
): Promise<Workshop2B2bTerritoryRow[]> {
  if (!isWorkshop2PostgresEnabled()) {
    return readFileTerritories();
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{
    id: string;
    territory_id: string;
    label_ru: string;
    credit_limit_rub: string;
    open_orders_rub: string;
    customer_name: string | null;
    active: boolean;
  }>(
    `SELECT id, territory_id, label_ru, credit_limit_rub, open_orders_rub, customer_name, active
     FROM workshop2_b2b_territories
     WHERE organization_id = $1
     ORDER BY territory_id ASC`,
    [organizationId]
  );
  if (!res.rows.length) {
    for (const seed of DEFAULT_TERRITORIES) {
      await upsertWorkshop2B2bTerritory({ ...seed, organizationId });
    }
    return listWorkshop2B2bTerritories(organizationId);
  }
  return res.rows.map((r) => ({
    id: r.id,
    territoryId: r.territory_id,
    labelRu: r.label_ru,
    creditLimitRub: Number(r.credit_limit_rub),
    openOrdersRub: Number(r.open_orders_rub),
    customerName: r.customer_name ?? undefined,
    active: r.active,
  }));
}

export async function upsertWorkshop2B2bTerritory(input: {
  id?: string;
  organizationId?: string;
  territoryId: string;
  labelRu: string;
  creditLimitRub: number;
  openOrdersRub?: number;
  customerName?: string;
  active?: boolean;
}): Promise<Workshop2B2bTerritoryRow> {
  const row: Workshop2B2bTerritoryRow = {
    id: input.id ?? `terr-${input.territoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    territoryId: input.territoryId.trim(),
    labelRu: input.labelRu.trim(),
    creditLimitRub: input.creditLimitRub,
    openOrdersRub: input.openOrdersRub ?? 0,
    customerName: input.customerName,
    active: input.active ?? true,
  };

  if (!isWorkshop2PostgresEnabled()) {
    const list = readFileTerritories();
    const idx = list.findIndex((t) => t.territoryId === row.territoryId);
    if (idx >= 0) list[idx] = row;
    else list.push(row);
    writeFileTerritories(list);
    return row;
  }

  await ensureWorkshop2PgSchema();
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_b2b_territories
       (id, organization_id, territory_id, label_ru, credit_limit_rub, open_orders_rub, customer_name, active, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     ON CONFLICT (id) DO UPDATE SET
       territory_id = EXCLUDED.territory_id,
       label_ru = EXCLUDED.label_ru,
       credit_limit_rub = EXCLUDED.credit_limit_rub,
       open_orders_rub = EXCLUDED.open_orders_rub,
       customer_name = EXCLUDED.customer_name,
       active = EXCLUDED.active,
       updated_at = NOW()`,
    [
      row.id,
      input.organizationId ?? 'org-brand-001',
      row.territoryId,
      row.labelRu,
      row.creditLimitRub,
      row.openOrdersRub,
      row.customerName ?? null,
      row.active,
    ]
  );
  return row;
}

export async function deleteWorkshop2B2bTerritory(territoryId: string): Promise<boolean> {
  if (!isWorkshop2PostgresEnabled()) {
    const list = readFileTerritories().filter((t) => t.territoryId !== territoryId);
    writeFileTerritories(list);
    return true;
  }
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query(
    `DELETE FROM workshop2_b2b_territories WHERE territory_id = $1`,
    [territoryId.trim()]
  );
  return (res.rowCount ?? 0) > 0;
}

export function clearWorkshop2B2bTerritoriesMemoryForTests(): void {
  if (fs.existsSync(FILE_STORE)) fs.unlinkSync(FILE_STORE);
}
