'use client';

import { BrandQualityDeskBody } from '@/components/brand/quality/BrandQualityDeskBody';
import { RegistryPageShell } from '@/components/design-system';

export default function BrandQualityPage() {
  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <BrandQualityDeskBody />
    </RegistryPageShell>
  );
}
