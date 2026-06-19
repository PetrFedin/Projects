import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import type { Workshop2B2bCartSession } from '@/lib/production/workshop2-b2b-wave23-parity';

const STORE_FILE = path.join(process.cwd(), 'data', 'workshop2-b2b-cart-sessions.json');

type StoreShape = Record<string, Workshop2B2bCartSession>;

function readStore(): StoreShape {
  try {
    if (!fs.existsSync(STORE_FILE)) return {};
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as StoreShape;
  } catch {
    return {};
  }
}

function writeStore(store: StoreShape): void {
  try {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch {
    /* best-effort — in-memory cart remains primary */
  }
}

export function readWorkshop2B2bCartSessionFromFile(
  sessionId: string
): Workshop2B2bCartSession | null {
  const sid = sessionId.trim();
  if (!sid) return null;
  const row = readStore()[sid];
  return row?.sessionId === sid && Array.isArray(row.lines) ? row : null;
}

export function persistWorkshop2B2bCartSessionToFile(session: Workshop2B2bCartSession): void {
  const sid = session.sessionId?.trim();
  if (!sid) return;
  const store = readStore();
  store[sid] = session;
  writeStore(store);
}
