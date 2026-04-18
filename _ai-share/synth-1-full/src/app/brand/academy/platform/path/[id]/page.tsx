'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { getLearningPathById, getCourseById } from '@/lib/education-data';
import { ArrowLeft, Clock, Award, ChevronRight, PlayCircle } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function PlatformPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const path = getLearningPathById(id);

  if (!path) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-slate-500">Траектория не найдена</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
          </Button>
        </div>
      </div>
=======
      <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-6 bg-gradient-to-b pb-16">
        <RegistryPageHeader
          title="Траектория не найдена"
          leadPlain="Траектория отсутствует в демо-данных платформы."
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
          <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
        </Button>
      </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
    );
  }

  const pathCourses = path.courses
    .map((cid) => getCourseById(cid))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const leadPlain = `${path.description} Итог: ${path.outcome}.`;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link href={ROUTES.brand.academyPlatform}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <AcademySegmentSwitcher active="platform" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl space-y-8 px-4 py-8 pb-24">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-white p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-3">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" /> {path.totalDuration}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{path.title}</h1>
            <p className="mt-2 leading-relaxed text-slate-600">{path.description}</p>
            <div className="mt-4">
              <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
                {path.outcome}
              </Badge>
            </div>
          </div>

          <Button size="lg" className="w-full gap-2 rounded-xl font-semibold sm:w-auto">
            <PlayCircle className="h-5 w-5" /> Начать траекторию
=======
    <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-8 bg-gradient-to-b pb-16">
      <RegistryPageHeader
        title={path.title}
        leadPlain={leadPlain}
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.academyPlatform} aria-label="К каталогу платформы">
              <ArrowLeft className="h-4 w-4" />
            </Link>
>>>>>>> recover/cabinet-wip-from-stash
          </Button>
        }
        actions={<AcademySegmentSwitcher active="platform" />}
      />

<<<<<<< HEAD
          <div>
            <h2 className="mb-4 font-semibold text-slate-900">Курсы в траектории</h2>
            <div className="space-y-4">
              {pathCourses.map((course, i) => (
                <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                  <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 transition-all hover:border-indigo-200/60 hover:shadow-md">
                    <CardContent className="flex p-0">
                      <div className="relative aspect-video w-32 shrink-0 bg-slate-100 sm:w-40">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt=""
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="160px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                        <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-700">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4">
                        <div>
                          <h3 className="line-clamp-2 font-semibold text-slate-900">
                            {course.title}
                          </h3>
                          <p className="mt-0.5 text-sm text-slate-500">{course.duration}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
=======
      <div className="flex flex-col gap-6">
        <div className="from-accent-primary/10 border-accent-primary/30 rounded-2xl border bg-gradient-to-br to-white p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-accent-primary/15 rounded-xl p-3">
              <Award className="text-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" /> {path.totalDuration}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className="border-accent-primary/30 text-accent-primary bg-accent-primary/10"
          >
            {path.outcome}
          </Badge>
        </div>

        <Button size="lg" className="w-full gap-2 rounded-xl font-semibold sm:w-auto">
          <PlayCircle className="h-5 w-5" /> Начать траекторию
        </Button>

        <div>
          <h2 className="text-text-primary mb-4 font-semibold">Курсы в траектории</h2>
          <div className="space-y-4">
            {pathCourses.map((course, i) => (
              <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                <Card className="border-border-default/80 hover:border-accent-primary/30 group overflow-hidden rounded-2xl border transition-all hover:shadow-md">
                  <CardContent className="flex p-0">
                    <div className="bg-bg-surface2 relative aspect-video w-32 shrink-0 sm:w-40">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt=""
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="160px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="text-text-muted h-8 w-8" />
                        </div>
                      )}
                      <span className="text-text-primary absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4">
                      <div>
                        <h3 className="text-text-primary line-clamp-2 font-semibold">
                          {course.title}
                        </h3>
                        <p className="text-text-secondary mt-0.5 text-sm">{course.duration}</p>
                      </div>
                      <ChevronRight className="text-text-muted h-5 w-5 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Button variant="outline" asChild>
        <Link href={ROUTES.brand.academyPlatform} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> К траекториям
        </Link>
      </Button>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
