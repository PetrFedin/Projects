/**
 * LLM Cache System
 * Предотвращает повторные вызовы ИИ для идентичных запросов.
 */

const CACHE_TTL = 3600 * 24; // 24 часа

export async function getFromCache<T>(key: string): Promise<T | null> {
  // В MVP используем LocalStorage (client) или простую Map (server)
  // В Production заменить на Redis
  if (typeof window === 'undefined') return null; 
  const cached = localStorage.getItem(`ai_cache_${key}`);
  if (!cached) return null;
  
  const { value, expiry } = JSON.parse(cached);
  if (Date.now() > expiry) {
    localStorage.removeItem(`ai_cache_${key}`);
    return null;
  }
  return value;
}

export function saveToCache(key: string, value: any) {
  if (typeof window === 'undefined') return;
  const expiry = Date.now() + CACHE_TTL * 1000;
  localStorage.setItem(`ai_cache_${key}`, JSON.stringify({ value, expiry }));
}

export function generateCacheKey(flowName: string, input: any): string {
  return `${flowName}_${Buffer.from(JSON.stringify(input)).toString('base64').substring(0, 32)}`;
}
