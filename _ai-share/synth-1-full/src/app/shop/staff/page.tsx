'use client';

import { TeamManagement } from '@/components/team/TeamManagement';
import { RegistryPageShell } from '@/components/design-system';

export default function StaffPage() {
  return (
    <RegistryPageShell className="max-w-6xl space-y-6 duration-700 animate-in fade-in">
      <div className="border-border-subtle overflow-hidden rounded-xl border bg-white p-1 shadow-sm">
        <TeamManagement />
      </div>
    </RegistryPageShell>
  );
}
