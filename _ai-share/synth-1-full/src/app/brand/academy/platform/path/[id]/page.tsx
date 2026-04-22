'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { getLearningPathById, getCourseById } from '@/lib/education-data';
import { ArrowLeft, Clock, Award, ChevronRight, PlayCircle } from 'lucide-react';

export default function PlatformPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string | undefined) ?? '';
  const path = getLearningPathById(id);

  if (!path) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-slate-500">Траектория не найдена</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pathCourses = path.courses
    .map((cid) => getCourseById(cid))
    .filter((c): c is NonNullable<typeof c> => c != null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href={ROUTES.brand.academyPlatform}>
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
              </Link>
              <AcademySegmentSwitcher active="platform" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8 pb-24">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-8 border border-indigo-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-indigo-100 p-3">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" /> {path.totalDuration}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{path.title}</h1>
            <p className="mt-2 text-slate-600 leading-relaxed">{path.description}</p>
            <div className="mt-4">
              <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                {path.outcome}
              </Badge>
            </div>
          </div>

          <Button size="lg" className="rounded-xl gap-2 font-semibold w-full sm:w-auto">
            <PlayCircle className="h-5 w-5" /> Начать траекторию
          </Button>

          <div>
            <h2 className="font-semibold text-slate-900 mb-4">Курсы в траектории</h2>
            <div className="space-y-4">
              {pathCourses.map((course, i) => (
                <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                  <Card className="rounded-2xl border border-slate-200/80 overflow-hidden hover:border-indigo-200/60 hover:shadow-md transition-all group">
                    <CardContent className="p-0 flex">
                      <div className="relative w-32 sm:w-40 aspect-video shrink-0 bg-slate-100">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt=""
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="160px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-700">
                          {i + 1}
                        </span>
                      </div>
                      <div className="p-4 flex-1 min-w-0 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{course.duration}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
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
      </div>
    </div>
  );
}
