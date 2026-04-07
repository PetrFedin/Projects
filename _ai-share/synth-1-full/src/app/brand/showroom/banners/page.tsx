'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, Eye, MousePointerClick } from 'lucide-react';

export default function ShowroomBannersPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Баннеры в шоуруме</h1>
        <p className="text-sm text-slate-500">Управление промо-блоками и метриками показов в виртуальном шоуруме.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <ImageIcon className="h-5 w-5 text-indigo-600 mb-2" />
            <CardTitle className="text-sm font-bold">Active banners</CardTitle>
            <CardDescription className="text-xs">Активные баннеры</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Eye className="h-5 w-5 text-emerald-600 mb-2" />
            <CardTitle className="text-sm font-bold">Impressions</CardTitle>
            <CardDescription className="text-xs">Показы</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <MousePointerClick className="h-5 w-5 text-amber-600 mb-2" />
            <CardTitle className="text-sm font-bold">Click rate</CardTitle>
            <CardDescription className="text-xs">CTR</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
