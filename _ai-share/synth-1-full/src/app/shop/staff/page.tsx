
'use client';

import { TeamManagement } from "@/components/team/TeamManagement";

export default function StaffPage() {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl animate-in fade-in duration-700">
        <div className="rounded-xl border border-slate-100 shadow-sm overflow-hidden bg-white p-1">
          <TeamManagement />
        </div>
      </div>
    );
}
