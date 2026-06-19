/**
 * Файловое хранилище integration meta на wholesaleOrderId (Wave A5).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';
import type { OperationalOrderIntegration } from './integration-external-ref.schema';

export type IntegrationMetaFileV1 = {
  schemaVersion: 1;
  byWholesaleOrderId: Record<string, OperationalOrderIntegration>;
};

const EMPTY: IntegrationMetaFileV1 = {
  schemaVersion: 1,
  byWholesaleOrderId: {},
};

export function getIntegrationMetaFilePath(): string {
  const fromEnv = process.env.B2B_INTEGRATION_META_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-integration-meta.json');
}

function load(): IntegrationMetaFileV1 {
  try {
    const raw = fs.readFileSync(getIntegrationMetaFilePath(), 'utf8');
    const j = JSON.parse(raw) as IntegrationMetaFileV1;
    if (j?.schemaVersion !== 1 || typeof j.byWholesaleOrderId !== 'object') {
      return { ...EMPTY };
    }
    return j;
  } catch {
    return { ...EMPTY };
  }
}

function save(data: IntegrationMetaFileV1): void {
  const p = getIntegrationMetaFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  void import('./spine-operational-persistence.pg')
    .then((m) => m.mirrorIntegrationMetaSnapshotToPg(data))
    .catch(() => {});
}

export function getIntegrationMetaForOrder(
  wholesaleOrderId: string
): OperationalOrderIntegration | undefined {
  return load().byWholesaleOrderId[wholesaleOrderId];
}

export function upsertIntegrationMetaForOrder(
  wholesaleOrderId: string,
  patch: OperationalOrderIntegration
): OperationalOrderIntegration {
  const data = load();
  const prev = data.byWholesaleOrderId[wholesaleOrderId] ?? {};
  const next = { ...prev, ...patch };
  data.byWholesaleOrderId[wholesaleOrderId] = next;
  save(data);
  return next;
}

export function listAllIntegrationMeta(): Record<string, OperationalOrderIntegration> {
  return { ...load().byWholesaleOrderId };
}
