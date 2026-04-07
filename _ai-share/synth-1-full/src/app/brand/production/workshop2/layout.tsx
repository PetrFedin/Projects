'use client';

import type { ReactNode } from 'react';
import { Workshop2LocalStateProvider } from './workshop2-local-state-provider';

export default function Workshop2Layout({ children }: { children: ReactNode }) {
  return <Workshop2LocalStateProvider>{children}</Workshop2LocalStateProvider>;
}
