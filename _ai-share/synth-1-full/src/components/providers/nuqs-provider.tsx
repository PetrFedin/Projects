'use client';

import * as React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

/** Обёртка для хуков `nuqs` (`useQueryState` и др.) в App Router. */
export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
