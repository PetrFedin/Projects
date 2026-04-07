'use client';

import React from 'react';

export function ProductionRoot({
  children,
  className = 'container mx-auto px-4 py-4 space-y-4 pb-24 max-w-5xl relative',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className} aria-label="Production">
      {children}
    </section>
  );
}
