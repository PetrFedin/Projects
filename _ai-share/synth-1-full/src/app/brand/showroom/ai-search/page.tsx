'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

export default function ShowroomAiSearchPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">AI-поиск B2B</h1>
        <p className="text-sm text-slate-500">
          Поиск по каталогу для байеров с подсказками и аналитикой запросов.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <Search className="mb-2 h-5 w-5 text-indigo-600" />
            <CardTitle className="text-sm font-bold">Search queries</CardTitle>
            <CardDescription className="text-xs">Запросы за период</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <Sparkles className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">AI suggestions accuracy</CardTitle>
            <CardDescription className="text-xs">Точность подсказок</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <TrendingUp className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Popular searches</CardTitle>
            <CardDescription className="text-xs">Популярные запросы</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
