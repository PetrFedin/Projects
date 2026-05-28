/**
 * Хранилище закреплённых разделов и напоминаний.
 * localStorage, ключ по value раздела/подраздела.
 */

const STORAGE_KEY = 'brand_nav_pins_v1';

export type NavPinEntry = {
  pinned: boolean;
  reminder?: string;
};

function load(): Record<string, NavPinEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, NavPinEntry>) : {};
  } catch {
    return {};
  }
}

function save(data: Record<string, NavPinEntry>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getNavPin(key: string): NavPinEntry | undefined {
  return load()[key];
}

export function setNavPin(key: string, entry: Partial<NavPinEntry>) {
  const data = load();
  const current = data[key] ?? { pinned: false };
  data[key] = { ...current, ...entry };
  if (!data[key].pinned && !data[key].reminder) delete data[key];
  save(data);
}

export function togglePin(key: string): boolean {
  const data = load();
  const current = data[key] ?? { pinned: false };
  const next = !current.pinned;
  data[key] = { ...current, pinned: next };
  if (!next && !current.reminder) delete data[key];
  save(data);
  return next;
}

export function setReminder(key: string, reminder: string | undefined) {
  const data = load();
  const current = data[key] ?? { pinned: false };
  data[key] = { ...current, reminder: reminder?.trim() || undefined };
  if (!current.pinned && !data[key].reminder) delete data[key];
  save(data);
}

export function getAllPins(): Record<string, NavPinEntry> {
  return load();
}
