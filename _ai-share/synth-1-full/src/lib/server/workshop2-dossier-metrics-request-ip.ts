/** Клиентский IP для rate limit / allowlist (прокси: x-forwarded-for, x-real-ip). */
export function getW2MetricsClientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xf) return xf;
  const ri = request.headers.get('x-real-ip')?.trim();
  return ri || 'unknown';
}

/** Список IP через запятую (точное совпадение). Пустой env — без ограничения. */
export function parseW2MetricsIpAllowlist(raw: string | undefined): Set<string> {
  const s = new Set<string>();
  if (!raw?.trim()) return s;
  for (const part of raw.split(',')) {
    const t = part.trim();
    if (t) s.add(t);
  }
  return s;
}

export function isW2MetricsIpInAllowlist(ip: string, allowed: Set<string>): boolean {
  if (allowed.size === 0) return true;
  return allowed.has(ip);
}
