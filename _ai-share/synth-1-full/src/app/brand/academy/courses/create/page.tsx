'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { WidgetCard } from '@/components/ui/widget-card';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';

export default function CreateBrandCoursePage() {
  return (
    <div className="space-y-6 pb-24">
      <Breadcrumb
        items={[
          { label: 'Бренд', href: ROUTES.brand.home },
          { label: 'Академия', href: ROUTES.brand.academy },
          { label: 'Создать курс' },
        ]}
        className="mb-4"
      />
      <WidgetCard
        title="Создание курса бренда"
        description="Собственные курсы и обучающие материалы: ДНК бренда, продукты, процессы. Связь с Академией, Team."
        actions={
          <>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href={ROUTES.brand.academy}>Академия бренда</Link></Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href={ROUTES.brand.academyPlatform}>Академия платформы</Link></Button>
          </>
        }
      >
      <Card className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Конструктор курса
          </CardTitle>
          <CardDescription>
            Модули, уроки, тесты, сертификация. Скоро: полный редактор курсов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Plus className="h-12 w-12 text-indigo-400 mb-4" />
            <p className="text-sm font-medium text-slate-600 mb-2">Редактор курсов в разработке</p>
            <p className="text-[11px] text-slate-500 mb-4">Модули, видео, тесты, сертификаты</p>
            <Button variant="outline" asChild>
              <Link href={ROUTES.brand.academy}>← Назад в Академию</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      </WidgetCard>
      <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
