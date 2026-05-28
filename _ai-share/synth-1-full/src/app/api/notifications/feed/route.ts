/**
 * Polling endpoint for notifications when WebSocket is unavailable.
 * Прокси только при `NEXT_PUBLIC_USE_FASTAPI=true` и заданном `NEXT_PUBLIC_API_URL`.
 */

const USE_FASTAPI = process.env.NEXT_PUBLIC_USE_FASTAPI === 'true';
const API = USE_FASTAPI ? (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') : '';
const FEED_PROXY_TIMEOUT_MS = 5000;

export async function GET(request: Request) {
  if (API) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FEED_PROXY_TIMEOUT_MS);
    try {
      const url = new URL(request.url);
      const backendUrl = `${API.replace(/\/$/, '')}/notifications/feed${url.search}`;
      const authHeader = request.headers.get('authorization');
      const res = await fetch(backendUrl, {
        headers: authHeader ? { Authorization: authHeader } : {},
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json(data);
      }
    } catch {
      // Fall through
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return Response.json({ events: [], lastId: null });
}
