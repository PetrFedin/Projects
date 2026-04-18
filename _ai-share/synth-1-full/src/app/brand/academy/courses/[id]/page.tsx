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
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function BrandCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const course = getBrandCourseById(id);

  if (!course) {
    return (
<<<<<<< HEAD
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="mt-6 text-slate-500">Курс не найден</p>
        <Button variant="outline" className="mt-4" asChild>
=======
      <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
        <RegistryPageHeader
          title="Курс не найден"
          leadPlain="Запрошенный курс отсутствует в демо-данных."
          eyebrow={
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 shrink-0"
              onClick={() => router.back()}
              aria-label="Назад"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        />
        <Button variant="outline" asChild>
>>>>>>> recover/cabinet-wip-from-stash
          <Link href={ROUTES.brand.academy}>Вернуться в Академию бренда</Link>
        </Button>
      </RegistryPageShell>
    );
  }

  return (
    <RegistryPageShell className="w-full max-w-none space-y-8 pb-16">
      <RegistryPageHeader
        title={course.title}
        leadPlain={course.description}
        eyebrow={
          <Breadcrumb
            items={[
              { label: 'Бренд', href: ROUTES.brand.home },
              { label: 'Академия', href: ROUTES.brand.academy },
              { label: course.title },
            ]}
          />
        }
      />

      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'rounded-2xl border p-8',
            course.status === 'completed'
              ? 'border-emerald-200/60 bg-emerald-50/30'
<<<<<<< HEAD
              : 'border-slate-200/80 bg-white'
=======
              : 'border-border-default/80 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl',
                course.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-600'
                  : course.status === 'in_progress'
<<<<<<< HEAD
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-400'
=======
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              {course.status === 'completed' ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <PlayCircle className="h-8 w-8" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    course.status === 'completed'
                      ? 'border-emerald-300 text-emerald-700'
                      : course.status === 'in_progress'
<<<<<<< HEAD
                        ? 'border-indigo-300 text-indigo-700'
                        : 'border-slate-200 text-slate-500'
=======
                        ? 'border-accent-primary/30 text-accent-primary'
                        : 'border-border-default text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {course.status === 'completed'
                    ? 'Завершён'
                    : course.status === 'in_progress'
                      ? `${course.progress}%`
                      : 'Не начат'}
                </Badge>
                <span className="text-text-secondary flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
                <span className="text-text-secondary text-sm">{course.modules} модулей</span>
              </div>
              {course.status !== 'not_started' && (
                <div className="mt-4 w-48">
                  <Progress value={course.progress} className="h-2 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full gap-2 rounded-xl font-semibold sm:w-auto">
          <PlayCircle className="h-5 w-5" />{' '}
          {course.status === 'not_started'
            ? 'Начать курс'
            : course.status === 'in_progress'
              ? 'Продолжить'
              : 'Повторить'}
        </Button>

        {course.curriculum && course.curriculum.length > 0 && (
          <WidgetCard title="Программа курса" description={`${course.modules} модулей`}>
            <ul className="space-y-3">
              {course.curriculum.map((item, i) => (
                <li
                  key={i}
<<<<<<< HEAD
                  className="flex items-center gap-3 border-b border-slate-100 py-2 text-slate-700 last:border-0"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
=======
                  className="text-text-primary border-border-subtle flex items-center gap-3 border-b py-2 last:border-0"
                >
                  <span className="bg-bg-surface2 text-text-secondary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
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
    </RegistryPageShell>
  );
}
