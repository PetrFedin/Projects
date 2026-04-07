'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, GraduationCap, UserPlus } from 'lucide-react';
import { getHRHubLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VacanciesContent = dynamic(() => import('@/app/brand/hr-hub/vacancies/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

const hrTabTriggerClass =
  'text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5';

export default function HRHubPage() {
  const [tab, setTab] = useState('hr-hub');
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
          <TabsTrigger value="hr-hub" className={hrTabTriggerClass}>
            <Users className="h-3 w-3 shrink-0" /> HR Hub
          </TabsTrigger>
          <TabsTrigger value="vacancies" className={hrTabTriggerClass}>
            <Briefcase className="h-3 w-3 shrink-0" /> Вакансии
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hr-hub" className="mt-0 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/brand/team">
              <Card className="h-full rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Команда
                  </CardTitle>
                  <CardDescription>Управление сотрудниками, роли, доступы</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/shop/career">
              <Card className="h-full rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Вакансии и резюме
                  </CardTitle>
                  <CardDescription>Размещение вакансий, поиск кандидатов</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/brand/academy">
              <Card className="h-full rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" /> Обучение
                  </CardTitle>
                  <CardDescription>Курсы бренда, академия платформы</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Card className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Онбординг
                </CardTitle>
                <CardDescription>Чеклисты для новых сотрудников</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[11px] text-slate-500">Скоро: автоматизированные чеклисты онбординга</p>
              </CardContent>
            </Card>
          </div>
          <RelatedModulesBlock links={getHRHubLinks()} />
        </TabsContent>
        <TabsContent value="vacancies" className="mt-0">
          {tab === 'vacancies' && <VacanciesContent />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
