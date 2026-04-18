'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileStack, Calendar } from 'lucide-react';

export default function VacanciesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Вакансии и резюме</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Открытые позиции, отклики и этапы отбора кандидатов.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              Open positions
            </CardTitle>
            <CardDescription className="text-xs">Активных вакансий</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <FileStack className="h-4 w-4 text-emerald-600" />
              Applications received
            </CardTitle>
            <CardDescription className="text-xs">Получено резюме</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Calendar className="h-4 w-4 text-amber-600" />
              Interviews scheduled
            </CardTitle>
            <CardDescription className="text-xs">Запланировано интервью</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
