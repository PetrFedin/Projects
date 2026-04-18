'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { decodeQuery, encodeQuery } from '../lib/queryCodec';

type SetStateOptions = { replace?: boolean };

export function useQueryState<T extends Record<string, any>>(
  defaults: T
): [T, (patch: Partial<T>, opts?: SetStateOptions) => void, () => void] {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const state = React.useMemo(
    () => decodeQuery(defaults, new URLSearchParams(sp.toString())),
    [sp, defaults]
  );

  const setState = React.useCallback(
    (patch: Partial<T>, opts?: SetStateOptions) => {
      const merged = { ...state, ...patch } as T;
      const qs = encodeQuery(merged);
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (opts?.replace) router.replace(url);
      else router.push(url);
    },
    [router, pathname, state]
  );

  const reset = React.useCallback(() => router.replace(pathname), [router, pathname]);

  return [state, setState, reset];
}
