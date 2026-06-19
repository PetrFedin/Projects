/**
 * External refs (Centric style, SKU, wholesale_order) — ADR IntegrationExternalRef.
 */
import 'server-only';

import fs from 'fs';
import path from 'path';
import type { IntegrationExternalRef } from './integration-external-ref.schema';

export type IntegrationExternalRefsFileV1 = {
  schemaVersion: 1;
  refs: IntegrationExternalRef[];
};

const EMPTY: IntegrationExternalRefsFileV1 = {
  schemaVersion: 1,
  refs: [],
};

export function getIntegrationExternalRefsFilePath(): string {
  const fromEnv = process.env.B2B_INTEGRATION_EXTERNAL_REFS_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-integration-external-refs.json');
}

function load(): IntegrationExternalRefsFileV1 {
  try {
    const raw = fs.readFileSync(getIntegrationExternalRefsFilePath(), 'utf8');
    const j = JSON.parse(raw) as IntegrationExternalRefsFileV1;
    if (j?.schemaVersion !== 1 || !Array.isArray(j.refs)) return { ...EMPTY };
    return j;
  } catch {
    return { ...EMPTY };
  }
}

function save(data: IntegrationExternalRefsFileV1): void {
  const p = getIntegrationExternalRefsFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

export function findExternalRef(params: {
  platform: IntegrationExternalRef['platform'];
  synthaEntityType: IntegrationExternalRef['synthaEntityType'];
  synthaEntityId: string;
}): IntegrationExternalRef | undefined {
  return load().refs.find(
    (r) =>
      r.platform === params.platform &&
      r.synthaEntityType === params.synthaEntityType &&
      r.synthaEntityId === params.synthaEntityId
  );
}

export function upsertExternalRef(ref: IntegrationExternalRef): IntegrationExternalRef {
  const data = load();
  const idx = data.refs.findIndex(
    (r) =>
      r.platform === ref.platform &&
      r.synthaEntityType === ref.synthaEntityType &&
      r.synthaEntityId === ref.synthaEntityId
  );
  if (idx >= 0) data.refs[idx] = ref;
  else data.refs.push(ref);
  save(data);
  void import('./spine-operational-persistence.pg')
    .then(({ mirrorExternalRefsSnapshotToPg, isSpineOperationalPgEnabled }) => {
      if (isSpineOperationalPgEnabled()) return mirrorExternalRefsSnapshotToPg([ref]);
    })
    .catch(() => undefined);
  return ref;
}

export function listExternalRefsForEntity(
  synthaEntityType: IntegrationExternalRef['synthaEntityType'],
  synthaEntityId: string
): IntegrationExternalRef[] {
  return load().refs.filter(
    (r) => r.synthaEntityType === synthaEntityType && r.synthaEntityId === synthaEntityId
  );
}

export function listIntegrationExternalRefs(): IntegrationExternalRef[] {
  return load().refs.slice();
}

export function getCentricApprovedForArticle(articleId: string): boolean {
  const refs = listExternalRefsForEntity('article', articleId);
  return refs.some((r) => r.platform === 'centric' && r.externalRevision === 'Approved');
}

/** PG hydrate: replace in-memory file snapshot. */
export function replaceExternalRefsSnapshot(refs: IntegrationExternalRef[]): void {
  save({ schemaVersion: 1, refs });
}
