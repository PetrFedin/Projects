'use client';

import { TeamManagement } from '@/components/team/TeamManagement';

export default function StaffPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 duration-700 animate-in fade-in">
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
        <TeamManagement />
      </div>
    </div>
  );
}
