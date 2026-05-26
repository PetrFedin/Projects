'use client';

import { B2BStateProvider } from '@/providers/b2b-state';

/** Sync-обёртка — отдельный chunk, подключается только когда gate решил mount B2B. */
export function B2BStateProviderSync({ children }: { children: React.ReactNode }) {
  return <B2BStateProvider>{children}</B2BStateProvider>;
}
