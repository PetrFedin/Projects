const g = globalThis as typeof globalThis & { __synthaRuntime?: Map<symbol, unknown> };

function runtimeMap(): Map<symbol, unknown> {
  if (!g.__synthaRuntime) g.__synthaRuntime = new Map();
  return g.__synthaRuntime;
}

/** Один экземпляр на процесс/воркер (демо-хранилища, кэш in-memory). */
export function getOrCreateGlobalRuntime<T>(key: symbol, factory: () => T): T {
  const m = runtimeMap();
  let v = m.get(key) as T | undefined;
  if (v === undefined) {
    v = factory();
    m.set(key, v);
  }
  return v;
}
