'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WidgetCard } from '@/components/ui/widget-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { getBrandCourseById } from '@/lib/academy/brand-academy-data';
import { ArrowLeft, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrandCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const course = getBrandCourseById(id);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="mt-6 text-slate-500">Курс не найден</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={ROUTES.brand.academy}>Вернуться в Академию бренда</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <Breadcrumb
        items={[
          { label: 'Бренд', href: ROUTES.brand.home },
          { label: 'Академия', href: ROUTES.brand.academy },
          { label: course.title },
        ]}
        className="mb-4"
      />

      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'rounded-2xl p-8 border',
            course.status === 'completed' ? 'border-emerald-200/60 bg-emerald-50/30' : 'border-slate-200/80 bg-white'
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'h-16 w-16 rounded-2xl flex items-center justify-center shrink-0',
                course.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : course.status === 'in_progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
              )}
            >
              {course.status === 'completed' ? <CheckCircle2 className="h-8 w-8" /> : <PlayCircle className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
              <p className="mt-2 text-slate-600">{course.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    course.status === 'completed' ? 'border-emerald-300 text-emerald-700' : course.status === 'in_progress' ? 'border-indigo-300 text-indigo-700' : 'border-slate-200 text-slate-500'
                  )}
                >
                  {course.status === 'completed' ? 'Завершён' : course.status === 'in_progress' ? `${course.progress}%` : 'Не начат'}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
                <span className="text-sm text-slate-500">{course.modules} модулей</span>
              </div>
              {course.status !== 'not_started' && (
                <div className="mt-4 w-48">
                  <Progress value={course.progress} className="h-2 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button size="lg" className="rounded-xl gap-2 font-semibold w-full sm:w-auto">
          <PlayCircle className="h-5 w-5" /> {course.status === 'not_started' ? 'Начать курс' : course.status === 'in_progress' ? 'Продолжить' : 'Повторить'}
        </Button>

        {course.curriculum && course.curriculum.length > 0 && (
          <WidgetCard title="Программа курса" description={`${course.modules} модулей`}>
            <ul className="space-y-3">
              {course.curriculum.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 py-2 border-b border-slate-100 last:border-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </WidgetCard>
        )}
      </div>

      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academy} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> К курсам бренда
        </Link>
      </Button>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
