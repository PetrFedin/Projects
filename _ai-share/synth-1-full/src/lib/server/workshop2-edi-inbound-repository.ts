import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2EdiJournalEntry } from '@/lib/production/workshop2-edi-types';
import { isWorkshop2PgOnlyMode } from '@/lib/production/workshop2-hub-pg-only-policy';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const memoryJournal: Workshop2EdiJournalEntry[] = [];
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-edi-inbound-journal.json');
let fileHydrated = false;

function canUseDiskPersistence(): boolean {
  return process.env.NODE_ENV !== 'test' && !isWorkshop2PgOnlyMode();
}

function hydrateFileIfNeeded(): void {
  if (fileHydrated) return;
  fileHydrated = true;
  if (!canUseDiskPersistence()) return;
  try {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Workshop2EdiJournalEntry[];
    if (Array.isArray(parsed)) memoryJournal.push(...parsed);
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryJournal, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

export async function appendWorkshop2EdiInboundJournalEntry(input: {
  entry: Workshop2EdiJournalEntry;
  organizationId?: string;
}): Promise<{ persisted: boolean; mode: 'postgres' | 'file' | 'memory' | 'pg_only_blocked' }> {
  const entry = input.entry;
  const org = input.organizationId ?? 'org-brand-001';

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    await getWorkshop2PgPool().query(
      `INSERT INTO workshop2_edi_inbound_journal
         (id, organization_id, document_type, retailer_id, purchase_order_id, status, payload, received_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::timestamptz)
       ON CONFLICT (id) DO NOTHING`,
      [
        entry.id,
        org,
        entry.documentType,
        entry.retailerId,
        entry.purchaseOrderId ?? null,
        entry.status,
        JSON.stringify(entry.payload),
        entry.receivedAt,
      ]
    );
    return { persisted: true, mode: 'postgres' };
  }

  if (isWorkshop2PgOnlyMode()) {
    return { persisted: false, mode: 'pg_only_blocked' };
  }

  hydrateFileIfNeeded();
  memoryJournal.push(entry);
  flushFile();
  return { persisted: true, mode: canUseDiskPersistence() ? 'file' : 'memory' };
}

export async function listWorkshop2EdiInboundJournalEntries(input?: {
  documentType?: string;
  limit?: number;
  organizationId?: string;
}): Promise<Workshop2EdiJournalEntry[]> {
  const limit = Math.min(Math.max(input?.limit ?? 50, 1), 200);
  const org = input?.organizationId ?? 'org-brand-001';
  const docType = input?.documentType?.trim();

  if (isWorkshop2PostgresEnabled()) {
    await ensureWorkshop2PgSchema();
    const params: unknown[] = [org, limit];
    let typeFilter = '';
    if (docType) {
      params.splice(1, 0, docType);
      typeFilter = ' AND document_type = $2';
    }
    const res = await getWorkshop2PgPool().query<{
      id: string;
      document_type: string;
      retailer_id: string;
      purchase_order_id: string | null;
      status: string;
      payload: Workshop2EdiJournalEntry['payload'];
      received_at: Date;
    }>(
      `SELECT id, document_type, retailer_id, purchase_order_id, status, payload, received_at
       FROM workshop2_edi_inbound_journal
       WHERE organization_id = $1${typeFilter}
       ORDER BY received_at DESC
       LIMIT $${params.length}`,
      docType ? [org, docType, limit] : [org, limit]
    );
    return res.rows.map((r) => ({
      id: r.id,
      documentType: r.document_type as Workshop2EdiJournalEntry['documentType'],
      retailerId: r.retailer_id,
      purchaseOrderId: r.purchase_order_id ?? undefined,
      receivedAt: r.received_at.toISOString(),
      status: 'journal_only',
      noteRu: 'Запись из PG journal.',
      payload: r.payload,
    }));
  }

  if (isWorkshop2PgOnlyMode()) {
    return [];
  }

  hydrateFileIfNeeded();
  return memoryJournal
    .filter((e) => !docType || e.documentType === docType)
    .slice(-limit)
    .reverse();
}

export function clearWorkshop2EdiInboundJournalMemoryForTests(): void {
  memoryJournal.length = 0;
  fileHydrated = false;
}
