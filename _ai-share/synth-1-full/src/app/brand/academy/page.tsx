'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { WidgetCard } from '@/components/ui/widget-card';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { getBrandCourses } from '@/lib/academy/brand-academy-data';
import { cn } from '@/lib/utils';
import { Plus, PlayCircle, CheckCircle2, ChevronRight, Clock, BookOpen } from 'lucide-react';

export default function BrandAcademyPage() {
  const courses = getBrandCourses();
  const inProgress = courses.filter((c) => c.status === 'in_progress');
  const completed = courses.filter((c) => c.status === 'completed');
  const notStarted = courses.filter((c) => c.status === 'not_started');

  return (
    <>
      <section className="space-y-6">
        <SectionHeader
          icon={BookOpen}
          title="Курсы бренда"
          description="Собственные курсы по ДНК бренда, продуктам и процессам. Доступны команде и партнёрам."
          actions={
            <Button variant="outline" className="rounded-lg" asChild>
              <Link href={`${ROUTES.brand.academy}/courses/create`} className="gap-2">
                <Plus className="h-4 w-4" /> Создать курс
              </Link>
            </Button>
          }
        />

        {inProgress.length > 0 && (
          <WidgetCard title="В процессе" description="Курсы в работе">
            <div className="space-y-3">
              {inProgress.map((c) => (
                <Link key={c.id} href={ROUTES.brand.academyCourse(c.id)}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <PlayCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">{c.modules} модулей</span>
                          <div className="w-24">
                            <Progress value={c.progress} className="h-1.5 rounded-full" />
                          </div>
                          <span className="text-xs font-medium text-indigo-600">{c.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </WidgetCard>
        )}

        <WidgetCard title="Все курсы" description={courses.length === 0 ? undefined : `${completed.length} завершено, ${notStarted.length} не начато`}>
        <div className="space-y-4">
          {courses.length === 0 ? (
            <EmptyStateB2B
              icon={BookOpen}
              title="Нет курсов"
              description="Создайте первый курс по ДНК бренда, продуктам или процессам."
              action={
                <Button variant="outline" size="sm" className="rounded-lg" asChild>
                  <Link href={`${ROUTES.brand.academy}/courses/create`}>Создать курс</Link>
                </Button>
              }
            />
          ) : courses.map((c) => (
            <Link key={c.id} href={ROUTES.brand.academyCourse(c.id)}>
            <div
              className={cn(
                'rounded-xl border overflow-hidden transition-all duration-200 group hover:shadow-md',
                c.status === 'completed' ? 'border-emerald-200/60 bg-emerald-50/30' : 'border-slate-200/80 bg-white hover:border-slate-300'
              )}
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div
                    className={cn(
                      'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors',
                      c.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : c.status === 'in_progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {c.status === 'completed' ? <CheckCircle2 className="h-7 w-7" /> : <PlayCircle className="h-7 w-7" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-base">{c.title}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-medium',
                          c.status === 'completed' ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : c.status === 'in_progress' ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-500'
                        )}
                      >
                        {c.status === 'completed' ? 'Завершён' : c.status === 'in_progress' ? `${c.progress}%` : 'Не начат'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                      <span>{c.modules} модулей</span>
                      {c.status !== 'not_started' && (
                        <div className="w-32">
                          <Progress value={c.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 self-center" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        </WidgetCard>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </>
  );
}
