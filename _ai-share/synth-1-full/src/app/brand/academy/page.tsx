'use client';

import Link from 'next/link';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
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
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-20">
      <RegistryPageHeader
        title="Академия"
        leadPlain="Собственные курсы по ДНК бренда, продуктам и процессам — для команды и партнёров."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase"
            asChild
          >
            <Link href={`${ROUTES.brand.academy}/courses/create`} className="gap-2">
              <Plus className="h-4 w-4" /> Создать курс
            </Link>
          </Button>
        }
      />

      <section className="space-y-6">
        {inProgress.length > 0 && (
          <WidgetCard title="В процессе" description="Курсы в работе">
            <div className="space-y-3">
              {inProgress.map((c) => (
                <Link key={c.id} href={ROUTES.brand.academyCourse(c.id)}>
<<<<<<< HEAD
                  <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 transition-colors hover:bg-indigo-50/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        <PlayCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.title}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-xs text-slate-500">{c.modules} модулей</span>
=======
                  <div className="border-accent-primary/20 bg-accent-primary/10 hover:bg-accent-primary/10 flex items-center justify-between rounded-xl border p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-accent-primary/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <PlayCircle className="text-accent-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-text-primary font-semibold">{c.title}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-text-secondary text-xs">{c.modules} модулей</span>
>>>>>>> recover/cabinet-wip-from-stash
                          <div className="w-24">
                            <Progress value={c.progress} className="h-1.5 rounded-full" />
                          </div>
                          <span className="text-accent-primary text-xs font-medium">
                            {c.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
<<<<<<< HEAD
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
=======
                    <ChevronRight className="text-text-muted h-4 w-4 shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </Link>
              ))}
            </div>
          </WidgetCard>
        )}

        <WidgetCard
          title="Все курсы"
          description={
            courses.length === 0
              ? undefined
              : `${completed.length} завершено, ${notStarted.length} не начато`
          }
        >
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
            ) : (
              courses.map((c) => (
                <Link key={c.id} href={ROUTES.brand.academyCourse(c.id)}>
                  <div
                    className={cn(
                      'group overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md',
                      c.status === 'completed'
                        ? 'border-emerald-200/60 bg-emerald-50/30'
<<<<<<< HEAD
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
=======
                        : 'border-border-default/80 hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                      <div
                        className={cn(
                          'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors',
                          c.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-600'
                            : c.status === 'in_progress'
<<<<<<< HEAD
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-slate-100 text-slate-400'
=======
                              ? 'bg-accent-primary/15 text-accent-primary'
                              : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {c.status === 'completed' ? (
                          <CheckCircle2 className="h-7 w-7" />
                        ) : (
                          <PlayCircle className="h-7 w-7" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
<<<<<<< HEAD
                          <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
=======
                          <h3 className="text-text-primary text-base font-semibold">{c.title}</h3>
>>>>>>> recover/cabinet-wip-from-stash
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] font-medium',
                              c.status === 'completed'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                : c.status === 'in_progress'
<<<<<<< HEAD
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-slate-200 text-slate-500'
=======
                                  ? 'border-accent-primary/30 text-accent-primary bg-accent-primary/10'
                                  : 'border-border-default text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {c.status === 'completed'
                              ? 'Завершён'
                              : c.status === 'in_progress'
                                ? `${c.progress}%`
                                : 'Не начат'}
                          </Badge>
                        </div>
<<<<<<< HEAD
                        <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
=======
                        <p className="text-text-secondary mt-1 text-sm">{c.description}</p>
                        <div className="text-text-secondary mt-3 flex items-center gap-4 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {c.duration}
                          </span>
                          <span>{c.modules} модулей</span>
                          {c.status !== 'not_started' && (
                            <div className="w-32">
                              <Progress value={c.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
<<<<<<< HEAD
                      <ChevronRight className="h-5 w-5 shrink-0 self-center text-slate-400 transition-colors group-hover:text-slate-600" />
=======
                      <ChevronRight className="text-text-muted group-hover:text-text-secondary h-5 w-5 shrink-0 self-center transition-colors" />
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </WidgetCard>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
