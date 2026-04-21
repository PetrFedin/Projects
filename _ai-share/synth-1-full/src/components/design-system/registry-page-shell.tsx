'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export type RegistryPageShellVariant = 'feed' | 'cabinet';

type RegistryPageShellProps = HTMLAttributes<HTMLDivElement> & {
  /** `cabinet` — без лишних px/max-width внутри хаба (отступы только у `CabinetHubMain`). */
  variant?: RegistryPageShellVariant;
};

/** Оболочка контента кабинета — те же отступы и max-width, что у «Глобальной ленты». */
export function RegistryPageShell({
  className,
  variant = 'feed',
  ...props
}: RegistryPageShellProps) {
  const base =
    variant === 'cabinet' ? registryFeedLayout.pageShellCabinet : registryFeedLayout.pageShell;
  return <div className={cn(base, className)} {...props} />;
}
