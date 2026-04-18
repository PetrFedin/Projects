'use client';

import React from 'react';
import ResaleHub from '@/components/resale/ResaleHub';
import { RegistryPageShell } from '@/components/design-system';

export default function ResalePage() {
  return (
    <RegistryPageShell className="py-12 pb-16">
      <ResaleHub />
    </RegistryPageShell>
  );
}
