'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Star, Clock } from 'lucide-react';

export default function RetailersFavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Избранные товары</h1>
        <p className="text-sm text-slate-500">Избранное у ритейлеров: объёмы, топ SKU и недавние добавления.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Heart className="h-5 w-5 text-indigo-600 mb-2" />
            <CardTitle className="text-sm font-bold">Total favorited</CardTitle>
            <CardDescription className="text-xs">Всего в избранном</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Star className="h-5 w-5 text-emerald-600 mb-2" />
            <CardTitle className="text-sm font-bold">Most popular</CardTitle>
            <CardDescription className="text-xs">Самые популярные</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <Clock className="h-5 w-5 text-amber-600 mb-2" />
            <CardTitle className="text-sm font-bold">Recent adds</CardTitle>
            <CardDescription className="text-xs">Недавние добавления</CardDescription>
          </CardHeader>
          <CardContent><p className="text-2xl font-black tabular-nums text-slate-900">—</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
