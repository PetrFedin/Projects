'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, Eye, MousePointerClick } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function ShowroomBannersPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-text-primary text-xl font-bold tracking-tight">Баннеры в шоуруме</h1>
        <p className="text-text-secondary text-sm">
          Управление промо-блоками и метриками показов в виртуальном шоуруме.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <ImageIcon className="text-accent-primary mb-2 h-5 w-5" />
            <CardTitle className="text-sm font-bold">Active banners</CardTitle>
            <CardDescription className="text-xs">Активные баннеры</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <Eye className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Impressions</CardTitle>
            <CardDescription className="text-xs">Показы</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <MousePointerClick className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Click rate</CardTitle>
            <CardDescription className="text-xs">CTR</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
