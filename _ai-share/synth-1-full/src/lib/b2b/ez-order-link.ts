/**
 * NuOrder: EZ Order по ссылке — заказ без входа в платформу.
 * Бренд генерирует уникальную ссылку (token), байер открывает и заполняет заказ по email.
 */

export interface EzOrderLinkPayload {
  brandId: string;
  linesheetId: string;
  collectionId?: string;
  /** Срок действия (timestamp ms) */
  expiresAt?: number;
  /** Ограничение по email (опционально) */
  allowedEmail?: string;
  /** Домен для private invite (например @store.ru) */
  allowedDomain?: string;
}

export interface EzOrderLink {
  token: string;
  url: string;
  payload: EzOrderLinkPayload;
  createdAt: number;
}

function toBase64Url(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(str, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(b64url: string): string {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  if (typeof atob !== 'undefined') return atob(b64);
  return Buffer.from(b64, 'base64').toString('utf-8');
}

/** Демо: генерация токена для EZ Order ссылки */
export function generateEzOrderToken(payload: EzOrderLinkPayload): EzOrderLink {
  const token = `ez_${toBase64Url(JSON.stringify({
    ...payload,
    _ts: Date.now(),
    _r: Math.random().toString(36).slice(2),
  }))}`;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://syntha.example.com';
  return {
    token,
    url: `${baseUrl}/o/ez/${token}`,
    payload,
    createdAt: Date.now(),
  };
}

/** Парсинг токена (работает в браузере и на сервере) */
export function parseEzOrderToken(token: string): EzOrderLinkPayload & { _ts?: number } | null {
  try {
    if (!token.startsWith('ez_')) return null;
    const raw = fromBase64Url(token.slice(3));
    const parsed = JSON.parse(raw) as EzOrderLinkPayload & { _ts?: number };
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}
