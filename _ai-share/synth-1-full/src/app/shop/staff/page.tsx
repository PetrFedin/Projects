'use client';

import { TeamManagement } from '@/components/team/TeamManagement';
<<<<<<< HEAD

export default function StaffPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
        <TeamManagement />
      </div>
    </div>
=======
import { RegistryPageShell } from '@/components/design-system';

export default function StaffPage() {
  return (
    <RegistryPageShell className="max-w-6xl space-y-6 duration-700 animate-in fade-in">
      <div className="border-border-subtle overflow-hidden rounded-xl border bg-white p-1 shadow-sm">
        <TeamManagement />
      </div>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
