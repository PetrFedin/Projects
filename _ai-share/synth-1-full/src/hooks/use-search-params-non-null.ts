'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams as useNextSearchParams } from 'next/navigation';

/** Стабильный пустой объект — не создаём новый URLSearchParams на каждый рендер при sp === null. */
const EMPTY_SEARCH_PARAMS = new URLSearchParams() as ReadonlyURLSearchParams;

/**
 * useSearchParams с не-null типом и стабильным fallback (важно для useEffect deps).
 */
export function useSearchParamsNonNull(): ReadonlyURLSearchParams {
  return useNextSearchParams() ?? EMPTY_SEARCH_PARAMS;
}
