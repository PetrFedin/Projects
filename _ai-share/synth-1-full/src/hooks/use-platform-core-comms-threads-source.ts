'use client';

import { useEffect, useState } from 'react';

export type PlatformCoreCommsThreadsSource =
  | 'postgres'
  | 'memory'
  | 'empty'
  | 'unavailable'
  | 'loading';

/** Fail-closed comms: PG-only threads source probe for role workspaces. */
export function usePlatformCoreCommsThreadsSource(
  threadsApiPath: string
): PlatformCoreCommsThreadsSource {
  const [source, setSource] = useState<PlatformCoreCommsThreadsSource>('loading');

  useEffect(() => {
    let cancelled = false;
    void fetch(threadsApiPath, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return { source: 'unavailable' as const };
        return (await res.json()) as { source?: PlatformCoreCommsThreadsSource };
      })
      .then((json) => {
        if (!cancelled) setSource(json.source ?? 'empty');
      })
      .catch(() => {
        if (!cancelled) setSource('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [threadsApiPath]);

  return source;
}
