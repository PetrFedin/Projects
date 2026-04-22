"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { decodeQuery, encodeQuery } from "../lib/queryCodec";

type SetStateOptions = { replace?: boolean };

export function useQueryState<T extends Record<string, any>>(
  defaults: T
): [T, (patch: Partial<T>, opts?: SetStateOptions) => void, () => void] {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const safePath = pathname ?? "/";

  const state = React.useMemo(
    () => decodeQuery(defaults, new URLSearchParams(sp?.toString() ?? "")),
    [sp, defaults]
  );

  const setState = React.useCallback(
    (patch: Partial<T>, opts?: SetStateOptions) => {
      const merged = { ...state, ...patch } as T;
      const qs = encodeQuery(merged);
      const url = qs ? `${safePath}?${qs}` : safePath;
      if (opts?.replace) router.replace(url);
      else router.push(url);
    },
    [router, safePath, state]
  );

  const reset = React.useCallback(() => router.replace(safePath), [router, safePath]);

  return [state, setState, reset];
}

