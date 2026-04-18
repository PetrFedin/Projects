'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RegistryPageShell } from '@/components/design-system';

export function ProductionRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RegistryPageShell
      className={cn('relative max-w-5xl space-y-4 pb-16', className)}
      aria-label="Production"
    >
      {children}
    </RegistryPageShell>
  );
}
