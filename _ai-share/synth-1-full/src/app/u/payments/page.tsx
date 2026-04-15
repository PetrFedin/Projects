'use client';

import { RegistryPageShell } from '@/components/design-system';
import { UserCabinetBreadcrumb } from '../_components/user-cabinet-nav';
import { PaymentsPageContent } from './payments-page-content';

export default function PaymentsPage() {
  return (
    <RegistryPageShell className="space-y-4 py-4">
      <UserCabinetBreadcrumb current="Оплата" />
      <PaymentsPageContent />
    </RegistryPageShell>
  );
}
