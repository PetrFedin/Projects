'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileStack, Calendar } from 'lucide-react';

export default function VacanciesPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">Вакансии и резюме</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Открытые позиции, отклики и этапы отбора кандидатов.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
