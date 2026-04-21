'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export function ProductionRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CabinetPageContent
      maxWidth="5xl"
      className={cn('relative space-y-4 pb-16', className)}
      aria-label="Production"
    >
      {children}
    </CabinetPageContent>
  );
}
