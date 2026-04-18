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
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import {
  mockCourses,
  mockLearningPaths,
  mockArticles,
  mockAcademyEvents,
  getMyPlatformEnrollments,
  getCourseById,
} from '@/lib/education-data';
import { cn } from '@/lib/utils';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

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
    () =>
      myEnrollments
        .map((e) => ({ enrollment: e, course: getCourseById(e.courseId) }))
        .filter((x) => x.course),
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
    <RegistryPageShell className="w-full max-w-none space-y-12 pb-16">
      <RegistryPageHeader
        title="Курсы платформы"
        leadPlain="Курсы, траектории обучения, статьи и события академии платформы для разных ролей в fashion-экосистеме."
      />
      {/* Мои курсы */}
      {myEnrollmentCourses.length > 0 && (
        <WidgetCard title="Мои курсы" description="Курсы в процессе прохождения">
          <div className="space-y-3">
            {myEnrollmentCourses.map(({ enrollment, course }) => (
              <Link
                key={enrollment.courseId}
                href={ROUTES.brand.academyPlatformCourse(enrollment.courseId)}
              >
                <div className="border-accent-primary/20 bg-accent-primary/10 hover:bg-accent-primary/10 flex items-center justify-between rounded-xl border p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent-primary/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <PlayCircle className="text-accent-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold">{course!.title}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-text-secondary text-xs">{course!.duration}</span>
                        <div className="w-24">
                          <Progress value={enrollment.progress} className="h-1.5 rounded-full" />
                        </div>
                        <span className="text-accent-primary text-xs font-medium">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-text-muted h-4 w-4 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Для кого */}
      <section>
        <h2 className="text-text-secondary mb-4 text-sm font-semibold uppercase tracking-wider">
          Для кого
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="border-border-default/80 hover:border-accent-primary/30 rounded-2xl border bg-white p-5 transition-colors">
            <Store className="text-accent-primary mb-3 h-8 w-8" />
            <h3 className="text-text-primary font-semibold">Магазины</h3>
            <p className="text-text-secondary mt-1 text-xs">
              Мерчандайзинг, продажи, продуктовая экспертиза
            </p>
          </div>
          <div className="border-border-default/80 hover:border-accent-primary/30 rounded-2xl border bg-white p-5 transition-colors">
            <Shirt className="text-accent-primary mb-3 h-8 w-8" />
            <h3 className="text-text-primary font-semibold">Бренды</h3>
            <p className="text-text-secondary mt-1 text-xs">Дизайн, стратегия, построение бренда</p>
          </div>
          <div className="border-border-default/80 hover:border-accent-primary/30 rounded-2xl border bg-white p-5 transition-colors">
            <Factory className="text-accent-primary mb-3 h-8 w-8" />
            <h3 className="text-text-primary font-semibold">Производители</h3>
            <p className="text-text-secondary mt-1 text-xs">Логистика, поставки, ESG, compliance</p>
          </div>
          <div className="border-border-default/80 hover:border-accent-primary/30 rounded-2xl border bg-white p-5 transition-colors">
            <Users className="text-accent-primary mb-3 h-8 w-8" />
            <h3 className="text-text-primary font-semibold">Дистрибьюторы</h3>
            <p className="text-text-secondary mt-1 text-xs">
              B2B-операции, маржа, управление запасами
            </p>
          </div>
        </div>
      </section>

      {/* Поиск и категории */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Поиск курсов по названию или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border-default h-12 rounded-xl pl-11 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.value ? 'default' : 'outline'}
              size="sm"
              className="h-10 rounded-xl px-4 font-medium"
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
          <h2 className="text-text-primary text-xl font-bold">Траектории обучения</h2>
        </div>
        <p className="text-text-secondary mb-6 text-sm">
          Сертифицированные пути: от начального до экспертного уровня. Освойте комплексные
          компетенции.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {mockLearningPaths.map((path) => (
            <Link key={path.id} href={ROUTES.brand.academyPlatformPath(path.id)}>
              <Card className="border-accent-primary/30 from-accent-primary/10 hover:shadow-accent-primary/10 hover:border-accent-primary/30 group h-full overflow-hidden rounded-2xl border bg-gradient-to-br to-white transition-all duration-200 hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="bg-accent-primary/15 rounded-xl p-3">
                      <Award className="text-accent-primary h-6 w-6" />
                    </div>
                    <ChevronRight className="text-text-muted group-hover:text-accent-primary h-5 w-5 shrink-0 transition-colors" />
                  </div>
                  <h3 className="text-text-primary mt-4 text-lg font-semibold">{path.title}</h3>
                  <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                    {path.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] font-medium">
                      <Clock className="mr-1 h-3 w-3" /> {path.totalDuration}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-accent-primary/30 text-accent-primary text-[10px]"
                    >
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
          <h2 className="text-text-primary text-xl font-bold">Курсы</h2>
          <p className="text-text-secondary mt-1 text-sm">Найдено: {filteredCourses.length}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={ROUTES.brand.academyPlatformCourse(course.id)}>
              <Card className="border-border-default/80 hover:border-accent-primary/30 group h-full overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:shadow-md hover:shadow-xl">
                <div className="bg-bg-surface2 relative aspect-video overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="from-bg-surface2 to-border-subtle absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                      <PlayCircle className="text-text-muted h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3 flex gap-1.5">
                    {(course as { isRecommended?: boolean }).isRecommended && (
                      <Badge className="bg-accent-primary text-[9px]">Рекомендуем</Badge>
                    )}
                    {(course as { isNew?: boolean }).isNew && (
                      <Badge variant="secondary" className="text-[9px]">
                        Новый
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-text-primary line-clamp-2 font-semibold leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-text-secondary mt-2 line-clamp-2 text-sm">
                    {course.description}
                  </p>
                  <div className="text-text-secondary mt-4 flex flex-wrap items-center gap-3 text-xs">
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
            <Calendar className="text-accent-primary h-5 w-5" />
            <h2 className="text-text-primary text-xl font-bold">Ближайшие мероприятия</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockAcademyEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="border-border-default/80 hover:border-accent-primary/30 rounded-2xl border bg-white p-5 transition-colors"
              >
                <Badge variant="secondary" className="mb-2 text-[10px]">
                  {event.type === 'webinar'
                    ? 'Вебинар'
                    : event.type === 'workshop'
                      ? 'Воркшоп'
                      : event.type}
                </Badge>
                <h3 className="text-text-primary font-semibold">{event.title}</h3>
                <p className="text-text-secondary mt-1 line-clamp-2 text-sm">{event.description}</p>
                <p className="text-text-muted mt-2 text-xs">{event.hostName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* База знаний */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <FileText className="text-text-secondary h-5 w-5" />
          <h2 className="text-text-primary text-xl font-bold">База знаний</h2>
        </div>
        <p className="text-text-secondary mb-6 text-sm">
          Wiki-статьи по терминам, процессам и регуляторике. Актуальная информация для партнёров.
        </p>
        <div className="space-y-3">
          {mockArticles.map((art) => (
            <Link key={art.id} href={ROUTES.brand.academyPlatformArticle(art.id)}>
              <Card className="border-border-default/80 hover:border-accent-primary/30 hover:shadow-accent-primary/5 group rounded-2xl border bg-white transition-all duration-200 hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-text-primary font-semibold">{art.title}</h3>
                    <p className="text-text-secondary mt-1 line-clamp-1 text-sm">{art.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {art.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="text-text-muted group-hover:text-accent-primary h-5 w-5 shrink-0 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
