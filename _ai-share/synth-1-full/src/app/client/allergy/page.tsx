'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Tag } from 'lucide-react';
import { getClientAllergyLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

const MOCK_ALLERGIES = ['Шерсть', 'Латекс'];
const MOCK_PRODUCTS = [
  { id: '1', name: 'Cyber Parka', composition: '100% хлопок', safe: true },
  { id: '2', name: 'Wool Coat', composition: '80% шерсть, 20% кашемир', safe: false },
];

export default function AllergyPage() {
  const [tags, setTags] = useState<string[]>(MOCK_ALLERGIES);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <header>
        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-600" /> Allergy & Material Alerts
        </h1>
        <p className="text-sm text-slate-500 mt-1">Персональные фильтры по составу ткани. Отметки на товарах.</p>
      </header>

      <Card className="rounded-xl border border-amber-200 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="text-sm">Ваши ограничения</CardTitle>
          <CardDescription>Добавьте материалы, которых стоит избегать</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} variant="secondary" className="gap-1">
                {t} <span className="cursor-pointer" onClick={() => setTags((s) => s.filter((x) => x !== t))}>×</span>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Input placeholder="Добавить материал..." className="rounded-lg max-w-xs" />
            <Button size="sm" className="rounded-lg">Добавить</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Tag className="h-4 w-4" /> Пример товаров
          </CardTitle>
          <CardDescription>Бейдж «Безопасно» или предупреждение по составу</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {MOCK_PRODUCTS.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-[11px] text-slate-500">{p.composition}</p>
                </div>
                {p.safe ? (
                  <Badge className="bg-emerald-100 text-emerald-800">Безопасно</Badge>
                ) : (
                  <Badge variant="destructive">Внимание: шерсть</Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getClientAllergyLinks()} />
    </div>
  );
}
