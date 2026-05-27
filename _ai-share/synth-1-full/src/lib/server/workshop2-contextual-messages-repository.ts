import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { parseWorkshop2ContextualMentions } from '@/lib/production/workshop2-contextual-chat-utils';
import { shouldWorkshop2PgOnlySkipFileFallback } from '@/lib/production/workshop2-hub-pg-only-policy';

export type Workshop2ContextualMessageRecord = {
  id: string;
  contextType: string;
  contextId: string;
  message: string;
  createdAt: string;
  sender: string;
  isSystem?: boolean;
  /** Wave 2 #C4: parsed @handles from message body. */
  mentions?: string[];
  /** Wave 2 #C5: vault attachment link (presign GET URL or storage path note). */
  attachmentUrl?: string;
  attachmentName?: string;
};

const memoryStore: Workshop2ContextualMessageRecord[] = [];
const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-contextual-messages.json');
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
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Workshop2ContextualMessageRecord[];
    if (Array.isArray(parsed)) memoryStore.push(...parsed);
  } catch {
    /* best-effort */
  }
}

function flushFile(): void {
  if (!canUseDiskPersistence()) return;
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch {
    /* best-effort */
  }
}

function newMessageId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizeContextualMessageText(message: string): string {
  return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function listWorkshop2ContextualMessages(input: {
  contextType: string;
  contextId: string;
  organizationId?: string;
}): Promise<Workshop2ContextualMessageRecord[]> {
  const contextType = input.contextType.trim();
  const contextId = input.contextId.trim();

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) return [];
    hydrateFileIfNeeded();
    return memoryStore
      .filter((m) => m.contextType === contextType && m.contextId === contextId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(enrichContextualMessageRecord);
  }

  await ensureWorkshop2PgSchema();
  const org = input.organizationId ?? 'org-brand-001';
  const res = await getWorkshop2PgPool().query<{
    id: string;
    context_type: string;
    context_id: string;
    message: string;
    sender: string;
    is_system: boolean;
    created_at: Date;
  }>(
    `SELECT id, context_type, context_id, message, sender, is_system, created_at
     FROM workshop2_contextual_messages
     WHERE organization_id = $1 AND context_type = $2 AND context_id = $3
     ORDER BY created_at ASC`,
    [org, contextType, contextId]
  );
  return res.rows.map((r) =>
    enrichContextualMessageRecord({
      id: r.id,
      contextType: r.context_type,
      contextId: r.context_id,
      message: r.message,
      sender: r.sender,
      isSystem: r.is_system,
      createdAt: r.created_at.toISOString(),
    })
  );
}

function enrichContextualMessageRecord(
  record: Workshop2ContextualMessageRecord
): Workshop2ContextualMessageRecord {
  const mentions = record.mentions ?? parseWorkshop2ContextualMentions(record.message);
  const attachment = record.attachmentUrl
    ? { attachmentUrl: record.attachmentUrl, attachmentName: record.attachmentName }
    : parseAttachmentFromMessage(record.message);
  return {
    ...record,
    mentions: mentions.length ? mentions : undefined,
    ...attachment,
  };
}

function parseAttachmentFromMessage(message: string): {
  attachmentUrl?: string;
  attachmentName?: string;
} {
  const m = message.match(/\[📎\s*([^\]]+)\]\(([^)]+)\)/);
  if (!m) return {};
  return { attachmentName: m[1]?.trim(), attachmentUrl: m[2]?.trim() };
}

function formatMessageWithAttachment(
  message: string,
  attachmentUrl?: string,
  attachmentName?: string
): string {
  if (!attachmentUrl?.trim()) return message;
  const name = attachmentName?.trim() || 'файл';
  return `${message}\n[📎 ${name}](${attachmentUrl.trim()})`;
}

export async function appendWorkshop2ContextualMessage(input: {
  contextType: string;
  contextId: string;
  message: string;
  sender?: string;
  isSystem?: boolean;
  organizationId?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}): Promise<Workshop2ContextualMessageRecord> {
  const mentions = parseWorkshop2ContextualMentions(input.message);
  const body = formatMessageWithAttachment(
    sanitizeContextualMessageText(input.message),
    input.attachmentUrl,
    input.attachmentName
  );
  const record: Workshop2ContextualMessageRecord = {
    id: newMessageId(),
    contextType: input.contextType.trim(),
    contextId: input.contextId.trim(),
    message: body,
    sender: input.sender?.trim() || 'Current User',
    isSystem: input.isSystem ?? false,
    createdAt: new Date().toISOString(),
    mentions: mentions.length ? mentions : undefined,
    attachmentUrl: input.attachmentUrl?.trim() || undefined,
    attachmentName: input.attachmentName?.trim() || undefined,
  };

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) {
      throw new Error('WORKSHOP2_PG_ONLY: contextual messages require PostgreSQL');
    }
    hydrateFileIfNeeded();
    memoryStore.push(record);
    flushFile();
    return record;
  }

  await ensureWorkshop2PgSchema();
  const org = input.organizationId ?? 'org-brand-001';
  await getWorkshop2PgPool().query(
    `INSERT INTO workshop2_contextual_messages
       (id, organization_id, context_type, context_id, message, sender, is_system, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz)`,
    [
      record.id,
      org,
      record.contextType,
      record.contextId,
      record.message,
      record.sender,
      record.isSystem ?? false,
      record.createdAt,
    ]
  );
  return record;
}

export async function appendWorkshop2ContextualSystemMessage(input: {
  contextType: string;
  contextId: string;
  message: string;
  organizationId?: string;
}): Promise<Workshop2ContextualMessageRecord> {
  return appendWorkshop2ContextualMessage({
    ...input,
    sender: 'Система',
    isSystem: true,
  });
}

export function clearWorkshop2ContextualMessagesMemoryForTests(): void {
  memoryStore.length = 0;
  fileHydrated = false;
}

export function isWorkshop2ContextualChatPersistConfigured(): boolean {
  if (isWorkshop2PostgresEnabled()) return true;
  return canUseDiskPersistence();
}

export type Workshop2ContextualMessageThreadSummary = {
  contextType: string;
  contextId: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  messageCount: number;
  collectionId?: string;
  articleId?: string;
};

function parseWorkshop2ArticleContextId(contextId: string): {
  collectionId?: string;
  articleId?: string;
} {
  const parts = contextId.split(':');
  if (parts.length !== 2) return {};
  return { collectionId: parts[0]?.trim(), articleId: parts[1]?.trim() };
}

function summarizeThreadFromMessages(
  contextType: string,
  contextId: string,
  messages: Workshop2ContextualMessageRecord[]
): Workshop2ContextualMessageThreadSummary {
  const sorted = [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const last = sorted[sorted.length - 1];
  const parsed =
    contextType === 'workshop2_article' ? parseWorkshop2ArticleContextId(contextId) : {};
  const preview = (last?.message ?? '').replace(/\n\[📎[^\]]+\]\([^)]+\)/, '').trim();
  return {
    contextType,
    contextId,
    lastMessageAt: last?.createdAt ?? new Date().toISOString(),
    lastMessagePreview: preview.slice(0, 120) || '—',
    messageCount: sorted.length,
    ...parsed,
  };
}

/** Wave 11: агрегированный список contextual threads для /brand/messages (RU). */
export async function listWorkshop2ContextualMessageThreads(input?: {
  organizationId?: string;
  contextType?: string;
  limit?: number;
}): Promise<Workshop2ContextualMessageThreadSummary[]> {
  const limit = Math.min(Math.max(input?.limit ?? 40, 1), 200);
  const contextTypeFilter = input?.contextType?.trim();
  const org = input?.organizationId ?? 'org-brand-001';

  if (!isWorkshop2PostgresEnabled()) {
    if (shouldWorkshop2PgOnlySkipFileFallback()) return [];
    hydrateFileIfNeeded();
    const grouped = new Map<string, Workshop2ContextualMessageRecord[]>();
    for (const m of memoryStore) {
      if (contextTypeFilter && m.contextType !== contextTypeFilter) continue;
      const key = `${m.contextType}::${m.contextId}`;
      const arr = grouped.get(key) ?? [];
      arr.push(m);
      grouped.set(key, arr);
    }
    return Array.from(grouped.entries())
      .map(([key, msgs]) => {
        const [contextType, contextId] = key.split('::');
        return summarizeThreadFromMessages(contextType, contextId, msgs);
      })
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
      .slice(0, limit);
  }

  await ensureWorkshop2PgSchema();
  const params: unknown[] = [org];
  let typeClause = '';
  if (contextTypeFilter) {
    params.push(contextTypeFilter);
    typeClause = ` AND context_type = $${params.length}`;
  }
  params.push(limit);
  const res = await getWorkshop2PgPool().query<{
    context_type: string;
    context_id: string;
    message_count: string;
    last_message_at: Date;
    last_message: string;
  }>(
    `SELECT context_type, context_id,
            COUNT(*)::text AS message_count,
            MAX(created_at) AS last_message_at,
            (ARRAY_AGG(message ORDER BY created_at DESC))[1] AS last_message
     FROM workshop2_contextual_messages
     WHERE organization_id = $1${typeClause}
     GROUP BY context_type, context_id
     ORDER BY MAX(created_at) DESC
     LIMIT $${params.length}`,
    params
  );

  return res.rows.map((r) => {
    const parsed =
      r.context_type === 'workshop2_article' ? parseWorkshop2ArticleContextId(r.context_id) : {};
    const preview = r.last_message.replace(/\n\[📎[^\]]+\]\([^)]+\)/, '').trim();
    return {
      contextType: r.context_type,
      contextId: r.context_id,
      lastMessageAt: r.last_message_at.toISOString(),
      lastMessagePreview: preview.slice(0, 120) || '—',
      messageCount: Number(r.message_count) || 0,
      ...parsed,
    };
  });
}
