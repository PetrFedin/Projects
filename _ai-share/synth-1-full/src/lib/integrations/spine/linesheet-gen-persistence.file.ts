/**
 * Wave D4 · persisted linesheet generation records (pillar 2 sample_collection).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';
import type { LinesheetGenResult } from './linesheet-gen.service';

export type LinesheetGenRecord = LinesheetGenResult & {
  linesheetId: string;
};

type FileV1 = {
  schemaVersion: 1;
  byCollectionId: Record<string, LinesheetGenRecord>;
  history: LinesheetGenRecord[];
};

const EMPTY: FileV1 = { schemaVersion: 1, byCollectionId: {}, history: [] };

function pathFile(): string {
  return (
    process.env.B2B_LINESHEET_GEN_FILE?.trim() ||
    path.join(process.cwd(), 'data', 'b2b-linesheet-gen.json')
  );
}

function load(): FileV1 {
  try {
    const j = JSON.parse(fs.readFileSync(pathFile(), 'utf8')) as FileV1;
    if (j?.schemaVersion !== 1) return { ...EMPTY };
    return {
      schemaVersion: 1,
      byCollectionId: j.byCollectionId ?? {},
      history: j.history ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function save(data: FileV1): void {
  const p = pathFile();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

export function persistLinesheetGen(result: LinesheetGenResult): LinesheetGenRecord {
  const record: LinesheetGenRecord = {
    ...result,
    linesheetId: `LS-${result.collectionId}-${Date.now().toString(36)}`,
  };
  const data = load();
  data.byCollectionId[result.collectionId] = record;
  data.history.unshift(record);
  data.history = data.history.slice(0, 100);
  save(data);
  return record;
}

export function getLatestLinesheetForCollection(
  collectionId: string
): LinesheetGenRecord | undefined {
  return load().byCollectionId[collectionId.trim()];
}

export function listLinesheetHistory(limit = 10): LinesheetGenRecord[] {
  return load().history.slice(0, limit);
}
