/**
 * Wave D1 · F-WIP — AIMS360 / AM production stages per PO (ADR §19.6).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

export const PRODUCTION_WIP_STAGES = [
  'cutting',
  'sewing',
  'qc',
  'ready_to_ship',
  'shipped',
] as const;

export type ProductionWipStage = (typeof PRODUCTION_WIP_STAGES)[number];

export type ProductionWipRecord = {
  productionOrderId: string;
  b2bOrderId: string;
  platform: 'aims360' | 'apparel_magic';
  poStage: ProductionWipStage;
  updatedAt: string;
  qtyComplete?: number;
  qtyTotal?: number;
};

export type ProductionWipFileV1 = {
  schemaVersion: 1;
  byProductionOrderId: Record<string, ProductionWipRecord>;
  byB2bOrderId: Record<string, string>;
};

const EMPTY: ProductionWipFileV1 = {
  schemaVersion: 1,
  byProductionOrderId: {},
  byB2bOrderId: {},
};

export const PRODUCTION_WIP_STAGE_LABEL_RU: Record<ProductionWipStage, string> = {
  cutting: 'Раскрой',
  sewing: 'Пошив',
  qc: 'КК',
  ready_to_ship: 'Готов к отгрузке',
  shipped: 'Отгружен',
};

export function productionWipFilePath(): string {
  const fromEnv = process.env.B2B_PRODUCTION_WIP_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-production-wip.json');
}

function load(): ProductionWipFileV1 {
  try {
    const raw = fs.readFileSync(productionWipFilePath(), 'utf8');
    const j = JSON.parse(raw) as ProductionWipFileV1;
    if (j?.schemaVersion !== 1) return { ...EMPTY };
    return {
      schemaVersion: 1,
      byProductionOrderId: j.byProductionOrderId ?? {},
      byB2bOrderId: j.byB2bOrderId ?? {},
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(data: ProductionWipFileV1): void {
  const p = productionWipFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  void import('./spine-operational-persistence.pg')
    .then((m) => m.mirrorProductionWipSnapshotToPg(data))
    .catch(() => {});
}

/** PG hydrate: replace full snapshot (idempotent). */
export function replaceProductionWipSnapshot(data: ProductionWipFileV1): void {
  save(data);
}

export function upsertProductionWip(record: ProductionWipRecord): ProductionWipRecord {
  const data = load();
  data.byProductionOrderId[record.productionOrderId] = record;
  data.byB2bOrderId[record.b2bOrderId] = record.productionOrderId;
  save(data);
  return record;
}

export function getProductionWipByPoId(productionOrderId: string): ProductionWipRecord | undefined {
  return load().byProductionOrderId[productionOrderId.trim()];
}

export function getProductionWipByB2bOrderId(b2bOrderId: string): ProductionWipRecord | undefined {
  const poId = load().byB2bOrderId[b2bOrderId.trim()];
  if (!poId) return undefined;
  return load().byProductionOrderId[poId];
}

export function listProductionWipRecords(): ProductionWipRecord[] {
  return Object.values(load().byProductionOrderId);
}

export function productionWipStageIndex(stage: ProductionWipStage): number {
  return PRODUCTION_WIP_STAGES.indexOf(stage);
}

export function productionWipSteps(current: ProductionWipStage): Array<{
  id: ProductionWipStage;
  labelRu: string;
  done: boolean;
}> {
  const idx = productionWipStageIndex(current);
  return PRODUCTION_WIP_STAGES.filter((s) => s !== 'shipped' || current === 'shipped').map((s) => ({
    id: s,
    labelRu: PRODUCTION_WIP_STAGE_LABEL_RU[s],
    done: productionWipStageIndex(s) <= idx,
  }));
}
