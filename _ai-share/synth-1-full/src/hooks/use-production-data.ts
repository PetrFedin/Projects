'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ENABLE_BACKEND_HTTP } from '@/lib/syntha-api-mode';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(
  /\/$/,
  ''
);
const FETCH_TIMEOUT_MS = 8000;

/**
 * Хук для загрузки данных производства.
 * При `ENABLE_BACKEND_HTTP` — запрос к API, иначе сразу fallback (без сети и таймаутов).
 */
export function useProductionData<T>(
  endpoint: string,
  fallback: T
): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(() => ENABLE_BACKEND_HTTP);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const refetch = useCallback(() => setRefetchTrigger((n) => n + 1), []);

  const endpointRef = useRef(endpoint);
  endpointRef.current = endpoint;

  useEffect(() => {
    if (!ENABLE_BACKEND_HTTP) {
      setData(fallbackRef.current);
      setError(null);
      setLoading(false);
      return;
    }

    const ep = endpointRef.current;
    let cancelled = false;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);

    queueMicrotask(() => {
      const doFetch = async () => {
        try {
          const token =
            typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;
          const res = await fetch(`${API_BASE}${ep}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: ctrl.signal,
          });
          clearTimeout(timeout);
          if (cancelled) return;
          if (res.ok) {
            const json = (await res.json()) as { data?: T } & Record<string, unknown>;
            setData((json.data ?? json) as T);
          } else {
            setData(fallbackRef.current);
          }
        } catch (err) {
          clearTimeout(timeout);
          if (cancelled) return;
          setError(err instanceof Error ? err.message : 'Network error');
          setData(fallbackRef.current);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      doFetch();
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, [refetchTrigger]);

  return { data, loading, error, refetch };
}
