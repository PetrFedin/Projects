'use client';

import { RegistryPageShell } from '@/components/design-system';
import { UserCabinetBreadcrumb } from '../_components/user-cabinet-nav';
import { WardrobePageContent } from './wardrobe-page-content';

export default function WardrobePage() {
  return (
    <RegistryPageShell className="space-y-4 py-4">
      <UserCabinetBreadcrumb current="Гардероб" />
      <WardrobePageContent />
    </RegistryPageShell>
  );
}
