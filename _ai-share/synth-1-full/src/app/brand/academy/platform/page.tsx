'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { WidgetCard } from '@/components/ui/widget-card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Star,
  ChevronRight,
  Search,
  Lightbulb,
  FileText,
  Award,
  Store,
  Shirt,
  Factory,
  Users,
  PlayCircle,
  Calendar,
} from 'lucide-react';
import { AcademySegmentSwitcher } from '@/components/brand/AcademySegmentSwitcher';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { mockCourses, mockLearningPaths, mockArticles, mockAcademyEvents, getMyPlatformEnrollments, getCourseById } from '@/lib/education-data';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', label: 'Все', value: '' },
  { id: 'economics', label: 'Экономика', value: 'economics' },
  { id: 'design', label: 'Дизайн', value: 'design' },
  { id: 'management', label: 'Менеджмент', value: 'management' },
  { id: 'retail', label: 'Ритейл', value: 'retail' },
];

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  pro: 'Экспертный',
};

export default function AcademyPlatformPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const myEnrollments = getMyPlatformEnrollments();
  const myEnrollmentCourses = useMemo(
    () => myEnrollments.map((e) => ({ enrollment: e, course: getCourseById(e.courseId) })).filter((x) => x.course),
    [myEnrollments]
  );

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || c.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-12">
        {/* Мои курсы */}
        {myEnrollmentCourses.length > 0 && (
          <WidgetCard title="Мои курсы" description="Курсы в процессе прохождения">
            <div className="space-y-3">
              {myEnrollmentCourses.map(({ enrollment, course }) => (
                <Link key={enrollment.courseId} href={ROUTES.brand.academyPlatformCourse(enrollment.courseId)}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <PlayCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{course!.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">{course!.duration}</span>
                          <div className="w-24">
                            <Progress value={enrollment.progress} className="h-1.5 rounded-full" />
                          </div>
                          <span className="text-xs font-medium text-indigo-600">{enrollment.progress}%</span>
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

        {/* Для кого */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Для кого</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 p-5 bg-white hover:border-indigo-200/60 transition-colors">
              <Store className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Магазины</h3>
              <p className="text-xs text-slate-500 mt-1">Мерчандайзинг, продажи, продуктовая экспертиза</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 p-5 bg-white hover:border-indigo-200/60 transition-colors">
              <Shirt className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Бренды</h3>
              <p className="text-xs text-slate-500 mt-1">Дизайн, стратегия, построение бренда</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 p-5 bg-white hover:border-indigo-200/60 transition-colors">
              <Factory className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Производители</h3>
              <p className="text-xs text-slate-500 mt-1">Логистика, поставки, ESG, compliance</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 p-5 bg-white hover:border-indigo-200/60 transition-colors">
              <Users className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Дистрибьюторы</h3>
              <p className="text-xs text-slate-500 mt-1">B2B-операции, маржа, управление запасами</p>
            </div>
          </div>
        </section>

        {/* Поиск и категории */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск курсов по названию или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-xl border-slate-200 text-base"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.value ? 'default' : 'outline'}
                size="sm"
                className="h-10 px-4 rounded-xl font-medium"
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Траектории обучения */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">Траектории обучения</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Сертифицированные пути: от начального до экспертного уровня. Освойте комплексные компетенции.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {mockLearningPaths.map((path) => (
              <Link key={path.id} href={ROUTES.brand.academyPlatformPath(path.id)}>
                <Card className="group h-full rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300/80 transition-all duration-200">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-indigo-100 p-3">
                        <Award className="h-6 w-6 text-indigo-600" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-900 text-lg">{path.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{path.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        <Clock className="h-3 w-3 mr-1" /> {path.totalDuration}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-indigo-200 text-indigo-700">
                        {path.outcome}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Курсы */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Курсы</h2>
            <p className="mt-1 text-sm text-slate-600">Найдено: {filteredCourses.length}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
                <Card className="group h-full rounded-2xl border border-slate-200/80 overflow-hidden bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200/60 transition-all duration-200">
                  <div className="aspect-video relative bg-slate-100 overflow-hidden">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <PlayCircle className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {(course as { isRecommended?: boolean }).isRecommended && (
                        <Badge className="text-[9px] bg-indigo-600">Рекомендуем</Badge>
                      )}
                      {(course as { isNew?: boolean }).isNew && (
                        <Badge variant="secondary" className="text-[9px]">Новый</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight">{course.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{course.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating}
                      </span>
                      <span>{course.studentsCount.toLocaleString()} слушателей</span>
                    </div>
                    {course.level && (
                      <Badge variant="outline" className="mt-3 text-[10px]">
                        {LEVEL_LABELS[course.level] ?? course.level}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Мероприятия */}
        {mockAcademyEvents.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Ближайшие мероприятия</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockAcademyEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-white hover:border-indigo-200/60 transition-colors"
                >
                  <Badge variant="secondary" className="text-[10px] mb-2">
                    {event.type === 'webinar' ? 'Вебинар' : event.type === 'workshop' ? 'Воркшоп' : event.type}
                  </Badge>
                  <h3 className="font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                  <p className="text-xs text-slate-400 mt-2">{event.hostName}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* База знаний */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">База знаний</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Wiki-статьи по терминам, процессам и регуляторике. Актуальная информация для партнёров.
          </p>
          <div className="space-y-3">
            {mockArticles.map((art) => (
              <Link key={art.id} href={ROUTES.brand.academyPlatformArticle(art.id)}>
                <Card className="group rounded-2xl border border-slate-200/80 hover:border-indigo-200/60 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 bg-white">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">{art.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-1">{art.excerpt}</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {art.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <RelatedModulesBlock links={getAcademyLinks()} />
    </div>
  );
}
