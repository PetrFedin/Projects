'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getFinanceLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function MarkdownOptimizerPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Markdown Optimizer"
        description="AI-рекомендации по времени и глубине скидок для максимизации прибыли. Когда и на сколько снижать цену по остаткам."
        icon={Percent}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              AI
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Скидки
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/pricing">Pricing</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Markdown Optimizer</h1>
      <Card className="rounded-xl border border-amber-100 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Рекомендации по скидкам
          </CardTitle>
          <CardDescription>
            Оптимальные сроки и глубина уценок по остаткам. Правила: остаток более 30 дней — 15%;
            более 60 дней — 25%; сезонный остаток — до 40%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { when: 'Сейчас', discount: 15, rule: 'Остаток до 30 дней' },
              { when: 'Через 2 нед.', discount: 25, rule: 'Остаток 30–60 дней' },
              { when: 'Через 4 нед.', discount: 40, rule: 'Сезонный остаток' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <p className="text-sm font-bold">{item.when}</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Рекомендуемая скидка: <strong>{item.discount}%</strong>
                </p>
                <p className="mt-1 text-[10px] text-slate-500">{item.rule}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
            <strong>Правила AI:</strong> Глубина скидки растёт с возрастом остатка. Для максимизации
            прибыли не снижайте раньше 2 недель до конца сезона; после — агрессивнее (до 40%).
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">
              Рекомендации по категориям
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-2 text-[10px] font-bold uppercase text-slate-500">
                      Категория
                    </th>
                    <th className="p-2 text-[10px] font-bold uppercase text-slate-500">
                      Остаток (дн.)
                    </th>
                    <th className="p-2 text-[10px] font-bold uppercase text-slate-500">
                      Скидка сейчас
                    </th>
                    <th className="p-2 text-[10px] font-bold uppercase text-slate-500">Когда</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Верхняя одежда', days: 45, discount: 15, when: 'Сейчас' },
                    { cat: 'Брюки', days: 75, discount: 25, when: 'Через 2 нед.' },
                    { cat: 'Трикотаж', days: 90, discount: 40, when: 'Через 4 нед.' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-2 font-medium">{r.cat}</td>
                      <td className="p-2 tabular-nums">{r.days}</td>
                      <td className="p-2">
                        <strong>{r.discount}%</strong>
                      </td>
                      <td className="p-2 text-slate-600">{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getFinanceLinks()} />
    </div>
  );
}
