export function encodeQuery(obj: Record<string, any>) {
  const p = new URLSearchParams();

  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;

    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      p.set(k, v.join(','));
      continue;
    }

    if (typeof v === 'boolean') {
      if (v === false) continue;
      p.set(k, '1');
      continue;
    }

    if (v === '') continue;

    p.set(k, String(v));
  }

  return p.toString();
}

export function decodeQuery<T extends Record<string, any>>(defaults: T, sp: URLSearchParams): T {
  const out: any = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const raw = sp.get(key);
    if (raw == null) continue;

    const def = (defaults as any)[key];

    if (Array.isArray(def)) {
      out[key] = raw ? raw.split(',').filter(Boolean) : [];
    } else if (typeof def === 'number') {
      out[key] = Number(raw);
    } else if (typeof def === 'boolean') {
      out[key] = raw === '1' || raw === 'true';
    } else {
      out[key] = raw;
    }
  }

  return out as T;
}
