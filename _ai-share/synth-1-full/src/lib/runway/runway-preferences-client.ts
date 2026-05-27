'use client';

/** Заголовки для runway preferences API — JWT session + dev fallback. */
export function buildRunwayPreferencesRequestHeaders(userId: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('syntha_access_token')?.trim();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (userId) {
      headers['X-Runway-User-Id'] = userId;
    }
  }

  return headers;
}
