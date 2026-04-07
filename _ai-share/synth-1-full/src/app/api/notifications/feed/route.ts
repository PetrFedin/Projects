/**
 * Polling endpoint for notifications when WebSocket is unavailable.
 * Прокси только при `NEXT_PUBLIC_USE_FASTAPI=true` и заданном `NEXT_PUBLIC_API_URL`.
 */

const USE_FASTAPI = process.env.NEXT_PUBLIC_USE_FASTAPI === 'true';
const API = USE_FASTAPI ? (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') : '';

export async function GET(request: Request) {
  if (API) {
    try {
      const url = new URL(request.url);
      const backendUrl = `${API.replace(/\/$/, '')}/notifications/feed${url.search}`;
      const authHeader = request.headers.get('authorization');
      const res = await fetch(backendUrl, {
        headers: authHeader ? { Authorization: authHeader } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json(data);
      }
    } catch {
      // Fall through
    }
  }

  return Response.json({ events: [], lastId: null });
}
