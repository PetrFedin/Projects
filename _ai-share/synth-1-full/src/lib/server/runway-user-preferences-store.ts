import 'server-only';

import fs from 'fs/promises';
import path from 'path';

export type RunwayUserPreferencesRecord = Record<string, number>;

type PreferencesStoreFile = {
  users: Record<string, RunwayUserPreferencesRecord>;
  updatedAt: string;
};

let chain: Promise<void> = Promise.resolve();

function storePath(): string {
  const fromEnv = process.env.RUNWAY_USER_PREFERENCES_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'runway-user-preferences.json');
}

async function readStore(): Promise<PreferencesStoreFile> {
  try {
    const raw = await fs.readFile(storePath(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<PreferencesStoreFile>;
    return {
      users: parsed.users && typeof parsed.users === 'object' ? parsed.users : {},
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return { users: {}, updatedAt: new Date().toISOString() };
  }
}

async function writeStore(store: PreferencesStoreFile): Promise<void> {
  const p = storePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(store, null, 2), 'utf8');
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn) as Promise<T>;
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

/** Избранные секции runway для пользователя (productSlug → sectionIndex). */
export async function readRunwayUserPreferences(
  userId: string
): Promise<RunwayUserPreferencesRecord> {
  return runExclusive(async () => {
    const store = await readStore();
    return store.users[userId] ?? {};
  });
}

export async function writeRunwayUserPreferences(
  userId: string,
  sectionFavorites: RunwayUserPreferencesRecord
): Promise<void> {
  return runExclusive(async () => {
    const store = await readStore();
    store.users[userId] = sectionFavorites;
    store.updatedAt = new Date().toISOString();
    await writeStore(store);
  });
}

/** Сброс file-store (dev / unit tests). */
export async function resetRunwayUserPreferencesStore(): Promise<void> {
  return runExclusive(async () => {
    await writeStore({ users: {}, updatedAt: new Date().toISOString() });
  });
}
