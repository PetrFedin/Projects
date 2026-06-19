/**
 * Wave D3 · Centric RFQ records for supplier procurement (F-PROCUREMENT).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

export type CentricRfqLine = {
  materialName: string;
  qty: number;
  unit?: string;
  supplierHint?: string;
};

export type CentricRfqRecord = {
  rfqId: string;
  centricStyleId: string;
  collectionId: string;
  articleId: string;
  b2bOrderId?: string;
  productionOrderId?: string;
  status: 'open' | 'quoted' | 'awarded';
  lines: CentricRfqLine[];
  importedAt: string;
};

type FileV1 = {
  schemaVersion: 1;
  byRfqId: Record<string, CentricRfqRecord>;
  byArticleKey: Record<string, string>;
  byOrderId: Record<string, string>;
};

const EMPTY: FileV1 = { schemaVersion: 1, byRfqId: {}, byArticleKey: {}, byOrderId: {} };

function pathFile(): string {
  return (
    process.env.B2B_CENTRIC_RFQ_FILE?.trim() ||
    path.join(process.cwd(), 'data', 'b2b-centric-rfq.json')
  );
}

function load(): FileV1 {
  try {
    const j = JSON.parse(fs.readFileSync(pathFile(), 'utf8')) as FileV1;
    if (j?.schemaVersion !== 1) return { ...EMPTY };
    return {
      schemaVersion: 1,
      byRfqId: j.byRfqId ?? {},
      byArticleKey: j.byArticleKey ?? {},
      byOrderId: j.byOrderId ?? {},
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

function articleKey(collectionId: string, articleId: string): string {
  return `${collectionId}:${articleId}`;
}

export function upsertCentricRfq(record: CentricRfqRecord): CentricRfqRecord {
  const data = load();
  data.byRfqId[record.rfqId] = record;
  data.byArticleKey[articleKey(record.collectionId, record.articleId)] = record.rfqId;
  if (record.b2bOrderId) data.byOrderId[record.b2bOrderId] = record.rfqId;
  save(data);
  return record;
}

export function getCentricRfqById(rfqId: string): CentricRfqRecord | undefined {
  return load().byRfqId[rfqId.trim()];
}

export function getCentricRfqByOrderId(b2bOrderId: string): CentricRfqRecord | undefined {
  const id = load().byOrderId[b2bOrderId.trim()];
  return id ? load().byRfqId[id] : undefined;
}

export function getCentricRfqByArticle(
  collectionId: string,
  articleId: string
): CentricRfqRecord | undefined {
  const id = load().byArticleKey[articleKey(collectionId, articleId)];
  return id ? load().byRfqId[id] : undefined;
}

export function listCentricRfqRecords(): CentricRfqRecord[] {
  return Object.values(load().byRfqId);
}

export function replaceCentricRfqSnapshot(records: CentricRfqRecord[]): void {
  const data: FileV1 = { schemaVersion: 1, byRfqId: {}, byArticleKey: {}, byOrderId: {} };
  for (const record of records) {
    data.byRfqId[record.rfqId] = record;
    data.byArticleKey[articleKey(record.collectionId, record.articleId)] = record.rfqId;
    if (record.b2bOrderId) data.byOrderId[record.b2bOrderId] = record.rfqId;
  }
  save(data);
}
