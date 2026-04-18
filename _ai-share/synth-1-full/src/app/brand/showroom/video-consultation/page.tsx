'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarClock, Timer, Percent } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';

export default function VideoConsultationPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-text-primary text-xl font-bold tracking-tight">Видео-консультация</h1>
        <p className="text-text-secondary text-sm">
          Планирование и эффективность видео-сессий с байерами в шоуруме.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CalendarClock className="text-accent-primary mb-2 h-5 w-5" />
            <CardTitle className="text-sm font-bold">Scheduled sessions</CardTitle>
            <CardDescription className="text-xs">Запланированные слоты</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <Timer className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Avg duration</CardTitle>
            <CardDescription className="text-xs">Средняя длительность</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
        <Card className="border-border-subtle rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <Percent className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Conversion rate</CardTitle>
            <CardDescription className="text-xs">Конверсия в заказ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-text-primary text-2xl font-black tabular-nums">—</p>
          </CardContent>
        </Card>
      </div>
    </RegistryPageShell>
  );
}
