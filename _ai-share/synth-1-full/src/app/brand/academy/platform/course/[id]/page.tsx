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
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  PlayCircle,
  Video,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

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
  const id = params.id as string;
  const course = getCourseById(id);

  if (!course) {
    return (
      <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-6 bg-gradient-to-b pb-16">
        <RegistryPageHeader
          title="Курс не найден"
          leadPlain="Курс отсутствует в демо-данных платформы."
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
    );
  }

  const isRecommended = (course as { isRecommended?: boolean }).isRecommended;
  const isNew = (course as { isNew?: boolean }).isNew;

  return (
    <RegistryPageShell className="from-bg-surface2/80 to-bg-surface w-full max-w-none space-y-8 bg-gradient-to-b pb-16">
      <RegistryPageHeader
        title={course.title}
        leadPlain={course.description}
        eyebrow={
          <Button variant="ghost" size="icon" className="-ml-2 shrink-0" asChild>
            <Link href={ROUTES.brand.academyPlatform} aria-label="К каталогу платформы">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={<AcademySegmentSwitcher active="platform" />}
      />

      <div className="flex flex-col gap-6">
        {course.thumbnail && (
          <div className="bg-bg-surface2 relative aspect-video overflow-hidden rounded-2xl">
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
              {isRecommended && <Badge className="bg-accent-primary">Рекомендуем</Badge>}
              {isNew && <Badge variant="secondary">Новый</Badge>}
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap gap-3">
            <span className="text-text-secondary flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4" /> {course.duration}
            </span>
            <span className="text-text-secondary flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {course.rating}
            </span>
            <span className="text-text-secondary flex items-center gap-1.5 text-sm">
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

        <Button size="lg" className="w-full gap-2 rounded-xl font-semibold sm:w-auto">
          <PlayCircle className="h-5 w-5" /> Начать обучение
        </Button>

        {course.curriculum && course.curriculum.length > 0 && (
          <Card className="border-border-default/80 rounded-2xl border">
            <CardHeader>
              <h2 className="text-text-primary font-semibold">Программа курса</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {course.curriculum.map((item, i) => (
                  <li key={i} className="text-text-primary flex items-center gap-3">
                    <span className="bg-accent-primary/15 text-accent-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
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
          <Card className="border-border-default/80 rounded-2xl border">
            <CardHeader>
              <h2 className="text-text-primary font-semibold">Материалы</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.media.map((m, i) => (
                  <a
                    key={i}
                    href={m.url}
                    className="border-border-default/80 hover:bg-bg-surface2 flex items-center justify-between rounded-xl border p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {m.type === 'video' ? (
                        <Video className="text-accent-primary h-5 w-5" />
                      ) : (
                        <FileText className="text-text-secondary h-5 w-5" />
                      )}
                      <span className="text-text-primary font-medium">{m.title}</span>
                      {m.type === 'file' && 'size' in m && m.size && (
                        <span className="text-text-secondary text-xs">{m.size}</span>
                      )}
                    </div>
                    <ChevronRight className="text-text-muted h-4 w-4" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(course as { relatedIds?: string[] }).relatedIds &&
          (course as { relatedIds: string[] }).relatedIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-text-secondary text-sm">Связанные материалы:</span>
              {(course as { relatedIds: string[] }).relatedIds.map((rid) => (
                <Link key={rid} href={ROUTES.brand.academyPlatformArticle(rid)}>
                  <Badge variant="outline" className="hover:bg-accent-primary/10 cursor-pointer">
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
    </RegistryPageShell>
  );
}
