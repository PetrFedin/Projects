'use client';

import { MapPin } from 'lucide-react';

export default function DistributorShowroomsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <MapPin className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="text-sm font-black uppercase tracking-tighter">Региональные шоурумы</h1>
      <p className="max-w-md text-center font-medium text-slate-400">
        Раздел находится в разработке. Здесь будет поиск и управление физическими площадками для
        презентации коллекций в регионах.
      </p>
    </div>
  );
}
