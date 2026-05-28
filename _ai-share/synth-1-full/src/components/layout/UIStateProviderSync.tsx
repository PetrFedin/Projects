'use client';

import { UIStateProvider } from '@/providers/ui-state';

/** Sync-обёртка — отдельный chunk, подключается только когда gate решил mount UI state. */
export function UIStateProviderSync({ children }: { children: React.ReactNode }) {
  return <UIStateProvider>{children}</UIStateProvider>;
}
