import 'server-only';

import fs from 'fs/promises';
import path from 'path';

import type { SewingOrderIntentServerRecordV1 } from '@/lib/client/sewing-order-intent';
import { sewingIntentSubjectKey } from '@/lib/client/sewing-order-intent';

type Snapshot = {
  latest: Record<string, SewingOrderIntentServerRecordV1>;
  logTail: Array<{ at: string; key: string; handbookLeafId: string }>;
};

const MAX_LOG = 200;
let chain: Promise<void> = Promise.resolve();

function filePath(): string {
  const fromEnv = process.env.SEWING_ORDER_INTENT_STORE_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'sewing-order-intents.json');
}

async function readSnapshot(): Promise<Snapshot> {
  try {
    const raw = await fs.readFile(filePath(), 'utf8');
    const p = JSON.parse(raw) as Partial<Snapshot>;
    return {
      latest: typeof p.latest === 'object' && p.latest ? p.latest : {},
      logTail: Array.isArray(p.logTail) ? p.logTail : [],
    };
  } catch {
    return { latest: {}, logTail: [] };
  }
}

async function writeSnapshot(s: Snapshot): Promise<void> {
  const p = filePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(s, null, 2), 'utf8');
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn) as Promise<T>;
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function putSewingOrderIntentRecord(record: SewingOrderIntentServerRecordV1): Promise<void> {
  const key = sewingIntentSubjectKey(record.subject);
  return runExclusive(async () => {
    const snap = await readSnapshot();
    snap.latest[key] = record;
    snap.logTail.unshift({
      at: record.updatedAt,
      key,
      handbookLeafId: record.handbookLeafId,
    });
    snap.logTail = snap.logTail.slice(0, MAX_LOG);
    await writeSnapshot(snap);
  });
}

export async function getLatestSewingOrderIntentForSubject(subject: {
  kind: 'device' | 'user';
  id: string;
}): Promise<SewingOrderIntentServerRecordV1 | null> {
  const key = sewingIntentSubjectKey(subject);
  return runExclusive(async () => {
    const snap = await readSnapshot();
    return snap.latest[key] ?? null;
  });
}

/** Приоритет: сначала пользователь, иначе устройство. */
export async function resolveLatestRecord(params: {
  userId?: string | null;
  deviceId: string;
}): Promise<SewingOrderIntentServerRecordV1 | null> {
  const uid = params.userId?.trim();
  if (uid) {
    const u = await getLatestSewingOrderIntentForSubject({ kind: 'user', id: uid });
    if (u) return u;
  }
  return getLatestSewingOrderIntentForSubject({ kind: 'device', id: params.deviceId });
}
