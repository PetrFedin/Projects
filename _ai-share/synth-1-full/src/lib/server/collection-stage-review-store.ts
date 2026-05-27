import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export type CollectionStageReviewChannel = 'tasks' | 'messages';
export type CollectionStageReviewStatus = 'queued' | 'processing' | 'sent' | 'failed';

export type CollectionStageReviewRecord = {
  requestId: string;
  createdAt: string;
  updatedAt: string;
  collectionKey: string;
  collectionIdLabel: string;
  stepId: string;
  stepTitle: string;
  actorLabel: string;
  channels: CollectionStageReviewChannel[];
  summaryNote?: string;
  status: CollectionStageReviewStatus;
  taskRef?: string;
  messageThreadRef?: string;
  lastError?: string;
};

const STORE_PATH = process.env.W2_COLLECTION_STAGE_REVIEW_STORE_FILE?.trim()
  ? process.env.W2_COLLECTION_STAGE_REVIEW_STORE_FILE.trim()
  : join(process.cwd(), '.data', 'workshop2-collection-stage-review.json');

type StoreShape = {
  records: CollectionStageReviewRecord[];
};

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await readFile(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return { records: Array.isArray(parsed.records) ? parsed.records : [] };
  } catch {
    return { records: [] };
  }
}

async function writeStore(next: StoreShape): Promise<void> {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(next, null, 2), 'utf-8');
}

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `w2-cs-${c.randomUUID()}`;
  return `w2-cs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createCollectionStageReviewRecord(input: {
  collectionKey: string;
  collectionIdLabel: string;
  stepId: string;
  stepTitle: string;
  actorLabel: string;
  channels: CollectionStageReviewChannel[];
  summaryNote?: string;
}): Promise<CollectionStageReviewRecord> {
  const now = new Date().toISOString();
  const requestId = makeId();
  const ticketBase = `${input.collectionKey.replace(/[^a-zA-Z0-9:_-]+/g, '-').slice(0, 80) || 'x'}:${
    input.stepId.replace(/[^a-zA-Z0-9:_-]+/g, '-').slice(0, 80) || 'x'
  }`;
  const record: CollectionStageReviewRecord = {
    requestId,
    createdAt: now,
    updatedAt: now,
    collectionKey: input.collectionKey,
    collectionIdLabel: input.collectionIdLabel,
    stepId: input.stepId,
    stepTitle: input.stepTitle,
    actorLabel: input.actorLabel,
    channels: input.channels,
    ...(input.summaryNote?.trim() ? { summaryNote: input.summaryNote.trim() } : {}),
    status: 'queued',
    ...(input.channels.includes('tasks')
      ? { taskRef: `task:${ticketBase}:${requestId.slice(-8)}` }
      : {}),
    ...(input.channels.includes('messages')
      ? { messageThreadRef: `thread:${ticketBase}:${requestId.slice(-8)}` }
      : {}),
  };
  const store = await readStore();
  store.records.unshift(record);
  store.records = store.records.slice(0, 500);
  await writeStore(store);
  return record;
}

export async function listCollectionStageReviewRecords(input: {
  collectionKey?: string;
  stepId?: string;
  limit?: number;
}): Promise<CollectionStageReviewRecord[]> {
  const limit = Math.min(Math.max(Math.floor(input.limit ?? 30), 1), 200);
  const store = await readStore();
  return store.records
    .filter((r) => (input.collectionKey ? r.collectionKey === input.collectionKey : true))
    .filter((r) => (input.stepId ? r.stepId === input.stepId : true))
    .slice(0, limit);
}
