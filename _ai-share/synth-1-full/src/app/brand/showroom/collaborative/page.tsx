'use client';

import { CollaborativeBuy } from '@/components/brand/CollaborativeBuy';
import { RegistryPageShell } from '@/components/design-system';

export default function CollaborativeBuyPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <CollaborativeBuy />
    </RegistryPageShell>
  );
}
