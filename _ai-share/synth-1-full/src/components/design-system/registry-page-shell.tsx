'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

/** Оболочка контента кабинета — те же отступы и max-width, что у «Глобальной ленты». */
export function RegistryPageShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(registryFeedLayout.pageShell, className)} {...props} />;
}
