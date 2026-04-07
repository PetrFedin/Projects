
'use client';

import { MapPin } from "lucide-react";

export default function DistributorShowroomsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <MapPin className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="text-sm font-black uppercase tracking-tighter">Региональные шоурумы</h1>
      <p className="text-slate-400 font-medium text-center max-w-md">
        Раздел находится в разработке. Здесь будет поиск и управление физическими площадками для презентации коллекций в регионах.
      </p>
    </div>
  );
}
