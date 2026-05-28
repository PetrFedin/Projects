/**
 * Серверное хранилище версий Working Order (JSON на диске).
 * GET/PUT `/api/b2b/v1/working-order-versions`.
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

import type { WorkingOrderVersion } from '@/lib/b2b/working-order-version.types';

export type B2BWorkingOrderVersionsFileV1 = {
  schemaVersion: 1;
  versions: WorkingOrderVersion[];
};

const EMPTY: B2BWorkingOrderVersionsFileV1 = {
  schemaVersion: 1,
  versions: [],
};

export function getB2BWorkingOrderVersionsFilePath(): string {
  const fromEnv = process.env.B2B_WORKING_ORDER_VERSIONS_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-working-order-versions.json');
}

function load(): B2BWorkingOrderVersionsFileV1 {
  try {
    const p = getB2BWorkingOrderVersionsFilePath();
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw) as B2BWorkingOrderVersionsFileV1;
    if (j?.schemaVersion !== 1 || !Array.isArray(j.versions)) {
      return { ...EMPTY };
    }
    return j;
  } catch {
    return { ...EMPTY };
  }
}

function save(data: B2BWorkingOrderVersionsFileV1): void {
  const p = getB2BWorkingOrderVersionsFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function loadWorkingOrderVersionsPersisted(): WorkingOrderVersion[] {
  return load().versions;
}

export function saveWorkingOrderVersionsPersisted(versions: WorkingOrderVersion[]): void {
  save({ schemaVersion: 1, versions });
}
