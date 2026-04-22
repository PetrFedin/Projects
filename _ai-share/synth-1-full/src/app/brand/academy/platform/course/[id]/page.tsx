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
import { getCourseById } from '@/lib/education-data';
import { ArrowLeft, Clock, Star, Users, PlayCircle, Video, FileText, ChevronRight } from 'lucide-react';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  pro: 'Экспертный',
};

const ROLE_LABELS: Record<string, string> = {
  shop: 'Магазины',
  brand: 'Бренды',
  distributor: 'Дистрибьюторы',
  manufacturer: 'Производители',
  supplier: 'Поставщики',
};

export default function PlatformCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string | undefined) ?? '';
  const course = getCourseById(id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="mt-6 text-slate-500">Курс не найден</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={ROUTES.brand.academyPlatform}>Вернуться в Академию платформы</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRecommended = (course as { isRecommended?: boolean }).isRecommended;
  const isNew = (course as { isNew?: boolean }).isNew;

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
          {course.thumbnail && (
            <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-100">
              <Image
                src={course.thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {isRecommended && <Badge className="bg-indigo-600">Рекомендуем</Badge>}
                {isNew && <Badge variant="secondary">Новый</Badge>}
              </div>
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="mt-2 text-slate-600 leading-relaxed">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4" /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {course.rating}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Users className="h-4 w-4" /> {course.studentsCount.toLocaleString()} слушателей
              </span>
              {course.level && (
                <Badge variant="outline">{LEVEL_LABELS[course.level] ?? course.level}</Badge>
              )}
            </div>
            {course.targetRoles && course.targetRoles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {course.targetRoles.map((r) => (
                  <Badge key={r} variant="secondary" className="text-xs">
                    {ROLE_LABELS[r] ?? r}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button size="lg" className="rounded-xl gap-2 font-semibold w-full sm:w-auto">
            <PlayCircle className="h-5 w-5" /> Начать обучение
          </Button>

          {course.curriculum && course.curriculum.length > 0 && (
            <Card className="rounded-2xl border border-slate-200/80">
              <CardHeader>
                <h2 className="font-semibold text-slate-900">Программа курса</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {course.curriculum.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {course.media && course.media.length > 0 && (
            <Card className="rounded-2xl border border-slate-200/80">
              <CardHeader>
                <h2 className="font-semibold text-slate-900">Материалы</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.media.map((m, i) => (
                    <a
                      key={i}
                      href={m.url}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {m.type === 'video' ? (
                          <Video className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-slate-600" />
                        )}
                        <span className="font-medium text-slate-900">{m.title}</span>
                        {m.type === 'file' && 'size' in m && m.size && (
                          <span className="text-xs text-slate-500">{m.size}</span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(course as { relatedIds?: string[] }).relatedIds && (course as { relatedIds: string[] }).relatedIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-500">Связанные материалы:</span>
              {(course as { relatedIds: string[] }).relatedIds.map((rid) => (
                <Link key={rid} href={ROUTES.brand.academyPlatformArticle(rid)}>
                  <Badge variant="outline" className="hover:bg-indigo-50 cursor-pointer">
                    {rid}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" asChild>
          <Link href={ROUTES.brand.academyPlatform} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> К каталогу курсов
          </Link>
        </Button>

        <RelatedModulesBlock links={getAcademyLinks()} />
      </div>
    </div>
  );
}
